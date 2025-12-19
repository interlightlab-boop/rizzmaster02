
import React from 'react';
import { X, Zap, Check, Lock, Share2, Flame, ExternalLink } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

interface PaywallProps {
  onClose: () => void;
  onShare: () => void;
  onSubscribe: () => void;
  language: Language;
}

// ==================================================================================
// 💰 [사장님 설정 필수] Lemon Squeezy 결제 링크 넣는 곳
// ==================================================================================
// 레몬스퀴지에서 기본 통화를 USD로 설정하고 7.99를 입력한 후 생성된 링크를 넣으세요!
const LEMON_SQUEEZY_LINK: string = ""; 
// ==================================================================================

// $7.99 기준 각 국가별 대략적인 현지 금액 (환율에 따른 근사치)
const LOCAL_PRICE_ESTIMATES: Record<string, string> = {
  ko: "약 ₩11,000",
  ja: "약 ¥1,200",
  es: "aprox. €7,50",
  fr: "env. €7,50",
  pt: "aprox. R$ 40",
  zh: "约 ¥58",
  ru: "ок. ₽750",
  en: "" // 기본 달러($7.99)
};

export const Paywall: React.FC<PaywallProps> = ({ onClose, onShare, onSubscribe, language }) => {
  const t = TRANSLATIONS[language];
  const localPrice = LOCAL_PRICE_ESTIMATES[language];

  const handleSubscribeClick = () => {
      if (!LEMON_SQUEEZY_LINK) {
          alert(language === 'ko' 
            ? "🚀 결제 시스템 연동 중입니다!\n\n현재는 '공유하기'를 통해 1시간 무료 이용이 가능합니다." 
            : "🚀 Payment system is coming soon!\n\nPlease use the 'Share' feature for now.");
          return;
      }
      window.location.href = LEMON_SQUEEZY_LINK;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white z-10"><X className="w-4 h-4" /></button>
        
        <div className="h-24 bg-gradient-to-br from-purple-600 to-pink-600 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
             <Lock className="w-10 h-10 text-white/80" />
        </div>

        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{t.locked_feature}</h2>
            <p className="text-slate-400 text-sm mb-6">{t.share_desc || "Unlock premium features"}</p>
            
            <div className="space-y-3">
                <button 
                    onClick={handleSubscribeClick} 
                    className="w-full bg-white text-slate-950 p-4 rounded-2xl flex items-center justify-between shadow-xl transform active:scale-95 transition-all group relative overflow-hidden"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Zap className="w-5 h-5 fill-purple-600" />
                        </div>
                        <div className="text-left">
                            <div className="font-black text-sm">{t.subscribe}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Unlimited • Instant Access</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className="text-sm font-black text-purple-600">$7.99 / mo</span>
                         {localPrice && (
                             <span className="text-[9px] text-slate-500 font-bold leading-none mt-0.5">
                                 ({localPrice})
                             </span>
                         )}
                         <ExternalLink className="w-3 h-3 text-slate-400 mt-1" />
                    </div>
                </button>

                <div className="flex items-center gap-2 opacity-30 py-2">
                    <div className="h-px bg-slate-600 flex-1"></div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">OR</span>
                    <div className="h-px bg-slate-600 flex-1"></div>
                </div>
                
                <button 
                    onClick={onShare} 
                    className="w-full bg-slate-800 text-slate-100 p-4 rounded-2xl flex items-center justify-between border border-slate-700 hover:bg-slate-750 transition-colors active:scale-95"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm">{t.share_to_unlock}</div>
                            <div className="text-[10px] text-slate-500">1 Hour Free Access</div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg border border-blue-500/30">FREE</span>
                </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Secure Checkout</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> Instant Unlock</span>
            </div>
        </div>
      </div>
    </div>
  );
};
