import React from 'react';
import { WordEditor } from './WordEditor';

import type { WordItem } from '../types';

interface WordAddModalProps {
  addingWord: WordItem | null;
  setAddingWord: (item: WordItem | null) => void;
  onSave: (item: WordItem, blob?: Blob | null) => Promise<void>;
  existingWords?: WordItem[];
}

export const WordAddModal: React.FC<WordAddModalProps> = ({ 
  addingWord, 
  setAddingWord, 
  onSave,
  existingWords
}) => {
  if (!addingWord) return null;

  return (
    <WordEditor 
      item={addingWord} 
      isNew={true}
      onSave={onSave}
      onClose={() => setAddingWord(null)}
      onDelete={() => setAddingWord(null)}
      existingWords={existingWords}
    />
  );
};
