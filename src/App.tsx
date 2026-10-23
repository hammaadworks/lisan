import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './styles/app.css';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { useAudio } from './hooks/useAudio';
import { ConfigProvider, useAppConfig } from './hooks/useAppConfig';
import { GestureEditModal } from './components/modals/GestureEditModal';
import { type GestureDefinition } from './recognition/gestures/types';
import { useFuzzySearch } from './hooks/useFuzzySearch';
import { predictionsEngine } from './lib/predictionsEngine';
import { translator } from './lib/translator';
import { universeDb } from './lib/universeDb';
import { vocabularyStore } from './lib/vocabularyStore';
import { sensoryFeedback } from './lib/sensoryFeedback';
import { useSentenceBuilder } from './hooks/useSentenceBuilder';
import { useAccessibilityNavigation } from './hooks/useAccessibilityNavigation';
import type { WordItem, AppRoute } from './types';

// Extracted UI Components
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { WordPredictions } from './components/WordPredictions';
import { WordGrid } from './components/WordGrid';
import { SentenceBuilder } from './components/SentenceBuilder';
import { Footer } from './components/Footer';
import { SOSModal } from './components/SOSModal';
import { SettingsPanel } from './components/SettingsPanel';
import { VoiceStudio } from './components/VoiceStudio/VoiceStudio';
import { DoodlePad } from './components/Doodle/DoodlePad';
import { GestureService } from './components/GestureService';
import { LandingPage } from './components/LandingPage';
import { WordManager } from './components/WordManager';
import { ScreenFlashes } from './components/ScreenFlashes';
import { WordAddModal } from './components/WordAddModal';
import { WordEditor } from './components/WordEditor';

