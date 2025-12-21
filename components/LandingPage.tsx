
import React from 'react';
import { 
  ArrowRight, Sparkles, BrainCircuit, Star, Zap, 
  ShieldCheck, UserCheck, HelpCircle, Target, 
  MessageCircle, BarChart3, Users, MousePointer2,
  Heart
} from 'lucide-react';
import { Language } from '../types';
import { AdBanner } from './AdBanner';

interface LandingPageProps {
  onStart: () => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  language: Language;
}

const CONTENT: Record<string, any> = {
  ko: {
    hero_tag: "AI 기반 커뮤니케이션 코치",
    hero_title_1: "ADVANCED",
    hero_title_2: "SOCIAL AI",
    hero_sub_highlight: "심리학 기반 대화 분석",
    hero_desc: "단순한 답장 생성이 아닙니다. Google AI가 텍스트의 맥락, 상대방의 성향, 비언어적 신호를 분석하여 관계 발전을 위한 최적의 커뮤니케이션 전략을 제안합니다.",
    cta_primary: "무료 분석 시작하기",

    // 가치 제안 (Value Prop) - 신뢰성 강조
    value_t: "과학적인 대화 분석 솔루션",
    v1_t: "성격 유형 심리학",
    v1_d: "MBTI 이론과 행동 심리학 데이터를 기반으로 상대방이 선호하는 대화 스타일과 인지 패턴을 분석합니다.",
    v2_t: "객관적 데이터 분석",
    v2_d: "감에 의존하는 것이 아니라, 텍스트 길이, 반응 속도, 키워드 감정을 분석하여 객관적인 '호감도 지표'를 제공합니다.",
    v3_t: "상황별 맞춤 전략",
    v3_d: "단순한 유머부터 진지한 관계 회복까지, 사용자의 목적에 맞는 3가지 톤(Tone)의 답변을 생성합니다.",

    // 시나리오
    scenario_t: "다양한 소셜 상황 대응",
    scenario_d: "MBTI Rizz AI는 데이팅부터 네트워킹까지 다양한 대화 상황에서 조력자가 됩니다.",
    sc1_t: "데이팅 앱 & 소개팅",
    sc1_d: "첫인상이 중요한 순간, 상대방의 프로필 정보를 바탕으로 공통사를 찾아내고 자연스러운 대화를 유도합니다.",
    sc2_t: "썸 & 관계 발전",
    sc2_d: "대화가 끊기지 않도록 상대방의 흥미를 유발하는 질문과 공감 멘트를 심리학적으로 설계합니다.",
    sc3_t: "갈등 해결 & 오해 풀기",
    sc3_d: "텍스트로 인해 발생한 오해를 줄이고, 정중하고 논리적인 표현으로 관계를 회복하는 메시지를 작성합니다.",

    // 기술적 원리 (Truthful)
    logic_t: "Google AI 분석 프로세스",
    logic_d: "업로드된 이미지는 최신 Vision AI 기술을 통해 텍스트 데이터로 변환되어 분석됩니다.",
    l1: "Context Extraction: 대화의 전체적인 맥락과 흐름 파악",
    l2: "Sentiment Analysis: 단어에 담긴 긍정/부정 감정선 추출",
    l3: "Personality Matching: 언어 패턴을 통한 성격 유형(MBTI) 추론",
    l4: "Draft Generation: 목적에 부합하는 최적의 답변 후보 생성",
    l5: "Safety Check: 부적절한 표현 필터링 및 윤리적 검토",

    // 블로그/아티클 섹션 (Authoritative)
    blog_title: "효과적인 소통의 과학",
    blog_p1: "디지털 커뮤니케이션에서 발생하는 오해의 대부분은 '맥락'의 부재에서 옵니다. 텍스트만으로는 전달되지 않는 감정과 의도를 파악하는 것이 성공적인 대화의 핵심입니다.",
    blog_p2: "MBTI Rizz AI는 수백만 건의 대화 데이터를 학습한 Google의 대규모 언어 모델을 활용하여, 상대방이 심리적으로 편안함을 느끼고 긍정적으로 반응할 수 있는 언어적 장치를 제안합니다. 이는 단순한 기술이 아닌, 사람을 이해하는 도구입니다.",
    
    // 통계 (Verifiable/General)
    stat_1: "Training Data",
    stat_1_desc: "Millions of sets",
    stat_2: "Analysis Speed",
    stat_2_desc: "Real-time Processing",
    stat_3: "Availability",
    stat_3_desc: "24/7 AI Access",
    stat_4: "Global Support",
    stat_4_desc: "Multi-language",

    faq_t: "자주 묻는 질문",
    q1: "이 앱은 어떤 기술을 사용하나요?",
    a1: "Google의 최신 AI 모델을 사용하여 이미지 속 텍스트를 인식(OCR)하고, 자연어 처리(NLP) 기술로 맥락을 분석합니다.",
    q2: "내 대화 내용이 안전한가요?",
    a2: "네, 강력한 개인정보 보호 정책을 따릅니다. 분석을 위해 업로드된 이미지는 휘발성 메모리에서 처리된 후 즉시 삭제되며 서버에 저장되지 않습니다.",

    final_t: "더 나은 대화를 시작하세요.",
    final_btn: "지금 분석 시작하기"
  },
  en: {
    hero_tag: "AI Communication Coach",
    hero_title_1: "ADVANCED",
    hero_title_2: "SOCIAL AI",
    hero_sub_highlight: "Psychology-Based Analysis",
    hero_desc: "More than just a reply generator. Powered by Google AI, we analyze context, personality tones, and non-verbal cues to suggest the optimal communication strategy for building relationships.",
    cta_primary: "Start Free Analysis",

    value_t: "Scientific Approach to Chat",
    v1_t: "Personality Psychology",
    v1_d: "Based on MBTI theories and behavioral data, we analyze the preferred communication styles and cognitive patterns of your partner.",
    v2_t: "Data-Driven Insights",
    v2_d: "Move beyond guesswork. We provide objective 'interest metrics' by analyzing response latency, text length, and keyword sentiment.",
    v3_t: "Tailored Strategies",
    v3_d: "From witty banter to sincere conflict resolution, get 3 distinct reply options tailored to your specific relationship goals.",

    scenario_t: "For Every Social Scenario",
    scenario_d: "MBTI Rizz AI acts as your assistant across various social contexts, from dating to networking.",
    sc1_t: "Dating Apps & Icebreakers",
    sc1_d: "First impressions matter. We help you identify common interests from profiles and craft natural, engaging openers.",
    sc2_t: "Building Connections",
    sc2_d: "Keep the conversation flowing with psychologically designed questions and empathetic responses that spark interest.",
    sc3_t: "Conflict Resolution",
    sc3_d: "Minimize misunderstandings caused by text. We help draft polite, logical, and sincere messages to restore relationships.",

    logic_t: "Powered by Google AI",
    logic_d: "Uploaded images are processed using state-of-the-art Vision AI to extract and analyze text data.",
    l1: "Context Extraction: Understanding the overall flow of conversation.",
    l2: "Sentiment Analysis: Extracting positive/negative emotional cues.",
    l3: "Personality Matching: Inferring MBTI types through linguistic patterns.",
    l4: "Draft Generation: Creating optimal reply candidates for your goal.",
    l5: "Safety Check: Filtering inappropriate content and ethical review.",

    blog_title: "The Science of Connection",
    blog_p1: "Most misunderstandings in digital communication stem from a lack of 'context'. Understanding the emotions and intentions behind the text is key to successful interaction.",
    blog_p2: "MBTI Rizz AI utilizes Google's Large Language Models, trained on millions of conversation datasets, to suggest linguistic triggers that make your partner feel psychologically safe and engaged. It's not just tech; it's a tool for understanding people.",

    stat_1: "Training Data",
    stat_1_desc: "Millions of Points",
    stat_2: "Analysis Speed",
    stat_2_desc: "Real-time Processing",
    stat_3: "Availability",
    stat_3_desc: "24/7 AI Access",
    stat_4: "Global Support",
    stat_4_desc: "Multi-language",

    faq_t: "Frequently Asked Questions",
    q1: "What technology is used?",
    a1: "We use Google's advanced AI models to recognize text in images (OCR) and analyze context using Natural Language Processing (NLP).",
    q2: "Is my data safe?",
    a2: "Yes, we adhere to strict privacy policies. Images uploaded for analysis are processed in volatile memory and deleted immediately. They are never stored on our servers.",

    final_t: "Upgrade Your Social Skills.",
    final_btn: "Start Analysis Now"
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenLegal, language }) => {
  const t = CONTENT[language] || CONTENT['en'];

  return (
    <div className="h-full w-full bg-[#020617] text-white overflow-y-auto scrollbar-hide relative font-sans selection:bg-purple-500/30">
        
        {/* 🔥 Hero Section - Focus on Educational/Tool Value */}
        <header className="relative z-10 px-6 pt-32 pb-24 flex flex-col items-center text-center space-y-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-purple-400 animate-pulse shadow-2xl">
                <Sparkles className="w-4 h-4" /> {t.hero_tag}
            </div>
            
            <div className="space-y-6">
                <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter italic leading-none text-slate-100">{t.hero_title_1}</h1>
                <h1 className="text-6xl md:text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tighter leading-none">{t.hero_title_2}</h1>
            </div>

            <div className="max-w-3xl space-y-10">
                <p className="text-slate-200 text-2xl md:text-4xl font-bold leading-tight">
                    {language === 'ko' ? "스크린샷 분석을 통한" : "Optimize your chat with"} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 underline decoration-pink-500/30 underline-offset-[12px]">{t.hero_sub_highlight}</span>
                </p>
                <p className="text-slate-400 text-base md:text-lg px-8 leading-relaxed font-medium max-w-2xl mx-auto">
                    {t.hero_desc}
                </p>
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <button onClick={onStart} className="group relative w-full bg-white text-black font-black py-8 rounded-[40px] flex items-center justify-center gap-4 active:scale-95 shadow-[0_20px_100px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_20px_100px_rgba(168,85,247,0.4)] hover:-translate-y-2 text-xl md:text-2xl">
                    {t.cta_primary} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                    <MousePointer2 className="w-3 h-3" /> Try it now for free
                </p>
            </div>
        </header>

        {/* 💡 Ad Slot 1 - Top Position for Visibility */}
        <div className="px-6 max-w-3xl mx-auto mb-32">
            <AdBanner className="rounded-[32px]" />
        </div>

        {/* 🚀 Feature Value Cards - Educational Focus */}
        <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-[#020617] to-slate-950">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                     <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">{t.value_t}</h2>
                     <div className="w-20 h-1.5 bg-purple-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <BrainCircuit className="text-purple-400" />, t: t.v1_t, d: t.v1_d },
                        { icon: <BarChart3 className="text-pink-400" />, t: t.v2_t, d: t.v2_d },
                        { icon: <Target className="text-yellow-400" />, t: t.v3_t, d: t.v3_d }
                    ].map((v, i) => (
                        <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] space-y-5 hover:bg-white/[0.05] transition-colors shadow-xl">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-inner border border-white/5">{v.icon}</div>
                            <h3 className="text-xl font-bold text-slate-100">{v.t}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{v.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 📱 Scenarios - Usage Context */}
        <section className="relative z-10 px-6 py-32 border-y border-white/5 bg-white/[0.01]">
            <div className="max-w-6xl mx-auto space-y-20">
                <div className="text-center space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-200">{t.scenario_t}</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.scenario_d}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Heart className="w-8 h-8" />, t: t.sc1_t, d: t.sc1_d, color: "from-pink-500/20 to-rose-600/20", border: "border-pink-500/30" },
                        { icon: <MessageCircle className="w-8 h-8" />, t: t.sc2_t, d: t.sc2_d, color: "from-purple-500/20 to-indigo-600/20", border: "border-purple-500/30" },
                        { icon: <Users className="w-8 h-8" />, t: t.sc3_t, d: t.sc3_d, color: "from-blue-500/20 to-cyan-600/20", border: "border-blue-500/30" }
                    ].map((item, i) => (
                        <div key={i} className={`group p-8 bg-gradient-to-br ${item.color} border ${item.border} rounded-[48px] space-y-6 hover:-translate-y-2 transition-transform`}>
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg text-white">{item.icon}</div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black italic text-white">{item.t}</h3>
                                <p className="text-slate-300 leading-relaxed text-sm font-medium">{item.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 📊 Analysis Logic - Technical Transparency */}
        <section className="relative z-10 px-6 py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                    <div className="inline-flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full">
                        <Zap className="w-3 h-3" /> Technical Architecture
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none">{t.logic_t}</h2>
                    <p className="text-slate-400 text-lg font-medium">{t.logic_d}</p>
                    
                    <div className="space-y-4">
                        {[t.l1, t.l2, t.l3, t.l4, t.l5].map((text, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-slate-800/50 border border-white/5 rounded-2xl">
                                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
                                <p className="text-slate-300 text-sm font-semibold">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full"></div>
                    <div className="relative bg-slate-900 border border-white/10 p-10 rounded-[48px] shadow-2xl space-y-8 backdrop-blur-3xl w-full max-w-md">
                        <div className="space-y-6">
                            <h4 className="text-xl font-black italic flex items-center gap-3 text-white"><Target className="w-5 h-5 text-pink-500" /> AI Confidence Score</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase"><span>Context Awareness</span><span>98%</span></div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[98%] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div></div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase"><span>Safety Filter</span><span>100%</span></div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[100%] bg-green-500 rounded-full"></div></div>
                            </div>
                        </div>
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/5 italic text-slate-400 text-sm leading-relaxed">
                            "{language === 'ko' ? '분석 결과: 상대방은 논리적인(T) 설명에 긍정적으로 반응하는 경향이 있습니다.' : 'Analysis: The partner shows a strong preference for logical (T) reasoning.'}"
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 📚 Psychology Column - High Quality Content */}
        <section className="relative z-10 px-6 py-32 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">{t.blog_title}</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
                </div>
                
                <div className="prose prose-invert prose-xl max-w-none space-y-10">
                    <p className="text-slate-300 text-lg md:text-2xl leading-relaxed font-medium">
                        {t.blog_p1}
                    </p>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed italic border-l-4 border-purple-500/30 pl-6 bg-purple-500/5 p-4 rounded-r-xl">
                        {t.blog_p2}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                        {[
                            { val: t.stat_1, desc: t.stat_1_desc },
                            { val: t.stat_2, desc: t.stat_2_desc },
                            { val: t.stat_3, desc: t.stat_3_desc },
                            { val: t.stat_4, desc: t.stat_4_desc }
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className="text-sm font-black text-white">{stat.val}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 💡 Ad Slot 2 */}
        <div className="px-6 max-w-3xl mx-auto my-24">
            <AdBanner className="rounded-[32px]" />
        </div>

        {/* ❓ FAQ - Transparency */}
        <section className="relative z-10 px-6 py-32 max-w-4xl mx-auto space-y-20">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">{t.faq_t}</h2>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Transparency & Trust</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {[
                    { q: t.q1, a: t.a1, icon: <BrainCircuit className="w-5 h-5" /> },
                    { q: t.q2, a: t.a2, icon: <ShieldCheck className="w-5 h-5" /> },
                ].map((item, i) => (
                    <div key={i} className="p-8 bg-slate-800/30 border border-white/5 rounded-3xl space-y-4 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3 text-purple-400">
                            <div className="p-2 bg-purple-500/10 rounded-xl">{item.icon}</div>
                            <h4 className="font-bold text-lg">{item.q}</h4>
                        </div>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed pl-11">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 🏁 Final CTA */}
        <section className="relative z-10 px-6 py-40 text-center space-y-12 bg-gradient-to-b from-[#020617] via-purple-900/10 to-[#020617]">
            <div className="space-y-6">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none max-w-5xl mx-auto uppercase text-white">{t.final_t}</h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium">Join thousands of users improving their communication skills.</p>
            </div>
            <button onClick={onStart} className="px-16 py-8 bg-white text-black font-black rounded-full active:scale-95 transition-all shadow-2xl hover:bg-slate-200 text-xl tracking-tight">
                {t.final_btn}
            </button>
        </section>

        {/* 🏮 Footer - Truthful & Compliant */}
        <footer className="relative z-10 px-6 py-24 border-t border-white/5 bg-[#020617]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                <div className="md:col-span-2 space-y-8">
                    <div className="flex items-center gap-2 font-black italic text-3xl text-white"><Sparkles className="w-6 h-6 text-purple-400" /> MBTI RIZZ AI</div>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                        Our mission is to enhance human connection through technology. We use AI to help people understand social dynamics and communicate more effectively.
                    </p>
                </div>
                <div className="space-y-6">
                    <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Legal & Support</h5>
                    <ul className="space-y-3 text-sm text-slate-500 font-bold">
                        <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                        <li><button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                        <li><a href="mailto:interlightlab@gmail.com" className="hover:text-white transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Core Technology</h5>
                    <ul className="space-y-3 text-sm text-slate-500 font-bold">
                        <li>Google AI Models</li>
                        <li>Personality Analysis Engine</li>
                        <li>Social Context Processing</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
                <p>© 2025 Interlight Lab • All Rights Reserved</p>
                <div className="flex gap-8">
                    <span>Secure SSL</span>
                    <span>GDPR Compliant</span>
                </div>
            </div>
        </footer>
    </div>
  );
};
