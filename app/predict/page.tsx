"use client";

import { useEffect, useMemo, useState } from "react";
import { SCHEDULE } from "@/lib/worldcup-data";

type Vote = "home" | "draw" | "away";

interface MatchCounts {
  home: number;
  draw: number;
  away: number;
}

const USER_ID_KEY = "mauribin_user_id";

function getUserId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`;
    window.localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export default function PredictPage() {
  const [counts, setCounts] = useState<Record<number, MatchCounts>>({});
  const [userVotes, setUserVotes] = useState<Record<number, Vote>>({});
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Load all predictions from API + user votes from localStorage
  useEffect(() => {
    const userId = getUserId();
    
    // Load all predictions
    fetch("/api/predictions")
      .then((r) => r.json())
      .then((data) => {
        if (data.predictions) {
          const map: Record<number, MatchCounts> = {};
          Object.entries(data.predictions).forEach(([id, c]: [string, any]) => {
            map[parseInt(id)] = {
              home: c.home,
              draw: c.draw,
              away: c.away,
            };
          });
          setCounts(map);
        }
      })
      .catch(() => {});
    
    // Load user's votes
    try {
      const raw = window.localStorage.getItem("mauribin_user_votes");
      if (raw) setUserVotes(JSON.parse(raw));
    } catch {}
    
    setHydrated(true);
  }, []);

  // Save user votes
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("mauribin_user_votes", JSON.stringify(userVotes));
  }, [userVotes, hydrated]);

  const upcomingMatches = useMemo(
    () => SCHEDULE.filter((m) => m.status === "upcoming").slice(0, 8),
    []
  );

  const totalVoters = useMemo(() => {
    return Object.values(counts).reduce(
      (sum, c) => sum + c.home + c.draw + c.away,
      0
    );
  }, [counts]);

  async function handleVote(matchId: number, vote: Vote) {
    const userId = getUserId();
    setLoading(`${matchId}_${vote}`);
    
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, vote, userId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setCounts((prev) => ({ ...prev, [matchId]: data.counts }));
        setUserVotes((prev) => ({ ...prev, [matchId]: vote }));
      }
    } catch (e) {
      // Fallback: save locally only
      setUserVotes((prev) => ({ ...prev, [matchId]: vote }));
      setCounts((prev) => {
        const current = prev[matchId] || { home: 0, draw: 0, away: 0 };
        const prevVote = userVotes[matchId];
        const updated = { ...current };
        if (prevVote) updated[prevVote] = Math.max(0, updated[prevVote] - 1);
        updated[vote] = updated[vote] + 1;
        return { ...prev, [matchId]: updated };
      });
    } finally {
      setLoading(null);
    }
  }

  function handleReset(matchId: number) {
    const userId = getUserId();
    const userVote = userVotes[matchId];
    if (!userVote) return;
    
    // Remove user vote locally
    setUserVotes((prev) => {
      const { [matchId]: _, ...rest } = prev;
      return rest;
    });
    
    // Decrement count locally
    setCounts((prev) => {
      const current = prev[matchId] || { home: 0, draw: 0, away: 0 };
      return {
        ...prev,
        [matchId]: {
          ...current,
          [userVote]: Math.max(0, current[userVote] - 1),
        },
      };
    });
    
    // Send reset to API (re-vote with null isn't supported, so this just removes user's local vote)
    fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, vote: userVote, userId, reset: true }),
    }).catch(() => {});
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006233]/15 to-transparent" />
        <div className="container mx-auto px-4 pt-8 pb-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 mb-4">
              <span className="text-xl">⚽</span>
              <span className="text-[#ffd700] text-sm font-medium">كأس العالم 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="gradient-text">توقعات المباريات</span>
            </h1>
            <p className="text-slate-400 mb-4">
              صوّت لنتيجة المباريات القادمة وشارك توقعاتك مع المشجعين
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#006233] animate-pulse" />
              <span className="text-slate-300 text-sm">
                إجمالي المصوّتين:{" "}
                <span className="text-[#ffd700] font-bold">{totalVoters.toLocaleString("ar-EG")}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-6">
        {upcomingMatches.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-slate-300">
            لا توجد مباريات قادمة للتوقع عليها حالياً.
          </div>
        )}

        {upcomingMatches.map((match) => {
          const matchCounts =
            counts[match.id] || { home: 0, draw: 0, away: 0 };
          const total = matchCounts.home + matchCounts.draw + matchCounts.away;
          const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
          const userVote = userVotes[match.id];
          const hasVoted = !!userVote;

          return (
            <div
              key={match.id}
              className="glass rounded-2xl overflow-hidden border border-white/10 card-hover"
            >
              {/* Match header */}
              <div className="bg-gradient-to-r from-[#006233]/25 via-transparent to-[#d01c1f]/25 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">
                    {match.label || match.group || match.stage}
                  </span>
                  <span>
                    {match.date} • {match.time}
                  </span>
                </div>
                <div className="text-xs text-slate-400 hidden sm:block">
                  📍 {match.venue}، {match.city}
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-3 items-center gap-4 px-6 py-8 relative">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-6xl md:text-7xl drop-shadow-lg leading-none">
                    {match.homeFlag}
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    {match.home}
                  </span>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass border border-[#ffd700]/30 mb-2">
                    <span className="text-[#ffd700] font-black text-lg">VS</span>
                  </div>
                  <div className="text-xs text-slate-400">{match.time}</div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-6xl md:text-7xl drop-shadow-lg leading-none">
                    {match.awayFlag}
                  </span>
                  <span className="text-white font-bold text-sm md:text-base">
                    {match.away}
                  </span>
                </div>
              </div>

              {/* Voting */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <VoteButton
                    label={`فوز ${match.home}`}
                    optionKey="home"
                    color="green"
                    count={matchCounts.home}
                    percentage={pct(matchCounts.home)}
                    selected={userVote === "home"}
                    loading={loading === `${match.id}_home`}
                    onClick={() => handleVote(match.id, "home")}
                  />
                  <VoteButton
                    label="تعادل"
                    optionKey="draw"
                    color="gold"
                    count={matchCounts.draw}
                    percentage={pct(matchCounts.draw)}
                    selected={userVote === "draw"}
                    loading={loading === `${match.id}_draw`}
                    onClick={() => handleVote(match.id, "draw")}
                  />
                  <VoteButton
                    label={`فوز ${match.away}`}
                    optionKey="away"
                    color="red"
                    count={matchCounts.away}
                    percentage={pct(matchCounts.away)}
                    selected={userVote === "away"}
                    loading={loading === `${match.id}_away`}
                    onClick={() => handleVote(match.id, "away")}
                  />
                </div>

                {/* Footer row */}
                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-400">
                    عدد المصوّتين:{" "}
                    <span className="text-white font-semibold">
                      {total.toLocaleString("ar-EG")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {hasVoted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#006233]/20 border border-[#006233]/40 text-[#a3e3b6] text-xs font-semibold">
                        ✓ شكراً لتصويتك
                      </span>
                    )}
                    {hasVoted && (
                      <button
                        type="button"
                        onClick={() => handleReset(match.id)}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
                        aria-label="إعادة التصويت"
                      >
                        ↺ إعادة التصويت
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface VoteButtonProps {
  label: string;
  optionKey: Vote;
  color: "green" | "gold" | "red";
  count: number;
  percentage: number;
  selected: boolean;
  loading: boolean;
  onClick: () => void;
}

function VoteButton({
  label,
  color,
  count,
  percentage,
  selected,
  loading,
  onClick,
}: VoteButtonProps) {
  const colorStyles = useMemo(() => {
    switch (color) {
      case "green":
        return {
          base: "border-[#006233]/40 hover:border-[#006233] hover:bg-[#006233]/10",
          bar: "bg-[#006233]",
          glow: "shadow-[0_0_24px_-8px_rgba(0,98,51,0.6)]",
          selected: "border-[#006233] bg-[#006233]/20 text-white",
        };
      case "gold":
        return {
          base: "border-[#ffd700]/40 hover:border-[#ffd700] hover:bg-[#ffd700]/10",
          bar: "bg-[#ffd700]",
          glow: "shadow-[0_0_24px_-8px_rgba(255,215,0,0.6)]",
          selected: "border-[#ffd700] bg-[#ffd700]/20 text-white",
        };
      case "red":
        return {
          base: "border-[#d01c1f]/40 hover:border-[#d01c1f] hover:bg-[#d01c1f]/10",
          bar: "bg-[#d01c1f]",
          glow: "shadow-[0_0_24px_-8px_rgba(208,28,31,0.6)]",
          selected: "border-[#d01c1f] bg-[#d01c1f]/20 text-white",
        };
    }
  }, [color]);

  const styles = colorStyles!;
  const roundedPct = Math.round(percentage);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={selected || loading}
      aria-pressed={selected}
      className={[
        "relative overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 text-right",
        "px-4 py-3 disabled:cursor-not-allowed",
        selected ? styles.selected : styles.base,
        selected ? styles.glow : "",
      ].join(" ")}
    >
      {/* Progress fill */}
      <div
        className={`absolute inset-y-0 right-0 ${styles.bar} opacity-15 transition-all duration-700 ease-out`}
        style={{ width: `${percentage}%` }}
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between gap-2">
        <span className="font-bold text-sm md:text-base text-white">{label}</span>
        <span className="text-xs font-bold text-slate-200">
          {loading ? "..." : `${roundedPct}%`}
        </span>
      </div>

      <div className="relative mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full ${styles.bar} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="relative mt-1 text-[10px] text-slate-300">
        {count.toLocaleString("ar-EG")} صوت
      </div>

      {selected && (
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-900">
          ✓
        </span>
      )}
    </button>
  );
}