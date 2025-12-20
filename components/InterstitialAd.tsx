
import React, { useState, useEffect } from 'react';
import { BrainCircuit, LockKeyhole, Sparkles } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

const RECTANGLE_AD_SLOT_ID = "7011091820"; // 👈 사장님이 주신 코드로 수정 완료

interface InterstitialAdProps {
  onClose?: () => void;
  onReward?: () => void;
  language: Language;
  mode: 'timer' | 'processing';
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, onReward, language, mode }) => {
  const DURATION_MS = 6000; 
  const UPDATE_INTERVAL = 50;

  const [progress, setProgress] = useState(0);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += UPDATE_INTERVAL;
      const newProgress = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(newProgress);
      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        if (mode === 'timer') {
            if (onReward) onReward();
            if (onClose) onClose();
        }
      }
    }, UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, [mode, onReward, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 animate-in fade-in duration-300 overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent)] blur-3xl animate-pulse"></div>

      <div className="flex flex-col items-center gap-8 p-6 w-full max-w-sm relative z-[205]">
        
        <div className="text-center space-y-4 animate-in slide-in-from-bottom-5 duration-700">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30">
                {mode === 'processing' ? (
                     <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
                ) : (
                     <LockKeyhole className="w-8 h-8 text-white animate-pulse" />
                )}
            </div>
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                    {mode === 'processing' ? (t.analyzing_btn || "Analyzing...") : "Unlocking..."}
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {mode === 'processing' ? "Analyzing Subtext" : "Premium Content"}
                </p>
            </div>
        </div>

        {/* Ad Container */}
        <div className="w-full relative">
            <div className="bg-white/[0.03] border border-white/5 p-2 rounded-3xl shadow-inner">
                <AdBanner 
                    format="rectangle" 
                    slotId={RECTANGLE_AD_SLOT_ID}
                    className="rounded-2xl"
                />
            </div>
            <div className="absolute -top-3 -left-3 bg-purple-600 p-2 rounded-xl shadow-lg border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[240px] space-y-3">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-100 ease-linear shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-[0.3em]">Processing...</p>
        </div>
      </div>
    </div>
  );
};
