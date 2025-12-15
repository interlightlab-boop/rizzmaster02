
import React from 'react';
import { X, Zap, Check, Lock, Share2, Flame } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

interface PaywallProps {
  onClose: () => void;
  onShare: () => void;
  onSubscribe: () => void;
  // onWatchAd removed to avoid AdSense violation
  language: Language;
}

// --- CONFIGURATION ---
const STANDARD_PRICE = "$4.99/mo";
const PAYMENT_LINK: string = "https://your-payment-provider.com/checkout/product-id"; 

export const Paywall: React.FC<PaywallProps> = ({ onClose, onShare, onSubscribe, language }) => {
  const t = TRANSLATIONS[language];

  const handleSubscribeClick = () => {
      // Safety check: If the developer hasn't changed the default link, show a "Coming Soon" message instead of a broken page.
      if (PAYMENT_LINK.includes("your-payment-provider") || PAYMENT_LINK === "") {
          alert("🚀 Pro subscriptions are coming soon!\n\nFor now, please use the 'Unlock for 1 Hour' feature by sharing the app. It's free!");
      } else {
          // If a real link exists (e.g. Gumroad, Stripe), open it.
          window.open(PAYMENT_LINK, '_blank');
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        
        <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"><Lock className="w-8 h-8 text-white" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.locked_feature}</h2>
            <p className="text-slate-400 text-sm mb-6">{t.share_desc || "Unlock premium features"}</p>
            
            <div className="space-y-3">
                {/* 1. Subscribe Option (Fast & Unlimited) */}
                <button onClick={handleSubscribeClick} className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white p-4 rounded-xl flex items-center justify-between shadow-lg transform active:scale-95 transition-all ring-1 ring-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="text-left relative z-10">
                            <div className="font-bold">{t.subscribe}</div>
                            <div className="text-[10px] text-white/80">Instant • No Wait • Cancel Anytime</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end relative z-10">
                         <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded text-white shadow-sm">{STANDARD_PRICE}</span>
                    </div>
                </button>

                {/* Separator */}
                <div className="flex items-center gap-2 opacity-50 py-1">
                    <div className="h-px bg-slate-600 flex-1"></div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Free Options</span>
                    <div className="h-px bg-slate-600 flex-1"></div>
                </div>
                
                {/* 2. Share Option (1 Hour) */}
                <button onClick={onShare} className="w-full bg-blue-600/20 text-blue-100 p-3 rounded-xl flex items-center justify-between group border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Share2 className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm">Unlock for 1 Hour</div>
                            <div className="text-[10px] opacity-70">Share with friends to unlock</div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-1 rounded">1 HR</span>
                </button>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Secure</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> Best Rizz</span>
            </div>
        </div>
      </div>
    </div>
  );
};
