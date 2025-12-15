
import React, { useEffect, useRef } from 'react';
import { Sparkles, Crown } from 'lucide-react';

// ==========================================
// 💰 [사장님 필수 설정] 애드센스 정보 입력란
// ==========================================
// 애드센스 승인 전에는 "ca-pub-XXXXXXXXXXXXXXXX" (기본값)을 그대로 두세요.
// 기본값인 경우 자동으로 '자체 홍보 배너(House Ad)'가 뜹니다. 안전합니다!
const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; 
// ==========================================

interface AdBannerProps {
  slotId?: string; 
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId = "1234567890", 
  format = "auto",
  className = "",
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Safety Check: ID가 설정되었는지 확인
  const isConfigured = ADSENSE_PUBLISHER_ID !== "ca-pub-XXXXXXXXXXXXXXXX" && slotId !== "1234567890" && slotId !== "YOUR_MREC_SLOT_ID";

  useEffect(() => {
    // 실제 배포 환경이고, ID가 올바르게 설정되었을 때만 광고 로드 시도
    // ID가 설정되지 않았다면 구글 스크립트를 아예 실행하지 않음 (승인 거절 방지)
    if (!isDev && isConfigured && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [isConfigured]);

  // 1. 애드센스 승인 전 (ID 미설정) -> 자체 홍보 배너(House Ad) 노출
  // 이렇게 하면 빈 공간이 생기지 않고, 앱이 꽉 차 보이며, 승인 심사에도 안전합니다.
  if (!isConfigured) {
    return (
      <div 
        className={`relative overflow-hidden bg-slate-800/50 flex flex-col items-center justify-center text-white p-4 border border-slate-700/50 shadow-inner rounded-xl ${className}`}
        style={{ ...style, minHeight: format === 'rectangle' ? '250px' : '60px' }}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            {format === 'rectangle' ? (
                <>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-200">Go Unlimited</h3>
                        <p className="text-xs text-slate-400 leading-tight">
                            Unlock all features<br/>& remove waiting times.
                        </p>
                    </div>
                    <button className="mt-2 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold px-4 py-2 rounded-full transition-colors border border-slate-600">
                        View Options
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-slate-300">MBTI Rizz AI <strong>Pro</strong></span>
                </div>
            )}
        </div>
      </div>
    );
  }

  // 2. 실제 배포용 코드 (AdSense Code) - ID가 설정된 후에만 작동
  return (
    <div 
        className={`overflow-hidden flex justify-center bg-slate-900/30 rounded-xl ${className}`} 
        style={{ minHeight: format === 'rectangle' ? '250px' : '50px', ...style }}
        ref={adRef}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={format === 'auto' ? "true" : "false"}
      />
    </div>
  );
};
