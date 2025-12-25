
import React, { useState, useRef, useEffect } from 'react';
import { PartnerProfile, UserProfile, RizzResponse, Language, RizzGenerationResult } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { generateRizzSuggestions } from '../services/geminiService';
import { Button } from './Button';
import { InterstitialAd } from './InterstitialAd';
import { AdBanner } from './AdBanner';
import { ArrowLeft, Image as ImageIcon, Copy, CheckCircle2, Settings, Globe, Sparkles, Home, Lock, Download, X, Flame, RotateCcw } from 'lucide-react';

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
  const [showFakeLoading, setShowFakeLoading] = useState(false);
  
  // 첫회 무료 이용권 사용 여부를 결과 렌더링 시점에 기억하기 위한 로컬 상태
  const [wasFreePass, setWasFreePass] = useState(false);

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
          const MAX_W = 1000;
          if (w > MAX_W) { h *= MAX_W/w; w = MAX_W; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
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

    // 분석 전에 1회 이용권 사용 여부를 로컬 상태에 저장하고 상위 상태 업데이트
    const currentlyHasFreePass = oneTimePass;
    if (currentlyHasFreePass) {
        setWasFreePass(true);
        onConsumeOneTimePass();
    } else {
        setWasFreePass(false);
    }

    const isProUser = isPro; 
    const shouldShowAdLoading = !isProUser && !currentlyHasFreePass; // 프로도 아니고 무료이용권도 아니면 로딩 광고
    
    if (shouldShowAdLoading) {
        setShowFakeLoading(true);
    }
    
    setIsAnalyzing(true); 
    setResultData(null); 
    
    try {
      const adWaitTime = shouldShowAdLoading ? 6000 : 0; 
      const minWaitPromise = new Promise(resolve => setTimeout(resolve, adWaitTime));
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Network Timeout")), 45000)
      );

      const apiPromise = generateRizzSuggestions(user, partner, selectedImage, mimeType, language);

      const [_, result] = await Promise.all([
          minWaitPromise, 
          Promise.race([apiPromise, timeoutPromise])
      ]) as [any, RizzGenerationResult];
      
      setResultData(result);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert(language === 'ko' ? "오류가 발생했습니다. 다시 시도해주세요." : "An error occurred. Please try again.");
    } finally { 
        setShowFakeLoading(false);
        setIsAnalyzing(false); 
    }
  };

  const handleRetry = () => handleAnalyze();
  const handleTryAnother = () => {
      setResultData(null);
      setSelectedImage(null);
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
      if (!res.translation || res.translation === 'null' || res.translation === res.text) return false;
      return true;
  };

  const getScoreColor = (score: number) => {
      if (score < 40) return 'text-red-400';
      if (score < 75) return 'text-yellow-400';
      return 'text-green-400';
  };

  if (showFakeLoading) return <InterstitialAd language={language} mode="processing" />;

  if (isAnalyzing) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 space-y-6">
         <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-slate-800 p-4 rounded-full border border-slate-700 shadow-2xl">
                <Sparkles className="w-10 h-10 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
         </div>
         <div className="text-center space-y-2">
             <h2 className="text-xl font-bold text-white animate-pulse">{t.analyzing_btn}</h2>
             <p className="text-sm text-slate-400">
                {language === 'ko' ? "AI가 대화의 공기를 읽는 중..." : "AI is analyzing the subtext..."}
             </p>
         </div>
      </div>
    );
  }

  if (resultData) {
    return (
      <div className="h-full w-full flex flex-col bg-slate-900 animate-in fade-in duration-500 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex items-center gap-2">
              <button onClick={onGoHome} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"><Home className="w-5 h-5" /></button>
              <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"><Settings className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-4 space-y-6 pb-24">
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 text-center space-y-3 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.rizz_score}</h2>
                <div className={`text-6xl font-black ${getScoreColor(resultData.rizzScore)} drop-shadow-2xl`}>{resultData.rizzScore}</div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 mt-2">
                    <h3 className="text-[10px] font-bold text-purple-400 uppercase mb-1 flex items-center justify-center gap-1"><Flame className="w-3 h-3" /> {t.ai_roast}</h3>
                    <p className="text-sm text-slate-200 italic">"{resultData.roast}"</p>
                </div>
            </div>

            <div className="space-y-4">
                {resultData.replies.map((reply, index) => {
                    const isMasterpiece = index === 2; 
                    // 👑 사장님 요청: 마스터피스는 Pro 사용자 또는 첫 회 무료 이용권 사용자(wasFreePass)에게 공개
                    const isLocked = isMasterpiece && !isPro && !wasFreePass; 
                    
                    return (
                        <div key={index} className={`relative group rounded-2xl transition-all duration-300 ${isLocked ? 'bg-slate-900 border border-slate-800 p-1 opacity-90' : isMasterpiece ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-500/30 shadow-lg shadow-yellow-900/10' : 'bg-slate-800 border border-slate-700'}`}>
                            {isLocked && (
                                <div onClick={onShowPaywall} className="absolute inset-0 z-20 backdrop-blur-md bg-slate-900/60 flex flex-col items-center justify-center rounded-2xl cursor-pointer border border-yellow-500/30 hover:bg-slate-900/40 transition-colors group-hover:scale-[1.01]">
                                    <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg shadow-orange-500/30 mb-2 animate-bounce"><Lock className="w-6 h-6 text-white" /></div>
                                    <h3 className="text-lg font-black text-white">{t.unlock_best_reply}</h3>
                                    <p className="text-xs text-yellow-200 font-medium mt-1">{t.tap_to_reveal}</p>
                                </div>
                            )}
                            <div className={`p-5 space-y-3 ${isLocked ? 'blur-sm select-none' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isMasterpiece ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'}`}>{reply.tone}</div>
                                    {isMasterpiece && !isLocked && <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />}
                                </div>
                                <div className="space-y-2">
                                    <p className={`text-lg font-medium leading-relaxed ${isMasterpiece ? 'text-white' : 'text-slate-100'}`}>{reply.text}</p>
                                    {shouldShowTranslation(reply) && <div className="text-sm text-slate-500 border-l-2 border-slate-700 pl-3 italic">{reply.translation}</div>}
                                </div>
                                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 font-medium"><span className="font-bold text-slate-500 uppercase mr-1">Rationale:</span>{reply.explanation}</p>
                                </div>
                                <button onClick={() => handleCopy(reply.text, index)} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${copiedIndex === index ? 'bg-green-500 text-white' : isMasterpiece ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'}`}>{copiedIndex === index ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copiedIndex === index ? t.copy_success : "Copy Text"}</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 🔥 애드센스 승인을 위한 안전한 광고 배치 (충분한 콘텐츠 하단) */}
            <div className="pt-4 pb-4">
                <AdBanner className="rounded-[32px]" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleRetry} disabled={isAnalyzing} className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-200 py-4 px-4 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50">
                    <RotateCcw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    {t.retry_btn}
                </button>
                <button onClick={handleTryAnother} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-4 px-4 rounded-xl font-bold text-sm transition-all active:scale-95">
                    <ImageIcon className="w-4 h-4" />
                    {t.try_another}
                </button>
            </div>
            
            {showInstallBanner && installPrompt && (
                <div className="fixed bottom-6 left-4 right-4 z-50 bg-slate-800 border border-purple-500/30 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 flex items-center justify-between">
                     <div className="flex flex-col"><span className="font-bold text-white text-sm">{t.install_promo_title}</span><span className="text-xs text-slate-400">{t.install_promo_desc}</span></div>
                     <button onClick={onInstallApp} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-500 transition-colors">Install</button>
                     <button onClick={() => setShowInstallBanner(false)} className="absolute -top-2 -right-2 bg-slate-700 text-slate-400 rounded-full p-1 border border-slate-600"><X className="w-3 h-3" /></button>
                </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-4 animate-in slide-in-from-right duration-300 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 shrink-0">
         <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft /></button>
         <div className="flex items-center gap-2 -mr-2">
            <button onClick={onGoHome} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><Home className="w-5 h-5" /></button>
            <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><Settings className="w-5 h-5" /></button>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6 pb-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3 rotate-3 transform hover:rotate-6 transition-transform"><ImageIcon className="w-8 h-8 text-white" /></div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{t.upload_title}</h2>
          <p className="text-slate-400 text-xs max-w-[280px] mx-auto leading-relaxed">{t.upload_desc}</p>
        </div>

        <div className="w-full max-w-[220px] aspect-[9/16] relative group cursor-pointer shadow-2xl shadow-purple-900/20 rounded-3xl">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div onClick={() => fileInputRef.current?.click()} className={`w-full h-full rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden ${selectedImage ? 'border-purple-500 bg-slate-900' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-purple-500/50'}`}>
            {selectedImage ? (
              <>
                <img src={`data:${mimeType};base64,${selectedImage}`} className="absolute inset-0 w-full h-full object-contain bg-black/50 backdrop-blur-sm p-4" alt="Preview" />
                <div className="absolute bottom-6 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10 shadow-xl z-10"><ImageIcon className="w-3 h-3" /> {t.change_img}</div>
              </>
            ) : (
               <>
                 <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner"><ImageIcon className="w-7 h-7 text-slate-500 group-hover:text-purple-400 transition-colors" /></div>
                 <span className="text-xs font-bold text-slate-500 group-hover:text-purple-300 transition-colors">{t.tap_upload}</span>
               </>
            )}
          </div>
        </div>

        {selectedImage && (
          <div className="w-full max-w-[240px] animate-in slide-in-from-bottom-4 duration-500 pt-2">
            <Button onClick={handleAnalyze} fullWidth disabled={isAnalyzing} className="py-3 text-base shadow-purple-500/25">{isAnalyzing ? t.analyzing_btn : t.analyze_btn}</Button>
          </div>
        )}
      </div>
    </div>
  );
};
