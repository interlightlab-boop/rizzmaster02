
import React from 'react';
import { Language } from '../types';
import { Globe, Zap, BrainCircuit, MessageCircle, Sparkles, PlusSquare, Cpu, ShieldCheck, Smartphone } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
  onInstall?: () => void;
}

// Order based on Ad Revenue (CPM) & User Base Size
const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, onInstall }) => {
  return (
    <div className="h-full w-full flex flex-col items-center p-6 bg-slate-900 relative overflow-hidden overflow-y-auto scrollbar-hide">
        
        {/* Background Effects (Tech/Science Vibe) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Install Button (Floating Top Right) */}
        {onInstall && (
            <button 
                onClick={onInstall}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all shadow-lg animate-in fade-in slide-in-from-top-5 duration-700"
            >
                <PlusSquare className="w-3.5 h-3.5" />
                Add to Home
            </button>
        )}

        {/* Main Content Container */}
        <div className="w-full max-w-md flex flex-col items-center z-10 space-y-10 pt-32 min-h-full justify-start md:justify-center pb-12">
            
            {/* Logo & Hero Section (Redesigned: Horizontal Layout) */}
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-top-10 duration-700">
                
                {/* Horizontal Container: Icon Left | Text Right */}
                <div className="flex items-center gap-5 transform scale-105">
                    
                    {/* ICON BOX */}
                    <div className="relative group">
                        {/* Glow Behind Icon */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 animate-pulse-slow"></div>
                        
                        {/* Icon Container */}
                        <div className="relative w-20 h-20 bg-slate-900 rounded-2xl border border-slate-700/80 flex items-center justify-center shadow-2xl ring-1 ring-white/10">
                             <MessageCircle 
                                className="w-10 h-10 text-white fill-purple-500/20 stroke-[1.5px]" 
                             />
                             {/* Sparkle Accent */}
                             <div className="absolute -top-1.5 -right-1.5 bg-slate-800 rounded-full p-1.5 border border-slate-600 shadow-lg">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                             </div>
                        </div>
                    </div>

                    {/* TEXT BOX */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-lg flex flex-col">
                            <span>MBTI</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Rizz AI</span>
                        </h1>
                        
                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold text-slate-300 border border-white/10 backdrop-blur-md">
                                v1.5
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-green-400 tracking-wide uppercase">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tagline / Subtitle */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-lg font-medium text-slate-300 tracking-tight">
                        Scientific Seduction Engine
                    </p>
                    <div className="flex items-center justify-center gap-3 opacity-60">
                        <span className="h-px w-8 bg-gradient-to-r from-transparent to-slate-500"></span>
                        <p className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                            NEURAL NET POWERED
                        </p>
                        <span className="h-px w-8 bg-gradient-to-l from-transparent to-slate-500"></span>
                    </div>
                </div>
            </div>

            {/* Feature Pills */}
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-300">Psychology</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-300">Compatibility</span>
                </div>
            </div>

            {/* Language Grid */}
            <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 pb-4">
                <div className="flex items-center gap-3 justify-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="h-px w-8 bg-slate-800"></span>
                    <Globe className="w-3 h-3" /> Initialize System
                    <span className="h-px w-8 bg-slate-800"></span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 px-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelect(lang.code)}
                            className="flex items-center gap-3 p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl hover:bg-slate-700/80 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all group active:scale-95"
                        >
                            <span className="text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">{lang.flag}</span>
                            <span className="text-sm font-bold text-slate-200 group-hover:text-white">{lang.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* EXPANDED SEO CONTENT (Styled as Technical Specs for AdSense Approval) */}
            <div className="w-full px-4 pt-12 pb-8 text-slate-600 opacity-60 animate-in fade-in duration-1000 delay-500">
                <div className="border-t border-slate-800 pt-8 space-y-8">
                    
                    {/* Section 1: Core Functionality */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Cpu className="w-3 h-3" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Core Neural Architecture</h3>
                        </div>
                        <p className="text-[10px] leading-relaxed">
                            MBTI Rizz AI leverages advanced Large Language Models (LLMs) tuned on social dynamics and Myers-Briggs Type Indicator (MBTI) psychology. Our algorithm analyzes chat screenshot contexts, detecting tone, intent, and personality indicators (ISTJ, ENFP, etc.) to generate high-conversion dating responses.
                        </p>
                    </div>

                    {/* Section 2: Platform Support */}
                    <div className="space-y-2">
                         <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Smartphone className="w-3 h-3" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Cross-Platform Protocols</h3>
                        </div>
                        <p className="text-[10px] leading-relaxed">
                            Optimized for major dating ecosystems including Tinder, Hinge, Bumble, and Instagram DMs. The system processes visual data (OCR) from screenshots to provide context-aware suggestions, functioning as a real-time digital wingman for both casual and serious relationship goals.
                        </p>
                    </div>

                    {/* Section 3: Privacy & Security */}
                    <div className="space-y-2">
                         <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <ShieldCheck className="w-3 h-3" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Privacy Standards</h3>
                        </div>
                        <p className="text-[10px] leading-relaxed">
                            Data processing occurs in ephemeral instances. Uploaded conversation screenshots are analyzed for semantic context and immediately discarded. User profiles and preference vectors are stored locally on the device to ensure maximum privacy and data sovereignty.
                        </p>
                    </div>

                    {/* Footer Copyright */}
                    <div className="text-[10px] text-center pt-4 border-t border-slate-800/50">
                        &copy; {new Date().getFullYear()} MBTI Rizz AI. Engineered for human connection.
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
