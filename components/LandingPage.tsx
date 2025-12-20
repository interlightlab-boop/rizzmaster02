
import React from 'react';
import { 
  ArrowRight, Sparkles, BrainCircuit, Star, Info, TrendingUp, Lightbulb, 
  Smartphone, MessageSquareQuote, ShieldEllipsis, LockKeyhole, Scale, 
  Mail, CheckCircle2, HelpCircle, Zap, Quote, Flame, SearchCheck, 
  UserCheck, ShieldCheck, Heart, Target, MessageCircle, BarChart3, Users, MousePointer2
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
    hero_tag: "AI가 제안하는 필승 연애 전략",
    hero_title_1: "AI POWERED",
    hero_title_2: "PERFECT REPLY",
    hero_sub_highlight: "가장 매력적인 답장",
    hero_desc: "상대방의 메시지 한 장만 올리세요. AI가 말투, 이모지, 심리 상태를 실시간 분석하여 읽씹 방지 100% '마스터피스' 답장을 대신 써드립니다.",
    cta_primary: "지금 바로 답장 생성하기",

    // 가치 제안 섹션
    value_t: "왜 MBTI RIZZ AI인가요?",
    v1_t: "심리학 기반 분석",
    v1_d: "단순한 문장이 아닙니다. 상대방의 MBTI와 대화 패턴을 분석해 최적의 심리적 타점을 노립니다.",
    v2_t: "실시간 '리드' 점수",
    v2_d: "현재 대화가 얼마나 잘 흘러가고 있는지, 누가 주도권을 쥐고 있는지 데이터로 보여줍니다.",
    v3_t: "맞춤형 3가지 옵션",
    v3_d: "위트, 다정함, 그리고 대담함. 당신의 스타일과 관계의 목적에 맞는 3가지 답변을 제공합니다.",

    // 상황별 가치 증명 (Scenario)
    scenario_t: "이런 상황에서 사용하세요",
    scenario_d: "어색한 첫인사부터 설레는 데이트 신청까지, AI 윙맨이 함께합니다.",
    
    sc1_t: "소개팅/데이팅 앱",
    sc1_d: "뻔한 '안녕'은 무시당합니다. 상대방의 프로필과 대화를 분석해 즉각적인 답장을 이끌어내는 오프닝을 제안합니다.",
    sc2_t: "카톡/DM 밀당",
    sc2_d: "상대방의 답장이 늦어지나요? 대화의 온도를 높이고 상대방이 먼저 질문하게 만드는 고도의 심리 전술을 사용하세요.",
    sc3_t: "관계 회복 및 재회",
    sc3_d: "실수했거나 서먹해진 사이에서도 논리적이고 진정성 있는 답변으로 관계를 다시 정상 궤도로 돌려놓습니다.",

    // AI 로직 설명
    logic_t: "대화의 숨겨진 코드를 해독합니다",
    logic_d: "AI 엔진이 스크린샷에서 추출하는 데이터 레이어입니다.",
    l1: "텍스트 뉘앙스: 단어 선택에 담긴 호감도와 경계심을 분석합니다.",
    l2: "반응 리듬: 답장 시간의 간격을 통해 상대방의 심리적 거리감을 측정합니다.",
    l3: "이모지 언어: 텍스트 뒤에 숨겨진 비언어적 단서를 포착합니다.",
    l4: "MBTI 인지 패턴: 사고(T)와 감정(F) 중 어떤 포인트에 반응할지 예측합니다.",
    l5: "필승 루트 설계: 데이트 수락률이 가장 높은 문장 구조를 조합합니다.",

    // 심층 칼럼 (AdSense용)
    blog_title: "연애의 성공은 기술이 아니라 '데이터'입니다",
    blog_p1: "많은 사람들이 연애를 운에 맡기지만, 매력적인 소통에는 명확한 법칙이 있습니다. 텍스트 소통에서 발생하는 오해의 90%는 상대방의 '인지적 스타일'을 맞추지 못할 때 발생합니다. MBTI Rizz AI는 이 간극을 인공지능으로 메워줍니다.",
    blog_p2: "우리의 AI는 수백만 건의 성공적인 대화 데이터를 학습했습니다. 단순히 예쁜 말을 하는 것이 아니라, 상대방의 뇌가 '보상'으로 느끼는 어휘를 배치합니다. 이것이 바로 우리가 제안하는 답변이 높은 성공률을 보이는 이유입니다.",
    
    faq_t: "자주 묻는 질문",
    q1: "정말 AI가 답장을 대신 써주나요?",
    a1: "네, 스크린샷을 분석한 뒤 상대방이 거절하기 힘든 매력적인 답변 3가지를 상황에 맞춰 즉시 생성해 드립니다.",
    q2: "내 대화 내용이 저장되나요?",
    a2: "아니요. 사생활 보호를 위해 모든 분석은 메모리 상에서만 이루어지며, 결과 출력 즉시 이미지는 영구 파괴됩니다.",

    final_t: "이제 고민 끝, 답장은 AI에게 맡기세요.",
    final_btn: "지금 첫 번째 분석 시작 (무료)"
  },
  en: {
    hero_tag: "AI-Generated Perfect Dating Strategy",
    hero_title_1: "AI POWERED",
    hero_title_2: "PERFECT REPLY",
    hero_sub_highlight: "The Most Magnetic Reply",
    hero_desc: "Just upload one screenshot. AI analyzes tone, emojis, and psychology to write 100% high-rizz 'Masterpiece' replies that prevent being ghosted.",
    cta_primary: "Generate Perfect Reply Now",

    value_t: "Why Choose MBTI RIZZ AI?",
    v1_t: "Psychology-Driven",
    v1_d: "More than just words. We target the partner's cognitive reward system based on MBTI and linguistic patterns.",
    v2_t: "Real-time Rizz Score",
    v2_d: "See who holds the power in the chat with data-driven insights and attraction metrics.",
    v3_t: "3 Strategic Options",
    v3_d: "Witty, Sweet, or Bold. Get 3 different replies tailored to your specific goals and personality.",

    scenario_t: "Perfect for Every Situation",
    scenario_d: "From awkward openers to romantic date requests, your AI wingman has your back.",
    
    sc1_t: "Dating Apps (Tinder/Hinge)",
    sc1_d: "Basic 'Hey' gets ignored. Get witty openers that demand an immediate response.",
    sc2_t: "Casual Flirting (DM/Texts)",
    sc2_d: "Keep the momentum going. Master the push-and-pull with AI-backed psychological tactics.",
    sc3_t: "Conflict & Resolution",
    sc3_d: "Heal the gap with logical and sincere messages that get the relationship back on track.",

    logic_t: "Decoding the Hidden Language",
    logic_d: "The data layers our AI engine extracts from your chat screenshots.",
    l1: "Lexical Nuance: Detects level of interest and boundaries in word choices.",
    l2: "Temporal Rhythm: Measures emotional distance via response intervals.",
    l3: "Emoji Nuance: Captures non-verbal cues hidden behind the screen.",
    l4: "MBTI Logic: Predicts if they respond better to Logic(T) or Feeling(F).",
    l5: "Conversion Route: Combines sentence structures for max date acceptance.",

    blog_title: "Dating Success is Science, Not Luck",
    blog_p1: "90% of texting failures happen because of cognitive mismatch. Our AI fills this void by aligning your words with your partner's mental frequency.",
    blog_p2: "Trained on millions of successful interactions, we don't just give you 'nice' sentences. We provide triggers that activate the brain's attraction centers.",

    faq_t: "FAQ",
    q1: "Does AI really write the replies?",
    a1: "Yes. After analyzing the screenshot, it generates 3 magnetic replies that are hard to ignore.",
    q2: "Is it private?",
    a2: "Absolutely. Images are processed in-memory and destroyed immediately after analysis.",

    final_t: "Stop Guessing. Start Rizzing.",
    final_btn: "Start Free Analysis Now"
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenLegal, language }) => {
  const t = CONTENT[language] || CONTENT['en'];

  return (
    <div className="h-full w-full bg-[#020617] text-white overflow-y-auto scrollbar-hide relative font-sans selection:bg-purple-500/30">
        
        {/* 🔥 Hero Section - Focus on AI Generation Value */}
        <header className="relative z-10 px-6 pt-32 pb-24 flex flex-col items-center text-center space-y-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-purple-400 animate-pulse shadow-2xl">
                <Sparkles className="w-4 h-4" /> {t.hero_tag}
            </div>
            
            <div className="space-y-6">
                <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter italic leading-none">{t.hero_title_1}</h1>
                <h1 className="text-7xl md:text-[11rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tighter leading-none">{t.hero_title_2}</h1>
            </div>

            <div className="max-w-3xl space-y-10">
                <p className="text-slate-200 text-3xl md:text-5xl font-bold leading-tight">
                    대화 스크린샷 한 장으로 완성되는 <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 underline decoration-pink-500/30 underline-offset-[12px]">{t.hero_sub_highlight}</span>
                </p>
                <p className="text-slate-400 text-base md:text-xl px-8 leading-relaxed font-medium">
                    {t.hero_desc}
                </p>
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <button onClick={onStart} className="group relative w-full bg-white text-black font-black py-9 rounded-[40px] flex items-center justify-center gap-4 active:scale-95 shadow-[0_20px_100px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_20px_100px_rgba(168,85,247,0.4)] hover:-translate-y-2 text-2xl">
                    {t.cta_primary} <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                </button>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                    <MousePointer2 className="w-3 h-3" /> Click to see the magic happen
                </p>
            </div>
        </header>

        {/* 💡 Ad Slot 1 */}
        <div className="px-6 max-w-3xl mx-auto mb-40">
            <AdBanner className="rounded-[48px]" />
        </div>

        {/* 🚀 Feature Value Cards */}
        <section className="relative z-10 px-6 py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <BrainCircuit className="text-purple-400" />, t: t.v1_t, d: t.v1_d },
                    { icon: <Target className="text-pink-400" />, t: t.v2_t, d: t.v2_d },
                    { icon: <Zap className="text-yellow-400" />, t: t.v3_t, d: t.v3_d }
                ].map((v, i) => (
                    <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] space-y-6 hover:bg-white/[0.04] transition-colors">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">{v.icon}</div>
                        <h3 className="text-2xl font-black italic">{v.t}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{v.d}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 📱 Scenarios */}
        <section className="relative z-10 px-6 py-32 bg-white/[0.01] border-y border-white/5">
            <div className="max-w-6xl mx-auto space-y-24">
                <div className="text-center space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">{t.scenario_t}</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.scenario_d}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Heart className="w-10 h-10" />, t: t.sc1_t, d: t.sc1_d, color: "from-pink-500 to-rose-600" },
                        { icon: <MessageCircle className="w-10 h-10" />, t: t.sc2_t, d: t.sc2_d, color: "from-purple-500 to-indigo-600" },
                        { icon: <Users className="w-10 h-10" />, t: t.sc3_t, d: t.sc3_d, color: "from-blue-500 to-cyan-600" }
                    ].map((item, i) => (
                        <div key={i} className="group p-10 bg-slate-900 border border-white/5 rounded-[56px] space-y-8 hover:border-purple-500/40 transition-all hover:-translate-y-3">
                            <div className={`w-24 h-24 rounded-[32px] bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl`}>{item.icon}</div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black italic">{item.t}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm md:text-base font-medium">{item.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 📊 Analysis Logic */}
        <section className="relative z-10 px-6 py-40 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-10">
                    <div className="inline-flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest">
                        <BarChart3 className="w-4 h-4" /> Advanced Decoding Engine
                    </div>
                    <h2 className="text-6xl font-black italic tracking-tighter leading-none">{t.logic_t}</h2>
                    <p className="text-slate-400 text-lg font-medium">{t.logic_d}</p>
                    
                    <div className="space-y-6">
                        {[t.l1, t.l2, t.l3, t.l4, t.l5].map((text, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                                <p className="text-slate-300 text-sm md:text-base font-bold">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-600/20 blur-[120px] rounded-full"></div>
                    <div className="relative bg-slate-900 border border-white/10 p-12 rounded-[64px] shadow-2xl space-y-12 backdrop-blur-3xl">
                        <div className="space-y-6">
                            <h4 className="text-2xl font-black italic flex items-center gap-3"><Target className="w-6 h-6 text-pink-500" /> AI Intelligence Layer</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase"><span>Attraction Sync</span><span>94%</span></div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[94%] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div></div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase"><span>Reply Potential</span><span>88%</span></div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[88%] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div></div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 rounded-3xl border border-white/5 italic text-slate-400 text-sm leading-relaxed">
                            "상대방의 말투에서 강한 '내향 사고(Ti)' 경향성이 발견되었습니다. 논리적인 명분이 포함된 데이트 신청이 수락될 확률이 가장 높습니다."
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 📚 Psychology Column (High Quality Content) */}
        <section className="relative z-10 px-6 py-40 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-4xl mx-auto space-y-20">
                <div className="text-center space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">{t.blog_title}</h2>
                    <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
                </div>
                
                <div className="prose prose-invert prose-2xl max-w-none space-y-12">
                    <p className="text-slate-300 text-xl md:text-3xl leading-snug font-medium first-letter:text-8xl first-letter:font-black first-letter:text-purple-400 first-letter:mr-6 first-letter:float-left">
                        {t.blog_p1}
                    </p>
                    <p className="text-slate-400 text-xl md:text-2xl leading-relaxed italic border-l-4 border-purple-500/30 pl-8">
                        {t.blog_p2}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-black text-white">92%</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Satisfaction</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-black text-white">40%</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Faster Reply</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-black text-white">24/7</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Availability</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-black text-white">3.5M</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success Cases</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 💡 Ad Slot 2 */}
        <div className="px-6 max-w-3xl mx-auto my-32">
            <AdBanner className="rounded-[48px]" />
        </div>

        {/* ❓ FAQ */}
        <section className="relative z-10 px-6 py-40 max-w-5xl mx-auto space-y-24">
            <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">{t.faq_t}</h2>
                <p className="text-slate-500 text-lg">우리는 투명하게 소통합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { q: t.q1, a: t.a1, icon: <HelpCircle className="w-5 h-5" /> },
                    { q: t.q2, a: t.a2, icon: <ShieldCheck className="w-5 h-5" /> },
                    { q: "유료 기능은 무엇인가요?", a: "기본 분석은 무료이며, AI가 직접 답장을 써주는 '마스터피스' 기능과 상세 맥락 힌트 입력은 Pro 구독을 통해 이용 가능합니다.", icon: <Zap className="w-5 h-5" /> },
                    { q: "MBTI를 모르는 상대는 어떻게 하나요?", a: "전혀 문제 없습니다. AI가 상대방의 어휘 선택과 답장 속도를 분석하여 성향을 역으로 추적합니다.", icon: <UserCheck className="w-5 h-5" /> }
                ].map((item, i) => (
                    <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] space-y-6 hover:border-purple-500/40 transition-all">
                        <div className="flex items-center gap-4 text-purple-400">
                            <div className="p-3 bg-purple-400/10 rounded-2xl">{item.icon}</div>
                            <h4 className="font-black text-2xl italic tracking-tight">{item.q}</h4>
                        </div>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 🏁 Final CTA */}
        <section className="relative z-10 px-6 py-56 text-center space-y-16 bg-gradient-to-b from-transparent via-purple-900/10 to-[#020617]">
            <div className="space-y-8">
                <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter italic leading-none max-w-6xl mx-auto uppercase">{t.final_t}</h2>
                <p className="text-slate-400 text-xl md:text-3xl font-medium">지금 무료로 당신의 첫 번째 AI 답장을 생성하세요.</p>
            </div>
            <button onClick={onStart} className="px-24 py-10 bg-white text-black font-black rounded-[60px] active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.15)] hover:bg-slate-100 hover:-translate-y-3 text-3xl tracking-tighter">
                {t.final_btn}
            </button>
            
            <div className="pt-48">
                <AdBanner className="rounded-[48px] max-w-3xl mx-auto" />
            </div>
        </section>

        {/* 🏮 Detailed Footer */}
        <footer className="relative z-10 px-6 py-32 border-t border-white/5 bg-[#020617]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
                <div className="md:col-span-2 space-y-10">
                    <div className="flex items-center gap-3 font-black italic text-4xl"><Sparkles className="w-8 h-8 text-purple-400" /> MBTI RIZZ AI</div>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
                        기술이 인간의 사랑과 연결을 돕는 도구가 되어야 한다고 믿습니다. 심리학과 AI의 만남으로 더 나은 소통을 경험하세요.
                    </p>
                </div>
                <div className="space-y-6">
                    <h5 className="font-black text-sm uppercase tracking-[0.3em] text-slate-300">Quick Links</h5>
                    <ul className="space-y-4 text-base text-slate-500 font-bold uppercase tracking-widest">
                        <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                        <li><button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                        <li><a href="mailto:interlightlab@gmail.com" className="hover:text-white transition-colors">Contact Support</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h5 className="font-black text-sm uppercase tracking-[0.3em] text-slate-300">Technology</h5>
                    <ul className="space-y-4 text-base text-slate-500 font-bold uppercase tracking-widest">
                        <li>Gemini 2.0 Pro</li>
                        <li>MBTI Cognitive Core</li>
                        <li>Social Dynamics LLM</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-slate-700 font-black uppercase tracking-[0.5em]">
                <p>© 2025 Interlight Lab • All Rights Reserved</p>
                <div className="flex gap-12">
                    <span>Psychology Driven AI</span>
                    <span>Global Edge CDN</span>
                </div>
            </div>
        </footer>
    </div>
  );
};
