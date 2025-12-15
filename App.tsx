
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
import { InterstitialAd } from './components/InterstitialAd';

const STORAGE_KEY_USER = 'rizz_user_profile';
const STORAGE_KEY_PRO_EXPIRY = 'rizz_pro_expiry';
const STORAGE_KEY_PRO_TYPE = 'rizz_pro_type';
const STORAGE_KEY_LANG = 'rizz_language';
const STORAGE_KEY_VISITED = 'rizz_has_visited';
const STORAGE_KEY_FREE_PASSES = 'rizz_free_passes'; // New Key for Counter

// ==================================================================================
// 🚨 [사장님 필독] 심사/개발 모드 설정
// ==================================================================================
// true: 모든 기능 잠금 해제 (심사 제출용, 개발 테스트용) - 광고 안 나옴, 결제 안 뜸
// false: 실제 출시 모드 - Pro 아니면 기능 잠김, 광고 나옴
// ==================================================================================
const IS_REVIEW_MODE = true; 

type ProType = 'none' | 'share' | 'subscription' | 'ad_reward';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'language' | 'onboarding' | 'partner' | 'analyzer'>('language');
  const [language, setLanguage] = useState<Language>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  
  // --- PRO STATUS STATE ---
  const [proExpiry, setProExpiry] = useState<number>(0); 
  const [proType, setProType] = useState<ProType>('none');
  const [now, setNow] = useState<number>(Date.now()); 
  
  // Changed from boolean to number for 3 trials
  const [freePasses, setFreePasses] = useState<number>(0);

  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showAdOverlay, setShowAdOverlay] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLegal, setShowLegal] = useState<boolean>(false);
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms'>('privacy');
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false); 

  // Derived Pro Status
  const isPro = IS_REVIEW_MODE || proExpiry > now;
  
  useEffect(() => {
    // 1. Check iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    // 2. Check Standalone
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                               (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    // 3. PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
      console.log("Install prompt captured");
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Load Saved Data
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    if (savedLang) {
        setLanguage(savedLang);
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUser) {
          setUserProfile(JSON.parse(savedUser));
          setScreen('partner'); 
        } else {
           setScreen('onboarding'); 
        }
    }

    // 5. FREE PASS LOGIC (STRATEGIC HOOK: 3 FREE TRIES)
    // Check if we have a stored count. 
    const storedPasses = localStorage.getItem(STORAGE_KEY_FREE_PASSES);
    
    if (storedPasses !== null) {
        // Use stored value
        setFreePasses(parseInt(storedPasses));
    } else {
        // First time initialization (or update for existing users)
        // Give everyone 3 free passes to start/restart the hook
        const INITIAL_PASSES = 3;
        setFreePasses(INITIAL_PASSES);
        localStorage.setItem(STORAGE_KEY_FREE_PASSES, INITIAL_PASSES.toString());
        localStorage.setItem(STORAGE_KEY_VISITED, 'true');
    }

    // Load Pro Expiry
    const savedExpiry = localStorage.getItem(STORAGE_KEY_PRO_EXPIRY);
    const savedType = localStorage.getItem(STORAGE_KEY_PRO_TYPE) as ProType;
    
    if (savedExpiry) {
        const expiryTime = parseInt(savedExpiry);
        if (expiryTime > Date.now()) {
            setProExpiry(expiryTime);
            setProType(savedType || 'none');
        } else {
            localStorage.removeItem(STORAGE_KEY_PRO_EXPIRY);
            localStorage.removeItem(STORAGE_KEY_PRO_TYPE);
            setProExpiry(0);
            setProType('none');
        }
    }

    // Check Payment Success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        grantTimeBasedReward('subscription', 30 * 24 * 60 * 60 * 1000); 
        window.history.replaceState({}, document.title, window.location.pathname);
        alert("🎉 Thank you! Pro access activated.");
    }

    // Timer Tick
    const tick = setInterval(() => {
        const currentTime = Date.now();
        setNow(currentTime);
        if (proExpiry > 0 && currentTime > proExpiry) {
            setProExpiry(0);
            setProType('none');
            localStorage.removeItem(STORAGE_KEY_PRO_EXPIRY);
            localStorage.removeItem(STORAGE_KEY_PRO_TYPE);
        }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', checkStandalone);
      clearInterval(tick);
    };
  }, [proExpiry]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    if (userProfile) {
        setScreen('partner');
    } else {
        setScreen('onboarding');
    }
  };

  const handleGoHome = () => {
      setScreen('language');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    setScreen('partner');
  };

  const grantTimeBasedReward = (type: ProType, durationMs: number) => {
      const newExpiry = Date.now() + durationMs;
      setProExpiry(newExpiry);
      setProType(type);
      localStorage.setItem(STORAGE_KEY_PRO_EXPIRY, newExpiry.toString());
      localStorage.setItem(STORAGE_KEY_PRO_TYPE, type);
      setShowPaywall(false);
      // NOTE: We do NOT reset free passes here. Pro overrides free passes.
      // When Pro expires, they might still have free passes left if they didn't use them.
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
            alert("Link copied! Share it with a friend to unlock.");
            grantTimeBasedReward('share', grantDuration);
        } catch (err) {
            console.error(err);
        }
    }
  };

  const handleSubscribe = () => {
    grantTimeBasedReward('subscription', 30 * 24 * 60 * 60 * 1000);
  };

  const handleAdRewardGranted = () => {
      // Ad Reward now gives +1 Free Pass instead of unlocking everything indefinitely
      // This is more profitable for ad monetization
      const newCount = freePasses + 1;
      setFreePasses(newCount);
      localStorage.setItem(STORAGE_KEY_FREE_PASSES, newCount.toString());
      setShowAdOverlay(false);
  };

  const handleAdClose = () => {
      setShowAdOverlay(false);
  };

  // Consume a free pass (Decrement count)
  const consumeFreePass = () => {
      if (freePasses > 0) {
          const newCount = freePasses - 1;
          setFreePasses(newCount);
          localStorage.setItem(STORAGE_KEY_FREE_PASSES, newCount.toString());
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
        alert("To install: \n1. Tap the Share/Menu button \n2. Select 'Add to Home Screen'");
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  const handleOpenLegal = (type: 'privacy' | 'terms') => {
      setLegalDocType(type);
      setShowSettings(false);
      setShowLegal(true);
  };
  
  const handleEditProfile = () => {
      setShowSettings(false);
      setScreen('onboarding');
  };

  const handleTogglePro = () => {
    if (isPro) {
        setProExpiry(0);
        setProType('none');
        localStorage.removeItem(STORAGE_KEY_PRO_EXPIRY);
        localStorage.removeItem(STORAGE_KEY_PRO_TYPE);
    } else {
        grantTimeBasedReward('subscription', 60 * 60 * 1000);
    }
  };

  const handlePartnerNext = (partner: PartnerProfile) => {
    setPartnerProfile(partner);
    setScreen('analyzer');
  };

  return (
    <div className="font-sans antialiased text-slate-100 bg-slate-900 h-[100dvh] w-full flex flex-col overflow-hidden">
      <div className="flex-1 relative overflow-hidden w-full">
        {screen === 'language' && (
             <LanguageSelector 
                onSelect={handleLanguageSelect} 
                onInstall={isStandalone ? undefined : handleUniversalInstall}
                onOpenLegal={handleOpenLegal}
            />
        )}
        {screen === 'onboarding' && (
            <Onboarding 
                onComplete={handleOnboardingComplete} 
                language={language} 
                onOpenSettings={() => setShowSettings(true)} 
                onGoHome={handleGoHome}
                initialData={userProfile} 
            />
        )}
        {screen === 'partner' && <PartnerSetup onBack={() => setScreen('onboarding')} onNext={handlePartnerNext} language={language} onOpenSettings={() => setShowSettings(true)} isPro={isPro} onShowPaywall={() => setShowPaywall(true)} onGoHome={handleGoHome} />}
        {screen === 'analyzer' && userProfile && partnerProfile && (
            <Analyzer 
                user={userProfile} 
                partner={partnerProfile} 
                isPro={isPro} 
                proType={proType} 
                freePasses={freePasses} 
                onConsumeFreePass={consumeFreePass}
                onBack={() => setScreen('partner')} 
                onShowPaywall={() => setShowPaywall(true)} 
                language={language} 
                onOpenSettings={() => setShowSettings(true)} 
                onGoHome={handleGoHome} 
                installPrompt={deferredPrompt} 
                onInstallApp={handleUniversalInstall} 
            />
        )}
      </div>
      
      {showPaywall && (
        <Paywall 
            onClose={() => setShowPaywall(false)} 
            onShare={handleShareReward} 
            onSubscribe={handleSubscribe} 
            language={language} 
        />
      )}
      
      {showAdOverlay && (
          <InterstitialAd 
            onClose={handleAdClose}
            onReward={handleAdRewardGranted}
            language={language}
            mode="timer" 
          />
      )}
      
      {showLegal && <LegalDocs docType={legalDocType} onBack={() => setShowLegal(false)} />}
      
      {showIOSInstall && <InstallGuide onClose={() => setShowIOSInstall(false)} language={language} />}
      
      <CookieConsent language={language} onOpenPrivacy={() => handleOpenLegal('privacy')} />
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        currentLanguage={language} 
        onLanguageChange={handleLanguageSelect} 
        onResetData={handleResetData} 
        installPrompt={deferredPrompt} 
        onInstallApp={handleUniversalInstall} 
        onOpenLegal={handleOpenLegal}
        isPro={isPro}
        onTogglePro={handleTogglePro}
        proExpiry={proExpiry} 
        proType={proType}
        onEditProfile={handleEditProfile}
      />
    </div>
  );
};

export default App;
