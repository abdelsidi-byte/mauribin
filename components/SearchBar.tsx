"use client";

import { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "ابحث عن منتخب، مباراة، أو مجموعة...",
  autoFocus = false,
}: SearchBarProps) {
  return (
    <div className="relative group w-full">
      {/* Glow on focus */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#006233] via-[#ffd700] to-[#d01c1f] opacity-0 group-focus-within:opacity-60 blur-md transition-opacity duration-500" />

      <div className="relative glass-card rounded-2xl border border-white/10 group-focus-within:border-[#ffd700] group-focus-within:shadow-[0_0_0_3px_rgba(255,215,0,0.15),0_0_30px_rgba(255,215,0,0.25)] transition-all duration-300">
        <div className="flex items-center gap-3 px-5 py-4">
          {/* Search icon - positioned on the right (start) for RTL */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#006233] to-[#004225] border border-[#ffd700]/30 flex items-center justify-center group-focus-within:border-[#ffd700] group-focus-within:from-[#ffd700]/20 transition-all">
            <svg
              className="w-5 h-5 text-[#ffd700]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-1.35z"
              />
            </svg>
          </div>

          <input
            type="text"
            dir="rtl"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-[#f1f5f9]/40 text-base md:text-lg font-medium"
            aria-label="بحث"
          />

          {/* Clear button - shown when there is a value */}
          {value && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  target: { value: "" },
                } as ChangeEvent<HTMLInputElement>)
              }
              className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[#f1f5f9]/60 hover:text-[#d01c1f] hover:bg-[#d01c1f]/10 border border-transparent hover:border-[#d01c1f]/30 transition-all"
              aria-label="مسح البحث"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Decorative kbd hint */}
          {!value && (
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <kbd className="px-2 py-1 rounded-md text-[10px] font-mono bg-[#006233]/40 border border-[#ffd700]/20 text-[#ffd700]/80">
                بحث
              </kbd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
