
import React from 'react';
import { Language } from '../types';
import { MessageCircle, Sparkles, PlusSquare, Zap, BrainCircuit, ShieldCheck, FileText } from 'lucide-react';

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

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, onInstall, onOpenLegal }) => {
  return (
    // CRITICAL FIX: h-full with overflow-y-auto enables internal scrolling within the fixed App shell.
    // pb-24 ensures content isn't hidden behind bottom navigation bars.
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-24 px-6 bg-[#020617] relative font-sans overflow-y-auto scrollbar-hide">
        
        {/* Deep Space Background (Fixed position) */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Install Button (Top Right) */}
        {onInstall && (
            <button 
                onClick={onInstall}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg"
            >
                <PlusSquare className="w-3.5 h-3.5 text-purple-400" />
                Add App
            </button>
        )}

        {/* Main Content */}
        <div className="w-full max-w-md flex flex-col items-center z-10 space-y-8 animate-in fade-in duration-700">
            
            {/* HERO SECTION */}
            <div className="flex flex-col items-center text-center space-y-4 mt-6">
                
                {/* Logo Icon with Glow */}
                <div className="relative group transform hover:scale-105 transition-transform duration-500">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5">
                         <MessageCircle className="w-12 h-12 text-white fill-purple-500/10 stroke-[1.5px]" />
                         <div className="absolute -top-1 -right-1 bg-white rounded-full p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600 animate-pulse" />
                         </div>
                    </div>
                </div>

                {/* Typography */}
                <div className="space-y-0">
                    <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl leading-[0.9]">
                        MBTI
                    </h1>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tighter leading-[0.9]">
                        RIZZ
                    </h1>
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    AI Dating Wingman v1.5
                </p>
            </div>

            {/* LANGUAGE LIST - 2 Column Grid */}
            <div className="w-full space-y-3 px-1">
                <div className="flex items-center gap-2 mb-1 px-1 justify-center">
                    <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Language</span>
                    <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelect(lang.code)}
                            className="group relative flex flex-col items-center justify-center p-3.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-purple-500/30 rounded-xl transition-all active:scale-[0.98] overflow-hidden text-center gap-1.5 shadow-sm"
                        >
                            <span className="text-2xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{lang.flag}</span>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">{lang.label}</span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{lang.native}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* VISIBLE SEO & GOOGLE ADS COMPLIANCE CONTENT */}
            <article className="w-full mt-8 p-6 bg-slate-900/50 rounded-3xl border border-white/5 text-center space-y-6 backdrop-blur-sm">
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                        How It Works
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed px-2">
                        MBTI Rizz AI uses advanced psychology to analyze your chat screenshots. We generate the perfect reply tailored to your partner's personality type.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-left">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-slate-200 text-sm">Instant Rizz</h3>
                            <p className="text-[11px] text-slate-500 leading-tight mt-1">Generate witty, charming replies in seconds using our Neural Engine.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-slate-200 text-sm">Safe & Private</h3>
                            <p className="text-[11px] text-slate-500 leading-tight mt-1">Your chats are analyzed anonymously and never stored on our servers.</p>
                        </div>
                    </div>
                </div>

                {/* CRITICAL FOR GOOGLE ADS: Visible Links to Privacy & Terms */}
                {onOpenLegal && (
                    <div className="pt-4 border-t border-white/5 flex flex-wrap justify-center gap-4">
                        <button onClick={() => onOpenLegal('privacy')} className="text-[10px] text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Privacy Policy
                        </button>
                        <button onClick={() => onOpenLegal('terms')} className="text-[10px] text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Terms of Service
                        </button>
                    </div>
                )}
                
                <div className="text-[9px] text-slate-600">
                    <p>© 2025 MBTI Rizz AI. All rights reserved.</p>
                </div>
            </article>

        </div>
    </div>
  );
};
