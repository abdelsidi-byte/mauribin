"use client";

import { useState, useEffect } from "react";
import { VIP_POPUP_CONFIG } from "@/config/ads";

interface VIPPopupProps {
  onClose: () => void;
}

export function VIPPopup({ onClose }: VIPPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[99998] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      dir="rtl"
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/40 bg-gradient-to-b from-yellow-900/90 to-slate-900/95 transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          onClick={handleClose}
          className="absolute top-3 left-3 w-8 h-8 bg-black/40 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm transition-colors z-10"
          aria-label="إغلاق"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-5 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-black font-black text-xl">Mauribin VIP</h2>
          <p className="text-black/70 text-sm font-medium mt-1">تجربة كرة القدم الحقيقية</p>
        </div>

        {/* Features */}
        <div className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { icon: "⚡", text: "تحديث لحظي" },
              { icon: "📊", text: "إحصائيات متقدمة" },
              { icon: "🔔", text: "إشعارات فورية" },
              { icon: "📺", text: "ملخصات وأهداف" },
              { icon: "🚫", text: "بدون إعلانات" },
              { icon: "🏆", text: "100+ دوري" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-yellow-400/10 rounded-lg px-3 py-2">
                <span>{f.icon}</span>
                <span className="text-yellow-200 font-medium text-xs">{f.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-2 space-y-2">
            <a href="/vip">
              <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl transition-all text-base">
                💎 اشترك الآن في VIP
              </button>
            </a>
            <button
              onClick={handleClose}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-xl transition-all text-sm"
            >
             繼續 المجاني
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manage VIP popup with localStorage throttle
export function useVIPPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem(VIP_POPUP_CONFIG.storageKey);
    const now = Date.now();
    const intervalMs = VIP_POPUP_CONFIG.showIntervalMs;

    // If interval is 0, only show once per session (not per 12h)
    if (intervalMs === 0) {
      const sessionKey = "mauribin_vip_popup_session_shown";
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");
        setShowPopup(true);
      }
    } else if (!lastShown || now - parseInt(lastShown) > intervalMs) {
      setShowPopup(true);
      localStorage.setItem(VIP_POPUP_CONFIG.storageKey, now.toString());
    }
  }, []);

  return { showPopup, setShowPopup };
}
