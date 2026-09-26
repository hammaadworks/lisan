import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronLeft, Download, Edit2, Mic, RefreshCw, Settings, Trash2, Upload, X, Volume2, VolumeX} from 'lucide-react';
import {translator} from '../lib/translator';
import {universePorter} from '../lib/universePorter';
import {universeDb} from '../lib/universeDb';
import {vocabularyStore} from '../lib/vocabularyStore';
import {WordEditor} from './WordEditor';
import {AlertDialog, ConfirmDialog, PromptDialog, SelectDialog} from './modals/Dialogs';

import { useLanguage } from '../hooks/useLanguage';
import { SUPPORTED_LANGS } from '../lib/languages';

import { QuoteCard } from './QuoteCard';

interface SettingsPanelProps {
    config: any;
    updateConfig: (newConfig: any) => void;
    onOpenVoiceStudio: (wordId?: string, language?: string) => void;
    onShowLanding?: () => void;
    onClose: () => void;
    initialTab?: TabType;
    initialEditingItem?: any;
    randomQuote?: any;
    onNextQuote?: () => void;
}

type EditingType = 'word' | 'category' | 'quote';

type TabType = 'contact' | 'voice' | 'data' | 'general';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
                                                                config,
                                                                updateConfig,
                                                                onOpenVoiceStudio,
                                                                onShowLanding,
                                                                onClose,
                                                                initialTab,
                                                                initialEditingItem,
                                                                randomQuote,
                                                                onNextQuote
                                                            }) => {
    const { primaryLanguage, secondaryLanguage, setLanguagePair, t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'general');
    const [editingItem, setEditingItem] = useState<any | null>(initialEditingItem || null);
    const [editingType] = useState<EditingType>('word');
    const [editMode] = useState<'edit' | 'new'>('edit');
    const [isExporting, setIsExporting] = useState(false);

    // Modal States
    const [alertInfo, setAlertInfo] = useState<{ title: string, desc: string } | null>(null);
    const [confirmInfo, setConfirmInfo] = useState<{
        title: string,
        desc: string,
        isDanger?: boolean,
        action: () => void
    } | null>(null);
    const [promptInfo, setPromptInfo] = useState<{
        title: string,
        placeholder?: string,
        defaultValue?: string,
        action: (val: string) => void
    } | null>(null);
    const [showVoiceSelect, setShowVoiceSelect] = useState(false);
    const [showPrimarySelect, setShowPrimarySelect] = useState(false);
    const [showSecondarySelect, setShowSecondarySelect] = useState(false);

    const voiceOptions = (config?.voices || []).map((p: any) => ({
        value: p.id,
        label: `${p.name} (${p.language?.toUpperCase() || '?'})${p.editable === false ? ' [🔒]' : ''}`
    }));
    const currentVoiceName = voiceOptions.find((o: any) => o.value === (config?.active_voice || ''))?.label || t('settings.voice.selectVoice');

    const handleRenameVoice = () => {
        const activeId = config?.active_voice;
        if (!activeId) return;
        const voice = (config?.voices || []).find((p: any) => p.id === activeId);
        if (!voice) return;
        
        if (voice.editable === false) {
            setAlertInfo({title: "System Voice", desc: "System pre-loaded voices cannot be renamed."});
            return;
        }

        const placeholder = `${voice.name} (${voice.language?.toUpperCase()})`;

        setPromptInfo({
            title: "Rename Voice",
            placeholder: placeholder,
            defaultValue: voice.name,
            action: async (newName) => {
                const trimmed = newName.trim();
                if (!trimmed || trimmed === voice.name) return;

                // Validation: Only English alphabets
                if (!/^[a-zA-Z]+$/.test(trimmed)) {
                    setAlertInfo({ title: "Invalid Name", desc: "Name must contain only English alphabets." });
                    return;
                }

                // Sanitization: Title Case
                const sanitizedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                if (sanitizedName === voice.name) return;

                const newId = `${voice.language}_voice_${sanitizedName.toLowerCase()}`;

                // Duplicate check
                const isDuplicate = await universeDb.voices.get(newId);
                if (isDuplicate) {
                    setAlertInfo({ title: "Duplicate Name", desc: `A voice named "${sanitizedName}" already exists for ${voice.language?.toUpperCase()}.` });
                    return;
                }

                // --- STABLE LINK RENAMING (Zero Cascading Updates) ---
                if (voice.numericId) {
                    await universeDb.voices.update(voice.numericId, { 
                        id: newId, 
                        name: sanitizedName 
                    });
                }

                const newVoices = (config?.voices || []).map((p: any) => p.id === activeId ? { ...p, id: newId, name: sanitizedName } : p);
                updateConfig({
                    ...config,
                    voices: newVoices,
                    active_voice: config.active_voice === activeId ? newId : config.active_voice
                });
            }
        });
    };

    const handleDeleteVoice = () => {
        const activeId = config?.active_voice;
        if (!activeId) return;
        const voice = (config?.voices || []).find((p: any) => p.id === activeId);
        if (!voice) return;

        if (voice.editable === false) {
            setAlertInfo({title: "System Voice", desc: "System pre-loaded voices cannot be deleted."});
            return;
        }

        setConfirmInfo({
            title: "Delete Voice?",
            desc: "Are you sure you want to delete this voice and all its recordings?",
            isDanger: true,
            action: async () => {
                if (voice.numericId !== undefined) {
                    await universeDb.audio.where('voiceNumericId').equals(voice.numericId).delete();
                    await universeDb.voices.delete(voice.numericId);
                }
                
                const newVoices = (config?.voices || []).filter((p: any) => p.id !== activeId);
                updateConfig({
                    ...config,
                    voices: newVoices,
                    active_voice: newVoices.length > 0 ? newVoices[0].id : ''
                });
            }
        });
    };

    // Persistence: Universe Snapshot (Portable Backup)
    const handleExportUniverse = async () => {
        setIsExporting(true);
        try {
            const snapshot = await universePorter.export(config);
            universePorter.download(snapshot);
        } catch (err) {
            setAlertInfo({title: "Backup Failed", desc: "Please check the console for details."});
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportUniverse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const snapshot = JSON.parse(event.target?.result as string);
                setConfirmInfo({
                    title: "Merge Data",
                    desc: "This will merge the imported data into your current universe. Proceed?",
                    action: async () => {
                        await universePorter.import(snapshot);
                        setAlertInfo({title: "Success", desc: "Universe restored successfully!"});
                        setTimeout(() => window.location.reload(), 1500);
                    }
                });
            } catch (err) {
                setAlertInfo({title: "Error", desc: "Invalid backup file format."});
            }
        };
        reader.readAsText(file);
    };

    // Initialize translator with current config
    useEffect(() => {
        if (config) {
            translator.refresh(config);
        }
    }, [config]);

    const handleBack = () => {
        if (editingItem) {
            setEditingItem(null);
        } else {
            onClose();
        }
    };

    const handleSave = async (item: any) => {
        switch (editingType) {
            case 'word': {
                // Check for duplicates
                const allWords = config.categories.flatMap((c: any) => c.items || []);
                const isDuplicate = allWords.some((i: any) => {
                    if (i.id === item.id) return false;
                    const matchEn = i.translations?.en?.toLowerCase() === item.translations?.en?.toLowerCase();
                    const matchUr = i.translations?.ur === item.translations?.ur;
                    return matchEn || matchUr;
                });

                if (isDuplicate) {
                    setAlertInfo({title: "Duplicate Entry", desc: "This word already exists!"});
                    return;
                }

                const updatedConfig = await vocabularyStore.saveConcept(item, config);
                updateConfig(updatedConfig);
                break;
            }
            case 'quote': {
                let finalQuote = {...item};
                const newConfig = {...config};
                const quotes = newConfig.quotes || [];

                if (!finalQuote.translations) finalQuote.translations = { ur: item.ur, en: item.en };

                if (editMode === 'new') {
                    finalQuote = {
                        id: `quote_user_${crypto.randomUUID()}`,
                        translations: finalQuote.translations,
                        source: item.source || '',
                        createdAt: Date.now()
                    };
                    newConfig.quotes = [finalQuote, ...quotes];
                } else {
                    const idx = quotes.findIndex((q: any) => q.id === item.id);
                    if (idx > -1) {
                        finalQuote = {
                            ...quotes[idx], 
                            translations: finalQuote.translations,
                            source: item.source
                        };
                        newConfig.quotes[idx] = finalQuote;
                    }
                }

                if (finalQuote.id) {
                    await universeDb.quotes.put(finalQuote);
                }
                updateConfig(newConfig);
                break;
            }
        }

        setEditingItem(null);
    };

    const handleDelete = (itemId: string, _itemEn?: string) => {
        setConfirmInfo({
            title: "Delete Item?",
            desc: "Are you sure you want to delete this? This action is irreversible.",
            isDanger: true,
            action: async () => {
                switch (editingType) {
                    case 'word': {
                        const updatedConfig = await vocabularyStore.deleteConcept(itemId, config);
                        updateConfig(updatedConfig);
                        break;
                    }
                    case 'quote': {
                        const newConfig = { ...config };
                        newConfig.quotes = (newConfig.quotes || []).filter((q: any) => q.id !== itemId);
                        if (itemId) {
                            await universeDb.quotes.delete(itemId);
                        }
                        updateConfig(newConfig);
                        break;
                    }
                }

                setEditingItem(null);
            }
        });
    };

    return (<div className="settings-panel naani-friendly">
        {/* Header */}
        <div className="settings-header">
            <button className="btn-icon large-icon" onClick={handleBack}>
                {editingItem ? <X size={32}/> : <ChevronLeft size={36}/>}
            </button>
            <h2>
                {editingItem ? (editMode === 'new' ? t('settings.addNew') : t('settings.edit')) : t('settings.title')}
            </h2>
        </div>

        {/* Tabs */}
        {!editingItem && (<div className="settings-tabs">
            {[
                {id: 'general', label: t('settings.tabs.general'), icon: Settings},
                {id: 'contact', label: t('settings.tabs.contact'), icon: Settings}, 
                {id: 'voice', label: t('settings.tabs.voice'), icon: Mic}, 
                {id: 'data', label: t('settings.tabs.data'), icon: RefreshCw},
            ].map(tab => (<button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as TabType)}
            >
                {tab.label}
            </button>))}
        </div>)}

        <div className="settings-content">
            {!editingItem && (<>
                {/* Contact Settings */}
                {activeTab === 'contact' && (<div className="gestures-settings-container">
                    <div className="list-group">
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-primary)', fontSize: '1.2rem' }}>{t('settings.sos.template')}</h3>
                            <textarea 
                                className="massive-input"
                                style={{ width: '100%', height: 100, padding: 16, fontSize: '1.1rem', borderRadius: 24 }}
                                placeholder="I need help!"
                                value={config.sos_settings?.message_template || ''}
                                onChange={(e) => {
                                    const newConfig = { ...config };
                                    if (!newConfig.sos_settings) newConfig.sos_settings = {};
                                    newConfig.sos_settings.message_template = e.target.value;
                                    updateConfig(newConfig);
                                }}
                            />
                        </div>

                        <div className="massive-item" style={{ height: 100, marginBottom: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('settings.sos.countdown')}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[3, 5, 10].map(sec => (
                                    <button
                                        key={sec}
                                        className={`btn-icon ${config.sos_settings?.countdown_seconds === sec ? 'active' : ''}`}
                                        style={{ 
                                            width: 60, height: 60, borderRadius: 18, fontSize: '1.2rem', fontWeight: 900,
                                            background: config.sos_settings?.countdown_seconds === sec ? 'var(--color-primary)' : 'white',
                                            color: config.sos_settings?.countdown_seconds === sec ? 'white' : 'var(--color-primary)',
                                            border: '1px solid var(--color-primary)'
                                        }}
                                        onClick={() => {
                                            const newConfig = { ...config };
                                            if (!newConfig.sos_settings) newConfig.sos_settings = {};
                                            newConfig.sos_settings.countdown_seconds = sec;
                                            updateConfig(newConfig);
                                        }}
                                    >
                                        {sec}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-primary)', fontSize: '1.2rem' }}>{t('settings.sos.contacts')}</h3>
                        {(config.emergency_contacts || []).map((contact: any, idx: number) => (
                            <div key={idx} className="massive-item"
                                 style={{flexDirection: 'column', gap: 12, marginBottom: 12}}>
                                <div style={{display: 'flex', width: '100%', gap: 12}}>
                                    <input
                                        className="massive-input"
                                        dir="ltr"
                                        style={{flex: 1}}
                                        placeholder={t('settings.sos.namePlaceholder')}
                                        value={contact.name}
                                        onChange={(e) => {
                                            const newConfig = {...config};
                                            newConfig.emergency_contacts[idx].name = e.target.value;
                                            updateConfig(newConfig);
                                        }}
                                    />
                                    <input
                                        className="massive-input"
                                        dir="ltr"
                                        style={{flex: 1.5}}
                                        placeholder={t('settings.sos.phonePlaceholder')}
                                        value={contact.phone}
                                        onChange={(e) => {
                                            const newConfig = {...config};
                                            newConfig.emergency_contacts[idx].phone = e.target.value;
                                            updateConfig(newConfig);
                                        }}
                                    />
                                </div>
                            </div>))}
                    </div>
                </div>)}

                {/* Voice Settings */}
                {activeTab === 'voice' && (<div className="gestures-settings-container">
                    <div style={{display: 'flex', gap: 12, marginBottom: 12}}>
                        <button
                            className="massive-input"
                            dir="ltr"
                            style={{
                                flex: 1,
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                height: 84,
                                borderRadius: 24,
                                fontSize: '1.2rem'
                            }}
                            onClick={() => setShowVoiceSelect(true)}
                        >
                            <span>{config?.active_voice ? currentVoiceName : t('settings.voice.selectVoice')}</span>
                            <ChevronDown size={24} color="var(--color-text-muted)"/>
                        </button>

                        {(() => {
                            const activeVoice = (config?.voices || []).find((p: any) => p.id === config?.activeVoice);
                            if (!activeVoice || activeVoice.editable === false) return null;
                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        className="btn-icon"
                                        style={{
                                            background: 'var(--color-bg)',
                                            border: '1px solid rgba(45,90,39,0.1)',
                                            height: 84,
                                            width: 84,
                                            borderRadius: 24
                                        }}
                                        onClick={handleRenameVoice}
                                    >
                                        <Edit2 size={28} color="var(--color-primary)"/>
                                    </button>
                                    <button
                                        className="btn-icon"
                                        style={{
                                            background: '#fff5f5',
                                            border: '1px solid rgba(220,38,38,0.1)',
                                            height: 84,
                                            width: 84,
                                            borderRadius: 24
                                        }}
                                        onClick={handleDeleteVoice}
                                    >
                                        <Trash2 size={28} color="#ff3b30"/>
                                    </button>
                                </div>
                            );
                        })()}
                    </div>

                    <button
                        className="btn-primary huge-btn w-full"
                        style={{
                            background: '#ff3b30',
                            height: 180,
                            color: 'white',
                            borderRadius: 36,
                            boxShadow: '0 12px 30px rgba(255,59,48,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            marginBottom: 24
                        }}
                        onClick={() => onOpenVoiceStudio()}
                    >
                        <Mic size={56}/>
                        <span style={{fontSize: '1.6rem', fontWeight: 900}}>{t('settings.voice.openStudio')}</span>
                    </button>
                </div>)}

                {/* Data Settings (System) */}
                {activeTab === 'data' && (<div className="gestures-settings-container">
                    <div className="list-group">
                        <div className="list-item massive-item"
                             style={{flexDirection: 'column', alignItems: 'flex-start', gap: 16}}>
                            <div style={{width: '100%'}}>
                                <h3 style={{margin: 0, color: 'var(--color-primary)'}}>{t('settings.data.intro')}</h3>
                                <p style={{fontSize: '0.9rem', color: '#8e8e93', marginTop: 4}}>
                                    {t('settings.data.introDesc')}
                                </p>
                            </div>
                            <button className="btn-save w-full" style={{
                                background: 'white',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-primary)',
                                boxShadow: 'none'
                            }} onClick={onShowLanding}>
                                {t('settings.data.viewLanding')}
                            </button>
                        </div>

                        <div className="list-item massive-item"
                             style={{flexDirection: 'column', alignItems: 'flex-start', gap: 16}}>
                            <div style={{width: '100%'}}>
                                <h3 style={{margin: 0, color: 'var(--color-primary)'}}>{t('settings.data.backup')}</h3>
                                <p dir="ltr" style={{
                                    fontSize: '0.9rem', color: '#8e8e93', marginTop: 4, textAlign: 'inherit'
                                }}>
                                    {t('settings.data.backupDesc')}
                                </p>
                            </div>
                            <button className="btn-save w-full" onClick={handleExportUniverse}
                                    disabled={isExporting}>
                                {isExporting ? <RefreshCw size={24} className="animate-spin"/> : <Download size={24}/>}
                                {isExporting ? "Exporting..." : t('settings.data.backupBtn')}
                            </button>
                        </div>

                        <div className="list-item massive-item"
                             style={{flexDirection: 'column', alignItems: 'flex-start', gap: 16}}>
                            <div style={{width: '100%'}}>
                                <h3 style={{margin: 0, color: 'var(--color-primary)'}}>{t('settings.data.restore')}</h3>
                                <p style={{fontSize: '0.9rem', color: '#8e8e93', marginTop: 4}}>
                                    {t('settings.data.restoreDesc')}
                                </p>
                            </div>
                            <label className="btn-save w-full" style={{
                                cursor: 'pointer',
                                background: '#f2f2f7',
                                color: 'var(--color-primary)',
                                boxShadow: 'none',
                                border: '1px solid rgba(45,90,39,0.1)'
                            }}>
                                <Upload size={24}/>
                                {t('settings.data.restoreBtn')}
                                <input type="file" accept=".json" onChange={handleImportUniverse}
                                       style={{display: 'none'}}/>
                            </label>
                        </div>

                        <div className="list-item massive-item"
                             style={{flexDirection: 'column', alignItems: 'flex-start', gap: 16, borderTop: '1px solid #eee', paddingTop: 24, marginTop: 12}}>
                            <div style={{width: '100%'}}>
                                <h3 style={{margin: 0, color: '#ff3b30'}}>{t('settings.data.hardReset')}</h3>
                                <p style={{fontSize: '0.9rem', color: '#8e8e93', marginTop: 4}}>
                                    {t('settings.data.hardResetDesc')}
                                </p>
                            </div>
                            <button 
                                className="btn-save w-full" 
                                style={{
                                    background: '#ff3b30', 
                                    color: 'white',
                                    boxShadow: '0 8px 20px rgba(255,59,48,0.2)'
                                }}
                                onClick={() => {
                                    setConfirmInfo({
                                        title: t('settings.data.hardResetBtn') + "?",
                                        desc: t('settings.data.hardResetConfirm'),
                                        isDanger: true,
                                        action: async () => {
                                            Object.keys(localStorage).forEach(key => {
                                                if (key.startsWith('shukr_')) {
                                                    localStorage.removeItem(key);
                                                }
                                            });
                                            await universePorter.clearAllLocalData();
                                            window.location.reload();
                                        }
                                    });
                                }}
                            >
                                <Trash2 size={24}/>
                                {t('settings.data.hardResetBtn')}
                            </button>
                        </div>
                    </div>
                </div>)}

                {/* General Settings */}
                {activeTab === 'general' && (<div className="gestures-settings-container">
                    <div className="list-group">
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-primary)', fontSize: '1.2rem' }}>{t('settings.general.nickname')}</h3>
                            <input 
                                className="massive-input"
                                style={{ width: '100%', height: 70, padding: 16, fontSize: '1.2rem', borderRadius: 24 }}
                                placeholder="e.g. Bade Ammi"
                                value={config.user_nickname || ''}
                                onChange={(e) => {
                                    updateConfig({ ...config, user_nickname: e.target.value });
                                }}
                            />
                        </div>

                        <div className="list-item massive-item"
                             style={{flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginBottom: 24}}>
                            <div style={{width: '100%'}}>
                                <h3 style={{margin: 0, color: 'var(--color-primary)'}}>{t('settings.general.langPair')}</h3>
                                <p style={{fontSize: '0.9rem', color: '#8e8e93', marginTop: 4}}>
                                    Select the language pair for the User and Caregiver.
                                </p>
                            </div>
                            
                            <div style={{ display: 'flex', width: '100%', gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: 4 }}>{t('settings.general.primary')}</label>
                                    <button 
                                        className="massive-input" 
                                        style={{ width: '100%', height: 60, fontSize: '1rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                        onClick={() => setShowPrimarySelect(true)}
                                    >
                                        <span>{SUPPORTED_LANGS.find(l => l.code === primaryLanguage)?.label}</span>
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: 4 }}>{t('settings.general.secondary')}</label>
                                    <button 
                                        className="massive-input" 
                                        style={{ width: '100%', height: 60, fontSize: '1rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                        onClick={() => setShowSecondarySelect(true)}
                                    >
                                        <span>{SUPPORTED_LANGS.find(l => l.code === secondaryLanguage)?.label}</span>
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-primary)', fontSize: '1.2rem' }}>{t('settings.general.speechRate')}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <input 
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.1"
                                    style={{ flex: 1, height: 12, accentColor: 'var(--color-primary)' }}
                                    value={config.preferences?.speech_rate || 0.9}
                                    onChange={(e) => {
                                        const newConfig = { ...config };
                                        if (!newConfig.preferences) newConfig.preferences = {};
                                        newConfig.preferences.speech_rate = parseFloat(e.target.value);
                                        updateConfig(newConfig);
                                    }}
                                />
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, width: 40 }}>{config.preferences?.speech_rate || 0.9}</span>
                            </div>
                        </div>

                        <div className="massive-item" style={{ height: 100 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ 
                                    background: config.preferences?.enable_click_sound !== false ? 'rgba(45,90,39,0.1)' : '#f2f2f7',
                                    padding: 16,
                                    borderRadius: 18,
                                    color: config.preferences?.enable_click_sound !== false ? 'var(--color-primary)' : '#8e8e93'
                                }}>
                                    {config.preferences?.enable_click_sound !== false ? <Volume2 size={32}/> : <VolumeX size={32}/>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('settings.general.buttonSound')}</span>
                                </div>
                            </div>
                            <button 
                                className={`huge-btn ${config.preferences?.enable_click_sound !== false ? 'active' : ''}`}
                                style={{ 
                                    width: 120, 
                                    height: 64, 
                                    borderRadius: 32,
                                    background: config.preferences?.enable_click_sound !== false ? 'var(--color-primary)' : '#e5e5ea',
                                    color: config.preferences?.enable_click_sound !== false ? 'white' : '#8e8e93',
                                    transition: 'all 0.3s ease',
                                    fontSize: '1.2rem',
                                    fontWeight: 900
                                }}
                                onClick={() => {
                                    const newConfig = { ...config };
                                    if (!newConfig.preferences) newConfig.preferences = {};
                                    newConfig.preferences.enable_click_sound = config.preferences?.enable_click_sound !== false ? false : true;
                                    updateConfig(newConfig);
                                }}
                            >
                                {config.preferences?.enable_click_sound !== false ? t('common.on') : t('common.off')}
                            </button>
                        </div>
                    </div>
                </div>)}
            </>)}

            {/* Edit Form */}
            {editingItem && (<WordEditor
                item={editingItem}
                isNew={editMode === 'new'}
                onChange={(newItem) => setEditingItem({...editingItem, ...newItem})}
                onSave={handleSave}
                onDelete={handleDelete}
                existingWords={(config?.categories || []).flatMap((c: any) => c.items || [])}
                onOpenVoiceStudio={onOpenVoiceStudio}
            />)}

            {!editingItem && randomQuote && onNextQuote && (
                <div style={{ marginTop: 32 }}>
                    <QuoteCard 
                        quote={randomQuote}
                        quotes={config?.quotes || []}
                        onNext={onNextQuote}
                        updateConfig={updateConfig}
                        config={config}
                    />
                </div>
            )}
        </div>

        {/* Modals */}
        <AlertDialog
            isOpen={!!alertInfo}
            onClose={() => setAlertInfo(null)}
            title={alertInfo?.title || ''}
            description={alertInfo?.desc || ''}
        />

        <ConfirmDialog
            isOpen={!!confirmInfo}
            onClose={() => setConfirmInfo(null)}
            title={confirmInfo?.title || ''}
            description={confirmInfo?.desc || ''}
            isDanger={confirmInfo?.isDanger}
            onConfirm={() => confirmInfo?.action()}
        />

        <PromptDialog
            isOpen={!!promptInfo}
            onClose={() => setPromptInfo(null)}
            title={promptInfo?.title || ''}
            placeholder={promptInfo?.placeholder}
            defaultValue={promptInfo?.defaultValue}
            onSubmit={(val) => promptInfo?.action(val)}
        />

        <SelectDialog 
            isOpen={showVoiceSelect} 
            onClose={() => setShowVoiceSelect(false)} 
            title="Select Voice" 
            options={voiceOptions} 
            selectedValue={config?.active_voice || 'default'} 
            onSelect={(val) => {
                const newConfig = {...config, active_voice: val};
                updateConfig(newConfig);
            }} 
        />
        <SelectDialog
            isOpen={showPrimarySelect}
            onClose={() => setShowPrimarySelect(false)}
            title={t('settings.general.primary')}
            options={SUPPORTED_LANGS.map(l => ({ value: l.code, label: l.label }))}
            selectedValue={primaryLanguage}
            onSelect={(val) => setLanguagePair(val, secondaryLanguage)}
        />

        <SelectDialog
            isOpen={showSecondarySelect}
            onClose={() => setShowSecondarySelect(false)}
            title={t('settings.general.secondary')}
            options={SUPPORTED_LANGS.map(l => ({ value: l.code, label: l.label }))}
            selectedValue={secondaryLanguage}
            onSelect={(val) => setLanguagePair(primaryLanguage, val)}
        />
    </div>);
};
