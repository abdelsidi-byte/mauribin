"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "./I18nProvider";
import { NewsSection } from "./NewsSection";
import { YesterdayResults } from "./YesterdayResults";
import VideoAdBanner from "./VideoAdBanner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Match = any;
type Article = any;

// ⚽ Goal Animation Component
function GoalCelebration({ team, side, localizeTeamFn }: { team: string; side: "home" | "away"; localizeTeamFn: (n: string) => string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className={`absolute ${side === "home" ? "animate-goal-left" : "animate-goal-right"}`}>
        <div className="bg-gradient-to-r from-[#FFD700]/90 to-[#FFA500]/90 text-black font-black text-2xl px-8 py-4 rounded-2xl shadow-2xl">
          ⚽ {localizeTeamFn(team)}
        </div>
      </div>
      {/* Soccer balls flying */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-ball-fly"
          style={{
            animationDelay: `${i * 0.1}s`,
            left: side === "home" ? "30%" : "70%",
          }}
        >
          ⚽
        </div>
      ))}
    </div>
  );
}

// Next Match Hero Section - only shows truly upcoming matches (kickoff > now)
function NextMatchHero({ match }: { match: Match }) {
  const { t, localizeTeam } = useI18n();
  if (!match) return null;
  
  // DEFENSIVE: never show a finished match as "next match"
  const matchDate = new Date(match.utcDate || match.date);
  const now = new Date();
  const diffMs = matchDate.getTime() - now.getTime();
  
  // If kickoff was more than 30 minutes ago, this is NOT a next match
  if (diffMs < -30 * 60 * 1000) {
    return null;
  }

  // isLive: match is live AND hasn't ended yet
  const isLive = match.state === "live" && diffMs < 0;

  let timeUntil = "قادمة";
  if (!isLive && diffMs > 0) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      timeUntil = `بعد ${Math.floor(hours / 24)} يوم`;
    } else if (hours > 0) {
      timeUntil = `بعد ${hours}س ${mins}د`;
    } else {
      timeUntil = `بعد ${mins} دقيقة`;
    }
  } else if (isLive) {
    timeUntil = t("match.live");
  }
  
  const homeTeam = match.home || match.team1 || "?";
  const awayTeam = match.away || match.team2 || "?";
  const homeCrest = match.homeCrest || match.homeFlag || "";
  const awayCrest = match.awayCrest || match.awayFlag || "";
  const homeFlag = match.homeFlag || match.team1Flag || "🏳️";
  const awayFlag = match.awayFlag || match.team2Flag || "🏳️";

  // Use crest URL if available, otherwise emoji flag
  const homeLogo = homeCrest || homeFlag;
  const awayLogo = awayCrest || awayFlag;
  const isHomeUrl = homeCrest && homeCrest.startsWith("http");
  const isAwayUrl = awayCrest && awayCrest.startsWith("http");
  const homeScore = match.homeScore ?? null;
  const awayScore = match.awayScore ?? null;
  
  return (
    <div className="mb-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">⚽ {isLive ? t("hero.liveMatch") : t("hero.nextMatch")}</h2>
      <div className="bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] rounded-3xl p-8 shadow-2xl border border-[#FFD700]/30">
        {/* Date & Countdown */}
        <div className="text-center mb-6">
          {isLive ? (
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-2xl font-black animate-pulse">{t("match.live")}</span>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </div>
          ) : (
            <p className="text-[#FFD700] text-lg font-bold mb-2">
              {matchDate.toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          )}
          {!isLive && (
            <div className="inline-block bg-black/30 rounded-full px-6 py-2">
              <span className="text-2xl font-black text-white">{timeUntil}</span>
            </div>
          )}
        </div>
        
        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div className="h-24 w-24 mx-auto mb-3 flex items-center justify-center">
              {isHomeUrl ? (
                <img src={homeLogo} alt={homeTeam} loading="lazy" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
              ) : (
                <span className="text-6xl">{homeLogo}</span>
              )}
            </div>
            <h3 className="text-2xl font-black text-white">{localizeTeam(homeTeam)}</h3>
          </div>
          
          {/* VS */}
          <div className="text-center px-6">
            {isLive && homeScore !== null ? (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-white">{homeScore}</span>
                <span className="text-2xl font-black text-[#FFD700]">-</span>
                <span className="text-4xl font-black text-white">{awayScore}</span>
              </div>
            ) : (
              <div className="text-5xl font-black text-[#FFD700]">VS</div>
            )}
            <p className="text-slate-300 mt-2 text-sm">{isLive ? "الدقيقة 45'" : "كأس العالم"}</p>
          </div>
          
          {/* Away Team */}
          <div className="flex-1 text-center">
            <div className="h-24 w-24 mx-auto mb-3 flex items-center justify-center">
              {isAwayUrl ? (
                <img src={awayLogo} alt={awayTeam} loading="lazy" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
              ) : (
                <span className="text-6xl">{awayLogo}</span>
              )}
            </div>
            <h3 className="text-2xl font-black text-white">{localizeTeam(awayTeam)}</h3>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <Link 
            href={`/match/${match.slug || match._index}`}
            className="block w-full bg-[#FFD700] hover:bg-[#FFC000] text-[#0a1628] font-black py-4 rounded-xl text-center text-xl transition-colors"
          >
            {t("details.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Match Card with goal detection
function MatchCard({
  match,
  onGoal,
  localizeTeamFn,
  tFn,
}: {
  match: Match;
  onGoal: (team: string, side: "home" | "away") => void;
  localizeTeamFn: (name: string) => string;
  tFn: (key: string) => string;
}) {
  // Support both data formats
  const homeTeam = match.home || match.team1 || "?";
  const awayTeam = match.away || match.team2 || "?";
  const homeFlag = match.homeFlag || match.team1Flag || "🏳️";
  const awayFlag = match.awayFlag || match.team2Flag || "🏳️";
  const isHomeUrl = homeFlag.startsWith("http");
  const isAwayUrl = awayFlag.startsWith("http");

  const prevScore = useRef<{ home: number | null; away: number | null }>({
    home: match.homeScore,
    away: match.awayScore,
  });

  const isLive = match.state === "live";
  const [showGoal, setShowGoal] = useState<"home" | "away" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect goal
    if (
      match.state === "live" &&
      prevScore.current.home !== null &&
      prevScore.current.away !== null
    ) {
      if (
        match.homeScore !== null &&
        match.homeScore > (prevScore.current.home ?? 0)
      ) {
        setShowGoal("home");
        onGoal(match.home, "home");
        setTimeout(() => setShowGoal(null), 3000);
      } else if (
        match.awayScore !== null &&
        match.awayScore > (prevScore.current.away ?? 0)
      ) {
        setShowGoal("away");
        onGoal(match.away, "away");
        setTimeout(() => setShowGoal(null), 3000);
      }
    }
    prevScore.current = { home: match.homeScore, away: match.awayScore };
  }, [match.homeScore, match.awayScore, match.state, match.home, match.away, onGoal]);

  return (
    <div ref={cardRef} className="relative">
      {showGoal && (
        <GoalCelebration team={showGoal === "home" ? match.home : match.away} side={showGoal} localizeTeamFn={localizeTeamFn} />
      )}
      <Link
        href={`/match/${match.slug || match._index}`}
        className={`group block w-full rounded-2xl p-4 bg-slate-900/90 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-900/20 hover:border-red-500/50 ${
          isLive ? "border-red-500/60 shadow-lg shadow-red-900/20" : "border-slate-700/50"
        }`}
      >
        {/* Live badge */}
        {isLive && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-bold">{tFn("match.live")}</span>
          </div>
        )}

        {/* Teams with centered score */}
        <div className="space-y-2">
          {/* Home */}
          <div className="flex items-center gap-2 min-w-0">
            {isHomeUrl ? (
              <img src={homeFlag} alt={homeTeam} loading="lazy" className="w-6 h-6 object-contain shrink-0 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <span className="text-xl shrink-0">{homeFlag}</span>
            )}
            <span className="text-white font-medium text-xs flex-1 min-w-0 truncate">{localizeTeamFn(homeTeam)}</span>
            <span className={`text-xl font-black text-center min-w-[24px] ${
              showGoal === "home" ? "text-[#FFD700] animate-pulse" : isLive ? "text-white" : "text-slate-300"
            }`}>
              {match.homeScore !== null ? match.homeScore : (isLive ? "0" : "-")}
            </span>
          </div>

          {/* Away */}
          <div className="flex items-center gap-2 min-w-0">
            {isAwayUrl ? (
              <img src={awayFlag} alt={awayTeam} loading="lazy" className="w-6 h-6 object-contain shrink-0 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <span className="text-xl shrink-0">{awayFlag}</span>
            )}
            <span className="text-white font-medium text-xs flex-1 min-w-0 truncate">{localizeTeamFn(awayTeam)}</span>
            <span className={`text-xl font-black text-center min-w-[24px] ${
              showGoal === "away" ? "text-[#FFD700] animate-pulse" : isLive ? "text-white" : "text-slate-300"
            }`}>
              {match.awayScore !== null ? match.awayScore : (isLive ? "0" : "-")}
            </span>
          </div>
        </div>

        {/* Time / Status */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">{match.state === "ft" || match.state === "finished" ? tFn("match.finished") : match.state === "upcoming" ? tFn("match.upcoming") : match.label}</span>
        </div>
      </Link>
    </div>
  );
}

// Auto-refresh indicator
function RefreshIndicator({ countdown }: { countdown: number }) {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/90 border border-slate-700/50 backdrop-blur-sm">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-xs text-slate-400">تحديث تلقائي</span>
      <span className="text-xs text-green-400 font-bold">{countdown}s</span>
    </div>
  );
}

// Live notification toast
function GoalToast({ goals, localizeTeamFn }: { goals: { team: string; side: "home" | "away" }[]; localizeTeamFn: (n: string) => string }) {
  if (goals.length === 0) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {goals.map((g, i) => (
        <div
          key={i}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black px-6 py-3 rounded-xl shadow-2xl animate-slide-down"
        >
          ⚽ {localizeTeamFn(g.team)}
        </div>
      ))}
    </div>
  );
}

