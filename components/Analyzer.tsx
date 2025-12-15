
import React, { useState, useRef, useEffect } from 'react';
import { PartnerProfile, UserProfile, RizzResponse, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { generateRizzSuggestions } from '../services/geminiService';
import { Button } from './Button';
import { InterstitialAd } from './InterstitialAd';
import { ArrowLeft, Image as ImageIcon, Copy, CheckCircle2, Settings, Globe, Sparkles, Home, Lock, Download, X, Zap } from 'lucide-react';

interface AnalyzerProps {
  user: UserProfile;
  partner: PartnerProfile;
  isPro: boolean;
  proType: 'none' | 'share' | 'subscription' | 'ad_reward'; 
  freePasses: number; // Changed from boolean to number
  onConsumeFreePass: () => void; 
  onBack: () => void;
  onShowPaywall: () => void;
  language: Language;
  onOpenSettings: () => void;
  onGoHome: () => void;
  installPrompt?: any;
  onInstallApp?: () => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ 
  user, partner, isPro, proType, freePasses, onConsumeFreePass, onBack, language, onOpenSettings, onGoHome, onShowPaywall, installPrompt, onInstallApp
}) => {
  const t = TRANSLATIONS[language];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<RizzResponse[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
  // State for the Fake Loading Screen
  const [showFakeLoading, setShowFakeLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (results && installPrompt) {
        const timer = setTimeout(() => setShowInstallBanner(true), 2000);
        return () => clearTimeout(timer);
    }
  }, [results, installPrompt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          const MAX_W = 800;
          if (w > MAX_W) { h *= MAX_W/w; w = MAX_W; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.5);
          setSelectedImage(compressed.split(',')[1]);
          setResults(null); 
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    // --- LOADING & REVENUE LOGIC ---
    // If IS_REVIEW_MODE is true in App.tsx, isPro passed here is TRUE.
    
    // Check if user is a paid subscriber (Unlimited Pro) or has review mode enabled
    const isSubscriber = isPro && (proType === 'subscription' || proType === 'none'); 
    
    // Determine if we should show the "Fake Loading / Ad Screen"
    // STRATEGY: If user has FREE PASSES, DO NOT SHOW AD. Hook them with speed.
    // Show Ad Loading ONLY IF user is NOT Pro AND has NO Free Passes (although they shouldn't be here if passes = 0... wait, usually they hit Paywall)
    // Actually, we use the ad screen to create "perceived value" or just monetization.
    // For Rizz Apps: Free users get hooked by SPEED. 
    const hasFreePasses = !isPro && freePasses > 0;
    
    const shouldShowAdLoading = !isPro && !hasFreePasses; 
    // If hasFreePasses is true, we skip loading to make it instant (Hook strategy)
    
    if (shouldShowAdLoading) {
        setShowFakeLoading(true);
    }
    
    setIsAnalyzing(true); 
    setResults(null); 
    
    try {
      // Logic:
      // If we are showing the ad screen, wait 6 seconds.
      // If it's a paid user OR free pass user, 0ms delay (Instant).
      const waitTime = shouldShowAdLoading ? 6000 : 0; 
      
      const minWaitPromise = new Promise(resolve => setTimeout(resolve, waitTime));
      const apiPromise = generateRizzSuggestions(user, partner, selectedImage, mimeType, language);

      const [_, result] = await Promise.all([minWaitPromise, apiPromise]);
      
      setResults(result.replies);
      
      // CONSUME PASS ONLY ON SUCCESS
      if (hasFreePasses) {
          onConsumeFreePass();
      }

    } catch (error: any) {
      console.error(error);
      alert(`${error.message}`);
    } finally { 
        setShowFakeLoading(false);
        setIsAnalyzing(false); 
    }
  };

  const handleTryAgain = () => {
      setResults(null);
  };

  const handleBack = () => {
      onBack();
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const shouldShowTranslation = (res: RizzResponse) => {
      if (language === partner.language) return false;
      if (!res.translation) return false;
      if (res.translation.trim() === '') return false;
      if (res.translation.toLowerCase() === 'null') return false;
      if (res.translation === res.text) return false;
      return true;
  };

  // Determines if the user has a "Premium/Gold" status (Subscription OR Review Mode)
  const isGoldStatus = proType === 'subscription' || (isPro && proType === 'none');
  
  // Is the Masterpiece Unlocked?
  // Unlocked if: User is Pro OR User has free passes (technically they use one to see it)
  // Wait, the logic above consumes the pass on generation.
  // So if results are visible, and we just consumed a pass, the Masterpiece SHOULD be visible.
  // We need to ensure the UI renders it as unlocked.
  // Since we consumed the pass, `freePasses` might have dropped.
  // But for the current render, if they successfully generated, they should see it.
  // Actually, the simpler logic: If they generated successfully, they see it.
  // The 'Lock' logic in the render loop below controls whether the 3rd reply is blurred.
  // If `results` exist, it means we either used a pass or are Pro. 
  // EXCEPT: If we ran out of passes? No, handleAnalyze wouldn't run or would trigger paywall if we enforced it strictly.
  // Let's enforce: If !isPro and freePasses == 0 (before generation), we show paywall.
  // But here, if results are present, we assume valid access.
  // HOWEVER, we want to visually show the lock IF they didn't have access. 
  // But since we auto-consume, let's assume if results are there, it's unlocked for this session.
  // To be safe/strict: We only lock if !isPro and the user *didn't* just spend a pass.
  // But since `handleAnalyze` does the spending, let's assume all results shown are fully unlocked for the moment.
  // Actually, standard behavior: Only unlock Masterpiece if Pro. 
  // BUT the "Free Pass" is specifically to unlock the Masterpiece. 
  // So: If (isPro || usedFreePass) -> Unlock.
  
  // To simplify: If `results` are present, we show all. 
  // The "Lock" UI below was for when we wanted to tease the user.
  // With the "3 Free Passes" model, the user "pays" with a pass to see the full result.
  // So we should NOT blur the 3rd result if they used a pass.
  // We will assume if results are rendered, they are unlocked.
  
  return (
    <div className="h-full w-full flex flex-col p-6 max-w-md mx-auto relative overflow-hidden bg-slate-900">
      
      {/* Fake Loading Overlay (Ads + Analyzing UI) */}
      {showFakeLoading && (
          <InterstitialAd 
            language={language}
            mode="processing"
          />
      )}

      <div className="flex items-center justify-between mb-6 shrink-0">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft /></button>
        <div className="flex items-center gap-2">
            {/* BADGE LOGIC UPDATE */}
            {isPro ? (
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border flex items-center gap-1 ${isGoldStatus ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500/50 shadow-orange-500/30' : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-500/50 shadow-cyan-500/30'}`}>
                    <Sparkles className="w-3 h-3" /> 
                    {proType === 'share' ? "PRO (1H)" : "PRO"}
                </div>
            ) : (
                // FREE PASS COUNTER BADGE
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border flex items-center gap-1 ${freePasses > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400/50 shadow-emerald-500/30 animate-pulse' : 'bg-slate-700 border-slate-600'}`}>
                    {freePasses > 0 ? (
                        <>
                            <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> 
                            {freePasses} LEFT
                        </>
                    ) : (
                        <span className="text-slate-400">0 LEFT</span>
                    )}
                </div>
            )}
            
            <button onClick={onGoHome} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><Home className="w-5 h-5" /></button>
            <button onClick={onOpenSettings} className="p-2 -mr-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><Settings className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
         <div className="flex items-center bg-slate-800/60 p-3 rounded-xl mb-6 border border-slate-700/50 backdrop-blur-sm shadow-inner">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">{partner.name.charAt(0).toUpperCase()}</div>
            <div className="ml-3 flex-1"><div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.talking_to}</div><div className="font-bold text-slate-100">{partner.name}</div></div>
            <button onClick={handleBack} className="text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg transition-colors">{t.change_partner}</button>
         </div>

        {!results && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center"><h2 className="text-2xl font-bold text-white">{t.upload_title}</h2><p className="text-slate-400 text-sm mt-1">{t.upload_desc}</p></div>
            <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${selectedImage ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}`}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {selectedImage ? <><img src={`data:${mimeType};base64,${selectedImage}`} alt="Preview" className="max-h-64 rounded-lg shadow-lg object-contain transition-transform group-hover:scale-[1.02]" /><div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10">{t.change_img}</div></> : <><div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 group-hover:bg-slate-750 transition-all"><ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-purple-400 transition-colors" /></div><span className="text-slate-300 font-medium mt-4 tracking-wide">{t.tap_upload}</span></>}
            </div>
            
            {/* The Main Analyze Button */}
            {/* If NO PRO and NO PASSES, clicking this opens Paywall */}
            <Button 
                onClick={() => (!isPro && freePasses <= 0) ? onShowPaywall() : handleAnalyze()} 
                disabled={!selectedImage || isAnalyzing} 
                fullWidth
                className={(!isPro && freePasses > 0 && selectedImage) ? "animate-pulse" : ""}
            >
                {t.analyze_btn}
                {(!isPro && freePasses > 0) && " (Free)"}
            </Button>
            
            {/* Teaser Text if Free Passes Available */}
            {!isPro && freePasses > 0 && (
                <p className="text-center text-xs text-emerald-400 font-bold animate-pulse">
                    ⚡ Instant Unlock Active ({freePasses} left)
                </p>
            )}
          </div>
        )}

        {results && (
            <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
                <div className="text-center">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{t.results_title}</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Algorithm Precision Optimized</p>
                </div>
                <div className="space-y-4">
                    {results.map((res, idx) => {
                        // UNLOCK LOGIC:
                        // With the 3-Pass model, if the user generated the result, it is fully unlocked.
                        // We do NOT blur the third result if they spent a pass.
                        // The lock only appears if they somehow saw this screen without paying/pass (impossible via current logic).
                        // So we remove the blurring logic for the 3rd item IF results are generated.
                        const isLocked = false; 
                        
                        return (
                            <div key={idx} onClick={() => isLocked ? onShowPaywall() : handleCopy(res.text, idx)} className={`relative border rounded-2xl p-5 transition-all overflow-hidden ${isLocked ? 'bg-slate-900 border-yellow-500/40 cursor-pointer shadow-2xl shadow-yellow-900/10 hover:border-yellow-400' : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'}`}>
                                <div className={`flex justify-between items-start mb-3`}>
                                    <span className={`px-2 py-1 text-[10px] font-black uppercase rounded tracking-[0.1em] ${idx === 2 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                                        {idx === 2 ? "🔥 MASTERPIECE" : res.tone}
                                    </span>
                                    {copiedIndex === idx ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" />}
                                </div>
                                
                                <p className={`text-lg leading-relaxed font-medium text-white mb-3`}>"{res.text}"</p>
                                
                                {shouldShowTranslation(res) && (
                                    <div className={`mb-4 px-3 py-3 bg-slate-700/30 rounded-lg flex items-start border border-slate-700/50`}>
                                        <Globe className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-slate-300 ml-3 italic leading-relaxed">"{res.translation}"</p>
                                    </div>
                                )}
                                
                                <p className={`text-xs text-slate-400 pt-3 border-t border-slate-700/50 leading-relaxed`}>💡 {res.explanation}</p>
                            </div>
                        );
                    })}
                </div>
                <Button variant="secondary" fullWidth onClick={handleTryAgain}>{t.try_another}</Button>
            </div>
        )}
      </div>

      {copiedIndex !== null && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl shadow-emerald-500/30 z-[100] animate-in slide-in-from-bottom-5 font-bold tracking-tight">{t.copy_success}</div>}
      
      {showInstallBanner && !isPro && onInstallApp && (
          <div className="fixed bottom-24 left-4 right-4 z-50 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-20 shadow-purple-900/20">
              <button onClick={() => setShowInstallBanner(false)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white rounded-full transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20"><Download className="w-6 h-6 text-white" /></div>
                  <div className="flex-1"><h4 className="font-bold text-white text-sm">{t.install_promo_title}</h4><p className="text-[11px] text-slate-400 leading-tight mt-0.5">{t.install_promo_desc}</p></div>
                  <button onClick={onInstallApp} className="bg-white text-slate-900 font-black text-xs px-4 py-2 rounded-lg hover:bg-slate-100 transition-all shadow-md">{t.install_app}</button>
              </div>
          </div>
      )}
    </div>
  );
};
