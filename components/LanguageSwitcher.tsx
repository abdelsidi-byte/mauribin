"use client";
import { useState, useRef, useEffect } from "react";
import { useI18n } from "./I18nProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, available } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#006233]/30 border border-[#ffd700]/30 hover:bg-[#006233]/50 hover:border-[#ffd700]/50 transition-all text-sm font-semibold text-white"
      >
        <span className="text-base leading-none">{available[locale].flag}</span>
        <span className="hidden sm:inline">{available[locale].native}</span>
        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full mt-2 end-0 z-50 min-w-[160px] rounded-xl bg-slate-900/95 backdrop-blur-xl border border-[#ffd700]/30 shadow-2xl shadow-black/40 overflow-hidden"
        >
          {(Object.keys(available) as Locale[]).map((code) => {
            const meta = available[code];
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-start ${
                  active
                    ? "bg-[#ffd700]/15 text-[#ffd700] font-bold"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="text-lg leading-none">{meta.flag}</span>
                <span className="flex-1">{meta.native}</span>
                {active && <span className="text-[#ffd700]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}