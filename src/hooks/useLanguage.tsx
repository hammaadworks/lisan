import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../lib/translations/en.json';
import ur from '../lib/translations/ur.json';

const translations: Record<string, any> = { en, ur };

// Unified Language Code (e.g., 'ur', 'en', 'es')
export type LanguageCode = string;

// The app maintains exactly TWO active languages: Primary (User) and Secondary (Caregiver)
export interface DualLanguagePair {
  primary: LanguageCode;
  secondary: LanguageCode;
  current: LanguageCode;
}

interface LanguageContextType {
  language: LanguageCode; // The currently active language code
  primaryLanguage: LanguageCode;
  secondaryLanguage: LanguageCode;
  isDualMode: boolean;
  setLanguage: (lang: LanguageCode) => void; 
  setLanguagePair: (primary: LanguageCode, secondary: LanguageCode) => void;
  isRTL: boolean;
  isPrimary: boolean;
  isSecondary: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to check if a language is Right-to-Left
const getDirection = (lang: LanguageCode): 'rtl' | 'ltr' => {
  const rtlLangs = ['ur', 'ar', 'fa', 'he', 'sd', 'ps'];
  return rtlLangs.includes(lang.toLowerCase()) ? 'rtl' : 'ltr';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load the pair configuration from storage or default to Urdu + English
  const [pair, setPair] = useState<DualLanguagePair>(() => {
    const stored = localStorage.getItem('shukr_lang_pair');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure we have current, primary, and secondary
      return {
        primary: parsed.primary || 'ur',
        secondary: parsed.secondary || 'en',
        current: parsed.current || parsed.primary || 'ur'
      };
    }
    
    // Default: Primary = Urdu, Secondary = English
    const initialPair: DualLanguagePair = {
      primary: 'ur',
      secondary: 'en',
      current: 'ur'
    };
    return initialPair;
  });

  const setLanguage = (lang: LanguageCode) => {
    const newPair = { ...pair, current: lang };
    setPair(newPair);
    localStorage.setItem('shukr_lang_pair', JSON.stringify(newPair));
  };

  const setLanguagePair = (primary: LanguageCode, secondary: LanguageCode) => {
    const newPair: DualLanguagePair = {
      primary,
      secondary,
      current: primary, // Reset to primary when pair changes
    };
    setPair(newPair);
    localStorage.setItem('shukr_lang_pair', JSON.stringify(newPair));
  };

  useEffect(() => {
    // Update global document attributes based on the current active language
    const dir = getDirection(pair.current);
    document.documentElement.lang = pair.current;
    document.documentElement.dir = dir;
    // Explicitly prevent browser translation for all languages handled by the app
    document.documentElement.setAttribute('translate', 'no');
  }, [pair.current]);

  const isRTL = getDirection(pair.current) === 'rtl';
  const isPrimary = pair.current === pair.primary;
  const isSecondary = pair.current === pair.secondary;
  const isDualMode = pair.primary !== pair.secondary;

  const t = (path: string): string => {
    const keys = path.split('.');
    let result = translations[pair.current] || translations['en'];
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        // Fallback to English if key missing in current language
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey]) {
            fallback = fallback[fKey];
          } else {
            return path; // Return key itself as last resort
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    
    return typeof result === 'string' ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ 
      language: pair.current, 
      primaryLanguage: pair.primary,
      secondaryLanguage: pair.secondary,
      isDualMode,
      setLanguage, 
      setLanguagePair,
      isRTL,
      isPrimary,
      isSecondary,
      t
    }}>
      <div className={`lang-${pair.current} dir-${isRTL ? 'rtl' : 'ltr'}`} translate="no">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
