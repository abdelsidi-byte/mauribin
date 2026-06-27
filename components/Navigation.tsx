"use client";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "./I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navigation() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("/");

  const NAV_LINKS = [
    { href: "/", label: t("nav.home"), icon: "⚽" },
    { href: "/schedule", label: t("nav.schedule"), icon: "🗓️" },
    { href: "/groups", label: t("nav.groups"), icon: "🏆" },
    { href: "/teams", label: t("nav.teams"), icon: "👥" },
    { href: "/news", label: t("nav.news"), icon: "📰" },
    { href: "/photos", label: "📸 Photos", icon: "📸" },
    { href: "/quiz", label: t("nav.quiz"), icon: "🎯" },
    { href: "/stats", label: t("nav.stats"), icon: "📊" },
    { href: "/predict", label: t("nav.predict"), icon: "⚽" },
    { href: "/search", label: t("nav.search"), icon: "🔍" },
  ];

  return (
    <header className="sticky top-0 z-50 stadium-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setActive("/")}
          >
            <div className="relative">
              <img
                src="/icons/icon-192.png"
                alt="Mauribin Logo"
                className="w-11 h-11 rounded-xl object-cover border border-[#ffd700]/30 group-hover:scale-110 transition-transform"
                style={{ background: "#000" }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffd700] rounded-full opacity-60 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text tracking-wide">Mauribin</span>
              <div className="text-[10px] text-[#ffd700]/70 -mt-0.5 flex items-center gap-1">
                <span>🏆</span>
                <span>{t("hero.worldCup")}</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActive(link.href)}
                  className={`
                    relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                    ${isActive
                      ? "text-[#ffd700]"
                      : "text-[#f1f5f9]/80 hover:text-white"
                    }
                  `}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive && (
                    <>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent rounded-full" />
                      <span className="absolute inset-0 bg-gradient-to-r from-[#ffd700]/10 to-transparent rounded-xl border border-[#ffd700]/20" />
                    </>
                  )}
                </Link>
              );
            })}

            {/* Search icon button - quick access */}
            <Link
              href="/search"
              onClick={() => setActive("/search")}
              aria-label="البحث"
              title="البحث"
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
                ${active === "/search"
                  ? "text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/30"
                  : "text-[#f1f5f9]/80 hover:text-[#ffd700] border border-transparent hover:border-[#ffd700]/30 hover:bg-[#ffd700]/5"
                }
              `}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-1.35z"
                />
              </svg>
            </Link>
          </nav>

          {/* Live indicator + Language switcher */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d01c1f]/20 border border-[#d01c1f]/40 glow-red">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d01c1f] live-dot" />
              <span className="text-xs text-[#d01c1f] font-bold tracking-wider">LIVE</span>
              <span className="text-xs text-[#d01c1f]/80">⚽</span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#006233]/40 hover:bg-[#007a40]/50 border border-[#006233]/30 transition-all"
              onClick={() => setOpen(!open)}
              aria-label="القائمة"
            >
              {open ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <div className="relative w-5 h-4">
                  <span className="absolute top-0 left-0 w-5 h-0.5 bg-white rounded-full" />
                  <span className="absolute top-1/2 left-0 w-5 h-0.5 bg-white rounded-full -translate-y-1/2" />
                  <span className="absolute bottom-0 left-0 w-5 h-0.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden glass rounded-2xl mt-2 p-2 space-y-1 border border-[#ffd700]/20">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActive(link.href);
                    setOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                      ? "bg-gradient-to-r from-[#ffd700]/20 to-transparent text-[#ffd700] border border-[#ffd700]/30"
                      : "text-[#f1f5f9]/80 hover:bg-[#006233]/10 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                  {isActive && <span className="mr-auto w-2 h-2 rounded-full bg-[#ffd700]" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
