import { universeDb } from './universeDb';
import type { WordItem } from '../types';
import type { AppConfig } from '../hooks/useAppConfig';

/**
 * Deep Module: Vocabulary & Audio Lifecycle Store
 * Concentrates data integrity logic for vocabulary concepts, associated audio recordings,
 * and vector doodles into a single atomic seam.
 */
export const vocabularyStore = {
  /**
   * Securely deletes a concept and all its associated artifacts (audio recordings and doodles).
   */
  async deleteConcept(id: string, config: AppConfig): Promise<AppConfig> {
    const newConfig: AppConfig = {
      ...config,
      categories: (config.categories || []).map((cat: any) => ({
        ...cat,
        items: (cat.items || []).filter((i: WordItem) => i.id !== id),
      }))
    };

    if (newConfig.favorites) {
      newConfig.favorites = newConfig.favorites.filter((fid: string) => fid !== id);
    }
    if (newConfig.family) {
      newConfig.family = newConfig.family.filter((fid: string) => fid !== id);
    }

    // 2. Perform Cascading Deletes in Database (Single Source of Truth)
    await universeDb.words.delete(id);
    await universeDb.audio.where({ wordId: id }).delete();
    await universeDb.doodles.where('wordId').equals(id).delete();

    return newConfig;
  },

  /**
   * Saves or updates a concept, saving audio recording and keeping configuration synchronized.
   */
  async saveConcept(
    item: WordItem,
    config: AppConfig,
    audioBlob?: Blob | null,
    voiceSlug?: string
  ): Promise<AppConfig> {
    const newConfig: AppConfig = { ...config };
    
    // Manage Family List Sync
    const isActuallyInFamily = (newConfig.family || []).includes(item.id);
    if (item.isFamily && !isActuallyInFamily) {
      newConfig.family = [...(newConfig.family || []), item.id];
    } else if (!item.isFamily && isActuallyInFamily) {
      newConfig.family = (newConfig.family || []).filter((id: string) => id !== item.id);
    }

    // Update categories
    const categoryTarget = item.categoryId || item.category || 'general';
    newConfig.categories = (newConfig.categories || []).map((cat: any) => ({
      ...cat,
      items: cat.id === categoryTarget
        ? (cat.items?.some((i: WordItem) => i.id === item.id)
            ? cat.items.map((i: WordItem) => (i.id === item.id ? item : i))
            : [...(cat.items || []), item])
        : (cat.items || []).filter((i: WordItem) => i.id !== item.id)
    }));

    // Persist Word to IndexedDB
    await universeDb.words.put(item as any);

    // Save Audio Blob if provided
    if (audioBlob) {
      const activeVoice = voiceSlug || config.active_voice || 'en_voice_hammaad';
      const voiceRecord = await universeDb.voices.where({ id: activeVoice }).first();
      if (voiceRecord?.numericId !== undefined) {
        await universeDb.audio.put({
          voiceNumericId: voiceRecord.numericId,
          wordId: item.id,
          blob: audioBlob
        });
      }
    }
    
    return newConfig;
  },

  /**
   * Resolves and retrieves the custom audio recording blob for a word across specified voice options.
   */
  async getConceptAudio(wordId: string, voiceIds: string[]): Promise<Blob | null> {
    if (!wordId || !voiceIds || voiceIds.length === 0) return null;
    
    for (const vId of voiceIds) {
      const voiceRecord = await universeDb.voices.where({ id: vId }).first();
      if (voiceRecord?.numericId !== undefined) {
        const audioRecord = await universeDb.audio.get([voiceRecord.numericId, wordId]);
        if (audioRecord?.blob) {
          return audioRecord.blob;
        }
      }
    }
    return null;
  },

  /**
   * Saves custom audio mapped to a specific hands-free gesture trigger.
   */
  async saveGestureAudio(gestureId: string, blob: Blob): Promise<void> {
    const key = `gesture_${gestureId}`;
    await universeDb.audio.put({
      voiceNumericId: 0,
      wordId: key,
      blob
    });
  },

  /**
   * Retrieves custom audio recorded for a gesture trigger.
   */
  async getGestureAudio(gestureKey: string): Promise<Blob | null> {
    const gestureId = `gesture_${gestureKey}`;
    const record = await universeDb.audio.get([0, gestureId]);
    return record?.blob || null;
  }
};
