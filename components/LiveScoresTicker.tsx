"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { useI18n } from "./I18nProvider";

interface Match {
  _index: number | string;
  slug?: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
  utcDate?: string;
  elapsed?: number;
  id?: number;
}

function formatElapsed(elapsed?: number): string {
  if (elapsed === undefined || elapsed < 0) return "";
  return `${elapsed}'`;
}

function getStatusLabel(match: Match, t: (k: string) => string): { text: string; color: string } {
  if (match.state === "live") {
    return { text: `🔴 ${t("match.live")} ${formatElapsed(match.elapsed)}`, color: "text-red-400" };
  }
  if (match.state === "ft" || match.state === "finished") {
    return { text: t("match.finished"), color: "text-slate-500" };
  }
  if (match.state === "upcoming") {
    return { text: match.label || "قادمة", color: "text-[#FFD700]" };
  }
  return { text: match.label || "", color: "text-slate-500" };
}

export function LiveScoresTicker({ initialMatches }: { initialMatches: Match[] }) {
  const { t, localizeTeam } = useI18n();
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Deduplicate matches by home+away pair, keep order
  const uniqueMatches = useMemo(() => {
    const seen = new Set<string>();
    return matches.filter((m) => {
      const key = `${m.home}-${m.away}`.toLowerCase().replace(/\s+/g, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [matches]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches && Array.isArray(data.matches)) {
          setMatches(data.matches);
        }
      } catch (e) {
        // Silent fail - keep existing data
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (uniqueMatches.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 px-4 py-3">
        <div className="text-center text-slate-500 text-sm">⏳ جاري التحميل...</div>
      </div>
    );
  }

  // Animation duration: faster with fewer matches, slower with many
  const duration = Math.max(40, uniqueMatches.length * 8);

  // Build a card for one match
  const renderMatchCard = (match: Match, key: string) => {
    const status = getStatusLabel(match, t);
    return (
      <Link
        key={key}
        href={`/match/${match.slug || match._index}`}
        className="shrink-0 inline-flex items-center gap-2 px-3 py-2 mx-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-[#FFD700]/40 transition-all"
      >
        {/* Status */}
        <span className={`text-[10px] font-bold ${status.color} min-w-[80px] whitespace-nowrap`}>
          {status.text}
        </span>
        {/* Home */}
        <span className="text-base leading-none">{match.homeFlag}</span>
        <span className="text-white text-xs font-bold max-w-[80px] truncate">
          {localizeTeam(match.home)}
        </span>
        <span className={`text-base font-black min-w-[20px] text-center ${
          match.state === "live" ? "text-[#FFD700]" : "text-white"
        }`}>
          {match.homeScore !== null ? match.homeScore : (match.state === "live" ? "0" : "-")}
        </span>
        <span className="text-slate-500 text-[10px]">-</span>
        <span className={`text-base font-black min-w-[20px] text-center ${
          match.state === "live" ? "text-[#FFD700]" : "text-white"
        }`}>
          {match.awayScore !== null ? match.awayScore : (match.state === "live" ? "0" : "-")}
        </span>
        <span className="text-white text-xs font-bold max-w-[80px] truncate">
          {localizeTeam(match.away)}
        </span>
        <span className="text-base leading-none">{match.awayFlag}</span>
      </Link>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#FFD700]/20 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Label badge */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20 bg-gradient-to-r from-[#006233] to-[#004225] text-white text-xs font-black px-3 py-2 rounded-r-full border-r-2 border-[#FFD700]/50 flex items-center gap-1.5 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
        <span>نتائج</span>
      </div>

      {/* Gradient overlays for smooth fade-in/out at edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      {/* Marquee track - duplicate content for seamless loop */}
      <div
        ref={trackRef}
        className="flex whitespace-nowrap py-2.5"
        style={{
          animation: `scroll-ticker ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          paddingLeft: "80px",
        }}
      >
        {/* First copy */}
        {uniqueMatches.map((m, i) => renderMatchCard(m, `a-${i}-${m._index}`))}
        {/* Spacer */}
        <div className="shrink-0 w-8" />
        {/* Second copy for seamless loop */}
        {uniqueMatches.map((m, i) => renderMatchCard(m, `b-${i}-${m._index}`))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
