
import React, { useState, useRef, useEffect } from 'react';
import { PartnerProfile, UserProfile, RizzResponse, Language, RizzGenerationResult } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { generateRizzSuggestions } from '../services/geminiService';
import { Button } from './Button';
import { InterstitialAd } from './InterstitialAd';
import { ArrowLeft, Image as ImageIcon, Copy, CheckCircle2, Settings, Globe, Sparkles, Home, Lock, Download, X, Flame } from 'lucide-react';

interface AnalyzerProps {
  user: UserProfile;
  partner: PartnerProfile;
  isPro: boolean;
  proType: 'none' | 'share' | 'subscription' | 'ad_reward'; 
  oneTimePass: boolean; 
  onConsumeOneTimePass: () => void; 
  onBack: () => void;
  onShowPaywall: () => void;
  language: Language;
  onOpenSettings: () => void;
  onGoHome: () => void;
  installPrompt?: any;
  onInstallApp?: () => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ 
  user, partner, isPro, proType, oneTimePass, onConsumeOneTimePass, onBack, language, onOpenSettings, onGoHome, onShowPaywall, installPrompt, onInstallApp
}) => {
  const t = TRANSLATIONS[language];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultData, setResultData] = useState<RizzGenerationResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
  // State for the Fake Loading Screen (Ad Version)
  const [showFakeLoading, setShowFakeLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resultData && installPrompt) {
        const timer = setTimeout(() => setShowInstallBanner(true), 2000);
        return () => clearTimeout(timer);
    }
  }, [resultData, installPrompt]);

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
          setResultData(null); 
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    // --- LOADING & REVENUE LOGIC ---
    const isProUser = isPro || oneTimePass;
    const shouldShowAdLoading = !isProUser;
    
    if (shouldShowAdLoading) {
        setShowFakeLoading(true);
    }
    
    setIsAnalyzing(true); 
    setResultData(null); 
    
    try {
      const waitTime = shouldShowAdLoading ? 6000 : 0; 
      
      const minWaitPromise = new Promise(resolve => setTimeout(resolve, waitTime));
      
      // TIMEOUT LOGIC: Fail if API takes longer than 25 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: AI is taking too long.")), 25000)
      );

      const apiPromise = generateRizzSuggestions(user, partner, selectedImage, mimeType, language);

      // Race against timeout
      const [_, result] = await Promise.all([
          minWaitPromise, 
          Promise.race([apiPromise, timeoutPromise])
      ]) as [any, RizzGenerationResult];
      
      setResultData(result);
    } catch (error: any) {
      console.error(error);
      alert(error.message === "Timeout: AI is taking too long." 
        ? "Network is slow. Please try again." 
        : `Error: ${error.message}`
      );
    } finally { 
        setShowFakeLoading(false);
        setIsAnalyzing(false); 
    }
  };

  const handleTryAgain = () => {
      setResultData(null);
      // Revoke pass when starting over
      if (oneTimePass) onConsumeOneTimePass(); 
  };

  const handleBack = () => {
      // Revoke pass when leaving
      if (oneTimePass) onConsumeOneTimePass();
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

  const isGoldStatus = proType === 'subscription' || (isPro && proType === 'none');

  const getScoreColor = (score: number) => {
      if (score < 40) return 'text-red-500';
      if (score < 70) return 'text-yellow-400';
      return 'text-green-400';
  };
  
  const getScoreGradient = (score: number) => {
      if (score < 40) return 'from-red-500 to-orange-600';
      if (score < 70) return 'from-yellow-400 to-orange-500';
      return 'from-green-400 to-emerald-500';
  };

  return (
    <div className="h-full w-full flex flex-col p-6 max-w-md mx-auto relative overflow-hidden bg-slate-900">
      
      {/* Fake Loading Overlay (Ads + Analyzing UI) - FOR FREE USERS */}
      {showFakeLoading && (
          <InterstitialAd 
            language={language}
            mode="processing"
          />
      )}

      {/* PRO Loading Overlay - FOR PRO USERS (No Ad, Just Status) */}
      {isAnalyzing && !showFakeLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xs flex flex-col items-center p-6 text-center">
                {/* Spinning Icon */}
                <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin"></div>
                    <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>

                {/* Text */}
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    {language === 'ko' ? '답변 생성 중...' : t.analyzing_btn}
                </h2>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                     {language === 'ko' ? 'AI가 최고의 플러팅을 분석하고 있습니다.' : 'Analyzing psychological vectors...'}
                </p>

                {/* Gauge Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-[shimmer_1.5s_infinite]"></div>
                </div>
                <div className="mt-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                    Pro Processing
                </div>
            </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 shrink-0">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft /></button>
        <div className="flex items-center gap-2">
            {(isPro || oneTimePass) && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border flex items-center gap-1 ${isGoldStatus ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500/50 shadow-orange-500/30' : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-500/50 shadow-cyan-500/30'}`}>
                    <Sparkles className="w-3 h-3" /> 
                    {/* Display 'PRO' for Review Mode users to act as paid users */}
                    {proType === 'share' ? "PRO (1H)" : (oneTimePass ? "UNLOCKED" : "PRO")}
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

        {!resultData && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center"><h2 className="text-2xl font-bold text-white">{t.upload_title}</h2><p className="text-slate-400 text-sm mt-1">{t.upload_desc}</p></div>
            <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${selectedImage ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}`}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {selectedImage ? <><img src={`data:${mimeType};base64,${selectedImage}`} alt="Preview" className="max-h-64 rounded-lg shadow-lg object-contain transition-transform group-hover:scale-[1.02]" /><div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10">{t.change_img}</div></> : <><div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 group-hover:bg-slate-750 transition-all"><ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-purple-400 transition-colors" /></div><span className="text-slate-300 font-medium mt-4 tracking-wide">{t.tap_upload}</span></>}
            </div>
            
            {/* The Main Analyze Button */}
            <Button onClick={handleAnalyze} disabled={!selectedImage || isAnalyzing} fullWidth>
                {t.analyze_btn}
            </Button>
          </div>
        )}

        {resultData && (
            <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
                
                {/* RIZZ SCORE & ROAST HEADER - NEW FEATURE */}
                <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-5 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getScoreGradient(resultData.rizzScore)}`}></div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            {/* Circular Background */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                                <circle 
                                    cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                    className={getScoreColor(resultData.rizzScore)}
                                    strokeDasharray={226}
                                    strokeDashoffset={226 - (226 * resultData.rizzScore) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-2xl font-black text-white">{resultData.rizzScore}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Flame className={`w-4 h-4 ${getScoreColor(resultData.rizzScore)}`} />
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{t.rizz_score}</h3>
                            </div>
                            <p className="text-sm font-medium text-white italic leading-tight">
                                "{resultData.roast}"
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{t.results_title}</h2>
                </div>
                
                <div className="space-y-4">
                    {resultData.replies.map((res, idx) => {
                        const hasAccess = isPro || oneTimePass;
                        const isLocked = !hasAccess && idx === 2;
                        
                        return (
                            <div key={idx} onClick={() => isLocked ? onShowPaywall() : handleCopy(res.text, idx)} className={`relative border rounded-2xl p-5 transition-all overflow-hidden ${isLocked ? 'bg-slate-900 border-yellow-500/40 cursor-pointer shadow-2xl shadow-yellow-900/10 hover:border-yellow-400' : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'}`}>
                                {isLocked && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
                                        <div className="bg-yellow-500/20 p-4 rounded-full border border-yellow-500/30 mb-3 animate-pulse shadow-2xl shadow-yellow-900/40">
                                          <Lock className="w-8 h-8 text-yellow-400 drop-shadow-xl" />
                                        </div>
                                        <span className="font-black text-yellow-500 text-sm drop-shadow-lg uppercase tracking-[0.25em]">{t.unlock_best_reply}</span>
                                        <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{t.tap_to_reveal}</span>
                                    </div>
                                )}
                                <div className={`flex justify-between items-start mb-3 ${isLocked ? 'blur-md opacity-30' : ''}`}>
                                    <span className={`px-2 py-1 text-[10px] font-black uppercase rounded tracking-[0.1em] ${isLocked ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>{res.tone}</span>
                                    {!isLocked && (copiedIndex === idx ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" />)}
                                </div>
                                
                                <p className={`text-lg leading-relaxed font-medium text-white mb-3 ${isLocked ? 'blur-md select-none' : ''}`}>"{res.text}"</p>
                                
                                {shouldShowTranslation(res) && (
                                    <div className={`mb-4 px-3 py-3 bg-slate-700/30 rounded-lg flex items-start border border-slate-700/50 ${isLocked ? 'blur-md select-none' : ''}`}>
                                        <Globe className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-slate-300 ml-3 italic leading-relaxed">"{res.translation}"</p>
                                    </div>
                                )}
                                
                                <p className={`text-xs text-slate-400 pt-3 border-t border-slate-700/50 leading-relaxed ${isLocked ? 'blur-md select-none' : ''}`}>💡 {res.explanation}</p>
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
