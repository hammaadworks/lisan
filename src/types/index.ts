export interface WordItem {
  id: string;
  icon?: string;
  next?: string[];
  usageCount?: number;
  lastUsedAt?: number;
  timeBias?: number[];
  doodle_shapes?: string[];
  translations?: Record<string, string>;
  transliterations?: Record<string, Record<string, string>>;
  verified?: boolean;
  verifiedLangs?: string[];
  ur?: string;
  en?: string;
  roman?: string;
  transitions?: Record<string, number>;
  category?: string;
  categoryId?: string;
  text_primary?: string;
  text_secondary?: string;
  isFamily?: boolean;
  isPrompt?: boolean;
  onClick?: () => void;
}

export interface CategoryItem {
  id: string;
  label_primary?: string;
  label_secondary?: string;
  icon?: string;
  items?: WordItem[];
}

export type AppRoute = '#' | '#voices' | '#words' | '#settings' | '#doodle' | '#landing';

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface SOSSettings {
  message_template: string;
  countdown_seconds: number;
  play_alarm_sound: boolean;
}

export interface UserPreferences {
  theme?: string;
  font_size?: string;
  speech_rate?: number;
  enable_vibration?: boolean;
  enable_click_sound?: boolean;
  auto_clear_minutes?: number;
}

export interface LanguagePair {
  primary: string;
  secondary: string;
}

export interface VoiceProfile {
  numericId?: number;
  id: string;
  name: string;
  language?: string;
  editable?: boolean;
}

export interface NavigableTarget {
  id: string;
  label: string;
  action: () => void;
  zone: 'header' | 'categories' | 'predictions' | 'grid' | 'builder' | 'footer';
}
