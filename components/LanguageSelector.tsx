
import React from 'react';
import { Language } from '../types';
import { PlusSquare, Zap, BrainCircuit, ShieldCheck, FileText, Sparkles, Heart, MessageCircle, ChevronDown } from 'lucide-react';

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
                    <div className="relative w-28 h-28 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5">
                         {/* Custom SVG mirroring the App Icon */}
                         <svg width="64" height="64" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                             <defs>
                                <linearGradient id="textGradInline" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#c084fc"/>
                                    <stop offset="50%" stopColor="#f472b6"/>
                                    <stop offset="100%" stopColor="#818cf8"/>
                                </linearGradient>
                             </defs>
                             {/* Dark Bubble Body - Synced exactly with icon.svg (stroke 12, opacity 0.15) */}
                             <path fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="12" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/>
                             {/* Gradient Text */}
                             <text x="256" y="285" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="130" fill="url(#textGradInline)" letterSpacing="-4">MBTI</text>
                         </svg>
                         
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

            {/* ========================================================================================= */}
            {/* 📝 VISIBLE CONTENT FOR ADSENSE APPROVAL (Valuable Inventory) */}
            {/* ========================================================================================= */}
            <article className="w-full mt-12 space-y-12 pb-10">
                
                {/* Section 1: Introduction */}
                <section className="text-center space-y-4 px-2">
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">The Science</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">
                        Why use AI for Dating?
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed text-left bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                        Modern dating is complex. <strong>MBTI Rizz AI</strong> leverages advanced Large Language Models (LLMs) and Myers-Briggs Type Indicator (MBTI) psychology to help you craft the perfect response. Whether you are talking to an Introvert (I) who needs space, or an Extrovert (E) who loves excitement, our AI tailors every word to resonate with their specific personality traits.
                    </p>
                </section>

                {/* Section 2: Features Grid */}
                <section className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 flex gap-4 items-start">
                        <div className="p-3 bg-pink-500/10 rounded-xl shrink-0">
                            <Heart className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Emotional Intelligence</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Our Neural Engine detects emotional undertones in chat screenshots. It identifies if your partner is being flirtatious, distant, or sarcastic, and suggests the optimal tone for your reply.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 flex gap-4 items-start">
                        <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                            <MessageCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Context Awareness</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Unlike generic chatbots, MBTI Rizz AI understands the visual context of your conversation. Upload screenshots from Tinder, Hinge, Instagram, or iMessage, and let the AI analyze the full dialogue history.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: MBTI Guide (Long Text for Crawler) */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-100 px-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Mastering the MBTI Types
                    </h2>
                    <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-purple-300 mb-2">For Analysts (INTJ, INTP, ENTJ, ENTP)</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                These types value logic and intellect. Avoid small talk. Instead, challenge them with witty banter, interesting facts, or deep questions about their goals. Our AI generates "Intellectual" responses specifically for this group.
                            </p>
                        </div>
                        <hr className="border-white/5" />
                        <div>
                            <h3 className="text-sm font-bold text-green-300 mb-2">For Diplomats (INFJ, INFP, ENFJ, ENFP)</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Connection and authenticity are key. They want to feel understood. Use our "Sweet" or "Deep" vibe settings to create replies that show empathy and emotional depth.
                            </p>
                        </div>
                        <hr className="border-white/5" />
                        <div>
                            <h3 className="text-sm font-bold text-blue-300 mb-2">For Sentinels (ISTJ, ISFJ, ESTJ, ESFJ)</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                They appreciate reliability and tradition. Be clear, direct, and respectful. The "Polite" mode in our app is perfect for making a good first impression with these stable personality types.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Privacy & Safety */}
                <section className="bg-slate-800/50 rounded-2xl p-6 text-center space-y-3 border border-white/5">
                    <ShieldCheck className="w-8 h-8 text-green-400 mx-auto" />
                    <h3 className="font-bold text-white">Your Privacy Matters</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        We believe in complete anonymity. Your chat screenshots are processed in real-time and are <strong>never stored</strong> on our servers. The analysis happens in a transient state, ensuring your private conversations remain private.
                    </p>
                </section>

                {/* Footer Links (Ads Compliance) */}
                {onOpenLegal && (
                    <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-6">
                            <button onClick={() => onOpenLegal('privacy')} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Privacy Policy
                            </button>
                            <button onClick={() => onOpenLegal('terms')} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Terms of Service
                            </button>
                        </div>
                        <div className="text-[10px] text-slate-600">
                            © 2025 Interlight Lab. All rights reserved.<br/>
                            MBTI® is a registered trademark of the Myers-Briggs Type Indicator Foundation.
                            <br/>This app is not affiliated with the MBTI Foundation.
                        </div>
                    </div>
                )}
            </article>

        </div>
    </div>
  );
};
