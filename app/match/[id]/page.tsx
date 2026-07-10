"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { MATCH_DATA, localizeTeam, getFlag } from "./matchData";
import { MatchStatsPanel } from "@/components/MatchStatsPanel";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "stats" | "events" | "cards" | "h2h";

interface LiveStats {
  home: {
    possession: string;
    shots: string;
    shotsOnTarget: string;
    corners: string;
    fouls: string;
    yellowCards: string;
    redCards: string;
    offsides: string;
    passes: string;
    passAccuracy: string;
  };
  away: {
    possession: string;
    shots: string;
    shotsOnTarget: string;
    corners: string;
    fouls: string;
    yellowCards: string;
    redCards: string;
    offsides: string;
    passes: string;
    passAccuracy: string;
  };
}

interface LiveEvent {
  type: string;
  minute: string;
  text: string;
  team?: "home" | "away";
  scorer?: string;
}

interface LiveData {
  id: string;
  date: string;
  venue: string;
  status: string;
  homeTeam: { name: string; abbr: string; logo: string; score: string };
  awayTeam: { name: string; abbr: string; logo: string; score: string };
  stats: LiveStats;
  goals: LiveEvent[];
  events: LiveEvent[];
}

// ─── Event Icon ───────────────────────────────────────────────────────────────
function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    "goal":"⚽","1st-half-goal":"⚽","2nd-half-goal":"⚽",
    "yellow-card":"🟨","caution":"🟨",
    "red-card":"🟥","sending-off":"🟥",
    "substitution":"🔄",
    "kickoff":"▶️","start-2nd-half":"▶️",
    "halftime":"⏸️",
    "full-time":"🏁","end-regular-time":"🏁",
  };
  return icons[type] || "•";
}

// ─── Loading ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-56 bg-slate-800 rounded-2xl" />
      <div className="h-40 bg-slate-800 rounded-2xl" />
      <div className="h-64 bg-slate-800 rounded-2xl" />
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <h2 className="text-2xl font-bold text-white mb-2">المباراة غير موجودة</h2>
        <p className="text-slate-400 mb-6">تعذر العثور على هذه المباراة</p>
        <button onClick={onBack} className="bg-[#006233] hover:bg-[#004225] text-white font-bold px-6 py-3 rounded-xl transition-colors">
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

