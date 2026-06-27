"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Team = {
  id: number;
  name: string;
  logo: string;
  flag: string;
};

type Fixture = {
  fixture_id: number;
  league_id: number;
  league_name: string;
  league_flag: string;
  round: string;
  date: string;
  venue: string;
  referee: string;
  home: Team;
  away: Team;
  status: string;
  status_short: string;
  elapsed: number;
  home_score: number;
  away_score: number;
  home_penalty: number | null;
  away_penalty: number | null;
};

type Stat = { team_id: number; team_name: string; value: string };
type StatsResponse = { statistics: Array<{ type: string; home: string; away: string }> };

type Event = {
  elapsed: number;
  team_id: number;
  team_name: string;
  player: string;
  assist: string;
  type: string;
  detail: string;
};
type EventsResponse = { events: Event[] };

type LineupPlayer = { id: number; name: string; number: number; pos: string };
type LineupResponse = {
  team: { id: number; name: string; logo: string };
  formation: string;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
};

type H2HResponse = { fixtures: Fixture[] };

// ─── Flag emoji map ────────────────────────────────────────────────────────────
const FLAG_MAP: Record<string, string> = {
  Belgium:"🇧🇪",Iran:"🇮🇷",Spain:"🇪🇸","Saudi Arabia":"🇸🇦",Tunisia:"🇹🇳",Japan:"🇯🇵",Ecuador:"🇪🇨","Cape Verde":"🇨🇻",Germany:"🇩🇪","Ivory Coast":"🇨🇮",Netherlands:"🇳🇱",Sweden:"🇸🇪",Turkey:"🇹🇷",Paraguay:"🇵🇾",Brazil:"🇧🇷",Haiti:"🇭🇹",Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",Morocco:"🇲🇦",USA:"🇺🇸","United States":"🇺🇸",Australia:"🇦🇺",Mexico:"🇲🇽","South Korea":"🇰🇷","New Zealand":"🇳🇿",Egypt:"🇪🇬",Argentina:"🇦🇷",Austria:"🇦🇹",France:"🇫🇷",Iraq:"🇮🇶",Norway:"🇳🇴",Senegal:"🇸🇳",Uruguay:"🇺🇾",England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Italy:"🇮🇹",Portugal:"🇵🇹",Switzerland:"🇨🇭",Croatia:"🇭🇷",Denmark:"🇩🇰",Serbia:"🇷🇸","Czech Republic":"🇨🇿","Czechia":"🇨🇿","South Africa":"🇿🇦","Costa Rica":"🇨🇷",Panama:"🇵🇦",Canada:"🇨🇦",Colombia:"🇨🇴",Ghana:"🇬🇭",Algeria:"🇩🇿",Nigeria:"🇳🇬",Qatar:"🇶🇦","Bosnia-Herzegovina":"🇧🇦","Bosnia and Herzegovina":"🇧🇦",Jordan:"🇯🇴",Uzbekistan:"🇺🇿","Curaçao":"🇨🇼","DR Congo":"🇨🇩",
};

function getFlag(name: string): string {
  return FLAG_MAP[name] || "🏳️";
}

function localizeTeam(name: string): string {
  const MAP: Record<string, string> = {
    Mexico:"المكسيك","South Korea":"كوريا الجنوبية","South Africa":"جنوب أفريقيا",Czechia:"التشيك",
    Canada:"كندا",Switzerland:"سويسرا",Qatar:"قطر","Bosnia-Herzegovina":"البوسنة والهرسك",
    Brazil:"البرازيل",Morocco:"المغرب",Scotland:"أسكتلندا",Haiti:"هايتي",
    USA:"الولايات المتحدة",Australia:"أستراليا",Paraguay:"باراغواي",Turkey:"تركيا",
    Germany:"ألمانيا","Ivory Coast":"ساحل العاج",Ecuador:"الإكوادور",Curaçao:"كوراساو",
    Netherlands:"هولندا",Sweden:"السويد",Japan:"اليابان",Tunisia:"تونس",
    Belgium:"بلجيكا",Iran:"إيران",Egypt:"مصر","New Zealand":"نيوزيلندا",
    Spain:"إسبانيا",Uruguay:"أوروغواي","Saudi Arabia":"السعودية","Cape Verde":"الرأس الأخضر",
    France:"فرنسا",Norway:"النرويج",Senegal:"السنغال",Iraq:"العراق",
    Argentina:"الأرجنتين",Austria:"النمسا",Algeria:"الجزائر",Jordan:"الأردن",
    Portugal:"البرتغال",Colombia:"كولومبيا","DR Congo":"الكونغو",Uzbekistan:"أوزبكستان",
    England:"إنجلترا",Croatia:"كرواتيا",Ghana:"غانا",Panama:"بنما",
  };
  return MAP[name] || name;
}

