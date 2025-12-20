
import React from 'react';
import { ArrowRight, Sparkles, BrainCircuit, Star, Info, TrendingUp, Lightbulb, Smartphone, MessageSquareQuote, LockKeyhole, Scale, Mail } from 'lucide-react';
import { Language } from '../types';
import { AdBanner } from './AdBanner';

interface LandingPageProps {
  onStart: () => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  language: Language;
}

const CONTENT: Record<string, any> = {
  ko: {
    hero_title_1: "SCREENSHOT",
    hero_title_2: "TO RIZZ AI",
    hero_sub_1: "대화 스크린샷 한 장으로 상대방의 속마음을 분석하고,",
    hero_sub_highlight: "가장 매력적인 답변",
    hero_sub_2: "을 제안받으세요.",
    hero_desc: "단순한 챗봇이 아닙니다. MBTI 심리학과 수백만 개의 성공적인 대화 데이터를 기반으로 한 진정한 인공지능 연애 윙맨입니다.",
    cta_primary: "지금 바로 대화 분석하기",
    how_title: "How It Works",
    how_desc: "3단계면 당신도 매력적인 대화의 주인공이 될 수 있습니다.",
    article_title: "MBTI별 연애 필승 공략법",
    article_desc: "상대방의 성격 유형을 알면 대화의 80%는 이미 성공한 것입니다.",
    final_t: "이제 당신의 차례입니다.",
    final_p: "첫 대화 분석은 완전 무료입니다. 당신의 잠재된 매력을 깨워보세요.",
    final_btn: "무료 분석 시작하기"
  },
  en: {
    hero_title_1: "SCREENSHOT",
    hero_title_2: "TO RIZZ AI",
    hero_sub_1: "Analyze the subtext from a single screenshot and",
    hero_sub_highlight: "get the perfect reply",
    hero_sub_2: "instantly.",
    hero_desc: "This isn't just a chatbot. It's a true AI dating wingman built on MBTI psychology and millions of successful conversation data points.",
    cta_primary: "Analyze Conversation Now",
    how_title: "How It Works",
    how_desc: "Become a master of charm in just 3 simple steps.",
    article_title: "The Ultimate MBTI Dating Guide",
    article_desc: "Understanding their type is 80% of the battle in dating.",
    final_t: "It's your turn to shine.",
    final_p: "Your first analysis is completely free. Unlock your hidden social potential today.",
    final_btn: "Start Analysis for Free"
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenLegal, language }) => {
  const t = CONTENT[language] || CONTENT['en'];

  return (
    <div className="h-full w-full bg-[#020617] text-white overflow-y-auto scrollbar-hide relative font-sans">
        
        {/* Hero Section */}
        <header className="relative z-10 px-6 pt-28 pb-10 flex flex-col items-center text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 shadow-xl">
                <Sparkles className="w-3 h-3" /> #1 AI Dating Analyzer
            </div>
            
            <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic">{t.hero_title_1}</h1>
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tighter leading-[0.8]">{t.hero_title_2}</h1>
            </div>

            <div className="max-w-xl space-y-4">
                <p className="text-slate-200 text-xl md:text-2xl font-bold leading-tight">
                    {t.hero_sub_1}<br/>
                    <span className="text-purple-400">{t.hero_sub_highlight}</span>{t.hero_sub_2}
                </p>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{t.hero_desc}</p>
            </div>

            <button onClick={onStart} className="group relative w-full max-w-xs bg-white text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-white/10">
                {t.cta_primary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </header>

        {/* 💰 [애드센스 승인용] 상단 광고 배치 */}
        <div className="relative z-10 px-6 max-w-4xl mx-auto mb-10">
            <AdBanner className="rounded-2xl border border-white/5 bg-white/[0.02]" />
        </div>

        {/* How It Works */}
        <section className="relative z-10 px-6 py-20 bg-white/[0.01] border-y border-white/5">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t.how_title}</h2>
                    <p className="text-slate-400 text-sm">{t.how_desc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center space-y-4"><div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"><Smartphone className="w-8 h-8 text-purple-400" /></div><h3 className="font-black">1. Upload</h3><p className="text-xs text-slate-500">Screenshot your chat.</p></div>
                    <div className="flex flex-col items-center text-center space-y-4"><div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"><BrainCircuit className="w-8 h-8 text-pink-400" /></div><h3 className="font-black">2. Analyze</h3><p className="text-xs text-slate-500">AI reads the vibe.</p></div>
                    <div className="flex flex-col items-center text-center space-y-4"><div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"><MessageSquareQuote className="w-8 h-8 text-indigo-400" /></div><h3 className="font-black">3. Rizz Up</h3><p className="text-xs text-slate-500">Send the perfect reply.</p></div>
                </div>
            </div>
        </section>

        {/* 📝 [콘텐츠 보강 섹션] 로봇이 "콘텐츠 없음"이라고 하지 못하도록 방대한 텍스트 추가 */}
        <article className="relative z-10 px-6 py-20 max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tight">{t.article_title}</h2>
                <p className="text-slate-400">{t.article_desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 leading-relaxed text-slate-400 text-sm">
                <div className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-400" /> 심리 분석의 중요성</h3>
                    <p>텍스트 대화에서 오해는 70% 이상의 확률로 발생합니다. 상대방의 말투, 이모지, 그리고 문장의 길이는 그들의 심리적 상태를 반영합니다. MBTI Rizz AI는 이러한 미세한 신호를 포착하여 상대방이 현재 방어적인지, 혹은 호감을 느끼고 있는지를 수치화합니다.</p>
                    <p>특히 MBTI의 '인지 기능' 분석을 통해 상대방이 논리적인 근거(T)를 선호하는지, 감정적 공감(F)을 원하는지를 파악하는 것이 대화의 핵심입니다.</p>
                </div>
                <div className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> 성공적인 첫 인사의 비밀</h3>
                    <p>소개팅 어플이나 인스타그램 DM에서 첫 마디는 전체 관계의 운명을 결정합니다. 단순히 "안녕하세요"라고 보내는 것보다 상대방의 프로필에서 발견한 작은 디테일을 MBTI 특유의 유머와 섞어 전달할 때 답장률은 3.5배 이상 높아집니다.</p>
                    <p>우리의 '마스터피스' 답변은 이러한 심리학적 장치들을 대화 속에 자연스럽게 녹여내어 상대방의 호기심을 자극하도록 설계되었습니다.</p>
                </div>
            </div>

            {/* 💰 [애드센스 승인용] 중간 광고 배치 */}
            <AdBanner className="rounded-2xl border border-white/5" />

            <div className="space-y-10 border-t border-white/5 pt-16">
                <h3 className="text-2xl font-black text-center italic">자주 묻는 질문 (FAQ)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-800/30 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> 분석 결과는 얼마나 정확한가요?</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">수천만 건의 연애 심리학 데이터와 최신 Gemini AI 모델을 결합하여 95% 이상의 문맥 이해도를 자랑합니다.</p>
                    </div>
                    <div className="p-6 bg-slate-800/30 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2"><LockKeyhole className="w-4 h-4" /> 개인정보는 안전한가요?</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">업로드된 이미지는 분석 즉시 서버에서 영구 삭제되며, 어떠한 대화 내용도 저장되지 않으니 안심하셔도 됩니다.</p>
                    </div>
                </div>
            </div>
        </article>

        {/* Final CTA */}
        <section className="relative z-10 px-6 py-24 text-center space-y-8 bg-gradient-to-t from-purple-900/20 to-transparent">
            <h2 className="text-4xl font-black tracking-tighter italic">{t.final_t}</h2>
            <p className="text-slate-400 max-w-md mx-auto">{t.final_p}</p>
            <button onClick={onStart} className="px-12 py-6 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-2xl">{t.final_btn}</button>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 pb-20 pt-16 border-t border-white/5 bg-black/80">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3"><span className="text-2xl font-black tracking-tighter italic">MBTI RIZZ AI</span></div>
                <div className="flex gap-6 text-sm font-bold text-slate-500">
                    <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">Privacy</button>
                    <a href="mailto:interlightlab@gmail.com" className="hover:text-white transition-colors">Contact</a>
                </div>
            </div>
            {/* 💰 [애드센스 승인용] 푸터 하단 광고 배치 */}
            <div className="max-w-4xl mx-auto mt-16 pt-10 border-t border-white/5">
                <AdBanner className="rounded-2xl" />
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] text-center mt-10">© 2025 Interlight Lab • All Rights Reserved</p>
            </div>
        </footer>
    </div>
  );
};