// ─── Match Stats (from embedded data) ─────────────────────────────────────────
const STAT_LABELS: Record<string, string> = {
  "Shots":"التسديدات","Shots on Goal":"التسديدات على المرمى","Shots off Goal":"التسديدات خارج المرمى",
  "Blocked Shots":"تسديدات محظورة","Free Kicks":"الركلات الحرة",
  "Corner Kicks":"الكرات Corner","Offsides":"التسلل",
  "Goalkeeper Saves":"تصديات الحارس","Fouls":"الأخطاء",
  "Yellow Cards":"البطاقات الصفراء","Red Cards":"البطاقات الحمراء",
  "Passes":"التمريرات","Pass Accuracy":"دقة التمرير",
  "Ball Possession":"الاستحواذ","Saves":"التصديات",
  "Duels":"الصراعات","Aerials Won":"الكرات الهوائية",
  "Tackles":"الاعتراضات","Interceptions":"التهديدات","Clearances":"التنظيفات",
};
function tStat(s: string): string { return STAT_LABELS[s] || s; }

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function TabOverview({ m, liveData }: { m: typeof MATCH_DATA[0]; liveData?: LiveData | null }) {
  const statsEntries = Object.entries(m.stats ?? {});
  const hasStats = statsEntries.length > 0;
  // Prefer live stats when available
  const useLive = liveData?.stats;
  const liveStats = useLive ? [
    { type: "Ball Possession", home: `${liveData!.stats.home.possession}%`, away: `${liveData!.stats.away.possession}%` },
    { type: "Shots", home: liveData!.stats.home.shots, away: liveData!.stats.away.shots },
    { type: "Shots on Goal", home: liveData!.stats.home.shotsOnTarget, away: liveData!.stats.away.shotsOnTarget },
    { type: "Corner Kicks", home: liveData!.stats.home.corners, away: liveData!.stats.away.corners },
    { type: "Fouls", home: liveData!.stats.home.fouls, away: liveData!.stats.away.fouls },
    { type: "Offsides", home: liveData!.stats.home.offsides, away: liveData!.stats.away.offsides },
  ] : null;

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#FFD700] text-sm font-bold">{m.league || "كأس العالم 2026"}</span>
          {m.group && <span className="text-slate-400 text-xs">{m.group}</span>}
        </div>
        {liveData?.venue && <p className="text-slate-400 text-sm mb-3">🏟️ {liveData.venue}</p>}
        <div className="flex items-center justify-center gap-3">
          {m.state === "live" && (
            <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              مباشر • {m.elapsed || 0}'
            </div>
          )}
          {m.state === "ft" && <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">انتهت</span>}
          {m.state === "upcoming" && <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">قادمة</span>}
        </div>
      </div>

      {/* Live Stats — using MatchStatsPanel */}
      {(liveStats || (hasStats && statsEntries.length > 0)) && (
        <MatchStatsPanel
          homeTeam={{ name: localizeTeam(m.home), flag: getFlag(m.home) }}
          awayTeam={{ name: localizeTeam(m.away), flag: getFlag(m.away) }}
          stats={(liveStats || statsEntries.map(([type, vals]) => ({ type, home: (vals as any).home, away: (vals as any).away })))}
          isLive={m.state === "live"}
          elapsed={m.elapsed}
        />
      )}

      {(!liveStats && (!hasStats || statsEntries.length === 0)) && (
        <div className="bg-slate-800 rounded-2xl p-5 text-center">
          <p className="text-slate-400">الإحصائيات غير متوفرة لهذه المباراة</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Events ──────────────────────────────────────────────────────────────
function TabEvents({ events, liveEvents }: { events: typeof MATCH_DATA[0]["events"]; liveEvents?: LiveEvent[] }) {
  // Prefer live events from ESPN
  const allEvents = liveEvents && liveEvents.length > 0 ? liveEvents : events || [];
  if (!allEvents || allEvents.length === 0) return <div className="text-center text-slate-400 py-10">لا توجد أحداث</div>;
  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#FFD700]">📋 أحداث المباراة</h3>
        {liveEvents && liveEvents.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            مباشر
          </span>
        )}
      </div>
      <div className="space-y-2">
        {allEvents.map((ev, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${
            (ev as any).type?.includes("goal") ? "bg-[#006233]/20" : "bg-slate-700/50"
          }`}>
            <span className="text-[#FFD700] font-black text-sm w-10 text-center">{(ev as any).minute}'</span>
            <span className="text-2xl">{getEventIcon((ev as any).type || "")}</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{(ev as any).player || (ev as any).text || (ev as any).scorer || "—"}</p>
              {(ev as any).assist && <p className="text-slate-400 text-xs">⬆️ {(ev as any).assist}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Cards (Yellow/Red) ──────────────────────────────────────────────────
function TabCards({ liveData, m }: { liveData?: LiveData | null; m: typeof MATCH_DATA[0] }) {
  // Use live data if available
  const liveHomeYellow = parseInt(liveData?.stats.home.yellowCards || "0");
  const liveAwayYellow = parseInt(liveData?.stats.away.yellowCards || "0");
  const liveHomeRed = parseInt(liveData?.stats.home.redCards || "0");
  const liveAwayRed = parseInt(liveData?.stats.away.redCards || "0");

  // Fallback to embedded events
  const cardEvents = (liveData?.events || m.events || []).filter((e: any) =>
    e.type?.includes("card") || e.type?.includes("yellow") || e.type?.includes("red")
  );

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <h3 className="text-lg font-bold text-[#FFD700] mb-4">🟨🟥 ملخص البطاقات</h3>

        {/* Home team cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getFlag(m.home)}</span>
              <span className="text-white font-bold">{localizeTeam(m.home)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-2xl">🟨</span>
                <span className="text-white font-black text-lg">{liveHomeYellow}</span>
              </div>
              {liveHomeRed > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-2xl">🟥</span>
                  <span className="text-white font-black text-lg">{liveHomeRed}</span>
                </div>
              )}
            </div>
          </div>

          {/* Away team cards */}
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getFlag(m.away)}</span>
              <span className="text-white font-bold">{localizeTeam(m.away)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-2xl">🟨</span>
                <span className="text-white font-black text-lg">{liveAwayYellow}</span>
              </div>
              {liveAwayRed > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-2xl">🟥</span>
                  <span className="text-white font-black text-lg">{liveAwayRed}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!liveData && (
          <p className="text-slate-400 text-xs text-center mt-4">
            ℹ️ العدّ التفصيلي متاح للمباريات المباشرة فقط
          </p>
        )}
      </div>

      {/* Individual card events */}
      {cardEvents.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-[#FFD700] mb-4">📋 البطاقات بالتفصيل</h3>
          <div className="space-y-2">
            {cardEvents.map((ev: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50">
                <span className="text-[#FFD700] font-black text-sm w-10 text-center">{ev.minute}'</span>
                <span className="text-2xl">{getEventIcon(ev.type || "")}</span>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{ev.text || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Stats (Detailed) ────────────────────────────────────────────────────
function TabStatsDetailed({ m, liveData }: { m: typeof MATCH_DATA[0]; liveData?: LiveData | null }) {
  const statsEntries = Object.entries(m.stats ?? {});
  const useLive = liveData?.stats;

  const detailedStats = useLive ? [
    { type: "Ball Possession", home: `${liveData!.stats.home.possession}%`, away: `${liveData!.stats.away.possession}%` },
    { type: "Shots", home: liveData!.stats.home.shots, away: liveData!.stats.away.shots },
    { type: "Shots on Goal", home: liveData!.stats.home.shotsOnTarget, away: liveData!.stats.away.shotsOnTarget },
    { type: "Passes", home: liveData!.stats.home.passes, away: liveData!.stats.away.passes },
    { type: "Pass Accuracy", home: `${liveData!.stats.home.passAccuracy}%`, away: `${liveData!.stats.away.passAccuracy}%` },
    { type: "Corner Kicks", home: liveData!.stats.home.corners, away: liveData!.stats.away.corners },
    { type: "Fouls", home: liveData!.stats.home.fouls, away: liveData!.stats.away.fouls },
    { type: "Offsides", home: liveData!.stats.home.offsides, away: liveData!.stats.away.offsides },
    { type: "Yellow Cards", home: liveData!.stats.home.yellowCards, away: liveData!.stats.away.yellowCards },
    { type: "Red Cards", home: liveData!.stats.home.redCards, away: liveData!.stats.away.redCards },
  ] : statsEntries.map(([type, vals]) => ({ type, home: (vals as any).home, away: (vals as any).away }));

  if (detailedStats.length === 0) {
    return <p className="text-slate-400 text-center py-8">الإحصائيات غير متوفرة</p>;
  }

  return (
    <MatchStatsPanel
      homeTeam={{ name: localizeTeam(m.home), flag: getFlag(m.home) }}
      awayTeam={{ name: localizeTeam(m.away), flag: getFlag(m.away) }}
      stats={detailedStats}
      isLive={m.state === "live"}
      elapsed={m.elapsed}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id || "";
  const [tab, setTab] = useState<Tab>("overview");
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);

  // Find match from embedded data using slug
  const match = MATCH_DATA.find(m => {
    if (m.slug?.toLowerCase() === id.toLowerCase()) return true;
    if (m.slug?.toLowerCase().replace(/-/g, " ") === id.toLowerCase().replace(/-/g, " ")) return true;
    if (m.id && String(m.id) === id) return true;
    return false;
  });

  // Fetch live stats from ESPN API (real-time)
  useEffect(() => {
    if (!match?.espnId && !match?.id) return;

    let cancelled = false;
    setLiveLoading(true);

    const fetchLive = async () => {
      try {
        // Try ESPN first using espnId or match id
        const espnId = match.espnId || match.id;
        const res = await fetch(`/api/match-detail/${espnId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("ESPN failed");
        const data = await res.json();
        if (!cancelled && data && data.stats) {
          setLiveData(data);
        }
      } catch (err) {
        console.warn("[match-page] ESPN live fetch failed:", err);
      } finally {
        if (!cancelled) setLiveLoading(false);
      }
    };

    fetchLive();
    // Refresh every 30s if match is live
    const interval = match?.state === "live" ? setInterval(fetchLive, 30000) : null;

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [match?.id, match?.espnId, match?.state]);

  if (!match) {
    return <ErrorState onBack={() => router.push("/")} />;
  }

  const { home, away } = match;
  const homeFlag = getFlag(home);
  const awayFlag = getFlag(away);
  const homeName = localizeTeam(home);
  const awayName = localizeTeam(away);

  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const isLive = match.state === "live";
  const isFinished = match.state === "ft";
  const isUpcoming = match.state === "upcoming";

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "نظرة عامة" },
    { key: "stats", label: "الإحصائيات" },
    { key: "events", label: "الأحداث" },
    { key: "cards", label: "🟨 البطاقات" },
    { key: "h2h", label: "مواجهات سابقة" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] py-6 px-4 border-b-4 border-[#FFD700]">
        <div className="max-w-4xl mx-auto">
          {/* Back + League */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => router.push("/")} className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <span className="text-[#FFD700] text-sm font-bold">{match.league || "كأس العالم 2026"}</span>
              {match.group && <p className="text-white/60 text-xs">{match.group}</p>}
            </div>
            <div className="w-8" />
          </div>

          {/* Date */}
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm">{match.label || match.date}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              {isLive && (
                <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  مباشر • {match.elapsed || 0}'
                </div>
              )}
              {isFinished && <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">انتهت</span>}
              {isUpcoming && <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">قادمة</span>}
            </div>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                <span className="text-5xl">{homeFlag}</span>
              </div>
              <h2 className="text-xl font-black text-white">{homeName}</h2>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              {!isUpcoming ? (
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white">{homeScore}</span>
                  <span className="text-3xl font-black text-[#FFD700]">:</span>
                  <span className="text-5xl font-black text-white">{awayScore}</span>
                </div>
              ) : (
                <div className="text-5xl font-black text-[#FFD700]">VS</div>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                <span className="text-5xl">{awayFlag}</span>
              </div>
              <h2 className="text-xl font-black text-white">{awayName}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-center text-sm font-bold whitespace-nowrap transition-all ${
                tab === t.key
                  ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-slate-900/50"
                  : "text-slate-400 border-b-2 border-transparent hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto p-4">
        {tab === "overview" && <TabOverview m={match} liveData={liveData} />}
        {tab === "stats" && <TabStatsDetailed m={match} liveData={liveData} />}
        {tab === "events" && <TabEvents events={match.events || []} liveEvents={liveData?.events} />}
        {tab === "cards" && <TabCards liveData={liveData} m={match} />}
        {tab === "h2h" && (
          <div className="text-center text-slate-400 py-10">
            <p>المواجهات السابقة غير متوفرة</p>
            <p className="text-sm mt-2">ستضاف قريباً</p>
          </div>
        )}
      </div>

      {/* Back CTA */}
      <div className="max-w-4xl mx-auto p-4 pb-8">
        <button onClick={() => router.push("/")} className="block w-full bg-[#006233] hover:bg-[#004225] text-white font-black py-4 rounded-xl text-center transition-colors">
          العودة للرئيسية ⚽
        </button>
      </div>
    </div>
  );
}
