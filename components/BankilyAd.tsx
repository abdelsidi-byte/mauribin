"use client";

import { useState } from "react";

export function BankilyAd({ variant = "banner" }: { variant?: "banner" | "card" | "float" }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const baseStyles = `
    relative overflow-hidden rounded-xl border border-[#ffd700]/20
    bg-gradient-to-r from-[#006233] via-[#006233]/95 to-[#D01C1F]
    transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#ffd700]/10
  `;

  if (variant === "float") {
    return (
      <a
        href="https://www.bankily.mr/ar/bankily-ar/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 group animate-[slideUp_0.5s_ease-out]"
        aria-label="إعلان Bankily - خدمة الدفع الإلكتروني"
      >
        <div className="flex items-center gap-3">
          {/* Pulsing glow */}
          <div className="absolute -inset-2 bg-[#ffd700]/20 rounded-2xl blur-xl animate-pulse" />

          {/* Card */}
          <div className={`
            ${baseStyles.replace('block', '')}
            px-4 py-3 shadow-xl backdrop-blur-sm
          `}>
            <div className="relative flex items-center gap-3">
              {/* Logo */}
              <img
                src="/icons/bankily-logo.png"
                alt="Bankily"
                className="w-11 h-11 rounded-xl object-cover border border-white/30"
              />

              {/* Text */}
              <div className="flex flex-col">
                <span className="text-[#ffd700] font-bold text-sm">Bankily</span>
                <span className="text-white/80 text-xs">ادفع بسهولة وأمان</span>
              </div>

              {/* Arrow */}
              <div className="mr-1 text-[#ffd700] group-hover:translate-x-1 transition-transform">
                ←
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDismissed(true); }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-black/70 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg"
            aria-label="إغلاق الإعلان"
          >
            ✕
          </button>
        </div>
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a
        href="https://www.bankily.mr/ar/bankily-ar/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} block p-5`}
        aria-label="إعلان Bankily - خدمة الدفع الإلكتروني"
      >
        {/* Glow effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffd700]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20">
              💳
            </div>
            <div className="flex flex-col">
              <span className="text-[#ffd700] font-bold text-lg">Bankily</span>
              <span className="text-white/80 text-sm">خدمة الدفع الإلكتروني رقم 1 في موريتانيا</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/60">صمّام</span>
                <span className="text-xs text-white/60">•</span>
                <span className="text-xs text-white/60">آمن</span>
                <span className="text-xs text-white/60">•</span>
                <span className="text-xs text-white/60">سريع</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#ffd700] group-hover:translate-x-1 transition-transform">
            <span className="text-sm font-bold">ادفع الآن</span>
            <span>←</span>
          </div>
        </div>
      </a>
    );
  }

  // Banner variant (default)
  return (
    <a
      href="https://www.bankily.mr/ar/bankily-ar/"
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} block p-3`}
      aria-label="إعلان Bankily - خدمة الدفع الإلكتروني"
    >
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl border border-white/20">
            💳
          </div>
          <div className="flex flex-col">
            <span className="text-[#ffd700] font-bold text-sm">Bankily</span>
            <span className="text-white/70 text-xs">ادفع فواتيرك وتحويلاتك بسهولة وأمان</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-white/60">
            <span>✓</span>
            <span>صمّام</span>
          </div>
          <div className="px-3 py-1.5 bg-[#ffd700] text-[#006233] rounded-lg text-xs font-bold group-hover:bg-[#e6c200] transition-colors">
            اعرف المزيد
          </div>
        </div>
      </div>
    </a>
  );
}
