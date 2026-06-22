"use client";

import { useEffect, useMemo, useState } from "react";
import { SCHEDULE } from "@/lib/worldcup-data";

type Vote = "home" | "draw" | "away";

interface MatchVotes {
  // Local aggregates: per option count for this match
  counts: Record<Vote, number>;
  // Has the current user voted on this match?
  userVote?: Vote;
  // Timestamp of user's last vote (for re-vote timing)
  votedAt?: number;
}

interface PredictionsStore {
  // Aggregated fake community votes so the UI has something to show
  community: Record<number, Record<Vote, number>>;
  // Real per-user votes
  user: Record<number, MatchVotes>;
}

const STORAGE_KEY = "mauribin_predictions";

// Deterministic pseudo-random helper so the initial fake tallies stay stable
// across reloads (per match id). This avoids hydration mismatch.
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildInitialStore(): PredictionsStore {
  const upcoming = SCHEDULE.filter((m) => m.status === "upcoming").slice(0, 5);
  const community: Record<number, Record<Vote, number>> = {};
  upcoming.forEach((m, idx) => {
    const base = m.id * 7 + idx;
    const home = 40 + Math.floor(seededRandom(base) * 35);
    const draw = 10 + Math.floor(seededRandom(base + 1) * 20);
    const away = 40 + Math.floor(seededRandom(base + 2) * 35);
    community[m.id] = { home, draw, away };
  });
  return { community, user: {} };
}

function loadStore(): PredictionsStore {
  if (typeof window === "undefined") return buildInitialStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialStore();
    const parsed = JSON.parse(raw) as PredictionsStore;
    // Make sure community section exists for current upcoming matches
    const seeded = buildInitialStore();
    return {
      community: { ...seeded.community, ...(parsed.community || {}) },
      user: parsed.user || {},
    };
  } catch {
    return buildInitialStore();
  }
}

function saveStore(store: PredictionsStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota or disabled — ignore */
  }
}

export default function PredictPage() {
  const [store, setStore] = useState<PredictionsStore>(buildInitialStore);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setHydrated(true);
  }, []);

  // Persist whenever user state changes
  useEffect(() => {
    if (!hydrated) return;
    saveStore(store);
  }, [store, hydrated]);

  const upcomingMatches = useMemo(
    () => SCHEDULE.filter((m) => m.status === "upcoming").slice(0, 5),
    []
  );

  const totalVoters = useMemo(() => {
    return upcomingMatches.reduce((sum, m) => {
      const c = store.community[m.id];
      if (!c) return sum;
      return sum + c.home + c.draw + c.away;
    }, 0);
  }, [store.community, upcomingMatches]);

  function handleVote(matchId: number, vote: Vote) {
    setStore((prev) => {
      const userEntry = prev.user[matchId];
      const community = { ...prev.community };
      const communityEntry = { ...(community[matchId] || { home: 0, draw: 0, away: 0 }) };

      // If user already voted, undo the previous community tally before
      // applying the new vote so totals stay consistent.
      if (userEntry?.userVote && userEntry.userVote !== vote) {
        communityEntry[userEntry.userVote] = Math.max(0, communityEntry[userEntry.userVote] - 1);
      }

      // If user clicks the same option again, treat as a no-op (idempotent).
      if (!userEntry?.userVote || userEntry.userVote !== vote) {
        communityEntry[vote] = communityEntry[vote] + 1;
      }

      community[matchId] = communityEntry;

      return {
        community,
        user: {
          ...prev.user,
          [matchId]: {
            counts: communityEntry,
            userVote: vote,
            votedAt: Date.now(),
          },
        },
      };
    });
  }

  function handleReset(matchId: number) {
    setStore((prev) => {
      const userEntry = prev.user[matchId];
      if (!userEntry?.userVote) return prev;
      const community = { ...prev.community };
      const communityEntry = { ...(community[matchId] || { home: 0, draw: 0, away: 0 }) };
      communityEntry[userEntry.userVote] = Math.max(
        0,
        communityEntry[userEntry.userVote] - 1
      );
      community[matchId] = communityEntry;

      const user = { ...prev.user };
      delete user[matchId];

      return { community, user };
    });
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
          const counts =
            store.community[match.id] || { home: 0, draw: 0, away: 0 };
          const total = counts.home + counts.draw + counts.away;
          const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
          const userEntry = store.user[match.id];
          const hasVoted = !!userEntry?.userVote;

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
                    count={counts.home}
                    percentage={pct(counts.home)}
                    selected={userEntry?.userVote === "home"}
                    disabled={hasVoted}
                    onClick={() => handleVote(match.id, "home")}
                  />
                  <VoteButton
                    label="تعادل"
                    optionKey="draw"
                    color="gold"
                    count={counts.draw}
                    percentage={pct(counts.draw)}
                    selected={userEntry?.userVote === "draw"}
                    disabled={hasVoted}
                    onClick={() => handleVote(match.id, "draw")}
                  />
                  <VoteButton
                    label={`فوز ${match.away}`}
                    optionKey="away"
                    color="red"
                    count={counts.away}
                    percentage={pct(counts.away)}
                    selected={userEntry?.userVote === "away"}
                    disabled={hasVoted}
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
  disabled: boolean;
  onClick: () => void;
}

function VoteButton({
  label,
  color,
  count,
  percentage,
  selected,
  disabled,
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
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "relative overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 text-right",
        "px-4 py-3 disabled:cursor-not-allowed disabled:opacity-70",
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
          {roundedPct}%
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
