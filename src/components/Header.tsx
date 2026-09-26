import React from 'react';
import {Camera, Megaphone, Settings, X} from 'lucide-react';
import {ShukrButton} from './ShukrButton';
import {useAudio} from '../hooks/useAudio';
import {useLanguage} from '../hooks/useLanguage';
import { type GestureDefinition } from '../recognition/gestures/types';

interface HeaderProps {
    onOpenSettings: (tab?: string) => void;
    toggleTracking: () => void;
    hasUnsyncedChanges: boolean;
    onSOS: () => void;
    onHome: () => void;
    isSentenceBuilderActive: boolean;
    toggleSentenceBuilder: () => void;
    lastGesture: string;
    isPrimary: boolean;
    focusedIndex: number;
    showCloseDropzone?: boolean;
    cameraButtonRef?: React.RefObject<HTMLButtonElement | null>;
    gestureMappings?: Record<string, GestureDefinition>;
    onLongPressGesture?: (gesture: GestureDefinition) => void;
    onLanguageClick?: () => void;
    customLanguageLabel?: string;
    showLanguageToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
                                                  onOpenSettings,
                                                  toggleTracking,
                                                  hasUnsyncedChanges,
                                                  onSOS,
                                                  onHome,
                                                  isSentenceBuilderActive,
                                                  toggleSentenceBuilder,
                                                  // @ts-ignore
                                                  lastGesture,
                                                  // @ts-ignore
                                                  isPrimary,
                                                  focusedIndex,
                                                  showCloseDropzone = false,
                                                  cameraButtonRef,
                                                  // @ts-ignore
                                                  gestureMappings = {},
                                                  // @ts-ignore
                                                  onLongPressGesture = () => {},
                                                  onLanguageClick,
                                                  customLanguageLabel,
                                                  showLanguageToggle = true
                                              }) => {
    const {playClick} = useAudio();
    const {language, setLanguage, primaryLanguage, secondaryLanguage} = useLanguage();

    const toggleLang = () => {
        playClick();
        if (navigator.vibrate) navigator.vibrate(30);
        const nextLang = language === primaryLanguage ? secondaryLanguage : primaryLanguage;
        setLanguage(nextLang);
    };

    return (<header className="apple-header consistent-header" dir="ltr">
            <div className="header-grid-layout">
                {/* 1fr: Camera */}
                <div className="header-cell">
                    <button
                        ref={cameraButtonRef}
                        className={`btn-icon-ios ${focusedIndex === 0 ? 'focused-item' : ''} ${showCloseDropzone ? 'drop-active' : ''}`}
                        onClick={() => {
                            playClick();
                            toggleTracking();
                        }}
                        aria-label="Camera"
                    >
                        {showCloseDropzone ? (
                            <X size={30} color="#DC2626" strokeWidth={3} className="animate-pulse" />
                        ) : (
                            <Camera size={22} color="var(--color-primary)" />
                        )}
                    </button>
                </div>

                {/* 1fr: Sentence Builder Toggle */}
                <div className="header-cell">
                    <button
                        className={`btn-icon-ios ${isSentenceBuilderActive ? 'active' : 'inactive'} ${focusedIndex === 1 ? 'focused-item' : ''}`}
                        onClick={() => {
                            playClick();
                            toggleSentenceBuilder();
                        }}
                        aria-label={isSentenceBuilderActive ? "Hide Sentence Builder" : "Show Sentence Builder"}
                    >
                        <Megaphone size={20} color={isSentenceBuilderActive ? "var(--color-primary)" : "#9CA3AF"}/>
                        {!isSentenceBuilderActive && <div className="inactive-slash"/>}
                    </button>
                </div>

                {/* 2fr: Shukr (Branding) */}
                <div className="header-cell span-2">
                    <div className="shukr-button-wrapper">
                        <ShukrButton
                            onSOS={onSOS}
                            onHome={onHome}
                            playClick={playClick}
                            onOpenSettings={() => onOpenSettings('contact')}
                            hasUnsyncedChanges={hasUnsyncedChanges}
                            isFocused={focusedIndex === 2}
                        />
                    </div>
                </div>

                {/* 1fr: Language */}
                {showLanguageToggle ? (
                    <div className="header-cell">
                        <button
                            className={`btn-icon-ios ${focusedIndex === 3 ? 'focused-item' : ''}`}
                            onClick={onLanguageClick ? () => { playClick(); onLanguageClick(); } : toggleLang}
                            aria-label="Switch Language"
                        >
                            <div className="lang-init-display" style={{ 
                                fontSize: '0.9rem', 
                                fontWeight: 800, 
                                color: 'var(--color-primary)'
                            }}>
                                {customLanguageLabel ? customLanguageLabel.toUpperCase() : language.toUpperCase()}
                            </div>
                        </button>
                    </div>
                ) : <div className="header-cell" />}

                {/* 1fr: Settings */}
                <div className="header-cell">
                    <button
                        className={`btn-icon-ios ${focusedIndex === 4 ? 'focused-item' : ''}`}
                        onClick={() => {
                            playClick();
                            onOpenSettings();
                        }}
                        aria-label="Settings"
                    >
                        <Settings size={22}/>
                    </button>
                </div>
            </div>
        </header>
    );
};
