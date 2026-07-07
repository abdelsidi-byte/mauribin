"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { VIDEO_AD_CONFIG } from "@/config/ads";

interface VideoAdOverlayProps {
  onComplete: () => void;
  isEnabled?: boolean;
}

export function VideoAdOverlay({ onComplete, isEnabled = true }: VideoAdOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState<number>(VIDEO_AD_CONFIG.skipAfterSeconds);
  const [canSkip, setCanSkip] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const fadeRef = useRef<NodeJS.Timeout | null>(null);

  // Build iframe src from config video URL (supports /e/, /v/, direct mp4)
  const videoSrc = VIDEO_AD_CONFIG.videoUrl.includes("?")
    ? VIDEO_AD_CONFIG.videoUrl + "&autoplay=1&muted=1"
    : VIDEO_AD_CONFIG.videoUrl + "?autoplay=1&muted=1";

  const closeAd = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (fadeRef.current) clearTimeout(fadeRef.current);
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
      onComplete();
    }, 400);
  }, [onComplete]);

  // Check localStorage and show ad if needed
  useEffect(() => {
    if (!isEnabled) return;

    const lastShown = localStorage.getItem(VIDEO_AD_CONFIG.storageKey);
    const now = Date.now();
    const intervalMs = VIDEO_AD_CONFIG.showIntervalHours * 60 * 60 * 1000;

    if (!lastShown || now - parseInt(lastShown) > intervalMs) {
      // Show ad with slight delay for page to settle
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem(VIDEO_AD_CONFIG.storageKey, now.toString());
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isEnabled]);

  // Handle countdown
  useEffect(() => {
    if (!isVisible) return;

    countdownRef.current = setInterval(() => {
      setCountdown((c: number) => {
        if (c <= 1) {
          setCanSkip(true);
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isVisible]);

  // Video ended — close immediately
  const handleVideoEnded = () => {
    closeAd();
  };

  // Video canplay — hide loading
  const handleCanPlay = () => {
    setIsLoading(false);
  };

  // Video waiting — show loading
  const handleWaiting = () => {
    setIsLoading(true);
  };

  // Video playing — hide loading
  const handlePlaying = () => {
    setIsLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 transition-opacity duration-400 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      dir="rtl"
    >
      {/* Video container */}
      <div className="relative w-full h-full max-w-6xl max-h-screen mx-4 my-4 rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/30">
        {/* Video — iframe for Streamable */}
        <iframe
          src={videoSrc}
          className="w-full h-full object-contain bg-black"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Mauribin VIP"
          frameBorder="0"
          scrolling="no"
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">جارٍ التحميل...</span>
            </div>
          </div>
        )}

        {/* Top bar: Ad label + close */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
          <div className="flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 py-1">
            <span className="text-yellow-400 text-xs font-bold">📺 إعلان</span>
            <span className="text-yellow-300 text-xs">by {VIDEO_AD_CONFIG.adPartner}</span>
          </div>

          {/* Skip button */}
          {canSkip ? (
            <button
              onClick={closeAd}
              className="bg-red-500 hover:bg-red-400 text-white text-sm font-bold px-5 py-2 rounded-full transition-all flex items-center gap-2"
            >
              <span>⏭</span>
              <span>تخطي الإعلان</span>
            </button>
          ) : (
            <div className="bg-black/60 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
              <span>⏱</span>
              <span>يمكنك التخطي بعد {countdown}s</span>
            </div>
          )}
        </div>

        {/* Bottom bar: Mauribin branding */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 font-black text-lg">🏆 Mauribin VIP</p>
              <p className="text-slate-400 text-xs mt-0.5">تجربة كرة القدم الحقيقية</p>
            </div>
            <a
              href="/vip"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-4 py-2 rounded-xl transition-all"
            >
              💎 اكتشف VIP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
