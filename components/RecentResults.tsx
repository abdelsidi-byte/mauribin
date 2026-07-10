"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentMatch {
  id: string;
  date: string;
  home: { name: string; abbr: string; logo: string; score: string; winner: boolean };
  away: { name: string; abbr: string; logo: string; score: string; winner: boolean };
  status: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const day = d.toLocaleDateString("ar-MR", { day: "numeric", month: "short" });
    const time = d.toLocaleTimeString("ar-MR", { hour: "2-digit", minute: "2-digit" });
    return `${day} · ${time}`;
  } catch {
    return iso;
  }
}

export function RecentResults() {
  const [matches, setMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/recent-results");
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-amber-500/20 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-slate-700 rounded w-1/3" />
          <div className="h-14 bg-slate-700 rounded" />
          <div className="h-14 bg-slate-700 rounded" />
          <div className="h-14 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-amber-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-amber-600/20 to-transparent px-5 py-3.5 border-b border-slate-700/50 flex items-center gap-2.5">
        <span className="text-xl">⚽</span>
        <h2 className="text-lg font-bold text-amber-400">آخر النتائج</h2>
        <span className="mr-auto text-xs text-slate-400">آخر 10 مباريات</span>
      </div>

      {/* Matches list */}
      <div className="divide-y divide-slate-700/40">
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`https://www.espn.com/soccer/match/_/gameId/${match.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-700/30 transition-colors active:bg-slate-700/50"
          >
            {/* Date */}
            <div className="w-20 shrink-0">
              <p className="text-[11px] text-slate-400 leading-tight">{formatDate(match.date)}</p>
            </div>

            {/* Home */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-lg font-medium">⚽</span>
              <span className="text-white text-sm font-medium truncate">
                {match.home.name}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-base font-black ${match.home.winner ? "text-amber-400" : "text-slate-300"}`}>
                {match.home.score}
              </span>
              <span className="text-slate-500 text-sm">-</span>
              <span className={`text-base font-black ${match.away.winner ? "text-amber-400" : "text-slate-300"}`}>
                {match.away.score}
              </span>
            </div>

            {/* Away */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
              <span className="text-white text-sm font-medium truncate text-left">
                {match.away.name}
              </span>
              <span className="text-lg font-medium">⚽</span>
            </div>

            {/* Status */}
            <div className="w-10 shrink-0 text-left">
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-400/10 px-1.5 py-0.5 rounded">
                {match.status}
              </span>
            </div>

            {/* Arrow */}
            <span className="text-slate-500 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
