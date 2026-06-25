"use client";

import { useState, useEffect } from "react";

export default function VideoAdBanner() {
  const [visible, setVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Show ad after 5 seconds on site
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown for skip
  useEffect(() => {
    if (!visible || skipped) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [visible, skipped, countdown]);

  const closeAd = () => {
    setVisible(false);
    setSkipped(true);
  };

  if (!visible || skipped) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4 rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/30 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-600 to-yellow-500 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <span className="text-black font-bold text-sm">⚠️ إعلان</span>
          </div>
          <button
            onClick={closeAd}
            className="text-black hover:text-red-600 font-bold text-xl leading-none"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative bg-black" style={{ height: "70vh", maxHeight: "600px" }}>
          <iframe
            src="https://streamable.com/e/sjep82?autoplay=1&loop=1&muted=0"
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Skip + CTA */}
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-yellow-400 font-bold text-sm">🏆 Mauribin VIP</span>
            <p className="text-slate-400 text-xs mt-0.5">اشترك الآن للحصول على تجربة حصرية</p>
          </div>
          <div className="flex items-center gap-3">
            {countdown > 0 ? (
              <span className="bg-slate-700 text-white text-xs px-3 py-1 rounded-full">
                انتظر {countdown}s
              </span>
            ) : (
              <button
                onClick={closeAd}
                className="bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
              >
                ⏭ تخطي الإعلان
              </button>
            )}
            <a
              href="/vip"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs px-4 py-2 rounded-lg transition-all"
            >
              💎 اشترك الآن
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
