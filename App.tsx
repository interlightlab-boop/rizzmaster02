
import React, { useState, useEffect } from 'react';
import { UserProfile, PartnerProfile, Language } from './types';
import { Onboarding } from './components/Onboarding';
import { PartnerSetup } from './components/PartnerSetup';
import { Analyzer } from './components/Analyzer';
import { Paywall } from './components/Paywall';
import { LanguageSelector } from './components/LanguageSelector';
import { SettingsModal } from './components/SettingsModal';
import { LegalDocs } from './components/LegalDocs';
import { InstallGuide } from './components/InstallGuide';
import { CookieConsent } from './components/CookieConsent';
import { LandingPage } from './components/LandingPage';

const STORAGE_KEY_USER = 'rizz_user_profile';
const STORAGE_KEY_PRO_EXPIRY = 'rizz_pro_expiry';
const STORAGE_KEY_PRO_TYPE = 'rizz_pro_type';
const STORAGE_KEY_LANG = 'rizz_language';
const STORAGE_KEY_VISITED = 'rizz_has_visited';

const IS_REVIEW_MODE = false; 

type ProType = 'none' | 'share' | 'subscription' | 'ad_reward';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'language' | 'onboarding' | 'partner' | 'analyzer'>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  
  const [proExpiry, setProExpiry] = useState<number>(0); 
  const [proType, setProType] = useState<ProType>('none');
  const [now, setNow] = useState<number>(Date.now()); 
  
  const [oneTimePass, setOneTimePass] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLegal, setShowLegal] = useState<boolean>(false);
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms'>('privacy');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const isPro = IS_REVIEW_MODE || proExpiry > now;
  
  const grantTimeBasedReward = (type: ProType, durationMs: number) => {
      const newExpiry = Date.now() + durationMs;
      setProExpiry(newExpiry);
      setProType(type);
      localStorage.setItem(STORAGE_KEY_PRO_EXPIRY, newExpiry.toString());
      localStorage.setItem(STORAGE_KEY_PRO_TYPE, type);
      setShowPaywall(false);
      setOneTimePass(false);
  };

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                               (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 저장된 설정 로드
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);

    // [로직 개선] 저장된 언어가 없으면 브라우저 언어 감지
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as any;
      const supportedLangs = ['en', 'ko', 'ja', 'es', 'fr', 'pt', 'zh', 'ru'];
      const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      setLanguage(defaultLang);
      localStorage.setItem(STORAGE_KEY_LANG, defaultLang);
    }

    if (savedUser) setUserProfile(JSON.parse(savedUser));

    const hasVisited = localStorage.getItem(STORAGE_KEY_VISITED);
    if (!hasVisited) {
        setOneTimePass(true);
        localStorage.setItem(STORAGE_KEY_VISITED, 'true');
        setScreen('landing');
    } else if (savedUser) {
        setScreen('partner');
    }

    const savedExpiry = localStorage.getItem(STORAGE_KEY_PRO_EXPIRY);
    const savedType = localStorage.getItem(STORAGE_KEY_PRO_TYPE) as ProType;
    if (savedExpiry) {
        const expiryTime = parseInt(savedExpiry);
        if (expiryTime > Date.now()) {
            setProExpiry(expiryTime);
            setProType(savedType || 'none');
        }
    }

    const tick = setInterval(() => {
        setNow(Date.now());
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', checkStandalone);
      clearInterval(tick);
    };
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    if (userProfile) setScreen('partner');
    else setScreen('onboarding');
  };

  const handleGoHome = () => setScreen('landing');
  const handleStartApp = () => setScreen('language');

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    setScreen('partner');
  };

  const handleShareReward = async () => {
    const shareData = {
        title: 'MBTI Rizz AI',
        text: 'Check out this AI Wingman! It writes the perfect replies based on MBTI.',
        url: 'https://mbtirizz.com'
    };
    const grantDuration = 60 * 60 * 1000; 

    if (navigator.share && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            grantTimeBasedReward('share', grantDuration);
        } catch (err: any) {
            if (err.name !== 'AbortError') console.error(err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareData.url);
            alert(language === 'ko' ? "링크가 복사되었습니다! 친구에게 공유하고 1시간 무료 혜택을 받으세요." : "Link copied! Share it with a friend to unlock 1 hour.");
            grantTimeBasedReward('share', grantDuration);
        } catch (err) {
            console.error(err);
        }
    }
  };

  const handleUniversalInstall = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    } else if (isIOS) {
        setShowIOSInstall(true);
    } else {
        alert(language === 'ko' ? "브라우저 메뉴에서 '홈 화면에 추가'를 선택해주세요." : "Please select 'Add to Home Screen' in your browser menu.");
    }
  };

  const handleResetData = () => { if (confirm('Reset all data?')) { localStorage.clear(); window.location.reload(); } };
  const handleOpenLegal = (type: 'privacy' | 'terms') => { setLegalDocType(type); setShowSettings(false); setShowLegal(true); };
  const handleEditProfile = () => { setShowSettings(false); setScreen('onboarding'); };
  const handleTogglePro = () => {
    if (isPro) { setProExpiry(0); setProType('none'); } 
    else { grantTimeBasedReward('subscription', 60 * 60 * 1000); }
  };
  const handlePartnerNext = (partner: PartnerProfile) => { setPartnerProfile(partner); setScreen('analyzer'); };

  return (
    <div className="font-sans antialiased text-slate-100 bg-[#020617] h-[100dvh] w-full flex flex-col overflow-hidden">
      <div className="flex-1 relative overflow-hidden w-full">
        {screen === 'landing' && <LandingPage onStart={handleStartApp} onOpenLegal={handleOpenLegal} language={language} />}
        {screen === 'language' && <LanguageSelector onSelect={handleLanguageSelect} onInstall={isStandalone ? undefined : handleUniversalInstall} onOpenLegal={handleOpenLegal} />}
        {screen === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} language={language} onOpenSettings={() => setShowSettings(true)} onGoHome={handleGoHome} initialData={userProfile} />}
        {screen === 'partner' && <PartnerSetup onBack={() => setScreen('onboarding')} onNext={handlePartnerNext} language={language} onOpenSettings={() => setShowSettings(true)} isPro={isPro} onShowPaywall={() => setShowPaywall(true)} onGoHome={handleGoHome} />}
        {screen === 'analyzer' && userProfile && partnerProfile && (
            <Analyzer 
                user={userProfile} partner={partnerProfile} isPro={isPro} proType={proType} oneTimePass={oneTimePass} 
                onConsumeOneTimePass={() => setOneTimePass(false)} onBack={() => setScreen('partner')} 
                onShowPaywall={() => setShowPaywall(true)} language={language} onOpenSettings={() => setShowSettings(true)} 
                onGoHome={handleGoHome} installPrompt={deferredPrompt} onInstallApp={handleUniversalInstall} 
            />
        )}
      </div>
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onShare={handleShareReward} onSubscribe={() => {}} language={language} />}
      {showLegal && <LegalDocs docType={legalDocType} onBack={() => setShowLegal(false)} />}
      {showIOSInstall && <InstallGuide onClose={() => setShowIOSInstall(false)} language={language} />}
      <CookieConsent language={language} onOpenPrivacy={() => handleOpenLegal('privacy')} />
      <SettingsModal 
        isOpen={showSettings} onClose={() => setShowSettings(false)} currentLanguage={language} onLanguageChange={handleLanguageSelect} 
        onResetData={handleResetData} installPrompt={deferredPrompt} onInstallApp={handleUniversalInstall} onOpenLegal={handleOpenLegal}
        isPro={isPro} onTogglePro={handleTogglePro} proExpiry={proExpiry} proType={proType} onEditProfile={handleEditProfile}
      />
    </div>
  );
};

export default App;
