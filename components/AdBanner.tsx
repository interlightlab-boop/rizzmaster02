
import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Lightbulb, MessageCircle, Heart, Info, ChevronRight } from 'lucide-react';

const ADSENSE_PUBLISHER_ID: string = "ca-pub-7077626760936318"; 

interface AdBannerProps {
  slotId?: string; 
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

const FALLBACK_TIPS = [
    { icon: <Heart className="w-5 h-5 text-pink-400" />, title: "The Power of Empathy", ko: "공감 능력이 뛰어난 NF 유형에게는 결과보다 '과정'과 '감정'에 집중한 답장이 효과적입니다.", en: "For NF types, focus on the 'process' and 'emotions' rather than just results." },
    { icon: <MessageCircle className="w-5 h-5 text-blue-400" />, title: "Logical Rizz", ko: "논리적인 NT 유형과는 지적인 호기심을 자극하는 질문으로 대화를 시작해보세요.", en: "Start conversations with NT types using questions that spark intellectual curiosity." },
    { icon: <Lightbulb className="w-5 h-5 text-yellow-400" />, title: "Small Details Matter", ko: "상대방이 흘려 말한 작은 취향을 기억했다가 언급하는 것만으로도 호감도는 급상승합니다.", en: "Mentioning small details they shared earlier significantly boosts your charisma." },
    { icon: <Sparkles className="w-5 h-5 text-purple-400" />, title: "Masterpiece Secret", ko: "마스터피스 답변은 상대방의 MBTI 특유의 유머 코드를 공략하도록 설계되었습니다.", en: "Masterpiece replies target the specific humor codes of each MBTI type." }
];

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId = "7011091820", 
  format = "auto",
  className = "",
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [tipIndex] = useState(Math.floor(Math.random() * FALLBACK_TIPS.length));
  
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isConfigured = ADSENSE_PUBLISHER_ID.startsWith("ca-pub-");

  useEffect(() => {
    if (!isDev && isConfigured && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense logic pending or error:", e);
      }
    }
  }, [isConfigured]);

  const tip = FALLBACK_TIPS[tipIndex];
  const isKo = navigator.language.startsWith('ko');

  return (
    <div 
        className={`w-full relative overflow-hidden flex flex-col items-center ${className}`} 
        style={{ ...style }}
    >
      {/* 
         1. 광고 미송출 시 보여줄 정보성 카드 (Fallback UI)
         - 순서를 위로 올려서 기본적으로 이것이 렌더링되게 함.
         - CSS로 광고가 'filled' 되면 숨김 처리.
      */}
      <div className="ad-fallback-ui w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 transition-all duration-700">
          <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-800 rounded-2xl border border-white/10 shadow-xl shrink-0">
                  {tip.icon}
              </div>
              <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">{tip.title}</span>
                      <Info className="w-3 h-3 text-slate-700 shrink-0" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                      {isKo ? tip.ko : tip.en}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-1">
                      Insight by MBTI AI <ChevronRight className="w-3 h-3" />
                  </div>
              </div>
          </div>
      </div>

      {/* 
         2. 실제 광고 단위 
         - CSS를 통해 광고가 로드되지 않았으면(unfilled) 높이를 0으로 만들거나 숨김.
      */}
      <div ref={adRef} className="w-full ad-container">
        <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={ADSENSE_PUBLISHER_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
        />
      </div>

      <style>{`
        /* 
           핵심 로직:
           1. 광고가 'filled' 상태가 되면 -> Fallback UI를 숨깁니다.
           2. 광고가 'unfilled' 상태이거나 로딩 중이면 -> 광고(ins)를 숨기고 Fallback UI를 보여줍니다.
        */
        
        /* 광고가 로드되면 Fallback 숨김 */
        .ad-container:has(.adsbygoogle[data-ad-status="filled"]) ~ .ad-fallback-ui,
        .ad-container:has(.adsbygoogle[data-ad-status="filled"]) + .ad-fallback-ui,
        .ad-fallback-ui:has(+ .ad-container .adsbygoogle[data-ad-status="filled"]) {
            display: none !important;
        }

        /* React 구조상 형제 선택자가 까다로울 수 있으므로, .adsbygoogle 자체 스타일링 강화 */
        .adsbygoogle {
            background: transparent !important; 
        }

        /* 광고가 채워지지 않았으면 광고 태그 자체를 숨김 (빈 박스 방지) */
        .adsbygoogle:not([data-ad-status="filled"]) {
            display: none !important;
            height: 0 !important;
        }

        /* 광고가 채워졌을 때만 Fallback을 숨기는 로직 (JS 의존성 줄임) */
        .w-full:has(.adsbygoogle[data-ad-status="filled"]) .ad-fallback-ui {
            display: none !important;
        }
      `}</style>
    </div>
  );
};
