
import React, { useEffect, useRef } from 'react';
import { Gamepad2, Star, Download, AlertTriangle } from 'lucide-react';

// ==========================================
// 💰 [사장님 필수 설정] 애드센스 정보 입력란
// ==========================================
// 애드센스 웹사이트에서 복사한 "웹 게시자 ID" (pub-으로 시작하는 것)
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
    // 실제 배포 환경이고, ID가 설정되었을 때만 광고 로드 시도
    if (!isDev && isConfigured && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [isConfigured]);

  // 1. 개발 환경이거나 ID 설정을 깜빡했을 때 보여줄 화면
  if (isDev || !isConfigured) {
    return (
      <div 
        className={`relative overflow-hidden bg-slate-900 flex flex-col items-center justify-between text-white p-4 border border-slate-700 shadow-inner ${className}`}
        style={{ ...style, minHeight: format === 'rectangle' ? '250px' : '60px' }}
      >
        {/* 경고: 배포 전 ID 확인용 */}
        {!isConfigured && !isDev && (
           <div className="absolute inset-0 z-50 bg-red-600/90 flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="w-10 h-10 text-white mb-2 animate-bounce" />
              <h3 className="font-bold text-white">광고 ID 미설정!</h3>
              <p className="text-xs text-white/90">AdBanner.tsx 파일에서<br/>ADSENSE_PUBLISHER_ID를 입력해주세요.</p>
           </div>
        )}

        {/* Ad Badge */}
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 z-10">
          Ad
        </div>

        {/* Mock Content (개발 중에 광고 위치 확인용) */}
        {format === 'rectangle' ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-3 opacity-50">
             <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-10 h-10 text-white" />
             </div>
             <div className="text-center">
                <h3 className="font-bold text-sm">Test Ad (Dev Mode)</h3>
                <p className="text-[10px] text-slate-400">실제 배포시 진짜 광고로 바뀝니다</p>
             </div>
             <button className="w-full bg-slate-700 text-white font-bold py-2 rounded-full text-xs">
                Install Now
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full h-full opacity-50">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shrink-0">
               <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-bold text-xs">Test Banner Ad</h3>
            </div>
            <button className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shrink-0">
               Open
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. 실제 배포용 코드 (AdSense Code)
  return (
    <div 
        className={`overflow-hidden flex justify-center bg-slate-900/30 ${className}`} 
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