function slugToTeams(slug: string): { home: string; away: string } {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return { home: "Home", away: "Away" };
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return { home: capitalize(parts[0]), away: capitalize(parts[1]) };
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    const day = days[d.getUTCDay()];
    const h = d.getUTCHours().toString().padStart(2,"0");
    const m = d.getUTCMinutes().toString().padStart(2,"0");
    return `${day} ${h}:${m} ت ع`;
  } catch { return iso; }
}

// ─── API ──────────────────────────────────────────────────────────────────────
const API_KEY = "c0e4608bccd8e7dc832fee613e8bc378";
const FALLBACK_KEY = "74324d6063934f75b808c611780d7b68";
const BASE = "https://api.football-data.org/v4";

async function apiFetch(path: string, key: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": key },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchWithFallback(path: string) {
  try {
    const data = await apiFetch(path, API_KEY);
    if (data) return data;
  } catch { /* fall through */ }
  return apiFetch(path, FALLBACK_KEY);
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-48 bg-slate-800 rounded-2xl" />
      <div className="h-32 bg-slate-800 rounded-2xl" />
      <div className="h-64 bg-slate-800 rounded-2xl" />
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <h2 className="text-2xl font-bold text-white mb-2">تعذر تحميل تفاصيل المباراة</h2>
        <p className="text-slate-400 mb-6">{message}</p>
        <Link href="/" className="bg-[#006233] hover:bg-[#004225] text-white font-bold px-6 py-3 rounded-xl transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function TabOverview({ fixture, stats }: { fixture: Fixture; stats: StatsResponse | null }) {
  const isLive = fixture.status_short === "1H" || fixture.status_short === "2H" || fixture.status === "LIVE";
  const isFinished = fixture.status_short === "FT" || fixture.status_short === "AET" || fixture.status_short === "PEN";

  return (
    <div className="space-y-4">
      {/* Match Info */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-sm">{fixture.league_name}</span>
          <span className="text-slate-500 text-xs">{fixture.round}</span>
        </div>
        <div className="text-center mb-4">
          <p className="text-slate-400 text-sm mb-1">🏟️ {fixture.venue || "غير محدد"}</p>
          <p className="text-slate-500 text-xs">{fixture.referee || ""}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              مباشر • {fixture.elapsed}'
            </div>
          )}
          {isFinished && (
            <div className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
              انتهت
            </div>
          )}
          {!isLive && !isFinished && (
            <div className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
              {fixture.status_short || fixture.status}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && stats.statistics && stats.statistics.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-[#FFD700] mb-4">📊 الإحصائيات</h3>
          <div className="space-y-4">
            {stats.statistics.map((stat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white font-medium w-1/3 text-left">{stat.home}</span>
                  <span className="text-slate-400 text-xs text-center w-1/3">{stat.type}</span>
                  <span className="text-white font-medium w-1/3 text-right">{stat.away}</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
                  <div
                    className="bg-[#006233] h-full transition-all duration-500"
                    style={{ width: stat.home && stat.away ? `${Math.round((parseFloat(stat.home) / (parseFloat(stat.home) + parseFloat(stat.away) || 1)) * 100)}%` : "50%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Events ──────────────────────────────────────────────────────────────
function TabEvents({ events }: { events: Event[] }) {
  const eventIcons: Record<string, string> = {
    Goal:"⚽", "Normal Goal":"⚽", "Own Goal":"⚽❌",
    "Yellow Card":"🟨", "Second Yellow":"🟨🟨",
    "Red Card":"🟥", "Direct Red":"🟥",
    Substitution:"🔄", "Penalty":"🎯", "Missed Penalty":"❌🎯",
    "Var":"📺", Kickoff:"▶️", Halftime:"⏸️",
  };

  if (!events || events.length === 0) {
    return <div className="text-center text-slate-400 py-10">لا توجد أحداث بعد</div>;
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <h3 className="text-lg font-bold text-[#FFD700] mb-4">📋 أحداث المباراة</h3>
      <div className="space-y-2">
        {events.map((event, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${event.type === "Goal" || event.type === "Normal Goal" ? "bg-[#006233]/20" : "bg-slate-700/50"}`}>
            <span className="text-[#FFD700] font-black text-sm w-10 text-center">{event.elapsed}'</span>
            <span className="text-2xl">{eventIcons[event.type] || "•"}</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{event.player}</p>
              {event.assist && event.assist !== "" && (
                <p className="text-slate-400 text-xs"> asistencia: {event.assist}</p>
              )}
            </div>
            <span className="text-slate-400 text-xs">{event.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Lineups ──────────────────────────────────────────────────────────────
function TabLineups({ lineups }: { lineups: LineupResponse[] }) {
  if (!lineups || lineups.length === 0) {
    return <div className="text-center text-slate-400 py-10">لا توجد تشكيلة</div>;
  }

  return (
    <div className="space-y-6">
      {lineups.map((team) => (
        <div key={team.team.id} className="bg-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <img src={team.team.logo} alt={team.team.name} className="w-8 h-8 object-contain" onError={(e)=>{e.currentTarget.style.display="none";}} />
            <div>
              <h4 className="text-white font-bold">{localizeTeam(team.team.name)}</h4>
              <p className="text-slate-400 text-xs">Formation: {team.formation}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[#FFD700] text-xs font-bold mb-2">التشكيلة الأساسية</p>
            {team.startXI.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-[#006233] flex items-center justify-center text-white text-xs font-bold">{p.number}</span>
                <span className="text-slate-200">{p.name}</span>
                <span className="text-slate-500 text-xs mr-auto">{p.pos}</span>
              </div>
            ))}
            {team.substitutes.length > 0 && (
              <>
                <p className="text-[#FFD700] text-xs font-bold mt-4 mb-2">البدلاء</p>
                {team.substitutes.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">{p.number}</span>
                    <span>{p.name}</span>
                    <span className="text-xs mr-auto">{p.pos}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: H2H ─────────────────────────────────────────────────────────────────
function TabH2H({ h2h }: { h2h: Fixture[] }) {
  if (!h2h || h2h.length === 0) {
    return <div className="text-center text-slate-400 py-10">لا توجد مواجهات سابقة</div>;
  }

  return (
    <div className="space-y-3">
      {h2h.slice(0, 10).map((match, i) => (
        <div key={i} className="bg-slate-800 rounded-xl p-4 flex items-center gap-4">
          <span className="text-slate-500 text-xs w-16 text-center">{match.date ? new Date(match.date).getFullYear() : ""}</span>
          <div className="flex-1 text-center">
            <span className="text-white text-sm font-medium">{localizeTeam(match.home?.name || "Home")}</span>
          </div>
          <div className="bg-slate-700 rounded-lg px-3 py-2 text-center">
            <span className="text-white font-black">{match.home_score ?? 0}</span>
            <span className="text-[#FFD700] mx-1">-</span>
            <span className="text-white font-black">{match.away_score ?? 0}</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-white text-sm font-medium">{localizeTeam(match.away?.name || "Away")}</span>
          </div>
          <span className="text-slate-500 text-xs">{match.status_short || ""}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Match Page ──────────────────────────────────────────────────────────
type Tab = "overview" | "events" | "lineups" | "h2h";

export default function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { home: homeName, away: awayName } = slugToTeams(id);

  const [tab, setTab] = useState<Tab>("overview");
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [lineups, setLineups] = useState<LineupResponse[]>([]);
  const [h2h, setH2h] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setError("");
      try {
        // Step 1: Find fixture ID from the match list
        // Use the slug to find the match in the WC competition
        const dates = [];
        const start = new Date("2026-06-11");
        const end = new Date();
        end.setDate(end.getDate() + 1);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(d.toISOString().split("T")[0]);
        }

        let found: any = null;
        for (const dateStr of dates) {
          try {
            const res = await fetch(
              `${BASE}/competitions/WC/matches?dateFrom=${dateStr}&dateTo=${dateStr}`,
              { headers: { "X-Auth-Token": API_KEY }, next: { revalidate: 30 } }
            );
            if (!res.ok) continue;
            const data = await res.json();
            const matches: any[] = data.matches || [];
            // Find match by team names
            const match = matches.find((m: any) => {
              const h = m.homeTeam?.name || "";
              const a = m.awayTeam?.name || "";
              return (
                h.toLowerCase().includes(homeName.toLowerCase()) ||
                a.toLowerCase().includes(homeName.toLowerCase()) ||
                homeName.toLowerCase().includes(h.toLowerCase().split(" ").pop() || "")
              );
            });
            if (match) { found = match; break; }
          } catch { continue; }
        }

        if (!found) {
          // Try fallback key
          for (const dateStr of dates) {
            try {
              const res = await fetch(
                `${BASE}/competitions/WC/matches?dateFrom=${dateStr}&dateTo=${dateStr}`,
                { headers: { "X-Auth-Token": FALLBACK_KEY }, next: { revalidate: 30 } }
              );
              if (!res.ok) continue;
              const data = await res.json();
              const matches: any[] = data.matches || [];
              const match = matches.find((m: any) => {
                const h = m.homeTeam?.name || "";
                const a = m.awayTeam?.name || "";
                return (
                  h.toLowerCase().includes(homeName.toLowerCase()) ||
                  a.toLowerCase().includes(homeName.toLowerCase())
                );
              });
              if (match) { found = match; break; }
            } catch { continue; }
          }
        }

        if (!found) {
          setError("المباراة غير موجودة");
          setLoading(false);
          return;
        }

        const fixtureId = found.id;

        // Build fixture object
        const hTeam = found.homeTeam || {};
        const aTeam = found.awayTeam || {};
        const f: Fixture = {
          fixture_id: found.id,
          league_id: found.league?.id || 1,
          league_name: found.league?.name || "FIFA World Cup",
          league_flag: "",
          round: found.matchday ? `الجولة ${found.matchday}` : "",
          date: found.utcDate || "",
          venue: found.venue?.name || "",
          referee: found.referee || "",
          home: {
            id: hTeam.id || 0,
            name: hTeam.name || homeName,
            logo: hTeam.logo || "",
            flag: getFlag(hTeam.name || homeName),
          },
          away: {
            id: aTeam.id || 0,
            name: aTeam.name || awayName,
            logo: aTeam.logo || "",
            flag: getFlag(aTeam.name || awayName),
          },
          status: found.status || "",
          status_short: found.status || "",
          elapsed: found.time?.elapsed || 0,
          home_score: found.score?.fullTime?.home ?? found.score?.halfTime?.home ?? 0,
          away_score: found.score?.fullTime?.away ?? found.score?.halfTime?.away ?? 0,
          home_penalty: found.score?.penalties?.home ?? null,
          away_penalty: found.score?.penalties?.away ?? null,
        };
        setFixture(f);

        // Fetch additional data in parallel
        const [statsData, eventsData, lineupsData, h2hData] = await Promise.allSettled([
          fetchWithFallback(`/fixtures/statistics?fixture=${fixtureId}`),
          fetchWithFallback(`/fixtures/events?fixture=${fixtureId}`),
          fetchWithFallback(`/fixtures/lineups?fixture=${fixtureId}`),
          fetchWithFallback(`/fixtures/headtohead?h2h=${hTeam.id}-${aTeam.id}&limit=10`),
        ]);

        if (statsData.status === "fulfilled") setStats(statsData.value);
        if (eventsData.status === "fulfilled") setEvents(eventsData.value?.events || []);
        if (lineupsData.status === "fulfilled") setLineups(lineupsData.value?.lineups || []);
        if (h2hData.status === "fulfilled") setH2h(h2hData.value?.fixtures || []);

      } catch (e: any) {
        console.error("[MatchPage] Error:", e);
        setError("تعذر تحميل تفاصيل المباراة");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, homeName, awayName]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="bg-gradient-to-br from-[#006233] to-[#002815] py-8 px-4 border-b-4 border-[#FFD700]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
            <div className="w-8" />
          </div>
        </div>
        <Skeleton />
      </div>
    );
  }

  // Error
  if (error || !fixture) {
    return <ErrorState message={error} />;
  }

  const { home, away, status_short, elapsed, home_score, away_score } = fixture;
  const isLive = status_short === "1H" || status_short === "2H" || status_short === "LIVE";
  const isFinished = status_short === "FT" || status_short === "AET" || status_short === "PEN";

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "نظرة عامة" },
    { key: "events", label: "الأحداث" },
    { key: "lineups", label: "التشكيلة" },
    { key: "h2h", label: "مواجهات سابقة" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] py-6 px-4 border-b-4 border-[#FFD700]">
        <div className="max-w-4xl mx-auto">
          {/* Back + League */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="text-center">
              <span className="text-[#FFD700] text-sm font-bold">{fixture.league_name}</span>
              <p className="text-white/60 text-xs">{fixture.round}</p>
            </div>
            <div className="w-8" />
          </div>

          {/* Date */}
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm">{formatDate(fixture.date)}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              {isLive && (
                <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  مباشر • {elapsed}'
                </div>
              )}
              {isFinished && <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">انتهت</span>}
              {!isLive && !isFinished && <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{status_short}</span>}
            </div>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                {home.logo ? (
                  <img src={home.logo} alt={home.name} className="w-16 h-16 object-contain" onError={(e)=>{e.currentTarget.style.display="none";}} />
                ) : (
                  <span className="text-4xl">{home.flag}</span>
                )}
              </div>
              <h2 className="text-xl font-black text-white">{localizeTeam(home.name)}</h2>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white">{home_score}</span>
                  <span className="text-3xl font-black text-[#FFD700]">:</span>
                  <span className="text-5xl font-black text-white">{away_score}</span>
                </div>
              ) : (
                <div className="text-5xl font-black text-[#FFD700]">VS</div>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                {away.logo ? (
                  <img src={away.logo} alt={away.name} className="w-16 h-16 object-contain" onError={(e)=>{e.currentTarget.style.display="none";}} />
                ) : (
                  <span className="text-4xl">{away.flag}</span>
                )}
              </div>
              <h2 className="text-xl font-black text-white">{localizeTeam(away.name)}</h2>
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
        {tab === "overview" && <TabOverview fixture={fixture} stats={stats} />}
        {tab === "events" && <TabEvents events={events} />}
        {tab === "lineups" && <TabLineups lineups={lineups} />}
        {tab === "h2h" && <TabH2H h2h={h2h} />}
      </div>

      {/* Back CTA */}
      <div className="max-w-4xl mx-auto p-4 pb-8">
        <Link href="/" className="block w-full bg-[#006233] hover:bg-[#004225] text-white font-black py-4 rounded-xl text-center transition-colors">
          العودة للرئيسية ⚽
        </Link>
      </div>
    </div>
  );
}
