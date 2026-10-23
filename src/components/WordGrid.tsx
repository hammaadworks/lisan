import React from 'react';
import { WordCard } from './WordCard';
import type { WordItem } from '../types';

interface WordGridProps {
  gridItems: WordItem[];
  focusedIndex: number;
  offset: number;
  onLongPressItem?: (item: WordItem) => void;
  onEditItem?: (item: WordItem) => void;
  onDeleteItem?: (id: string) => void;
  onSelect?: (item: WordItem) => void;
  favorites?: string[];
  currentlyPlayingId?: string | null;
}

export const WordGrid: React.FC<WordGridProps> = React.memo(({
  gridItems,
  focusedIndex,
  offset,
  onLongPressItem,
  onEditItem,
  onSelect,
  favorites = [],
  currentlyPlayingId,
}) => {
  return (
    <div className="smart-grid-apple">
      {gridItems.map((item, idx) => (
        <WordCard 
          key={item.id}
          item={item}
          isFocused={focusedIndex === offset + idx}
          isPlaying={currentlyPlayingId === item.id}
          onClick={() => {
            if (item.onClick) item.onClick();
            else onSelect?.(item);
          }}
          onEdit={() => {
             if (item.isPrompt) return;
             onEditItem?.(item);
          }}
          onToggleFavorite={() => onLongPressItem?.(item)}
          onDelete={() => {
             if (item.isPrompt) return;
             onEditItem?.(item);
          }}
          isFavorite={favorites.includes(item.id)}
        />
      ))}
    </div>
  );
});
WordGrid.displayName = 'WordGrid';
