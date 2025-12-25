import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Lightbulb } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

interface InterstitialAdProps {
  onClose?: () => void;
  onReward?: () => void;
  language: Language;
  mode: 'timer' | 'processing';
}

/**
 * Note: No external ad units are loaded in this interstitial view to maintain optimal user experience
 * during short waiting periods. Informative content is displayed instead.
 */

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, onReward, language, mode }) => {
  const DURATION_MS = 6000; 
  const UPDATE_INTERVAL = 50;

  const [progress, setProgress] = useState(0);
  const t = TRANSLATIONS[language];
  const [tipIndex] = useState(Math.floor(Math.random() * 4));

  const TIPS = [
    { ko: "상대방의 텍스트 길이가 길어진다면, 호감도가 상승하고 있다는 강력한 신호입니다.", en: "If their text length increases, it's a strong signal of rising interest." },
    { ko: "질문이 없는 대화는 관계의 정체를 의미합니다. 상대방의 흥미사에 대해 '열린 질문'을 던져보세요.", en: "A conversation without questions means stagnation. Try asking 'open-ended questions' about their interests." },
    { ko: "MBTI 'F' 유형은 공감을, 'T' 유형은 해결책을 원합니다. 상대방의 성향에 맞춰 반응하세요.", en: "'F' types want empathy, 'T' types want solutions. Tailor your response to their personality." },
    { ko: "답장 속도를 상대방과 비슷하게 맞추는 '미러링'은 심리적 안정감을 줍니다.", en: "Mirroring their reply speed creates psychological comfort." }
  ];

  const currentTip = language === 'ko' ? TIPS[tipIndex].ko : TIPS[tipIndex].en;

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
      
      {/* Decorative Blur Background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent)] blur-3xl animate-pulse"></div>

      <div className="flex flex-col items-center gap-10 p-6 w-full max-w-sm relative z-[205]">
        
        <div className="text-center space-y-4 animate-in slide-in-from-bottom-5 duration-700">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30">
                <BrainCircuit className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                    {mode === 'processing' ? (t.analyzing_btn || "Analyzing...") : "Unlocking..."}
                </h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">
                    Context Processing Unit
                </p>
            </div>
        </div>

        {/* Informative Tip Card - Providing Content during Wait */}
        <div className="w-full bg-white/[0.05] border border-white/10 p-8 rounded-[40px] backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-500/20 p-2 rounded-xl text-yellow-400">
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Rizz Academy Insight</h3>
                </div>
                <p className="text-base text-slate-200 font-bold leading-relaxed italic">
                    "{currentTip}"
                </p>
            </div>
        </div>

        {/* Visual Progress Indicator */}
        <div className="w-full max-w-[240px] space-y-4">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Optimizing Suggestions</p>
            </div>
        </div>
      </div>
    </div>
  );
};