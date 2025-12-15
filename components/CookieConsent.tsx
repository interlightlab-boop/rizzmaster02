
import React, { useState, useEffect } from 'react';
import { Shield, Check } from 'lucide-react';
import { Language } from '../types';

interface CookieConsentProps {
  language: Language;
  onOpenPrivacy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ language, onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem('rizz_cookie_consent');
    if (!consent) {
      // Show with a slight delay for better UX animation
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('rizz_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Simple translations for the banner
  const text = {
    en: { msg: "We use cookies to improve your experience and show personalized ads.", btn: "Accept", link: "Privacy Policy" },
    ko: { msg: "더 나은 경험과 맞춤형 광고 제공을 위해 쿠키를 사용합니다.", btn: "동의", link: "개인정보 처리방침" },
    ja: { msg: "当サイトでは、サービスの向上と広告の表示にクッキーを使用します。", btn: "同意", link: "プライバシー" },
    es: { msg: "Usamos cookies para mejorar su experiencia y mostrar anuncios.", btn: "Aceptar", link: "Privacidad" },
    fr: { msg: "Nous utilisons des cookies pour améliorer votre expérience.", btn: "Accepter", link: "Confidentialité" },
    pt: { msg: "Usamos cookies para melhorar sua experiência.", btn: "Aceitar", link: "Privacidade" },
    zh: { msg: "我们使用 Cookie 以改善体验并显示广告。", btn: "接受", link: "隐私政策" },
    ru: { msg: "Мы используем файлы cookie для улучшения работы.", btn: "Принять", link: "Приватность" },
  };

  const t = text[language] || text['en'];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-in slide-in-from-bottom-20 duration-500">
      <div className="max-w-md mx-auto bg-slate-800/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-700 rounded-full shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-sm text-slate-300 leading-relaxed">
                {t.msg}
                <button 
                    onClick={onOpenPrivacy}
                    className="ml-2 text-xs font-bold text-purple-400 hover:text-purple-300 underline decoration-purple-500/30 underline-offset-2"
                >
                    {t.link}
                </button>
            </div>
        </div>
        <button
            onClick={handleAccept}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
            <Check className="w-4 h-4" />
            {t.btn}
        </button>
      </div>
    </div>
  );
};