const AppContent = () => {
  const { language, setLanguage, primaryLanguage, secondaryLanguage, isPrimary, t } = useLanguage();
  const { speak, speakSequence, playClick, currentlyPlayingId } = useAudio();
  const { config, updateConfig, isLoading: isConfigLoading } = useAppConfig();

  // Sentence Builder Domain Hook
  const {
    sentence,
    isActive: isSentenceBuilderActive,
    toggleActive: toggleSentenceBuilder,
    isFlashing: flashSentenceBuilder,
    addWord,
    clearSentence,
    backspaceSentence,
    playSentence,
    canAddWords
  } = useSentenceBuilder(speakSequence);

  // Core Modals and Editing States
  const [editingWord, setEditingWord] = useState<WordItem | null>(null);
  const [addingWord, setAddingWord] = useState<WordItem | null>(null);
  const [editingGesture, setEditingGesture] = useState<GestureDefinition | null>(null);
  const [showSOS, setShowSOS] = useState(false);

  // App Lifecycle & Routing
  const isPWA = useMemo(() => {
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  }, []);

  const [isAppStarted, setIsAppStarted] = useState(() => {
    return localStorage.getItem('lisan_app_started') === 'true' || isPWA;
  });

  const [route, setRoute] = useState<AppRoute>((window.location.hash as AppRoute) || '#');
  const [previousRoute, setPreviousRoute] = useState<string>('#');
  const [showSplash, setShowSplash] = useState(isAppStarted);

  // Settings & Voice Studio Routing Params
  const [initialSettingsTab, setInitialSettingsTab] = useState<string | null>(null);
  const [initialEditingItem, setInitialEditingItem] = useState<WordItem | null>(null);
  const [voiceParams, setVoiceParams] = useState<{ wordId?: string; voiceId?: string; language?: string } | null>(null);

  // Navigation, Search, and Category State
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastGesture, setLastGesture] = useState<string>('');
  const [showYesFlash, setShowYesFlash] = useState(false);
  const [showNoFlash, setShowNoFlash] = useState(false);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const [dbWords, setDbWords] = useState<WordItem[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const builderScrollRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const cameraButtonRef = useRef<HTMLButtonElement>(null);

  // Safe quotes management avoiding cascading renders
  const randomQuote = useMemo(() => {
    if (selectedQuote) return selectedQuote;
    if (config?.quotes && config.quotes.length > 0) {
      return config.quotes[0];
    }
    return null;
  }, [selectedQuote, config?.quotes]);

  const handleNextQuote = useCallback(() => {
    if (!config?.quotes?.length) return;
    const quotes = config.quotes;
    const currentIndex = quotes.findIndex((q: any) => q.id === randomQuote?.id);
    const nextIndex = (currentIndex + 1) % quotes.length;
    setSelectedQuote(quotes[nextIndex]);
  }, [config, randomQuote]);

  // Synchronize IndexedDB words safely without triggering setState in effect warnings
  useEffect(() => {
    let isMounted = true;
    universeDb.words.toArray().then((words) => {
      if (isMounted) setDbWords(words as WordItem[]);
    });
    return () => {
      isMounted = false;
    };
  }, [config]);

  // Routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      setPreviousRoute(route);
      setRoute((window.location.hash as AppRoute) || '#');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [route]);

  const navigate = useCallback((newRoute: AppRoute, tab?: string) => {
    if (tab) setInitialSettingsTab(tab);
    setPreviousRoute(route);
    window.location.hash = newRoute;
  }, [route]);

  const navigateVoiceStudio = useCallback((params: { wordId?: string; voiceId?: string; language?: string }) => {
    setVoiceParams(params);
    setPreviousRoute(route);
    window.location.hash = '#voices';
  }, [route]);

  // Splash Screen timeout
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleStartApp = useCallback(() => {
    localStorage.setItem('lisan_app_started', 'true');
    setIsAppStarted(true);
    setShowSplash(true);
    navigate('#');
    playClick();
  }, [playClick, navigate]);

  const handleCameraToggle = useCallback(() => {
    const fn = (window as unknown as { _toggleGestureService?: () => void })._toggleGestureService;
    if (typeof fn === 'function') {
      fn();
    }
  }, []);

  // Dropzone magnetism for camera preview
  const handlePreviewDrop = useCallback((rect: DOMRect) => {
    if (!cameraButtonRef.current) return;
    const dropRect = cameraButtonRef.current.getBoundingClientRect();
    const padding = 25;
    const target = {
      left: dropRect.left - padding,
      right: dropRect.right + padding,
      top: dropRect.top - padding,
      bottom: dropRect.bottom + padding
    };

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const isOverlapping = (
      centerX >= target.left &&
      centerX <= target.right &&
      centerY >= target.top &&
      centerY <= target.bottom
    );

    if (isOverlapping) {
      sensoryFeedback.vibrate([40, 30]);
      handleCameraToggle();
    }
  }, [handleCameraToggle]);

  // Category and Word Data
  const allItems: WordItem[] = useMemo(() => {
    if (!config?.categories) return [];
    return config.categories.flatMap((c: any) => c.items || []);
  }, [config]);

  const displayCategories = useMemo(() => {
    if (!config?.categories) return [];
    return config.categories.map((cat: any) => ({
      id: cat.id,
      label_primary: cat.label_primary,
      label_secondary: cat.label_secondary,
      icon: cat.icon
    }));
  }, [config]);

  const searchResults = useFuzzySearch(allItems, searchQuery);

  const toggleFavorite = useCallback(
    (itemId: string) => {
      if (!config) return;
      const favorites = [...(config.favorites || [])];
      const idx = favorites.indexOf(itemId);
      if (idx > -1) favorites.splice(idx, 1);
      else favorites.push(itemId);
      updateConfig({ ...config, favorites });
    },
    [config, updateConfig]
  );

  const handleDeleteWord = useCallback(async (id: string) => {
    if (!config) return;
    const updatedConfig = await vocabularyStore.deleteConcept(id, config);
    updateConfig(updatedConfig);
    setEditingWord(null);
  }, [config, updateConfig]);

  const handleSaveEdit = useCallback(async (item: WordItem, blob?: Blob | null) => {
    if (!config) return;
    const updatedConfig = await vocabularyStore.saveConcept(item, config, blob);
    updateConfig(updatedConfig);
    setEditingWord(null);
  }, [config, updateConfig]);

  const handleAddCustomWord = useCallback(async (item: WordItem, blob?: Blob | null) => {
    if (!config) return;
    const updatedItem: WordItem = { ...item, categoryId: item.categoryId || 'general' };
    const updatedConfig = await vocabularyStore.saveConcept(updatedItem, config, blob);
    updateConfig(updatedConfig);
    setAddingWord(null);
  }, [config, updateConfig]);

  const handleSaveGesture = useCallback(async (updated: GestureDefinition, blob?: Blob | null) => {
    if (!config) return;
    const newConfig = {
      ...config,
      gesture_mappings: {
        ...(config.gesture_mappings || {}),
        [updated.id]: updated
      }
    };
    updateConfig(newConfig);
    if (blob) {
      await vocabularyStore.saveGestureAudio(updated.id, blob);
    }
    setEditingGesture(null);
  }, [config, updateConfig]);

  const createSearchPrompt = useCallback(async () => {
    const res = await translator.translate(searchQuery);
    setAddingWord({
      id: 'pending_id',
      text_primary: res?.ur || searchQuery,
      text_secondary: res?.en || searchQuery,
      en: res?.en || searchQuery,
      ur: res?.ur || searchQuery,
      roman: res?.roman || searchQuery,
      icon: 'list-plus',
      next: []
    });
  }, [searchQuery]);

  const handleOpenAddWord = useCallback((_catId: string, initialValue?: string) => {
    setAddingWord({
      id: 'pending_id',
      text_primary: initialValue || '',
      text_secondary: initialValue || '',
      ur: initialValue || '',
      en: initialValue || '',
      roman: '',
      icon: 'list-plus',
      next: []
    });
  }, []);

  const getSearchItems = useCallback((): WordItem[] => {
    const results = [...searchResults];
    const exactMatch = results.some((r: any) =>
      (r.text_primary || r.ur || '').toLowerCase() === searchQuery.toLowerCase() ||
      (r.text_secondary || r.en || '').toLowerCase() === searchQuery.toLowerCase()
    );
    if (!exactMatch && searchQuery.length > 1) {
      const addLabel = t('doodle.addNew');
      results.push({ id: 'add_new_prompt', ur: addLabel, en: 'Add Word?', icon: 'list-plus', isPrompt: true, onClick: createSearchPrompt });
    }
    return results;
  }, [searchResults, searchQuery, createSearchPrompt, t]);

  const getHomeItems = useCallback((): WordItem[] => {
    return dbWords.length > 0 ? [...dbWords].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)) : allItems;
  }, [dbWords, allItems]);

  const getFavoriteItems = useCallback((): WordItem[] => {
    const favs = config?.favorites || [];
    const items = (dbWords.length > 0 ? dbWords : allItems).filter((i: WordItem) => favs.includes(i.id));
    const addLabel = t('doodle.addNew');
    return [
      { id: 'add_fav_prompt', ur: addLabel, en: 'Add Word?', icon: 'list-plus', isPrompt: true, onClick: () => handleOpenAddWord('favorite') },
      ...items
    ];
  }, [dbWords, allItems, config?.favorites, t, handleOpenAddWord]);

  const getFamilyItems = useCallback((): WordItem[] => {
    const fams = config?.family || [];
    const items = (dbWords.length > 0 ? dbWords : allItems).filter((i: WordItem) => fams.includes(i.id));
    const addLabel = t('doodle.addNew');
    return [
      { id: 'add_family_prompt', ur: addLabel, en: 'Add Word?', icon: 'list-plus', isPrompt: true, onClick: () => handleOpenAddWord('family') },
      ...items
    ];
  }, [dbWords, allItems, config?.family, t, handleOpenAddWord]);

  const gridItems: WordItem[] = useMemo(() => {
    if (searchQuery) return getSearchItems();
    if (currentCategory === 'favorite') return getFavoriteItems();
    if (currentCategory === 'family') return getFamilyItems();

    const items = getHomeItems();
    if (currentCategory === 'general') {
      const addLabel = t('doodle.addNew');
      return [
        { id: 'add_general_prompt', ur: addLabel, en: 'Add Word?', icon: 'list-plus', isPrompt: true, onClick: () => handleOpenAddWord('general') },
        ...items
      ];
    }
    return items;
  }, [searchQuery, currentCategory, getSearchItems, getFavoriteItems, getFamilyItems, getHomeItems, t, handleOpenAddWord]);

  // Dynamic Word Predictions
  const [predictions, setPredictions] = useState<WordItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (dbWords.length === 0) return;
    predictionsEngine.rankPredictions(dbWords, sentence).then(ranked => {
      if (isMounted) setPredictions(ranked.slice(0, 6));
    });
    return () => { isMounted = false; };
  }, [sentence, dbWords]);

  const handleWordItemClick = useCallback(
    async (item: WordItem) => {
      const text = isPrimary ? (item.text_primary || item.ur || '') : (item.text_secondary || item.en || '');
      speak(text, item.id);
      addWord(item);
    },
    [speak, isPrimary, addWord]
  );

  // Consolidated Navigable Actions Array
  const navigableActions = useMemo(() => {
    const actions: (() => void)[] = [];

    // 1. Header (0-4)
    actions.push(() => handleCameraToggle());
    actions.push(toggleSentenceBuilder);
    actions.push(() => { playClick(); navigate('#'); });
    actions.push(() => { playClick(); setLanguage(language === primaryLanguage ? secondaryLanguage : primaryLanguage); });
    actions.push(() => { playClick(); navigate('#settings'); });

    // 2. Categories
    displayCategories.forEach(cat => actions.push(() => {
      playClick();
      setCurrentCategory(cat.id === currentCategory ? null : cat.id);
    }));

    // 3. Predictions
    predictions.forEach(item => actions.push(() => handleWordItemClick(item)));

    // 4. Grid Items
    gridItems.forEach(item => actions.push(() => handleWordItemClick(item)));

    // 5. Sentence Builder (if active)
    if (isSentenceBuilderActive) {
      actions.push(() => { clearSentence(); playClick(); });
      actions.push(() => { backspaceSentence(); playClick(); });
      actions.push(playSentence);
    }

    // 6. Footer Actions (Yes, No, Doodle)
    actions.push(() => {
      speak(t('app.yes'), 'sys_yes');
      setShowYesFlash(true);
      setTimeout(() => setShowYesFlash(false), 1000);
    });
    actions.push(() => {
      speak(t('app.no'), 'sys_no');
      setShowNoFlash(true);
      setTimeout(() => setShowNoFlash(false), 1000);
    });
    actions.push(() => { playClick(); navigate('#doodle'); });

    return actions;
  }, [
    handleCameraToggle,
    toggleSentenceBuilder,
    playClick,
    navigate,
    setLanguage,
    language,
    primaryLanguage,
    secondaryLanguage,
    displayCategories,
    currentCategory,
    predictions,
    gridItems,
    isSentenceBuilderActive,
    clearSentence,
    backspaceSentence,
    playSentence,
    handleWordItemClick,
    speak,
    t
  ]);

  // Centralized Accessibility Navigation Hook
  const {
    focusedIndex,
    setFocusedIndex,
    resetFocus,
    nextFocus,
    selectCurrent,
    offsets
  } = useAccessibilityNavigation(navigableActions, {
    headerCount: 5,
    categoriesCount: displayCategories.length,
    predictionsCount: predictions.length,
    gridItemsCount: gridItems.length,
    builderCount: isSentenceBuilderActive ? 3 : 0,
    footerCount: 3
  });

  // Hands-free Gesture Action Dispatcher
  const handleGestureAction = useCallback(async (gestureKey: string) => {
    const mapping = config?.gesture_mappings?.[gestureKey];
    if (!mapping) return;

    setLastGesture(gestureKey);
    setTimeout(() => setLastGesture(''), 2000);

    // 1. Audio Mapping
    if (mapping.type === 'audio') {
      const blob = await vocabularyStore.getGestureAudio(gestureKey);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => URL.revokeObjectURL(url);
        audio.play();
        return;
      }
    }

    // 2. Words Sequence
    if (mapping.type === 'words' && Array.isArray(mapping.value)) {
      const wordsToSpeak = allItems.filter((i: WordItem) => (mapping.value as string[]).includes(i.id));
      if (wordsToSpeak.length > 0) {
        speakSequence(wordsToSpeak);
        return;
      }
    }

    // 3. Functional Actions
    if (mapping.type === 'action') {
      const action = mapping.value as string;
      switch (action) {
        case 'YES':
          speak(t('app.yes'), 'sys_yes');
          setShowYesFlash(true);
          setTimeout(() => setShowYesFlash(false), 1000);
          break;
        case 'CLEAR':
          clearSentence();
          setCurrentCategory(null);
          resetFocus();
          playClick();
          break;
        case 'SELECT':
          selectCurrent();
          break;
        case 'NEXT':
          nextFocus();
          break;
        case 'NAV_DOODLE':
          playClick();
          navigate('#doodle');
          break;
        case 'NAV_SETTINGS':
          playClick();
          navigate('#settings');
          break;
        case 'TOGGLE_LANG':
          playClick();
          setLanguage(language === primaryLanguage ? secondaryLanguage : primaryLanguage);
          break;
        case 'TOGGLE_BUILDER':
          playClick();
          toggleSentenceBuilder();
          break;
      }
    }
  }, [
    config,
    speak,
    speakSequence,
    allItems,
    selectCurrent,
    nextFocus,
    clearSentence,
    resetFocus,
    playClick,
    navigate,
    setLanguage,
    language,
    primaryLanguage,
    secondaryLanguage,
    toggleSentenceBuilder,
    t
  ]);

  if (showSplash || isConfigLoading) {
    return <SplashScreen quote={randomQuote || { ur: 'لسان', en: 'Lisan' }} isLoading={isConfigLoading} />;
  }

  if ((!isAppStarted || route === '#landing') && (route === '#' || route === '#landing')) {
    return <LandingPage onStart={handleStartApp} />;
  }

  return (
    <div className="app-viewport" dir={document.documentElement.dir}>
      {isDraggingPreview && <div className="dragging-backdrop" />}

      {route !== '#voices' && route !== '#words' && (
        <Header
          onOpenSettings={(tab) => navigate('#settings', tab)}
          toggleTracking={handleCameraToggle}
          hasUnsyncedChanges={false}
          onSOS={() => setShowSOS(true)}
          onHome={() => { clearSentence(); setCurrentCategory(null); navigate('#'); }}
          isSentenceBuilderActive={isSentenceBuilderActive}
          toggleSentenceBuilder={toggleSentenceBuilder}
          lastGesture={lastGesture}
          isPrimary={isPrimary}
          focusedIndex={focusedIndex}
          showCloseDropzone={isDraggingPreview}
          cameraButtonRef={cameraButtonRef}
          gestureMappings={config?.gesture_mappings}
          onLongPressGesture={setEditingGesture}
          showLanguageToggle={route === '#' || route === '#doodle'}
        />
      )}

      <div className="main-content-wrapper" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {route === '#voices' ? (
          <VoiceStudio
            config={config}
            updateConfig={updateConfig}
            onClose={() => { setVoiceParams(null); navigate(previousRoute !== '#voices' ? (previousRoute as AppRoute) : '#'); }}
            initialWordId={voiceParams?.wordId}
            initialVoiceId={voiceParams?.voiceId}
            initialLanguage={voiceParams?.language}
          />
        ) : route === '#words' ? (
          <WordManager 
            onClose={() => navigate('#')} 
            onRecord={navigateVoiceStudio}
          />
        ) : route === '#settings' ? (
          <SettingsPanel
            config={config}
            updateConfig={updateConfig}
            initialTab={(initialSettingsTab as any) || undefined}
            initialEditingItem={initialEditingItem}
            onOpenVoiceStudio={(wordId?: string, language?: string) => navigateVoiceStudio({ wordId, language })}
            onShowLanding={() => { setIsAppStarted(false); navigate('#'); }}
            onClose={() => { setInitialEditingItem(null); setInitialSettingsTab(null); navigate('#'); }}
            randomQuote={randomQuote}
            onNextQuote={handleNextQuote}
          />
        ) : route === '#doodle' ? (
          <DoodlePad
            config={config}
            focusedIndex={focusedIndex}
            onOpenAddWord={(initial) => handleOpenAddWord('cat_custom', initial)}
            sentence={sentence}
            onRecognize={(item: WordItem) => {
              const text = isPrimary ? (item.text_primary || item.ur || '') : (item.text_secondary || item.en || '');
              speak(text, item.id);
              addWord(item);
            }}
          />
        ) : (
          <>
            <div className="top-system-area">
              <WordPredictions 
                predictions={predictions} 
                focusedIndex={focusedIndex} 
                offset={offsets.predictions} 
                onSelect={handleWordItemClick}
              />
            </div>

            <div className="main-content-area" ref={mainContentRef}>
              <WordGrid
                gridItems={gridItems}
                focusedIndex={focusedIndex}
                offset={offsets.grid}
                currentlyPlayingId={currentlyPlayingId}
                onLongPressItem={(item) => toggleFavorite(item.id)}
                onDeleteItem={handleDeleteWord}
                onEditItem={(item) => setEditingWord(item)}
                onSelect={handleWordItemClick}
                favorites={config?.favorites || []}
              />
            </div>

            {isSentenceBuilderActive && (
              <div className="top-system-area" style={{ paddingTop: 0, paddingBottom: 8 }}>
                <SentenceBuilder
                  words={sentence}
                  onClear={clearSentence}
                  onBackspace={backspaceSentence}
                  onPlay={playSentence}
                  focusedIndex={focusedIndex} 
                  offset={offsets.builder}
                  canAddWords={canAddWords}
                  builderScrollRef={builderScrollRef} 
                  flashBorder={flashSentenceBuilder}
                  currentlyPlayingId={currentlyPlayingId}
                />
              </div>
            )}
          </>
        )}
      </div>

      {(route === '#' || route === '#doodle') && (
        <Footer
          currentCategory={currentCategory}
          onCategoryClick={(catId) => {
            playClick();
            if (route !== '#') navigate('#');
            setCurrentCategory(catId === currentCategory ? null : catId);
            setFocusedIndex(-1);
            setSearchQuery('');
          }}
          onDoodleClick={() => {
            playClick(); 
            if (currentCategory) { 
              setCurrentCategory(null); 
              navigate('#'); 
              return; 
            }
            if (route === '#doodle') {
              navigate('#');
            } else {
              navigate('#doodle');
            }
          }}
          onYesClick={() => {
            const yesText = t('app.yes');
            speak(yesText, 'sys_yes');
            setShowYesFlash(true);
            setTimeout(() => setShowYesFlash(false), 1000);
            if (route === '#doodle') navigate('#');
          }}
          onNoClick={() => {
            const noText = t('app.no');
            speak(noText, 'sys_no');
            setShowNoFlash(true);
            setTimeout(() => setShowNoFlash(false), 1000);
            if (route === '#doodle') navigate('#');
          }}
          focusedIndex={focusedIndex} 
          offset={offsets.footer}
        />
      )}

      <GestureService 
         onAction={handleGestureAction}
         forceDisabled={route === '#voices' || showSplash || !isAppStarted || isConfigLoading}
         onDragChange={setIsDraggingPreview}
         onDrop={handlePreviewDrop}
         cameraButtonRef={cameraButtonRef}
         onLongPressGesture={setEditingGesture}
         lastGesture={lastGesture}
      />

      <ScreenFlashes showYes={showYesFlash} showNo={showNoFlash} />
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} emergencyContacts={config?.emergency_contacts || []} />}
      <WordAddModal 
        addingWord={addingWord} 
        setAddingWord={setAddingWord} 
        onSave={handleAddCustomWord} 
        existingWords={allItems} 
      />
      <WordEditor 
        item={editingWord} 
        onClose={() => setEditingWord(null)} 
        onSave={handleSaveEdit} 
        onDelete={handleDeleteWord} 
        existingWords={allItems}
      />
      {editingGesture && (
        <GestureEditModal
          gesture={editingGesture}
          config={config}
          onClose={() => setEditingGesture(null)}
          onSave={handleSaveGesture}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </LanguageProvider>
  );
}
