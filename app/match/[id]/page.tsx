"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Team = {
  id: number;
  name: string;
  originalName: string;
  logo: string;
  flag: string;
};

type MatchDetail = {
  fixture_id: string;
  slug: string;
  league: { id: number; name: string; flag: string };
  round: string;
  date: string;
  venue: string;
  referee: string;
  home: Team;
  away: Team;
  status: string;
  statusShort: string;
  elapsed: number;
  homeScore: number;
  awayScore: number;
  isLive: boolean;
  isFinished: boolean;
  formattedDate: string;
  statistics: Array<{ type: string; home: string; away: string }>;
  events: Array<{ elapsed: number; minute: string; team_name: string; player: string; assist: string; type: string; detail: string; icon: string }>;
  lineups: any[];
  h2h: any[];
};

type Tab = "overview" | "stats" | "events" | "h2h";

// ─── Translation Map ──────────────────────────────────────────────────────────
const STAT_LABELS: Record<string, string> = {
  "Shots":"الكرات", "Shots on Goal":"التسديدات", "Shots off Goal":"خارج المرمى",
  "Blocked Shots":"تسديدات محظورة", "Free Kicks":"الركلات الحرة",
  "Corner Kicks":"الركلات Corner", "Offsides":"التسلل",
  "Goalkeeper Saves":"تصديات الحارس", "Fouls":"الأخطاء",
  "Yellow Cards":"البطاقات الصفراء", "Red Cards":"البطاقات الحمراء",
  "Passes":"التمريرات", "Pass Accuracy":"دقة التمرير",
  "Ball Possession":"الاستحواذ", "Saves":"التصديات",
  "Duels":"الصراعات",
  "Aerials Won":"الكرات الهوائية", "Tackles":"الاعتراضات",
  "Interceptions":"التهديدات", "Clearances":"التنظيفات",
};

function tStat(s: string): string { return STAT_LABELS[s] || s; }

