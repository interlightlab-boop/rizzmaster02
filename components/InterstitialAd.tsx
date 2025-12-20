
import React, { useState, useEffect } from 'react';
import { BrainCircuit, LockKeyhole } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

// 사장님 스크린샷의 ID를 공통 적용
const ACTUAL_SLOT_ID = "7011091820";

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
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 p-6 w-full max-w-sm relative z-[205]">
        <div className="text-center space-y-3 animate-in slide-in-from-bottom-5 duration-700">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                {mode === 'processing' ? <BrainCircuit className="w-8 h-8 text-purple-400 animate-pulse" /> : <LockKeyhole className="w-8 h-8 text-purple-400 animate-pulse" />}
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">{mode === 'processing' ? (t.analyzing_btn || "Analyzing...") : "Unlocking..."}</h2>
                <p className="text-sm text-slate-400 mt-1">{mode === 'processing' ? "Calculating psychological vectors..." : "Preparing your premium response..."}</p>
            </div>
        </div>

        <div className="w-full flex flex-col items-center gap-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sponsored Support</div>
            <div className="relative bg-slate-800 p-1 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                <div className="bg-black w-[300px] h-[250px] rounded-xl overflow-hidden flex items-center justify-center">
                    <AdBanner format="rectangle" slotId={ACTUAL_SLOT_ID} style={{ width: '300px', height: '250px' }} />
                </div>
            </div>
        </div>

        <div className="w-full max-w-[240px] space-y-2">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] animate-[shimmer_2s_infinite] transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </div>
    </div>
  );
};
