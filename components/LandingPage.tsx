
import React from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Heart, BrainCircuit, Users, Target, BookOpen, Star, Info, MessageCircle, BarChart3, HelpCircle, ShieldAlert, TrendingUp, Lightbulb, Compass, Award, MousePointer2, Smartphone, MessageSquareQuote, CheckCircle2, ShieldEllipsis, LockKeyhole, EyeOff, Scale, Mail } from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  language: Language;
}

// 🌐 MEGA MULTILINGUAL CONTENT DATABASE
const CONTENT: Record<string, any> = {
  ko: {
    hero_title_1: "SCREENSHOT",
    hero_title_2: "TO RIZZ AI",
    hero_sub_1: "대화 스크린샷 한 장으로 상대방의 속마음을 분석하고,",
    hero_sub_highlight: "가장 매력적인 답변",
    hero_sub_2: "을 제안받으세요.",
    hero_desc: "단순한 챗봇이 아닙니다. MBTI 심리학과 수백만 개의 성공적인 대화 데이터를 기반으로 한 진정한 인공지능 연애 윙맨입니다.",
    cta_primary: "지금 바로 대화 분석하기",
    badge_1: "회원가입 없음",
    badge_2: "스크린샷 즉시 분석",
    how_title: "How It Works",
    how_desc: "3단계면 당신도 매력적인 대화의 주인공이 될 수 있습니다.",
    step1_t: "1. 캡쳐 및 업로드",
    step1_d: "상대방과 나눈 대화 화면을 스크린샷으로 찍어 업로드하세요. 어떤 메신저든 상관없습니다.",
    step2_t: "2. AI 심리 분석",
    step2_d: "AI가 상대방의 문체, 이모지 사용 빈도, 답변 속도를 분석하여 MBTI 성향과 현재 호감도를 파악합니다.",
    step3_t: "3. 완벽한 답장 선택",
    step3_d: "분석 결과에 따른 3가지 맞춤형 답변 중 마음에 드는 것을 골라 복사해서 보내기만 하세요.",
    cta_step: "첫 대화 분석 시작하기",
    article1_t: "왜 텍스트 대화가 가장 어려울까요?",
    article1_p1: "현대인의 연애는 스마트폰 화면 속에서 시작되고 끝납니다. 하지만 텍스트는 목소리의 톤, 눈빛, 제스처와 같은 비언어적 요소를 모두 배제합니다. 이로 인해 사소한 단어 선택 하나가 오해를 부르기도 하고, 절호의 기회를 놓치게 만들기도 합니다.",
    article1_p2: "MBTI Rizz AI는 이 텍스트의 장벽을 허뭅니다. 인지 기능 분석 기술을 통해 텍스트 뒤에 숨겨진 상대방의 의도를 읽어냅니다. 상대방이 어떤 유형인지에 따라 우리가 건네야 할 첫마디는 완전히 달라져야 합니다.",
    article1_card_t: "데이터가 증명하는 매력",
    article1_card_p: "심리학 데이터에 따르면, 자신의 성격 유형에 맞춘 언어 패턴을 사용하는 대화 상대에게 인간은 본능적으로 2.8배 높은 신뢰감과 호기심을 느낍니다.",
    mbti_title: "MBTI 유형별 필승 대화 전략",
    mbti_desc: "AI가 제안하는 유형별 커뮤니케이션 가이드",
    group_nt: "분석가형 (NT)",
    intj_t: "INTJ - 전략적인 건축가",
    intj_d: "지적인 효율성을 중시합니다. 의미 없는 안부보다는 흥미로운 주제나 전문적인 견해를 묻는 대화가 효과적입니다.",
    intp_t: "INTP - 논리적인 사색가",
    intp_d: "가설과 이론의 세계에 삽니다. 엉뚱하고 철학적인 질문에 가장 큰 흥미를 느낍니다.",
    group_nf: "외교관형 (NF)",
    infj_t: "INFJ - 선의의 옹호자",
    infj_d: "가장 깊은 교감을 원합니다. 피상적인 대화보다는 진정성 있는 고민을 나누어 보세요.",
    enfp_t: "ENFP - 재기발랄한 활동가",
    enfp_d: "에너지가 넘치고 호기심이 많습니다. 예측 불가능한 주제로 대화를 이끄세요.",
    faq_t: "자주 묻는 질문 (FAQ)",
    faq1_q: "정말 스크린샷만으로 분석이 가능한가요?",
    faq1_a: "네, 저희 비전 AI 모델은 대화창의 레이아웃을 인식하고 텍스트를 추출하여 문맥을 파악합니다.",
    faq2_q: "추천 답변이 너무 인위적이지 않을까요?",
    faq2_a: "걱정 마세요. AI는 당신의 평소 말투와 설정하신 분위기에 맞춰 가장 자연스러운 어휘를 선택합니다.",
    legal_title: "개인정보 보호 및 법적 고지",
    legal_privacy_t: "개인정보 처리방침",
    legal_privacy_d: "저희는 사용자의 사생활을 최우선으로 합니다. 업로드된 모든 스크린샷은 분석 즉시 서버에서 영구 삭제됩니다. 어떠한 대화 내용도 수집하거나 저장하지 않습니다.",
    legal_terms_t: "서비스 이용약관",
    legal_terms_d: "본 서비스는 정보 제공 및 오락을 목적으로 합니다. AI의 답변이 실제 인간 관계의 성공을 보장하지 않으며, 모든 대화의 책임은 사용자 본인에게 있습니다.",
    legal_ai_t: "AI 윤리 가이드",
    legal_ai_d: "타인을 기만하거나 해를 끼치는 목적으로의 사용을 엄격히 금지합니다. 건강하고 진정성 있는 소통을 지향합니다.",
    legal_view_all: "모든 법적 약관 상세히 보기",
    final_t: "읽기만 하지 말고 직접 경험해보세요.",
    final_p: "지금 첫 대화 분석은 완전 무료입니다. 당신의 잠재된 매력을 깨워보세요.",
    final_btn: "무료 분석 시작하기",
    footer_desc: "Interlight Lab은 AI 기술을 통해 현대인의 건강한 인간관계와 소통을 돕는 연구소입니다.",
    footer_privacy: "개인정보 처리방침",
    footer_terms: "이용약관",
    footer_contact: "고객지원"
  },
  en: {
    hero_title_1: "SCREENSHOT",
    hero_title_2: "TO RIZZ AI",
    hero_sub_1: "Analyze the subtext from a single screenshot and",
    hero_sub_highlight: "get the perfect reply",
    hero_sub_2: "instantly.",
    hero_desc: "This isn't just a chatbot. It's a true AI dating wingman built on MBTI psychology and millions of successful conversation data points.",
    cta_primary: "Analyze Conversation Now",
    badge_1: "No Sign-up Required",
    badge_2: "Instant AI Analysis",
    how_title: "How It Works",
    how_desc: "Become a master of charm in just 3 simple steps.",
    step1_t: "1. Capture & Upload",
    step1_d: "Take a screenshot of your chat and upload it. Works with any messenger or dating app.",
    step2_t: "2. AI Psychological Analysis",
    step2_d: "AI analyzes the tone, emoji usage, and response speed to determine personality and attraction levels.",
    step3_t: "3. Choose the Perfect Reply",
    step3_d: "Pick your favorite from 3 tailored responses and simply copy-paste to your crush.",
    cta_step: "Start Your First Analysis",
    article1_t: "Why is texting so difficult?",
    article1_p1: "Modern romance begins and ends on a smartphone screen. But text lacks tone, eye contact, and gestures. This often leads to misunderstandings and missed opportunities.",
    article1_p2: "MBTI Rizz AI breaks this barrier. Our Cognitive Function Analysis deciphers the intent behind every word. Depending on their type, your first message should be fundamentally different.",
    article1_card_t: "Charisma backed by Data",
    article1_card_p: "Psychological data shows that people feel 2.8x higher trust and curiosity toward partners who match their linguistic patterns.",
    mbti_title: "MBTI Dating Strategies",
    mbti_desc: "AI-powered communication guides for every personality type",
    group_nt: "The Analysts (NT)",
    intj_t: "INTJ - The Strategic Architect",
    intj_d: "They value efficiency. Focus on deep topics or professional insights rather than small talk.",
    intp_t: "INTP - The Logical Innovator",
    intp_d: "They live in a world of theory. Engaging them with quirky, philosophical questions works best.",
    faq_t: "Frequently Asked Questions",
    faq1_q: "Can it really analyze just from a screenshot?",
    faq1_a: "Yes, our Vision AI recognizes the layout, extracts text, and understands the context with high precision.",
    faq2_q: "Won't the replies sound artificial?",
    faq2_a: "Not at all. The AI adapts to your natural tone and chosen vibe for a seamless, organic feel.",
    legal_title: "Privacy & Legal Transparency",
    legal_privacy_t: "Privacy Policy",
    legal_privacy_d: "Your privacy is our priority. Uploaded screenshots are analyzed in memory and permanently deleted immediately after. We never store your personal conversations.",
    legal_terms_t: "Terms of Service",
    legal_terms_d: "This service is for entertainment and informational purposes. AI suggestions are provided 'as is' and the user holds full responsibility for their social interactions.",
    legal_ai_t: "Ethical AI Usage",
    legal_ai_d: "We prohibit the use of this tool for deceptive or harmful purposes. We promote authentic and respectful communication.",
    legal_view_all: "View all legal terms in detail",
    final_t: "Stop reading and start rizzing.",
    final_p: "Your first analysis is completely free. Unlock your hidden social potential today.",
    final_btn: "Start Analysis for Free",
    footer_desc: "Interlight Lab is a research studio dedicated to enhancing human connection and communication through AI technology.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_contact: "Contact Support"
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenLegal, language }) => {
  const t = CONTENT[language] || CONTENT['en'];

  return (
    <div className="h-full w-full bg-[#020617] text-white overflow-y-auto scrollbar-hide relative font-sans selection:bg-purple-500/30">
        
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Hero Section */}
        <header className="relative z-10 px-6 pt-28 pb-20 flex flex-col items-center text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl shadow-purple-500/10">
                <Sparkles className="w-3 h-3" /> #1 AI Conversation Analyzer
            </div>
            
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic">{t.hero_title_1}</h1>
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tighter leading-[0.8]">{t.hero_title_2}</h1>
            </div>

            <div className="max-w-xl space-y-4">
                <p className="text-slate-200 text-xl md:text-2xl font-bold leading-tight">
                    {t.hero_sub_1}<br/>
                    <span className="text-purple-400">{t.hero_sub_highlight}</span>{t.hero_sub_2}
                </p>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    {t.hero_desc}
                </p>
            </div>

            <div className="flex flex-col w-full items-center gap-6">
                <button 
                    onClick={onStart}
                    className="group relative w-full max-w-xs bg-white text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-95 shadow-[0_25px_60px_rgba(255,255,255,0.15)]"
                >
                    {t.cta_primary}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> {t.badge_1}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> {t.badge_2}</span>
                </div>
            </div>
        </header>

        {/* Process Section */}
        <section className="relative z-10 px-6 py-24 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t.how_title}</h2>
                    <p className="text-slate-400 text-sm">{t.how_desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-20 h-20 bg-slate-800 rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors shadow-2xl">
                            <Smartphone className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="font-black text-lg">{t.step1_t}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.step1_d}</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-20 h-20 bg-slate-800 rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:border-pink-500/50 transition-colors shadow-2xl">
                            <BrainCircuit className="w-10 h-10 text-pink-400" />
                        </div>
                        <h3 className="font-black text-lg">{t.step2_t}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.step2_d}</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-20 h-20 bg-slate-800 rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors shadow-2xl">
                            <MessageSquareQuote className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="font-black text-lg">{t.step3_t}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.step3_d}</p>
                    </div>
                </div>

                <div className="pt-8 flex justify-center">
                    <button 
                        onClick={onStart}
                        className="px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-full transition-all active:scale-95 shadow-xl shadow-purple-900/40 flex items-center gap-3"
                    >
                        {t.cta_step} <MousePointer2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>

        {/* 📚 MEGA KNOWLEDGE BASE */}
        <article className="relative z-10 px-6 py-20 space-y-32 bg-gradient-to-b from-transparent via-black/40 to-black/80">
            
            {/* Psychological Foundation Section */}
            <section className="space-y-10 max-w-3xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-purple-500/10 rounded-3xl text-purple-400">
                        <TrendingUp className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight leading-none text-center">{t.article1_t}</h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-400 leading-relaxed text-sm">
                    <div className="space-y-4">
                        <p className="first-letter:text-5xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:float-left">
                            {t.article1_p1}
                        </p>
                        <p>
                            {t.article1_p2}
                        </p>
                    </div>
                    <div className="space-y-4 bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 italic">
                        <h4 className="text-white font-bold not-italic flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {t.article1_card_t}
                        </h4>
                        <p>
                            {t.article1_card_p}
                        </p>
                    </div>
                </div>
            </section>

            {/* ⚖️ LEGAL & PRIVACY TRANSPARENCY SECTION */}
            <section className="space-y-16 border-t border-white/10 pt-20">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 border border-white/10 shadow-lg">
                        <ShieldEllipsis className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight">{t.legal_title}</h2>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto">우리는 기술의 힘만큼 윤리와 투명성을 중요하게 생각합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 space-y-4 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-3 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                            <LockKeyhole className="w-4 h-4" /> {t.legal_privacy_t}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.legal_privacy_d}</p>
                    </div>
                    
                    <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 space-y-4 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                            <Scale className="w-4 h-4" /> {t.legal_terms_t}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.legal_terms_d}</p>
                    </div>

                    <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 space-y-4 hover:border-green-500/30 transition-all">
                        <div className="flex items-center gap-3 text-green-400 font-bold uppercase tracking-widest text-[10px]">
                            <EyeOff className="w-4 h-4" /> {t.legal_ai_t}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.legal_ai_d}</p>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <button 
                        onClick={() => onOpenLegal('privacy')}
                        className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                    >
                        {t.legal_view_all} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black tracking-tight">{t.faq_t}</h2>
                    <div className="hidden md:block h-px bg-white/10 flex-1 ml-10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="group space-y-3 p-8 rounded-[30px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors">
                        <h4 className="font-bold text-white flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                            <Info className="w-5 h-5" /> {t.faq1_q}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.faq1_a}</p>
                    </div>
                    <div className="group space-y-3 p-8 rounded-[30px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors">
                        <h4 className="font-bold text-white flex items-center gap-2 group-hover:text-pink-400 transition-colors">
                            <Lightbulb className="w-5 h-5" /> {t.faq2_q}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.faq2_a}</p>
                    </div>
                </div>
            </section>

        </article>

        {/* 🏢 MEGA FOOTER (AD SENSE COMPLIANCE) */}
        <footer className="relative z-10 px-6 pb-20 pt-24 border-t border-white/5 bg-black/80">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* 1. Brand Section */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter italic">MBTI RIZZ AI</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                        {t.footer_desc}
                    </p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <a href="mailto:interlightlab@gmail.com" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* 2. Navigation Section */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Navigation</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-300">
                        <li><button onClick={onStart} className="hover:text-purple-400 transition-colors">Get Started</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-purple-400 transition-colors">Back to Top</button></li>
                    </ul>
                </div>

                {/* 3. Legal Section (Critical for AdSense) */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Documents</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-300">
                        <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-purple-400 transition-colors">{t.footer_privacy}</button></li>
                        <li><button onClick={() => onOpenLegal('terms')} className="hover:text-purple-400 transition-colors">{t.footer_terms}</button></li>
                        <li><a href="mailto:interlightlab@gmail.com" className="hover:text-purple-400 transition-colors">{t.footer_contact}</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="max-w-6xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    © 2025 Interlight Lab • All Rights Reserved
                </p>
                <div className="flex items-center gap-6 text-[10px] text-slate-600 font-bold uppercase">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> GDPR Compliant</span>
                    <span className="flex items-center gap-1"><LockKeyhole className="w-3 h-3" /> SSL Secured</span>
                </div>
            </div>
        </footer>
    </div>
  );
};
