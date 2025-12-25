
import React from 'react';
import { 
  ArrowRight, Sparkles, BrainCircuit, Target, 
  MessageCircle, BarChart3, Users, MousePointer2,
  Heart, BookOpen, Quote
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

    // 가치 제안 (Value Prop)
    value_t: "과학적인 대화 분석 솔루션",
    v1_t: "성격 유형 심리학",
    v1_d: "MBTI 이론과 행동 심리학 데이터를 기반으로 상대방이 선호하는 대화 스타일과 인지 패턴을 분석합니다.",
    v2_t: "객관적 데이터 분석",
    v2_d: "감에 의존하는 것이 아니라, 텍스트 길이, 반응 속도, 키워드 감정을 분석하여 객관적인 '호감도 지표'를 제공합니다.",
    v3_t: "상황별 맞춤 전략",
    v3_d: "단순한 유머부터 진지한 관계 회복까지, 사용자의 목적에 맞는 3가지 톤(Tone)의 답변을 생성합니다.",

    // New Content Section for AdSense Approval (Original Articles)
    guide_title: "커뮤니케이션 심리학 아카데미",
    guide_desc: "애드센스 승인을 위해 보강된 전문 정보 섹션입니다. 더 나은 관계를 위한 전문가의 조언을 읽어보세요.",
    
    art1_t: "텍스트 답장 속도의 심리학",
    art1_d: "답장 속도는 관심도의 척도일까요? 심리학 연구에 따르면, 무조건 빠른 답장보다 상대방의 속도에 맞추는 '미러링'이 신뢰 형성에 더 효과적입니다. 불안형 애착 유형은 늦은 답장을 거절로 인식하지만, 회피형 유형은 너무 빠른 답장을 압박으로 느낄 수 있습니다. 상대방의 패턴을 관찰하고 70~80% 수준으로 보조를 맞추는 것이 가장 안정적인 전략입니다. 이는 상대방에게 심리적 동질감을 부여하며 대화의 흐름을 자연스럽게 유지해줍니다.",
    
    art2_t: "디지털 제스처: 이모티콘의 활용",
    art2_d: "텍스트는 비언어적 신호(표정, 목소리 톤)가 부재합니다. 이모티콘은 이를 보완하는 '디지털 제스처' 역할을 합니다. 하지만 T(사고형) 성향의 사람에게 과도한 이모티콘은 가벼운 인상을 줄 수 있고, F(감정형) 성향에게 이모티콘 없는 단답은 차가운 거절로 느껴질 수 있습니다. 상대방의 성향에 따라 문장 끝맺음을 조절하는 것만으로도 대화의 온도가 달라집니다. 특히 관계 초기에는 상대방이 사용하는 이모티콘의 양과 종류를 따라가는 것이 라포(Rapport) 형성에 유리합니다.",
    
    art3_t: "개방형 질문의 마법",
    art3_d: "대화가 자꾸 끊긴다면 '네/아니오'로 끝나는 폐쇄형 질문을 하고 있을 가능성이 큽니다. '오늘 바빠?' 대신 '오늘 하루 중 가장 기억에 남는 순간이 언제야?'와 같이 상대방의 생각과 감정을 끌어내는 '개방형 질문'을 던져보세요. 이는 상대방으로 하여금 자신의 이야기를 하게 만들어 심리적 친밀감을 높이는 가장 빠른 지름길입니다. 질문의 형태를 조금만 바꿔도 상대방은 자신이 존중받고 있다는 느낌을 받게 되며 대화는 더욱 풍성해집니다.",

    // 시나리오
    scenario_t: "다양한 소셜 상황 대응",
    scenario_d: "MBTI Rizz AI는 데이팅부터 네트워킹까지 다양한 대화 상황에서 조력자가 됩니다.",
    sc1_t: "데이팅 앱 & 소개팅",
    sc1_d: "첫인상이 중요한 순간, 상대방의 프로필 정보를 바탕으로 공통사를 찾아내고 자연스러운 대화를 유도합니다.",
    sc2_t: "썸 & 관계 발전",
    sc2_d: "대화가 끊기지 않도록 상대방의 흥미를 유발하는 질문과 공감 멘트를 심리학적으로 설계합니다.",
    sc3_t: "갈등 해결 & 오해 풀기",
    sc3_d: "텍스트로 인해 발생한 오해를 줄이고, 정중하고 논리적인 표현으로 관계를 회복하는 메시지를 작성합니다.",

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

    // New Content Section for AdSense Approval
    guide_title: "Communication Psychology Academy",
    guide_desc: "Explore our expert-curated articles for high-quality social interaction.",

    art1_t: "The Psychology of Text Latency",
    art1_d: "Is reply speed a measure of interest? Psychological studies suggest that 'mirroring'—matching the response cadence of your partner—is more effective for building trust than instant replies. Anxious attachment types perceive late replies as rejection, while avoidant types feel pressured by quick ones. Aim for a 70-80% match of their speed for optimal results. This subtle mirroring builds subconscious rapport.",

    art2_t: "Digital Gestures: Emoji Usage",
    art2_d: "Text lacks non-verbal cues like tone and facial expression. Emojis act as 'digital gestures' to bridge this gap. However, excessive emojis can seem 'frivolous' to T (Thinking) types, while short replies without emojis might be misinterpreted as 'anger' by F (Feeling) types. Tailoring your digital punctuation to their style is key to rapport and prevents unnecessary misunderstandings in digital space.",

    art3_t: "The Art of Open-Ended Questions",
    art3_d: "If conversations keep stalling, you might be asking 'closed questions' (Yes/No). Instead of 'Are you busy?', try 'What was the highlight of your day?'. This encourages the other person to share their thoughts and feelings, which is the fastest route to increasing interpersonal intimacy and creating a lasting bond. Open-ended questions show genuine curiosity about the other person.",

    scenario_t: "For Every Social Scenario",
    scenario_d: "MBTI Rizz AI acts as your assistant across various social contexts, from dating to networking.",
    sc1_t: "Dating Apps & Icebreakers",
    sc1_d: "First impressions matter. We help you identify common interests from profiles and craft natural, engaging openers.",
    sc2_t: "Building Connections",
    sc2_d: "Keep the conversation flowing with psychologically designed questions and empathetic responses that spark interest.",
    sc3_t: "Conflict Resolution",
    sc3_d: "Minimize misunderstandings caused by text. We help draft polite, logical, and sincere messages to restore relationships.",

    final_t: "Upgrade Your Social Skills.",
    final_btn: "Start Analysis Now"
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenLegal, language }) => {
  const t = CONTENT[language] || CONTENT['en'];

  return (
    <div className="h-full w-full bg-[#020617] text-white overflow-y-auto scrollbar-hide relative font-sans selection:bg-purple-500/30">
        
        {/* 🔥 Hero Section */}
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

        {/* 💡 Ad Slot 1 - Top Position (Content Rich Page) */}
        <div className="px-6 max-w-3xl mx-auto mb-32">
            <AdBanner className="rounded-[32px]" />
        </div>

        {/* 📚 Educational Articles Section (Crucial for AdSense Approval) */}
        <section className="relative z-10 px-6 py-24 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                     <div className="inline-flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest bg-purple-500/10 px-4 py-2 rounded-full">
                        <BookOpen className="w-4 h-4" /> Academy
                    </div>
                     <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase">{t.guide_title}</h2>
                     <p className="text-slate-400 text-lg max-w-xl mx-auto">{t.guide_desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { t: t.art1_t, d: t.art1_d, icon: <Quote className="w-6 h-6 text-pink-400" /> },
                        { t: t.art2_t, d: t.art2_d, icon: <MessageCircle className="w-6 h-6 text-purple-400" /> },
                        { t: t.art3_t, d: t.art3_d, icon: <Target className="w-6 h-6 text-blue-400" /> },
                    ].map((art, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px] space-y-6 shadow-2xl hover:border-slate-600 transition-all group">
                            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/5 mb-2 group-hover:scale-110 transition-transform">
                                {art.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-100 leading-tight italic">{art.t}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed text-justify font-medium">
                                {art.d}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 🚀 Feature Value Cards */}
        <section className="relative z-10 px-6 py-24">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                     <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-500/50 uppercase">Features</h2>
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

        {/* 💡 Ad Slot 2 */}
        <div className="px-6 max-w-3xl mx-auto my-12">
            <AdBanner className="rounded-[32px]" />
        </div>

        {/* 📱 Scenarios */}
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

        {/* 🏮 Footer */}
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
