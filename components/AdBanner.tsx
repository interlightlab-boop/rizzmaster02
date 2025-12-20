
import React, { useEffect, useRef } from 'react';

// ==========================================
// 💰 [사장님 스크린샷 확인 완료] 애드센스 실제 ID
// ==========================================
const ADSENSE_PUBLISHER_ID: string = "ca-pub-7077626760936318"; 
const ACTUAL_SLOT_ID: string = "7011091820"; // mbtirizz01 단위 ID
// ==========================================

interface AdBannerProps {
  slotId?: string; 
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId = ACTUAL_SLOT_ID, 
  format = "auto",
  className = "",
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  useEffect(() => {
    // 개발 환경이 아니고, 광고 단위가 로드되지 않았을 때만 실행
    if (!isDev && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense logic: Waiting for approval or script load.");
      }
    }
  }, [isDev]);

  return (
    <div 
        className={`overflow-hidden flex justify-center items-center bg-slate-900/30 rounded-xl min-h-[100px] border border-white/5 ${className}`} 
        style={{ ...style }}
      >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '300px' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
};
