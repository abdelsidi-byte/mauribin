"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface YesterdayMatch {
  id: string;
  home: { name: string; abbr: string; logo: string; score: string; winner: boolean };
  away: { name: string; abbr: string; logo: string; score: string; winner: boolean };
  status: string;
}

const TEAM_FLAGS: Record<string, string> = {
  "Curaçao": "🇨🇼", "Ivory Coast": "🇨🇮", "Ecuador": "🇪🇨", "Germany": "🇩🇪",
  "Japan": "🇯🇵", "Sweden": "🇸🇪", "Tunisia": "🇹🇳", "Netherlands": "🇳🇱",
};

const TEAM_NAMES: Record<string, string> = {
  "Curaçao": "كوبا كونترو", "Ivory Coast": "ساحل العاج", "Ecuador": "الإكوادور",
  "Germany": "ألمانيا", "Japan": "اليابان", "Sweden": "السويد",
  "Tunisia": "تونس", "Netherlands": "هولندا",
};

export function YesterdayResults() {
  const [matches, setMatches] = useState<YesterdayMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYesterday() {
      try {
        const res = await fetch("/api/yesterday-results");
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches || []);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchYesterday();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-amber-500/20 p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-slate-700 rounded w-1/3"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <div className="mb-8" dir="rtl">
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-amber-500/20 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-l from-amber-600/20 to-transparent px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <h2 className="text-xl font-bold text-amber-400">نتائج أمس</h2>
          <span className="mr-auto text-xs text-slate-400">25 يونيو 2026</span>
        </div>

        <div className="p-5 space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl hover:bg-slate-700/50 transition-all"
            >
              {/* Home Team */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-2xl shrink-0">
                  {TEAM_FLAGS[match.home.name] || "🏳️"}
                </span>
                {match.home.logo && (
                  <Image
                    src={match.home.logo}
                    alt={match.home.name}
                    width={24}
                    height={24}
                    className="object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <span className="text-white text-sm font-medium truncate">
                  {TEAM_NAMES[match.home.name] || match.home.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-2xl font-black ${match.home.winner ? "text-amber-400" : "text-slate-300"}`}>
                  {match.home.score}
                </span>
                <span className="text-slate-500 text-lg">-</span>
                <span className={`text-2xl font-black ${match.away.winner ? "text-amber-400" : "text-slate-300"}`}>
                  {match.away.score}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <span className="text-white text-sm font-medium truncate">
                  {TEAM_NAMES[match.away.name] || match.away.name}
                </span>
                {match.away.logo && (
                  <Image
                    src={match.away.logo}
                    alt={match.away.name}
                    width={24}
                    height={24}
                    className="object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <span className="text-2xl shrink-0">
                  {TEAM_FLAGS[match.away.name] || "🏳️"}
                </span>
              </div>

              {/* Status */}
              <span className="text-xs text-emerald-400 font-medium shrink-0 bg-emerald-400/10 px-2 py-1 rounded">
                {match.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
