"use client";
import { useEffect, useState } from "react";

interface Match {
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
}

export function LiveScoresTicker() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches) setMatches(data.matches);
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || matches.length === 0) return null;

  const liveMatches = matches.filter((m) => m.state === "live");

  return (
    <div className="w-full bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 overflow-hidden">
      {liveMatches.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-green-600 animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full" />
          <span className="text-xs font-bold tracking-widest text-white">مباشر</span>
        </div>
      )}
      <div className="relative overflow-hidden">
        <div className="animate-ticker">
          {[...matches, ...matches].map((match, i) => (
            <div
              key={`${match.home}-${match.away}-${i}`}
              className="flex items-center gap-2 px-6 py-2 whitespace-nowrap border-slate-700"
              style={{ borderLeftWidth: "1px" }}
            >
              <span className="text-lg">{match.homeFlag}</span>
              <span className="text-sm font-medium text-white">{match.home}</span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                match.state === "live" ? "bg-green-600 text-white" : "bg-slate-700 text-slate-200"
              }`}>
                {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
              </span>
              <span className="text-sm font-medium text-white">{match.away}</span>
              <span className="text-lg">{match.awayFlag}</span>
              {match.state === "live" && (
                <span className="text-xs font-bold text-green-300">● مباشر</span>
              )}
              {match.state === "upcoming" && (
                <span className="text-xs text-slate-400">{match.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
