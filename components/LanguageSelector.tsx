
import React from 'react';
import { Language } from '../types';
import { ChevronRight, Globe, ArrowLeft } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
  onInstall?: () => void;
  onOpenLegal?: (type: 'privacy' | 'terms') => void;
}

const languages: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'ko', label: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Russian', native: 'Русский', flag: '🇷🇺' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start bg-[#020617] relative p-6 overflow-y-auto scrollbar-hide">
        
        {/* Decorative Background */}
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md space-y-10 py-10 z-10">
            <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Globe className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl font-black text-white">Choose Language</h1>
                <p className="text-slate-400 text-sm">Select your preferred language for the interface.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {languages.map((lang) => (
                    <button 
                        key={lang.code} 
                        onClick={() => onSelect(lang.code)}
                        className="group flex items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-3xl transition-all active:scale-[0.98] text-left"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl filter drop-shadow-md">{lang.flag}</span>
                            <div>
                                <div className="text-white font-bold">{lang.label}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{lang.native}</div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};
