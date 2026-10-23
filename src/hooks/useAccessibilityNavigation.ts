import { useState, useCallback, useMemo } from 'react';

interface ZoneItemCounts {
  headerCount: number;
  categoriesCount: number;
  predictionsCount: number;
  gridItemsCount: number;
  builderCount: number;
  footerCount: number;
}

export const useAccessibilityNavigation = (
  navigableActions: (() => void)[],
  counts: ZoneItemCounts
) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const nextFocus = useCallback(() => {
    if (navigableActions.length === 0) return;
    setFocusedIndex(prev => (prev + 1) % navigableActions.length);
  }, [navigableActions.length]);

  const selectCurrent = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < navigableActions.length) {
      navigableActions[focusedIndex]();
    }
  }, [focusedIndex, navigableActions]);

  const offsets = useMemo(() => {
    const header = 0;
    const categories = header + counts.headerCount;
    const predictions = categories + counts.categoriesCount;
    const grid = predictions + counts.predictionsCount;
    const builder = grid + counts.gridItemsCount;
    const footer = builder + counts.builderCount;

    return {
      header,
      categories,
      predictions,
      grid,
      builder,
      footer
    };
  }, [
    counts.headerCount,
    counts.categoriesCount,
    counts.predictionsCount,
    counts.gridItemsCount,
    counts.builderCount
  ]);

  return {
    focusedIndex,
    setFocusedIndex,
    resetFocus,
    nextFocus,
    selectCurrent,
    offsets
  };
};
