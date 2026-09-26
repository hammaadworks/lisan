import { useMemo } from 'react';
import { useLanguage } from './useLanguage';
import { translator } from '../lib/translator';

export type RenderMode = 'Mono' | 'Dual';

export interface RenderableWord {
  id: string;
  major: string;        // Text for the Patient (Primary)
  support?: string;     // Translation for the Caregiver (Secondary)
  phonetic?: string;    // Pronunciation (Transliteration)
  primaryDir: 'rtl' | 'ltr';
  mode: RenderMode;
}

const getDirection = (lang: string): 'rtl' | 'ltr' => {
  const rtlLangs = ['ur', 'ar', 'fa', 'he', 'sd', 'ps'];
  return rtlLangs.includes(lang.toLowerCase()) ? 'rtl' : 'ltr';
};

/**
 * Deep Module: Encapsulates the complexity of language modes and fallbacks.
 * Components get high LEVERAGE by receiving exactly what they need to render.
 */
export const useRenderableWord = (
  item: { id: string; text_primary?: string; text_secondary?: string },
  overrides?: { primary?: string; secondary?: string }
): RenderableWord => {
  const { primaryLanguage: globalPrimary, secondaryLanguage: globalSecondary, isDualMode: globalDual, isPrimary } = useLanguage();

  // Use local overrides (e.g. for #voices) or global pair
  const primary = overrides?.primary || (isPrimary ? globalPrimary : globalSecondary);
  const secondary = overrides?.secondary || (isPrimary ? globalSecondary : globalPrimary);
  const isDualMode = overrides ? (overrides.primary !== overrides.secondary) : globalDual;

  return useMemo(() => {
    const major = translator.getTranslation(item.id, primary) || item.text_primary || '';
    
    // In Mono mode, we strictly hide supporting metadata
    if (!isDualMode) {
      return {
        id: item.id,
        major,
        primaryDir: getDirection(primary),
        mode: 'Mono'
      };
    }

    // In Dual mode, we provide translation and transliteration
    const support = translator.getTranslation(item.id, secondary) || item.text_secondary || '';
    const phonetic = translator.getTransliteration(item.id, primary, secondary);

    return {
      id: item.id,
      major,
      support,
      phonetic,
      primaryDir: getDirection(primary),
      mode: 'Dual'
    };
  }, [item.id, item.text_primary, item.text_secondary, primary, secondary, isDualMode]);
};
