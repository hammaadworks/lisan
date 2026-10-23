import { useCallback, useState, useEffect } from 'react';
import { useLanguage } from './useLanguage';
import { useAppConfig } from './useAppConfig';
import { universeDb } from '../lib/universeDb';
import { generateAudioStorageKey } from '../lib/constants';
import { sensoryFeedback } from '../lib/sensoryFeedback';
import { vocabularyStore } from '../lib/vocabularyStore';
import type { WordItem } from '../types';

// Singleton state to track currently playing word across components
let globalPlayingId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

const setGlobalPlayingId = (id: string | null) => {
  globalPlayingId = id;
  listeners.forEach(l => l(id));
};

export const useAudio = () => {
  const { language, primaryLanguage } = useLanguage();
  const { config } = useAppConfig();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(globalPlayingId);

  useEffect(() => {
    const handler = (id: string | null) => setCurrentlyPlayingId(id);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const activeVoice = config?.active_voice || 'default';

  const playClick = useCallback(() => {
    sensoryFeedback.playClick(config?.preferences?.enable_click_sound ?? true);
  }, [config?.preferences?.enable_click_sound]);

  const playSOS = useCallback(() => {
    sensoryFeedback.playSOS();
  }, []);

  const stopSOS = useCallback(() => {
    sensoryFeedback.stopSOS();
  }, []);

  const toggleFlashlight = useCallback(async () => {
    await sensoryFeedback.toggleFlashlight();
  }, []);

  const speak = useCallback((text: string, wordId?: string) => {
    return new Promise<void>((resolve) => {
      const executeSpeak = async () => {
        if (!text) return resolve();

        let audioInstance: HTMLAudioElement | null = null;
        let objectUrl: string | null = null;

        const handleAudioEnd = () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          if (wordId && globalPlayingId === wordId) setGlobalPlayingId(null);
          resolve();
        };

        const tryFallbackTTS = () => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language === 'ur' ? 'ur-PK' : (language === 'es' ? 'es-ES' : (language === 'ar' ? 'ar-SA' : 'en-US'));
          utterance.onend = handleAudioEnd;
          utterance.onerror = handleAudioEnd;
          window.speechSynthesis.speak(utterance);
        };

        try {
          if (wordId) {
            setGlobalPlayingId(wordId);

            let recordedBlob: Blob | null = null;

            if (wordId.startsWith('gesture_')) {
              recordedBlob = await vocabularyStore.getGestureAudio(wordId.replace('gesture_', ''));
            } else {
              const voice = await universeDb.voices.where({ id: activeVoice }).first();
              if (voice?.numericId !== undefined) {
                const record = await universeDb.audio.get([voice.numericId, wordId]);
                recordedBlob = record?.blob || null;
              }
            }

            if (recordedBlob) {
              objectUrl = URL.createObjectURL(recordedBlob);
              audioInstance = new Audio(objectUrl);
            } else {
              // Try ingested pre-recorded audio bundle
              try {
                const audioRecordCacheKey = generateAudioStorageKey(wordId, activeVoice);
                const ingestedModules = import.meta.glob('../lib/data/audio/*.wav', { eager: false });
                const matchingPath = `../lib/data/audio/${audioRecordCacheKey}.wav`;

                if (ingestedModules[matchingPath]) {
                  const mod = await ingestedModules[matchingPath]() as { default: string };
                  audioInstance = new Audio(mod.default);
                }
              } catch {
                // Fallback to public audio path
              }
            }
          }

          if (!audioInstance) {
            const fallbackPath = `/audio/${language}/${wordId || text.toLowerCase()}.mp3`;
            audioInstance = new Audio(fallbackPath);
          }

          audioInstance.onended = handleAudioEnd;
          audioInstance.onerror = () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            tryFallbackTTS();
          };

          await audioInstance.play();
        } catch (e) {
          console.warn('[useAudio] Playback failed:', e);
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          tryFallbackTTS();
        }
      };

      executeSpeak();
    });
  }, [language, activeVoice]);

  const speakSequence = useCallback(async (words: WordItem[]) => {
    for (const word of words) {
      const isPrimary = language === primaryLanguage;
      const text = isPrimary ? (word.text_primary || word.ur || '') : (word.text_secondary || word.en || '');
      await speak(text, word.id);
      await new Promise(r => setTimeout(r, 150));
    }
  }, [speak, language, primaryLanguage]);

  return { speak, speakSequence, playClick, toggleFlashlight, playSOS, stopSOS, currentlyPlayingId };
};
