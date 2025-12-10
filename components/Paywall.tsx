
import React from 'react';
import { X, Zap, Check, Lock, Share2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

interface PaywallProps {
  onClose: () => void;
  onShare: () => void;
  onSubscribe: () => void;
  language: Language;
}

export const Paywall: React.FC<PaywallProps> = ({ onClose, onShare, onSubscribe, language }) => {
  const t = TRANSLATIONS[language];
  const getSmartPrice = () => {
      const locale = (navigator.language || "").toUpperCase(); 
      if (language === 'pt') return locale.includes('PT') ? "€4.99/mês" : "R$ 19,90/mês";
      if (language === 'es') return locale.includes('ES') ? "4,99 €/mes" : "$4.99/mes";
      return t.per_month;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"><Lock className="w-8 h-8 text-white" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.locked_feature}</h2>
            <p className="text-slate-400 text-sm mb-6">{t.share_desc}</p>
            <div className="space-y-3">
                <button onClick={onShare} className="w-full bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between group border border-slate-700">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Share2 className="w-5 h-5" /></div><div className="text-left"><div className="font-bold text-blue-100">{t.share_to_unlock}</div><div className="text-xs text-slate-400">Unlock Premium (1h)</div></div></div>
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded">FREE</span>
                </button>
                <button onClick={onSubscribe} className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><Zap className="w-5 h-5" /></div><div className="text-left"><div className="font-bold">{t.subscribe}</div><div className="text-xs text-white/80">{t.unlimited}</div></div></div>
                    <span className="text-sm font-bold">{getSmartPrice()}</span>
                </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500"><span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Premium Modes</span><span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Dating Goals</span><span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> No Ads</span></div>
        </div>
      </div>
    </div>
  );
};