interface ClientHomeProps {
  matches: Match[];
  articles: Article[];
  worldCupMatches?: Match[];
}

export function ClientHome({ matches: initialMatches, articles, worldCupMatches = [] }: ClientHomeProps) {
  const { t, localizeTeam } = useI18n();
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [countdown, setCountdown] = useState(10);
  const [recentGoals, setRecentGoals] = useState<{ team: string; side: "home" | "away" }[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use ref to avoid stale closure in intervals
  const matchesRef = useRef<Match[]>(initialMatches);
  matchesRef.current = matches;

  // Track last manual refresh to pause auto-refresh briefly
  const lastManualRefresh = useRef<number>(0);

  const shouldSkipRefresh = () => Date.now() - lastManualRefresh.current < 10000;

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (shouldSkipRefresh()) {
        console.log("[AUTO-REFRESH] Skipped - recent manual refresh");
        return;
      }

      const scrollY = window.scrollY;
      const currentMatches = matchesRef.current;

      try {
        setIsRefreshing(true);
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          // Detect new goals using current (fresh) matches
          const newGoals: { team: string; side: "home" | "away" }[] = [];
          data.matches.forEach((newMatch: Match) => {
            const oldMatch = currentMatches.find(
              (m) => m.home === newMatch.home && m.away === newMatch.away
            );
            if (oldMatch && newMatch.state === "live") {
              if (
                newMatch.homeScore !== null &&
                oldMatch.homeScore !== null &&
                newMatch.homeScore > oldMatch.homeScore
              ) {
                newGoals.push({ team: newMatch.home, side: "home" });
              }
              if (
                newMatch.awayScore !== null &&
                oldMatch.awayScore !== null &&
                newMatch.awayScore > oldMatch.awayScore
              ) {
                newGoals.push({ team: newMatch.away, side: "away" });
              }
            }
          });
          if (newGoals.length > 0) {
            setRecentGoals(newGoals);
            setTimeout(() => setRecentGoals([]), 4000);
          }

          setMatches(data.matches);
          setLastUpdate(new Date());

          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
          });
        }
      } catch (e) {
        console.error("Auto-refresh failed:", e);
      } finally {
        setIsRefreshing(false);
      }
      setCountdown(10);
    }, 10000);

    const countdownInterval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []); // Empty deps - interval uses refs, not closure values

  // Manual refresh handler (call this from a button)
  const handleManualRefresh = useCallback(() => {
    lastManualRefresh.current = Date.now();
    setIsRefreshing(true);
    fetch("/api/live-scores")
      .then((res) => res.json())
      .then((data) => {
        if (data.matches) {
          setMatches(data.matches);
          setLastUpdate(new Date());
        }
        setIsRefreshing(false);
        setCountdown(30);
      })
      .catch(() => setIsRefreshing(false));
  }, []);

  const handleGoal = useCallback((team: string, side: "home" | "away") => {
    setRecentGoals((prev) => [...prev, { team, side }]);
    setTimeout(() => {
      setRecentGoals((prev) => prev.filter((g) => !(g.team === team && g.side === side)));
    }, 4000);
  }, []);

  // Combine and deduplicate live matches by slug
  const liveMatches = matches.filter((m) => m.state === "live");
  const finishedMatches = matches.filter((m) => m.state === "ft" || m.state === "finished");
  const upcomingMatches = matches.filter((m) => m.state === "upcoming");

  // World Cup matches
  const wcLiveMatches = worldCupMatches.filter((m) => m.state === "live");
  const wcFinishedMatches = worldCupMatches.filter((m) => m.state === "ft");
  const wcUpcomingMatches = worldCupMatches.filter((m) => m.state === "upcoming");

  // Deduplicated live matches - by team pair, not slug
  const allLiveMatches = [...liveMatches, ...wcLiveMatches];
  const seenTeams = new Set<string>();
  const uniqueLiveMatches = allLiveMatches.filter((m) => {
    const key = `${m.home}|${m.away}`.toLowerCase();
    if (seenTeams.has(key)) return false;
    seenTeams.add(key);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006233]/8 via-slate-950 to-slate-950">
      <GoalToast goals={recentGoals} localizeTeamFn={localizeTeam} />
      <RefreshIndicator countdown={countdown} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-6 pb-16 relative">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#006233]/15 border border-[#FFD700]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD700] live-dot" />
              <span className="text-[#FFD700] text-sm font-bold">{t("hero.worldCup")}</span>
              <span className="text-slate-400 text-xs">
                {lastUpdate.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-3">
              <span className="bg-gradient-to-r from-[#FFD700] via-yellow-200 to-[#FFD700] bg-clip-text text-transparent">
                Mauribin
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              موقعك لأخبار كرة القدم بالعربية — نتائج مباشرة، جداول المباريات، أخبار الانتقالات
            </p>
          </div>

          {/* Featured LIVE Matches - Sofascore Style */}
          {uniqueLiveMatches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  {t("hero.liveNow")} ({uniqueLiveMatches.length})
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {uniqueLiveMatches.map((match) => (
                  <div key={match.slug || match._index} className="w-full">
                    <MatchCard match={match} onGoal={handleGoal} localizeTeamFn={localizeTeam} tFn={t} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Match Hero - South Africa vs South Korea */}
          {upcomingMatches.length > 0 && (
            <NextMatchHero match={upcomingMatches[0] as Match} />
          )}

          {/* Results - Horizontal Scroll */}
          {(finishedMatches.length > 0 || wcFinishedMatches.length > 0) && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-xl">⚽</span> {t("hero.results")} ({finishedMatches.length + wcFinishedMatches.length})
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {finishedMatches.map((match) => (
                  <MatchCard key={match._index} match={match} onGoal={handleGoal} localizeTeamFn={localizeTeam} tFn={t} />
                ))}
                {wcFinishedMatches.slice(0, 10).map((match, idx) => (
                  <MatchCard key={`wc-ft-${idx}`} match={match as Match} onGoal={handleGoal} localizeTeamFn={localizeTeam} tFn={t} />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday's Results */}
          <YesterdayResults />

          {/* Upcoming - Horizontal Scroll */}
          {(upcomingMatches.length > 0 || wcUpcomingMatches.length > 0) && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-xl">📅</span> {t("hero.upcoming")} ({upcomingMatches.length + wcUpcomingMatches.length})
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match._index} match={match} onGoal={handleGoal} localizeTeamFn={localizeTeam} tFn={t} />
                ))}
                {wcUpcomingMatches.slice(0, 10).map((match, idx) => (
                  <MatchCard key={`wc-up-${idx}`} match={match as Match} onGoal={handleGoal} localizeTeamFn={localizeTeam} tFn={t} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {matches.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚽</div>
              <p className="text-slate-400">{t("hero.noMatches")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Ad Banner */}
      <VideoAdBanner />

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes goal-left {
          0% { transform: translateX(-100px); opacity: 0; }
          20% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(0); opacity: 0; }
        }
        @keyframes goal-right {
          0% { transform: translateX(100px); opacity: 0; }
          20% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(0); opacity: 0; }
        }
        @keyframes ball-fly {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
        }
        @keyframes slide-down {
          0% { transform: translateY(-100px); opacity: 0; }
          20% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(0); opacity: 0; }
        }
        .animate-goal-left { animation: goal-left 3s ease-out forwards; }
        .animate-goal-right { animation: goal-right 3s ease-out forwards; }
        .animate-ball-fly { animation: ball-fly 1.5s ease-out forwards; }
        .animate-slide-down { animation: slide-down 4s ease-out forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
