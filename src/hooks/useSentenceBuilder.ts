import { useState, useCallback, useRef, useEffect } from 'react';
import type { WordItem } from '../types';
import { predictionsEngine } from '../lib/predictionsEngine';

const MAX_SENTENCE_LENGTH = 8;

export const useSentenceBuilder = (
  speakSequence: (words: WordItem[]) => Promise<void>
) => {
  const [sentence, setSentence] = useState<WordItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const sentenceRef = useRef<WordItem[]>([]);

  useEffect(() => {
    sentenceRef.current = sentence;
  }, [sentence]);

  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const addWord = useCallback((item: WordItem) => {
    if (sentenceRef.current.length < MAX_SENTENCE_LENGTH) {
      setSentence(prev => {
        const next = [...prev, item];
        if (prev.length > 0) {
          predictionsEngine.recordTransition(prev[prev.length - 1].id, item.id);
        }
        return next;
      });
    } else {
      if (isActive) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);
      } else {
        setSentence(prev => [...prev.slice(1), item]);
      }
    }
    predictionsEngine.recordUsage(item.id);
  }, [isActive]);

  const clearSentence = useCallback(() => {
    setSentence([]);
  }, []);

  const backspaceSentence = useCallback(() => {
    setSentence(prev => prev.slice(0, -1));
  }, []);

  const playSentence = useCallback(async () => {
    if (sentence.length === 0) return;
    await speakSequence(sentence);
    setSentence([]);
  }, [sentence, speakSequence]);

  return {
    sentence,
    setSentence,
    isActive,
    setIsActive,
    toggleActive,
    isFlashing,
    addWord,
    clearSentence,
    backspaceSentence,
    playSentence,
    canAddWords: sentence.length < MAX_SENTENCE_LENGTH
  };
};
