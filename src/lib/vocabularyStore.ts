import { universeDb } from './universeDb';

export interface VocabularyLifecycleModule {
  deleteConcept: (id: string, config: any) => Promise<any>;
}

/**
 * Deep Module: Concentrates data integrity logic for the vocabulary lifecycle.
 * Prevents leaks of implementation details (cascading deletes) into UI orchestrators.
 */
export const vocabularyStore = {
  /**
   * Securely deletes a concept and all its associated artifacts.
   * concentration: Locality of deletion rules.
   */
  async deleteConcept(id: string, config: any): Promise<any> {
    // 1. Prepare new config without the item in any list
    const newConfig: any = {
      ...config,
      categories: (config.categories || []).map((cat: any) => ({
        ...cat,
        items: (cat.items || []).filter((i: any) => i.id !== id),
      }))
    };

    if (newConfig.favorites) {
      newConfig.favorites = newConfig.favorites.filter((fid: string) => fid !== id);
    }
    if (newConfig.family) {
      newConfig.family = newConfig.family.filter((fid: string) => fid !== id);
    }

    // 2. Perform Cascading Deletes in Database
    await universeDb.words.delete(id);
    // Remove all associated audio (from any voice)
    await universeDb.audio.where({ wordId: id }).delete();
    // Remove all trained doodles
    await universeDb.doodles.where('wordId').equals(id).delete();

    return newConfig;
  },

  /**
   * Saves or updates a concept, ensuring configuration sync.
   */
  async saveConcept(item: any, config: any): Promise<any> {
    const newConfig: any = { ...config };
    
    // Manage Family List Sync
    const isActuallyInFamily = (newConfig.family || []).includes(item.id);
    if (item.isFamily && !isActuallyInFamily) {
        newConfig.family = [...(newConfig.family || []), item.id];
    } else if (!item.isFamily && isActuallyInFamily) {
        newConfig.family = (newConfig.family || []).filter((id: string) => id !== item.id);
    }

    // Update categories
    newConfig.categories = newConfig.categories.map((cat: any) => ({
      ...cat,
      items: cat.id === (item.categoryId || item.category || 'general') 
        ? (cat.items.some((i: any) => i.id === item.id) ? cat.items.map((i: any) => i.id === item.id ? item : i) : [...cat.items, item])
        : cat.items.filter((i: any) => i.id !== item.id)
    }));

    // Persist to DB
    await universeDb.words.put(item);
    
    return newConfig;
  }
};
