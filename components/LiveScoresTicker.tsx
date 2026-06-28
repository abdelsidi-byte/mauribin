"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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

// Goal celebration animation for ticker
function TickerGoalFlash({ side }: { side: "home" | "away" }) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-r ${
        side === "home" ? "from-[#FFD700]/40" : "from-[#FFD700]/40"
      } to-transparent animate-flash-goal pointer-events-none rounded-2xl`}
    />
  );
}

interface LiveScoresTickerProps {
  initialMatches: Match[];
}

export function LiveScoresTicker({ initialMatches }: LiveScoresTickerProps) {
  const { t, localizeTeam } = useI18n();
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [goalFlash, setGoalFlash] = useState<Record<number, "home" | "away" | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevScores = useRef<Record<number, { home: number | null; away: number | null }>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Deduplicate by home+away pair
  const seen = new Set<string>();
  const uniqueMatches = matches.filter((m) => {
    const key = `${m.home}-${m.away}`.toLowerCase().replace(/\s+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches && Array.isArray(data.matches)) {
          // Detect goals
          const newFlashes: Record<number, "home" | "away" | null> = {};
          data.matches.forEach((m: Match, idx: number) => {
            const old = prevScores.current[idx];
            if (old && m.state === "live") {
              if (m.homeScore !== null && (old.home ?? 0) < m.homeScore) {
                newFlashes[idx] = "home";
                setTimeout(() => setGoalFlash((f) => ({ ...f, [idx]: null })), 2000);
              } else if (m.awayScore !== null && (old.away ?? 0) < m.awayScore) {
                newFlashes[idx] = "away";
                setTimeout(() => setGoalFlash((f) => ({ ...f, [idx]: null })), 2000);
              }
            }
            prevScores.current[idx] = { home: m.homeScore, away: m.awayScore };
          });
          if (Object.keys(newFlashes).length > 0) {
            setGoalFlash((f) => ({ ...f, ...newFlashes }));
          }
          setMatches(data.matches);
        }
      } catch (e) {
        console.error("Ticker refresh failed:", e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to next match every 8 seconds
  useEffect(() => {
    if (uniqueMatches.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % Math.max(1, uniqueMatches.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [uniqueMatches.length]);

  // Scroll ticker container horizontally only
  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll("[data-ticker-card]");
      if (cards[currentIndex]) {
        const card = cards[currentIndex] as HTMLElement;
        const container = containerRef.current;
        const scrollLeft = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  if (uniqueMatches.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 px-4 py-6">
        <div className="text-center text-slate-500 text-sm">⏳ جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with progress dots */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#006233] to-[#004225] border border-[#FFD700]/30">
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          <span className="text-[#FFD700] text-xs font-bold">نتائج</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/20 to-transparent" />
        {/* Progress dots - clickable */}
        <div className="flex gap-1">
          {uniqueMatches.slice(0, Math.min(12, uniqueMatches.length)).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentIndex % Math.min(12, uniqueMatches.length) ? "bg-[#FFD700] w-4" : "bg-slate-600"
              }`}
              aria-label={`Match ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Ticker container with horizontal scroll */}
      <div ref={containerRef} className="relative overflow-x-auto overflow-y-hidden hide-scrollbar">
        <div className="flex gap-4 pb-2">
          {uniqueMatches.map((match, idx) => (
            <div
              key={`${match._index}-${idx}`}
              data-ticker-card
              className="shrink-0 w-[230px] relative"
            >
              {goalFlash[idx] && (
                <TickerGoalFlash side={goalFlash[idx]!} />
              )}
              <Link
                href={`/match/${match.slug || match._index}`}
                className={`block rounded-2xl p-4 border transition-all duration-300 hover:scale-105 ${
                  match.state === "live"
                    ? "bg-gradient-to-br from-slate-900 to-slate-800 border-red-500/60 shadow-lg shadow-red-900/20"
                    : match.state === "ft" || match.state === "finished"
                    ? "bg-slate-900/80 border-slate-700/50 opacity-90"
                    : "bg-slate-900/80 border-slate-700/50"
                }`}
              >
                {/* Status */}
                <div className="flex items-center gap-2 mb-3">
                  {match.state === "live" && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-400 text-xs font-bold">
                        {t("match.live")} {match.elapsed ? `${match.elapsed}'` : ""}
                      </span>
                    </>
                  )}
                  {match.state !== "live" && (
                    <span className="text-slate-500 text-xs">
                      {match.state === "ft" || match.state === "finished" ? t("match.finished") : match.label}
                    </span>
                  )}
                </div>

                {/* Match */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.homeFlag}</span>
                    <span className="text-white text-sm flex-1 truncate">{localizeTeam(match.home)}</span>
                    <span className={`text-xl font-black ${
                      goalFlash[idx] === "home" ? "text-[#FFD700] animate-pulse" : "text-white"
                    }`}>
                      {match.homeScore !== null ? match.homeScore : (match.state === "live" ? "0" : "-")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.awayFlag}</span>
                    <span className="text-white text-sm flex-1 truncate">{localizeTeam(match.away)}</span>
                    <span className={`text-xl font-black ${
                      goalFlash[idx] === "away" ? "text-[#FFD700] animate-pulse" : "text-white"
                    }`}>
                      {match.awayScore !== null ? match.awayScore : (match.state === "live" ? "0" : "-")}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flash-goal {
          0%, 100% { opacity: 0; }
          10%, 30%, 50% { opacity: 1; }
          20%, 40% { opacity: 0; }
        }
        .animate-flash-goal { animation: flash-goal 2s ease-out forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
