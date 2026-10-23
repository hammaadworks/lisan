import React, { useEffect, useState, useRef, useMemo } from 'react';
import '../styles/modules/landing.css';
import { WordCard } from './WordCard';
import { useLanguage } from '../hooks/useLanguage';
import { useAudio } from '../hooks/useAudio';
import { SUPPORTED_LANGS as REGISTRY_LANGS } from '../lib/languages';
import { SelectDialog } from './modals/Dialogs';
import nastaliqHeritageImg from '../assets/archival/nizami-s-divan-nasta-liq-calligraphy-style.jpg';
import quranManuscriptImg from '../assets/archival/page-from-a-qur-an-manuscript.jpg';
import foliosManuscriptImg from '../assets/archival/folios-from-a-qur-an-manuscript.jpg';
import { 
  ChevronDown, 
  Hand, 
  Mic, 
  Smartphone, 
  Bug, 
  ShieldCheck, 
  Volume2, 
  AlertCircle,
  Globe,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const METADATA: Record<string, { font: string, align: string }> = {
  ur: { font: "'Noto Nastaliq Urdu', serif", align: 'right' },
  en: { font: "'Inter', sans-serif", align: 'left' },
  es: { font: "'Inter', sans-serif", align: 'left' },
  ar: { font: "'Noto Nastaliq Urdu', serif", align: 'right' },
  hi: { font: "'Inter', sans-serif", align: 'left' },
  zh: { font: "'Inter', sans-serif", align: 'left' },
  fr: { font: "'Inter', sans-serif", align: 'left' }
};

const SUPPORTED_LANGS = REGISTRY_LANGS.map(l => ({
  ...l,
  font: METADATA[l.code]?.font || "'Inter', sans-serif",
  align: METADATA[l.code]?.align || 'left'
}));

const LANDING_CONTENT: Record<string, any> = {
  ur: {
    hero_title: "خاموشی کو آواز دینے کا باوقار سفر",
    hero_subtitle: "بزرگوں اور بولنے سے قاصر مریضوں کے لیے اردو اول، ہمدرد اور بغیر چھوئے بات چیت کا پلیٹ فارم۔",
    demo_hint: "نیچے دیے گئے کارڈز پر کلک کر کے فوری آواز اور گفتگو کا تجربہ کریں:",
    f1_title: "الفاظ اور مکمل جملوں کی تشکیل",
    f1_desc: "بڑے اور واضح نستعلیق ورڈ کارڈز کے ذریعے بغیر کسی الجھن کے فوری جملے بنائیں۔ عمر رسیدہ آنکھوں اور کمزور انگلیوں کے لیے خصوصی ڈیزائن۔",
    f2_title: "خاکہ بنا کر الفاظ کی تلاش",
    f2_desc: "جب مناسب لفظ نہ ملے تو اسکرین پر ہلکا سا خاکہ بنائیں۔ ہمارا مقامی ماڈل آپ کی ڈرائنگ کو لمحوں میں درست آواز میں بدل دیتا ہے۔",
    f3_title: "بغیر چھوئے اشاروں سے کنٹرول",
    f3_desc: "ہاتھوں کی کمزوری یا فالج کے شکار مریضوں کے لیے چہرے اور ہاتھ کے قدرتی اشاروں سے مکمل نیویگیشن۔ اسکرین چھونے کی ضرورت نہیں۔",
    f4_title: "خاندان اور پیاروں کی مانوس آوازیں",
    f4_desc: "روبوٹک بیزار کن آوازوں کے بجائے اپنے بچوں اور پوتوں کی آوازیں ریکارڈ کریں۔ ہر بولے گئے لفظ میں محبت اور تسلی محسوس ہو۔",
    f5_title: "فوری ہنگامی امداد اور تحفظ (SOS)",
    f5_desc: "ہنگامی ضرورت کے وقت ایک تسلی بخش بٹن سے خاندان کو فوری طور پر بلند آواز اور واضح الرٹ پہنچ جاتا ہے۔",
    privacy_title: "100% آف لائن اور ذاتی ڈیٹا کی حفاظت",
    privacy_desc: "آپ کی گفتگو اور اہل خانہ کی ریکارڈنگز کبھی ڈیوائس سے باہر نہیں جاتیں۔ کوئی اکاؤنٹ، کوئی کلاؤڈ اور کوئی فیس نہیں۔",
    pwa_title: "ہر ڈیوائس پر یکساں خوبصورت",
    pwa_desc: "کسی ایپ اسٹور کی محتاجی نہیں۔ پی سی، میک اور فون پر ایک ٹیپ میں شامل کریں اور مکمل آف لائن استعمال کریں۔",
    gift_title: "انسانیت کی خدمت — ہمیشہ مفت",
    gift_desc: "لسان ایک صدقہ جاریہ ہے جو ہر مریض اور تیماردار کے لیے ہمیشہ مفت رہے گا۔",
    install_btn: "ایپ انسٹال کریں",
    launch_btn: "ایپ شروع کریں",
    contribute_btn: "گٹ ہب پر تعاون کریں",
    bug_report: "بگ رپورٹ کریں",
    whatsapp_placeholder: "سوال پوچھیں یا رائے دیں...",
    send_wa: "واٹس ایپ پر رابطہ کریں"
  },
  en: {
    hero_title: "Empowering Silent Voices with Dignity & Comfort",
    hero_subtitle: "An Urdu-first, touchless communication platform crafted for speech-impaired elders and patients across PC, Mac, and mobile.",
    demo_hint: "Tap any communication card below to test the live voice and sentence dock:",
    f1_title: "Natural Sentences with Tactile Word Cards",
    f1_desc: "Build complete thoughts using large, high-contrast word cards tailored for senior accessibility, limited dexterity, and aging eyes.",
    f2_title: "Sketch to Search and Speak",
    f2_desc: "Can't find the right concept? Draw a quick sketch on screen. Our on-device local model translates doodles into clear spoken words.",
    f3_title: "Hands-Free Touchless Gesture Control",
    f3_desc: "Navigate effortlessly through subtle face and hand gestures via on-device vision. Designed for stroke recovery and tremors.",
    f4_title: "The Reassuring Warmth of Family Voices",
    f4_desc: "Replace synthetic robotic voices with recordings of loved ones, children, and caregivers for genuine emotional connection.",
    f5_title: "Instant Emergency SOS Alerts",
    f5_desc: "Peace of mind in one deliberate press. Immediately signals family members with prominent visual and audible emergency notifications.",
    privacy_title: "100% Offline-First Digital Sovereignty",
    privacy_desc: "Conversations and family voice clips remain strictly on the user's device. No cloud sync, no tracking, and zero subscriptions.",
    pwa_title: "Works Everywhere — PC, Mac, Phone",
    pwa_desc: "No App Store required. Add to Home Screen in one tap. Runs instantly and smoothly in any browser or standalone window.",
    gift_title: "A Gift to Humanity — Free Forever",
    gift_desc: "Lisan will always remain open-source and free of paywalls, ads, and data collection.",
    install_btn: "Install App",
    launch_btn: "Launch App",
    contribute_btn: "Contribute on GitHub",
    bug_report: "Report an Issue",
    whatsapp_placeholder: "Ask a question or send feedback...",
    send_wa: "Connect on WhatsApp"
  }
};

const DEMO_CARDS = [
  { id: 'demo_1', text_primary: 'السلام علیکم', text_secondary: 'Peace / Salam', icon: 'volume2' },
  { id: 'demo_2', text_primary: 'پانی چاہیے', text_secondary: 'Need Water', icon: 'droplets' },
  { id: 'demo_3', text_primary: 'الحمدللہ', text_secondary: 'All Praise to God', icon: 'heart' },
  { id: 'demo_4', text_primary: 'طبیعت کیسی ہے؟', text_secondary: 'How Are You?', icon: 'user' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { primaryLanguage, secondaryLanguage, setLanguagePair } = useLanguage();
  const { speak, playClick } = useAudio();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [demoSentence, setDemoSentence] = useState<any[]>([
    DEMO_CARDS[0],
    DEMO_CARDS[1]
  ]);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const primary = useMemo(() => LANDING_CONTENT[primaryLanguage] || LANDING_CONTENT['en'], [primaryLanguage]);
  const pConfig = useMemo(() => SUPPORTED_LANGS.find(l => l.code === primaryLanguage), [primaryLanguage]);
  const sConfig = useMemo(() => SUPPORTED_LANGS.find(l => l.code === secondaryLanguage), [secondaryLanguage]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  const scrollSlide = (direction: 'up' | 'down') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const slideHeight = container.offsetHeight;
    const currentScroll = container.scrollTop;
    
    let targetScroll;
    if (direction === 'down') {
      targetScroll = Math.ceil((currentScroll + 1) / slideHeight) * slideHeight;
    } else {
      targetScroll = Math.floor((currentScroll - 1) / slideHeight) * slideHeight;
    }
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleDemoCardClick = (card: any) => {
    playClick();
    setPlayingWordId(card.id);
    speak(card.text_primary, card.id);
    setDemoSentence(prev => {
      if (prev.length >= 4) {
        return [...prev.slice(1), card];
      }
      return [...prev, card];
    });
    setTimeout(() => setPlayingWordId(null), 1200);
  };

  const handlePlayDemoSentence = () => {
    playClick();
    const fullText = demoSentence.map(w => w.text_primary).join(' ');
    speak(fullText, 'demo_full');
  };

  const handleClearDemoSentence = () => {
    playClick();
    setDemoSentence([]);
  };

  return (
    <div 
      className="landing-container" 
      ref={containerRef}
      dir={pConfig?.align === 'right' ? 'rtl' : 'ltr'} 
      style={{ 
        '--font-primary-override': pConfig?.font,
        '--font-secondary-override': sConfig?.font,
        '--slide-text-align': pConfig?.align === 'right' ? 'right' : 'left',
        '--slide-text-align-rev': pConfig?.align === 'right' ? 'left' : 'right'
      } as React.CSSProperties}
    >
      <div className="landing-nav-controls">
        <button className="nav-arrow-btn" onClick={() => scrollSlide('up')} aria-label="Previous Section">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        <button className="nav-arrow-btn" onClick={() => scrollSlide('down')} aria-label="Next Section">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      <header className="landing-header" dir="ltr">
        <div className="landing-logo">
          <span className="naani-urdu-text" style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }}>لسان</span>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>Lisan</span>
        </div>
        
        <div className="lang-picker-group">
          <button 
            className="lang-select-minimal"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
            onClick={() => setShowLangSelect(true)}
            aria-label="Select Language"
          >
            <Globe size={15} color="var(--color-primary)" />
            <span style={{ fontWeight: 700 }}>{SUPPORTED_LANGS.find(l => l.code === primaryLanguage)?.label}</span>
            <ChevronDown size={14} color="var(--color-primary)" />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {isInstallable && (
            <button className="btn-pitch btn-pitch-white" onClick={handleInstall}>
              {primary.install_btn}
            </button>
          )}
          <button className="btn-pitch btn-pitch-primary" onClick={onStart}>
            {primary.launch_btn}
          </button>
        </div>
      </header>

      <SelectDialog
        isOpen={showLangSelect}
        onClose={() => setShowLangSelect(false)}
        title="زبان کا انتخاب (Select Language)"
        options={SUPPORTED_LANGS.map(l => ({ value: l.code, label: l.label }))}
        selectedValue={primaryLanguage}
        onSelect={(val) => {
          const newSec = val === secondaryLanguage ? (val === 'en' ? 'ur' : 'en') : secondaryLanguage;
          setLanguagePair(val, newSec);
          setShowLangSelect(false);
        }}
      />

      <main>
        {/* SLIDE 1: HERO & LIVE AAC EXPERIENCE */}
        <section className="pitch-slide slide-why">
          <div className="slide-content">
            <h1 className="slide-title-primary hero-display-title">
              {primary.hero_title}
            </h1>
            <p className="slide-desc" style={{ maxWidth: '65ch', marginBottom: '2rem' }}>
              {primary.hero_subtitle}
            </p>

            {/* LIVE TACTILE AAC EXPERIENCE (One Live Thing) */}
            <div className="live-demo-showcase" data-ui="aac-showcase" dir={pConfig?.align === 'right' ? 'rtl' : 'ltr'}>
              <div className="demo-sentence-bar">
                <div className="demo-words-stream">
                  {demoSentence.length === 0 ? (
                    <span className="demo-placeholder">{primary.demo_hint}</span>
                  ) : (
                    demoSentence.map((word, i) => (
                      <span key={`${word.id}-${i}`} className="demo-chip">
                        {word.text_primary}
                      </span>
                    ))
                  )}
                </div>
                <div className="demo-sentence-actions">
                  <button 
                    className="demo-action-btn play" 
                    onClick={handlePlayDemoSentence}
                    disabled={demoSentence.length === 0}
                    aria-label="Play Sentence"
                  >
                    <Volume2 size={18} />
                    <span>سنیں</span>
                  </button>
                  <button 
                    className="demo-action-btn clear" 
                    onClick={handleClearDemoSentence}
                    disabled={demoSentence.length === 0}
                    aria-label="Clear Sentence"
                  >
                    صاف
                  </button>
                </div>
              </div>

              {/* TACTILE PATIENT WORD CARDS */}
              <div className="demo-cards-grid">
                {DEMO_CARDS.map(card => (
                  <button 
                    key={card.id}
                    className={`demo-card-item ${playingWordId === card.id ? 'is-playing' : ''}`}
                    onClick={() => handleDemoCardClick(card)}
                  >
                    <span className="demo-card-ur">{card.text_primary}</span>
                    <span className="demo-card-sub">{card.text_secondary}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-pitch btn-pitch-primary" onClick={onStart}>
                {primary.launch_btn}
              </button>
            </div>
          </div>
        </section>

        {/* SLIDE 2: WORDS & SENTENCES */}
        <section className="pitch-slide slide-feature">
          <div className="slide-content-split">
            <div className="slide-text-side">
              <h2 className="slide-title-primary">{primary.f1_title}</h2>
              <p className="slide-desc" style={{ marginBottom: '1.5rem' }}>
                {primary.f1_desc}
              </p>
            </div>
            <div className="slide-visual-side">
              <div className="visual-composite">
                <img 
                  src={nastaliqHeritageImg} 
                  alt="Classical Nastaliq Calligraphic Manuscript" 
                  className="archival-heritage-img"
                />
                <div className="mockup-overlay-frame" data-ui="card-mockup">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
                    <WordCard 
                      item={{ id: 'sys_iwant', text_primary: 'مجھے چاہیے', text_secondary: 'I want', ur: 'مجھے چاہیے', en: 'I want', icon: 'user' }} 
                      isFocused={false} 
                      variant={1} 
                      onClick={() => {}} 
                    />
                    <WordCard 
                      item={{ id: 'sys_water', text_primary: 'پانی', text_secondary: 'Water', ur: 'پانی', en: 'Water', icon: 'droplets' }} 
                      isFocused={true} 
                      variant={1} 
                      onClick={() => {}} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3: SKETCH TO SEARCH */}
        <section className="pitch-slide slide-feature alternate-tone">
          <div className="slide-content-split reverse">
            <div className="slide-text-side">
              <h2 className="slide-title-primary">{primary.f2_title}</h2>
              <p className="slide-desc" style={{ marginBottom: '2rem' }}>
                {primary.f2_desc}
              </p>
            </div>
            <div className="slide-visual-side">
              <div className="mockup-frame" data-ui="doodle-match">
                <div className="doodle-demo-box">
                  <div className="doodle-canvas-preview">
                    <svg width="120" height="90" viewBox="0 0 200 150">
                      <circle cx="100" cy="75" r="42" fill="none" stroke="var(--color-primary)" strokeWidth="6" />
                      <path d="M100,33 Q112,8 122,18" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ marginTop: '14px', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-ur)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>سیب</span>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Apple · Local Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4: TOUCHLESS GESTURE CONTROL */}
        <section className="pitch-slide slide-what">
          <div className="slide-content-split">
            <div className="slide-text-side">
              <h2 className="slide-title-primary" style={{ color: 'white' }}>{primary.f3_title}</h2>
              <p className="slide-desc" style={{ color: 'rgba(255, 255, 255, 0.95)', marginBottom: '2rem' }}>
                {primary.f3_desc}
              </p>
            </div>
            <div className="slide-visual-side">
              <div className="mockup-frame" data-ui="touchless-vision">
                <div className="gesture-demo-card">
                  <div className="gesture-icon-circle">
                    <Hand size={46} color="var(--color-primary)" />
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', display: 'block' }}>MediaPipe Touchless</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Mouth Open / Hand Pointing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: FAMILIAR VOICES OF FAMILY */}
        <section className="pitch-slide slide-feature">
          <div className="slide-content-split reverse">
            <div className="slide-text-side">
              <h2 className="slide-title-primary">{primary.f4_title}</h2>
              <p className="slide-desc" style={{ marginBottom: '2rem' }}>
                {primary.f4_desc}
              </p>
            </div>
            <div className="slide-visual-side">
              <div className="mockup-frame" data-ui="voice-recorder">
                <div className="voice-demo-card">
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-primary)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mic size={34} color="white" />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', height: '48px', alignItems: 'center', justifyContent: 'center', margin: '16px 0' }}>
                    {[35, 75, 100, 55, 85, 45, 95, 65, 45, 75, 55, 85].map((h, i) => (
                      <div key={i} style={{ width: '8px', height: `${h}%`, background: 'var(--color-accent)', borderRadius: '4px' }} />
                    ))}
                  </div>
                  <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>Sakina (Daughter) · 4,211 Words Recorded</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 6: OFFLINE PRIVACY & DIGITAL SOVEREIGNTY */}
        <section className="pitch-slide slide-feature alternate-tone">
          <div className="slide-content-split">
            <div className="slide-text-side">
              <h2 className="slide-title-primary">{primary.privacy_title}</h2>
              <p className="slide-desc" style={{ marginBottom: '2rem' }}>
                {primary.privacy_desc}
              </p>
            </div>
            <div className="slide-visual-side">
              <div className="visual-composite">
                <img 
                  src={quranManuscriptImg} 
                  alt="Historic illuminated manuscript" 
                  className="archival-heritage-img"
                />
                <div className="mockup-overlay-frame" data-ui="privacy-banner">
                  <div className="privacy-card-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ShieldCheck size={28} color="var(--color-primary)" />
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary)' }}>Local IndexedDB</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Zero cloud storage, zero tracking</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={28} color="var(--color-primary)" />
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary)' }}>100% Offline Reliable</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Functions anywhere without internet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 7: EMERGENCY SOS ALERT */}
        <section className="pitch-slide slide-feature">
          <div className="slide-content-split reverse">
            <div className="slide-text-side">
              <h2 className="slide-title-primary">{primary.f5_title}</h2>
              <p className="slide-desc" style={{ marginBottom: '2rem' }}>
                {primary.f5_desc}
              </p>
            </div>
            <div className="slide-visual-side">
              <div className="mockup-frame" data-ui="sos-button">
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'var(--color-danger)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', margin: '0 auto' }}>
                  <AlertCircle size={36} />
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px' }}>SOS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 8: UNIVERSAL ACCESS & PWA */}
        <section className="pitch-slide slide-what">
          <div className="slide-content">
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'white', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={36} color="var(--color-primary)" />
            </div>
            <h2 className="slide-title-primary" style={{ color: 'white' }}>{primary.pwa_title}</h2>
            <p className="slide-desc" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '720px', marginBottom: '2.5rem' }}>
              {primary.pwa_desc}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isInstallable && (
                <button className="btn-pitch btn-pitch-white" onClick={handleInstall}>
                  {primary.install_btn}
                </button>
              )}
              <button className="btn-pitch btn-pitch-white" onClick={onStart}>
                {primary.launch_btn}
              </button>
            </div>
          </div>
        </section>

        {/* SLIDE 9: FREE FOREVER & CAREGIVER CONTACT */}
        <section className="pitch-slide slide-final">
          <div className="slide-content">
            <h2 className="slide-title-primary">{primary.gift_title}</h2>
            <p className="slide-desc" style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>
              {primary.gift_desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img 
                src={foliosManuscriptImg} 
                alt="Classical historic manuscript folio" 
                className="archival-heritage-img"
                style={{ height: '140px', maxWidth: '320px' }}
              />
            </div>

            <form 
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                const msg = (e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement).value;
                window.open(`https://wa.me/919663527755?text=${encodeURIComponent(msg)}`, '_blank');
              }}
            >
              <textarea 
                name="message" 
                className="contact-input" 
                placeholder={primary.whatsapp_placeholder}
                rows={3}
                required
              />
              <button type="submit" className="btn-pitch btn-pitch-primary" style={{ width: '100%' }}>
                {primary.send_wa}
              </button>
            </form>

            <div className="social-links" style={{ flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
              <a href="https://github.com/hammaadworks/lisan/issues/new" target="_blank" rel="noreferrer" className="social-link" style={{ background: 'var(--color-primary)', color: 'white' }}>
                <Bug size={16} />
                <span>{primary.bug_report}</span>
              </a>
              <a href="https://github.com/hammaadworks/lisan" target="_blank" rel="noreferrer" className="social-link">GitHub</a>
              <a href="mailto:hammaadworks@gmail.com" className="social-link">Email</a>
            </div>
            <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Built with empathy for seniors and speech-impaired individuals worldwide.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