// ─── Event Icon ───────────────────────────────────────────────────────────────
function getEventIcon(type: string, detail: string): string {
  const icons: Record<string, string> = {
    "goal":"⚽","1st-half-goal":"⚽","2nd-half-goal":"⚽",
    "yellow-card":"🟨","caution":"🟨",
    "red-card":"🟥","sending-off":"🟥",
    "substitution":"🔄",
    "kickoff":"▶️","start-2nd-half":"▶️",
    "halftime":"⏸️",
    "full-time":"🏁","end-regular-time":"🏁",
  };
  return icons[type] || icons[detail] || "•";
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
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
function ErrorState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <h2 className="text-2xl font-bold text-white mb-2">تعذر تحميل تفاصيل المباراة</h2>
        <p className="text-slate-400 mb-6">{message}</p>
        <button onClick={onBack} className="bg-[#006233] hover:bg-[#004225] text-white font-bold px-6 py-3 rounded-xl transition-colors">
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function TabOverview({ m }: { m: MatchDetail }) {
  const { home, away, venue, league, round } = m;

  return (
    <div className="space-y-4">
      {/* Match Info */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#FFD700] text-sm font-bold">{league.name}</span>
          {round && <span className="text-slate-400 text-xs">{round}</span>}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
          <span>🏟️ {venue || "—"}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          {m.isLive && (
            <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              مباشر • {m.elapsed}'
            </div>
          )}
          {m.isFinished && <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">انتهت</span>}
          {!m.isLive && !m.isFinished && <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{m.statusShort}</span>}
        </div>
      </div>

      {/* Statistics Bars */}
      {m.statistics.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-[#FFD700] mb-4">📊 الإحصائيات</h3>
          <div className="space-y-5">
            {m.statistics.slice(0, 10).map((stat, i) => {
              const homeNum = parseFloat(String(stat.home).replace("%", ""));
              const awayNum = parseFloat(String(stat.away).replace("%", ""));
              const total = homeNum + awayNum || 1;
              const homePct = Math.round((homeNum / total) * 100);
              const awayPct = 100 - homePct;

              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium w-20 text-left truncate">{stat.home}</span>
                    <span className="text-slate-400 text-xs text-center">{tStat(stat.type)}</span>
                    <span className="text-white font-medium w-20 text-right truncate">{stat.away}</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
                    <div
                      className="bg-[#006233] h-full transition-all duration-500"
                      style={{ width: `${homePct}%` }}
                    />
                    <div
                      className="bg-[#D01C1F] h-full transition-all duration-500"
                      style={{ width: `${awayPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Stats (full page) ──────────────────────────────────────────────────
function TabStats({ m }: { m: MatchDetail }) {
  if (!m.statistics.length) return <div className="text-center text-slate-400 py-10">لا توجد إحصائيات</div>;
  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <h3 className="text-lg font-bold text-[#FFD700] mb-4">📊 جميع الإحصائيات</h3>
      <div className="space-y-3">
        {m.statistics.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
            <span className="text-white text-sm w-24 text-left">{s.home}</span>
            <span className="text-slate-400 text-xs text-center w-40">{tStat(s.type)}</span>
            <span className="text-white text-sm w-24 text-right">{s.away}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Events ──────────────────────────────────────────────────────────────
function TabEvents({ events }: { events: MatchDetail["events"] }) {
  if (!events.length) return <div className="text-center text-slate-400 py-10">لا توجد أحداث</div>;
  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <h3 className="text-lg font-bold text-[#FFD700] mb-4">📋 أحداث المباراة</h3>
      <div className="space-y-2">
        {events.map((ev, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${ev.type?.includes("goal") ? "bg-[#006233]/20" : "bg-slate-700/50"}`}>
            <span className="text-[#FFD700] font-black text-sm w-10 text-center">{ev.minute || ev.elapsed}'</span>
            <span className="text-2xl">{ev.icon}</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{ev.player || ev.detail}</p>
              {ev.assist && <p className="text-slate-400 text-xs">⬆️ {ev.assist}</p>}
            </div>
            <span className="text-slate-400 text-xs">{ev.team_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: H2H ─────────────────────────────────────────────────────────────────
function TabH2H({ h2h }: { h2h: any[] }) {
  if (!h2h.length) return <div className="text-center text-slate-400 py-10">لا توجد مواجهات سابقة</div>;
  return (
    <div className="space-y-3">
      {h2h.map((match, i) => (
        <div key={i} className="bg-slate-800 rounded-xl p-4 flex items-center gap-4">
          <span className="text-slate-500 text-xs w-16 text-center">{match.year || (match.date ? new Date(match.date).getFullYear() : "")}</span>
          <div className="flex-1 text-center">
            <span className="text-white text-sm font-medium">{match.home?.name || "Home"}</span>
          </div>
          <div className="bg-slate-700 rounded-lg px-3 py-2 text-center">
            <span className="text-white font-black">{match.home_score ?? 0}</span>
            <span className="text-[#FFD700] mx-1">-</span>
            <span className="text-white font-black">{match.away_score ?? 0}</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-white text-sm font-medium">{match.away?.name || "Away"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id || "";

  const [tab, setTab] = useState<Tab>("overview");
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/match-detail?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMatch(data);
      } catch (e: any) {
        setError(e.message || "تعذر تحميل تفاصيل المباراة");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="bg-gradient-to-br from-[#006233] to-[#002815] py-8 px-4 border-b-4 border-[#FFD700]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => router.push("/")} className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
            <div className="w-8" />
          </div>
        </div>
        <Skeleton />
      </div>
    );
  }

  // Error
  if (error || !match) {
    return <ErrorState message={error} onBack={() => router.push("/")} />;
  }

  const { home, away } = match;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "نظرة عامة" },
    { key: "stats", label: "الإحصائيات" },
    { key: "events", label: "الأحداث" },
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
              <span className="text-[#FFD700] text-sm font-bold">{match.league.name}</span>
              {match.round && <p className="text-white/60 text-xs">{match.round}</p>}
            </div>
            <div className="w-8" />
          </div>

          {/* Date */}
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm">{match.formattedDate}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              {match.isLive && (
                <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  مباشر • {match.elapsed}'
                </div>
              )}
              {match.isFinished && <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">انتهت</span>}
              {!match.isLive && !match.isFinished && <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{match.statusShort}</span>}
            </div>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                {home.logo ? (
                  <img src={home.logo} alt={home.name} className="w-16 h-16 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <span className="text-4xl">{home.flag}</span>
                )}
              </div>
              <h2 className="text-xl font-black text-white">{home.name}</h2>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              {match.isLive || match.isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white">{match.homeScore}</span>
                  <span className="text-3xl font-black text-[#FFD700]">:</span>
                  <span className="text-5xl font-black text-white">{match.awayScore}</span>
                </div>
              ) : (
                <div className="text-5xl font-black text-[#FFD700]">VS</div>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                {away.logo ? (
                  <img src={away.logo} alt={away.name} className="w-16 h-16 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <span className="text-4xl">{away.flag}</span>
                )}
              </div>
              <h2 className="text-xl font-black text-white">{away.name}</h2>
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
        {tab === "overview" && <TabOverview m={match} />}
        {tab === "stats" && <TabStats m={match} />}
        {tab === "events" && <TabEvents events={match.events} />}
        {tab === "h2h" && <TabH2H h2h={match.h2h} />}
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
