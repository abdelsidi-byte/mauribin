"use client";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/components/I18nProvider";

// ─── Types ───────────────────────────────────────────────────────────────────
type Match = {
  _index: number;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
  utcDate?: string;
  slug?: string;
};

type Article = {
  title: string;
  description?: string;
  source: string;
  url: string;
};

// ─── Fetch real matches or fallback ──────────────────────────────────────────
async function fetchRealMatches(): Promise<Match[]> {
  const API_KEY = "c0e4608bccd8e7dc832fee613e8bc378";
  const FALLBACK_KEY = "74324d6063934f75b808c611780d7b68";

  const fetchFromAPI = async (key: string) => {
    const end = new Date();
    end.setDate(end.getDate() + 1);
    const endStr = end.toISOString().split("T")[0];
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=2026-06-11&dateTo=${endStr}`,
      { headers: { "X-Auth-Token": key }, next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  function mapMatch(m: any, i: number) {
    const home = m.homeTeam?.name || m.homeTeam?.shortName || "Unknown";
    const away = m.awayTeam?.name || m.awayTeam?.shortName || "Unknown";
    const hg = m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null;
    const ag = m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null;
    const status = m.status || "";
    const s = status.toUpperCase();
    let state = "upcoming", label = "قادم";
    if (["FINISHED", "FT", "AET", "PEN"].includes(s)) { state = "ft"; label = "انتهت"; }
    else if (["IN_PLAY", "PAUSED", "LIVE", "1H", "2H", "HT", "ET", "BT", "P"].includes(s)) { state = "live"; label = "مباشر"; }
    else if (["TIMED", "SCHEDULED", "NS", "PST", "CANC"].includes(s)) { state = "upcoming"; label = formatUpcomingDate(m.utcDate); }
    else { state = "upcoming"; label = status || "قادم"; }
    return { home, away, homeFlag: getFlag(home), awayFlag: getFlag(away), homeScore: hg, awayScore: ag, state, label, utcDate: m.utcDate, slug: slugify(home, away), _index: i };
  }

  function formatUpcomingDate(isoDate: string): string {
    try {
      const d = new Date(isoDate);
      const now = new Date();
      const hours = d.getUTCHours().toString().padStart(2, "0");
      const mins = d.getUTCMinutes().toString().padStart(2, "0");
      if (d.toDateString() === now.toDateString()) return `اليوم ${hours}:${mins} ت ع`;
      const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
      return `${days[d.getUTCDay()]} ${hours}:${mins} ت ع`;
    } catch { return isoDate; }
  }

  function getFlag(team: string): string {
    const FLAG_MAP: Record<string, string> = {
      Belgium:"🇧🇪",Iran:"🇮🇷",Spain:"🇪🇸","Saudi Arabia":"🇸🇦",Tunisia:"🇹🇳",Japan:"🇯🇵",Ecuador:"🇪🇨","Cape Verde":"🇨🇻",Germany:"🇩🇪","Ivory Coast":"🇨🇮","Côte d'Ivoire":"🇨🇮",Netherlands:"🇳🇱",Sweden:"🇸🇪",Turkey:"🇹🇷",Paraguay:"🇵🇾",Brazil:"🇧🇷",Haiti:"🇭🇹",Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",Morocco:"🇲🇦",USA:"🇺🇸","United States":"🇺🇸",Australia:"🇦🇺",Mexico:"🇲🇽","Korea Republic":"🇰🇷","South Korea":"🇰🇷","New Zealand":"🇳🇿",Egypt:"🇪🇬",Argentina:"🇦🇷",Austria:"🇦🇹",France:"🇫🇷",Iraq:"🇮🇶",Norway:"🇳🇴",Senegal:"🇸🇳",Uruguay:"🇺🇾",England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Italy:"🇮🇹",Portugal:"🇵🇹",Poland:"🇵🇱",Switzerland:"🇨🇭",Croatia:"🇭🇷",Denmark:"🇩🇰",Serbia:"🇷🇸",Wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",Ukraine:"🇺🇦",Hungary:"🇭🇺","Czech Republic":"🇨🇿","Czechia":"🇨🇿","South Africa":"🇿🇦","Costa Rica":"🇨🇷",Panama:"🇵🇦",Jamaica:"🇯🇲",Canada:"🇨🇦",Peru:"🇵🇪",Chile:"🇨🇱",Colombia:"🇨🇴",Venezuela:"🇻🇪",Bolivia:"🇧🇴",Cameroon:"🇨🇲",Mali:"🇲🇱",Ghana:"🇬🇭",Algeria:"🇩🇿",Nigeria:"🇳🇬",Qatar:"🇶🇦",UAE:"🇦🇪","Bosnia-Herzegovina":"🇧🇦","Bosnia and Herzegovina":"🇧🇦",Jordan:"🇯🇴",Uzbekistan:"🇺🇿","Curaçao":"🇨🇼","DR Congo":"🇨🇩",
    };
    return FLAG_MAP[team] || "🏳️";
  }

  function slugify(home: string, away: string): string {
    return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // Try primary API key
  try {
    const data = await fetchFromAPI(API_KEY);
    const matches = (data.matches || []).map(mapMatch);
    if (matches.length > 0) return matches;
  } catch (e) { console.error("[TV] Primary API failed:", e); }

  // Fallback to secondary key
  try {
    const data = await fetchFromAPI(FALLBACK_KEY);
    const matches = (data.matches || []).map(mapMatch);
    if (matches.length > 0) return matches;
  } catch (e) { console.error("[TV] Fallback API failed:", e); }

  // Use demo data as last resort
  return DEMO_MATCHES;
}

function getFlag(team: string): string {
  const FLAG_MAP: Record<string, string> = {
    Belgium:"🇧🇪",Iran:"🇮🇷",Spain:"🇪🇸","Saudi Arabia":"🇸🇦",Tunisia:"🇹🇳",Japan:"🇯🇵",Ecuador:"🇪🇨","Cape Verde":"🇨🇻",Germany:"🇩🇪","Ivory Coast":"🇨🇮","Côte d'Ivoire":"🇨🇮",Netherlands:"🇳🇱",Sweden:"🇸🇪",Turkey:"🇹🇷",Paraguay:"🇵🇾",Brazil:"🇧🇷",Haiti:"🇭🇹",Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",Morocco:"🇲🇦",USA:"🇺🇸","United States":"🇺🇸",Australia:"🇦🇺",Mexico:"🇲🇽","Korea Republic":"🇰🇷","South Korea":"🇰🇷","New Zealand":"🇳🇿",Egypt:"🇪🇬",Argentina:"🇦🇷",Austria:"🇦🇹",France:"🇫🇷",Iraq:"🇮🇶",Norway:"🇳🇴",Senegal:"🇸🇳",Uruguay:"🇺🇾",England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Italy:"🇮🇹",Portugal:"🇵🇹",Poland:"🇵🇱",Switzerland:"🇨🇭",Croatia:"🇭🇷",Denmark:"🇩🇰",Serbia:"🇷🇸",Wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",Ukraine:"🇺🇦",Hungary:"🇭🇺","Czech Republic":"🇨🇿","Czechia":"🇨🇿","South Africa":"🇿🇦","Costa Rica":"🇨🇷",Panama:"🇵🇦",Jamaica:"🇯🇲",Canada:"🇨🇦",Peru:"🇵🇪",Chile:"🇨🇱",Colombia:"🇨🇴",Venezuela:"🇻🇪",Bolivia:"🇧🇴",Cameroon:"🇨🇲",Mali:"🇲🇱",Ghana:"🇬🇭",Algeria:"🇩🇿",Nigeria:"🇳🇬",Qatar:"🇶🇦",UAE:"🇦🇪","Bosnia-Herzegovina":"🇧🇦","Bosnia and Herzegovina":"🇧🇦",Jordan:"🇯🇴",Uzbekistan:"🇺🇿","Curaçao":"🇨🇼","DR Congo":"🇨🇩",
  };
  return FLAG_MAP[team] || "🏳️";
}

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
}

function formatUpcomingDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const hours = d.getUTCHours().toString().padStart(2, "0");
    const mins = d.getUTCMinutes().toString().padStart(2, "0");
    if (d.toDateString() === now.toDateString()) return `اليوم ${hours}:${mins} ت ع`;
    const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    return `${days[d.getUTCDay()]} ${hours}:${mins} ت ع`;
  } catch { return isoDate; }
}

// ─── Demo match data (used when API is unavailable) ──────────────────────────
const DEMO_MATCHES: Match[] = [
  // Finished
  { home: "Germany", away: "Curaçao", homeScore: 7, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-14T14:00:00Z", _index: 22, homeFlag: "🇩🇪", awayFlag: "🇨🇼" },
  { home: "Ivory Coast", away: "Ecuador", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-14T17:00:00Z", _index: 23, homeFlag: "🇨🇮", awayFlag: "🇪🇨" },
  { home: "Germany", away: "Ivory Coast", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-20T17:00:00Z", _index: 24, homeFlag: "🇩🇪", awayFlag: "🇨🇮" },
  { home: "Mexico", away: "South Africa", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-11T19:00:00Z", _index: 0, homeFlag: "🇲🇽", awayFlag: "🇿🇦" },
  { home: "Brazil", away: "Morocco", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T20:00:00Z", _index: 12, homeFlag: "🇧🇷", awayFlag: "🇲🇦" },
  { home: "USA", away: "Paraguay", homeScore: 4, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T02:00:00Z", _index: 18, homeFlag: "🇺🇸", awayFlag: "🇵🇾" },
  { home: "Spain", away: "Saudi Arabia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 34, homeFlag: "🇪🇸", awayFlag: "🇸🇦" },
  { home: "France", away: "Senegal", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-16T14:00:00Z", _index: 38, homeFlag: "🇫🇷", awayFlag: "🇸🇳" },
  { home: "Argentina", away: "Austria", homeScore: 3, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-17T14:00:00Z", _index: 42, homeFlag: "🇦🇷", awayFlag: "🇦🇹" },
  { home: "Portugal", away: "Uzbekistan", homeScore: 5, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-23T15:00:00Z", _index: 46, homeFlag: "🇵🇹", awayFlag: "🇺🇿" },
  { home: "England", away: "Croatia", homeScore: 4, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-17T14:00:00Z", _index: 48, homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇭🇷" },
  { home: "Germany", away: "Ecuador", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-26T14:00:00Z", _index: 59, homeFlag: "🇩🇪", awayFlag: "🇪🇨" },
  // Upcoming
  { home: "France", away: "Norway", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - غداً 17:00", utcDate: "2026-06-29T17:00:00Z", _index: 57, homeFlag: "🇫🇷", awayFlag: "🇳🇴" },
  { home: "Uruguay", away: "Saudi Arabia", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - غداً 17:00", utcDate: "2026-06-27T17:00:00Z", _index: 68, homeFlag: "🇺🇾", awayFlag: "🇸🇦" },
  { home: "Argentina", away: "Austria", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - الإثنين 17:00", utcDate: "2026-06-29T17:00:00Z", _index: 71, homeFlag: "🇦🇷", awayFlag: "🇦🇹" },
];

// ─── Auto-scrolling news ticker ──────────────────────────────────────────────
function NewsTicker({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  const doubled = [...articles, ...articles];
  return (
    <div className="w-full bg-[#006233]/95 border-b border-[#FFD700]/30 overflow-hidden relative">
      <div className="absolute right-0 top-0 bottom-0 z-10 bg-[#FFD700] flex items-center px-6 shrink-0">
        <span className="text-[#0a1628] font-bold text-lg">⚽ آخر الأخبار</span>
      </div>
      <div className="flex items-center h-12 ml-44">
        <div className="flex gap-12 animate-ticker-scroll whitespace-nowrap" style={{ willChange: "transform" }}>
          {doubled.map((article, i) => (
            <span key={i} className="text-white text-lg font-medium shrink-0 flex items-center gap-3">
              <span className="text-[#FFD700]">•</span>
              <span>{article.title}</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 45s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Next Match Hero (large centered display) ────────────────────────────────
function NextMatchHero({ match }: { match: Match }) {
  const { localizeTeam } = useI18n();
  const homeFlag = match.homeFlag || "🏳️";
  const awayFlag = match.awayFlag || "🏳️";
  const isHomeUrl = homeFlag.startsWith("http");
  const isAwayUrl = awayFlag.startsWith("http");

  return (
    <div className="w-full bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] rounded-3xl p-8 border-2 border-[#FFD700]/40 shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
        <span className="text-[#FFD700] text-xl font-bold">المباراة القادمة</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      </div>
      <div className="text-center mb-6">
        <p className="text-white/80 text-lg">{match.label}</p>
      </div>
      <div className="flex items-center justify-between gap-6">
        {/* Home */}
        <div className="flex-1 text-center">
          <div className="h-24 w-24 mx-auto mb-4 flex items-center justify-center">
            {isHomeUrl ? (
              <img src={homeFlag} alt={match.home} className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ) : (
              <span className="text-6xl">{homeFlag}</span>
            )}
          </div>
          <h3 className="text-white text-2xl font-bold">{localizeTeam(match.home)}</h3>
        </div>
        {/* VS / Score */}
        <div className="text-center px-6">
          <div className="text-[#FFD700] text-5xl font-black">VS</div>
          <p className="text-white/60 text-base mt-3">كأس العالم 2026</p>
        </div>
        {/* Away */}
        <div className="flex-1 text-center">
          <div className="h-24 w-24 mx-auto mb-4 flex items-center justify-center">
            {isAwayUrl ? (
              <img src={awayFlag} alt={match.away} className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ) : (
              <span className="text-6xl">{awayFlag}</span>
            )}
          </div>
          <h3 className="text-white text-2xl font-bold">{localizeTeam(match.away)}</h3>
        </div>
      </div>
    </div>
  );
}

// ─── Match card for TV ────────────────────────────────────────────────────────
function TVMatchCard({ match }: { match: Match }) {
  const { localizeTeam } = useI18n();
  const homeFlag = match.homeFlag || "🏳️";
  const awayFlag = match.awayFlag || "🏳️";
  const isHomeUrl = homeFlag.startsWith("http");
  const isAwayUrl = awayFlag.startsWith("http");
  const isLive = match.state === "live";
  const isFinished = match.state === "ft";

  return (
    <div className={`flex-1 min-w-[320px] rounded-2xl p-5 border-2 flex items-center gap-4 ${
      isLive
        ? "bg-gradient-to-br from-slate-900 to-slate-800 border-red-500/60"
        : "bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/50"
    }`}>
      {/* Live badge */}
      {isLive && (
        <div className="absolute -top-2 right-4 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          مباشر
        </div>
      )}
      {/* Home team */}
      <div className="flex-1 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          {isHomeUrl ? (
            <img src={homeFlag} alt={match.home} className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          ) : (
            <span className="text-3xl">{homeFlag}</span>
          )}
        </div>
        <span className="text-white text-lg font-semibold">{localizeTeam(match.home)}</span>
      </div>
      {/* Score */}
      <div className="text-center px-4">
        {match.homeScore !== null && match.awayScore !== null ? (
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-black ${isLive ? "text-white" : "text-slate-300"}`}>{match.homeScore}</span>
            <span className="text-[#FFD700] text-2xl font-black">:</span>
            <span className={`text-3xl font-black ${isLive ? "text-white" : "text-slate-300"}`}>{match.awayScore}</span>
          </div>
        ) : (
          <span className="text-[#FFD700] text-2xl font-black">VS</span>
        )}
        <p className="text-slate-400 text-sm mt-1">{match.label}</p>
      </div>
      {/* Away team */}
      <div className="flex-1 flex items-center gap-3 justify-start">
        <span className="text-white text-lg font-semibold">{localizeTeam(match.away)}</span>
        <div className="w-12 h-12 flex items-center justify-center">
          {isAwayUrl ? (
            <img src={awayFlag} alt={match.away} className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          ) : (
            <span className="text-3xl">{awayFlag}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Groups / Standings ───────────────────────────────────────────────────────
function StandingsQuickView() {
  const groups = [
    { name: "المجموعة أ", flag: "🇲🇦", teams: ["🇲🇦 المغرب", "🇭🇷 كرواتيا", "🇪🇸 إسبانيا", "🇨🇦 كندا"] },
    { name: "المجموعة ب", flag: "🇩🇪", teams: ["🇩🇪 ألمانيا", "🇳🇱 هولندا", "🇧🇪 بلجيكا", "🇮🇹 إيطاليا"] },
    { name: "المجموعة ج", flag: "🇧🇷", teams: ["🇧🇷 البرازيل", "🇦🇷 الأرجنتين", "🇫🇷 فرنسا", "🇵🇹 البرتغال"] },
    { name: "المجموعة د", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", teams: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿 إنجلترا", "🇺🇾 أوروغواي", "🇺🇸 أمريكا", "🇸🇦 السعودية"] },
    { name: "المجموعة ه", flag: "🇲🇦", teams: ["🇲🇦 المغرب", "🇭🇷 كرواتيا", "🇪🇸 إسبانيا", "🇨🇦 كندا"] },
    { name: "المجموعة و", flag: "🇩🇪", teams: ["🇩🇪 ألمانيا", "🇳🇱 هولندا", "🇧🇪 بلجيكا", "🇮🇹 إيطاليا"] },
    { name: "المجموعة ز", flag: "🇧🇷", teams: ["🇧🇷 البرازيل", "🇦🇷 الأرجنتين", "🇫🇷 فرنسا", "🇵🇹 البرتغال"] },
    { name: "المجموعة ح", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", teams: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿 إنجلترا", "🇺🇾 أوروغواي", "🇺🇸 أمريكا", "🇸🇦 السعودية"] },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-[#006233] text-white text-lg font-bold px-5 py-2 rounded-full border border-[#FFD700]/30">
          🏆 المجموعات
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {groups.map((group) => (
          <div key={group.name} className="bg-gradient-to-b from-[#006233]/20 to-slate-900/80 rounded-2xl p-4 border border-[#FFD700]/20">
            <h3 className="text-[#FFD700] text-base font-bold mb-4 text-center">{group.name}</h3>
            <div className="space-y-3">
              {group.teams.map((team, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xl">{team.split(" ")[0]}</span>
                  <span className="text-white text-sm font-medium">{team.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Auto-refresh indicator ──────────────────────────────────────────────────
function TVRefreshIndicator({ countdown }: { countdown: number }) {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-[#FFD700]/30 backdrop-blur-sm">
      <div className={`w-2 h-2 rounded-full ${countdown <= 5 ? "bg-[#FFD700] animate-pulse" : "bg-green-400"}`} />
      <span className="text-white text-sm font-medium">تحديث</span>
      <span className="text-[#FFD700] text-sm font-bold">{countdown}s</span>
    </div>
  );
}

// ─── Main TV Page ─────────────────────────────────────────────────────────────
export default function TVPage() {
  const [allMatches, setAllMatches] = useState<Match[]>(DEMO_MATCHES);

  useEffect(() => {
    fetchRealMatches().then(setAllMatches).catch(() => {});
  }, []);

  const upcomingMatches = allMatches
    .filter((m) => m.state === "upcoming")
    .sort((a, b) => new Date(a.utcDate!).getTime() - new Date(b.utcDate!).getTime());
  const finishedMatches = allMatches
    .filter((m) => m.state === "ft")
    .slice(-6);

  const nextMatch = upcomingMatches[0] || null;

  const [refreshCountdown, setRefreshCountdown] = useState(15);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setRefreshCountdown((c) => {
        if (c <= 1) {
          setLastUpdate(new Date());
          return 15;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const demoArticles: Article[] = [
    { title: "🇲🇷 موريتانيا تتأهل لنهائيات كأس العالم 2026", source: "Mauribin", url: "#" },
    { title: "كأس العالم 2026: أرقام تاريخية في مرحلة المجموعات", source: "FIFA", url: "#" },
    { title: "أفضل 10 أهداف في تاريخ كأس العالم", source: "BBC Sport", url: "#" },
    { title: "تحليل: لماذا favorites البرازيل للفوز بالبطولة؟", source: "ESPN", url: "#" },
    { title: "تقنية الفيديو VAR: كل ما تحتاج معرفته", source: "FIFA", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a0d] via-[#002515] to-[#001209] text-white overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#006233]/95 border-b-2 border-[#FFD700]/40 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700] flex items-center justify-center">
              <span className="text-[#006233] text-2xl font-black">M</span>
            </div>
            <div>
              <h1 className="text-[#FFD700] text-2xl font-black leading-none">Mauribin</h1>
              <p className="text-white/70 text-sm">كأس العالم 2026</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[#FFD700] text-xl font-black">كأس العالم</div>
            <div className="text-white/60 text-sm">FIFA World Cup 2026</div>
          </div>
          <div className="text-right">
            <div className="text-white text-lg font-medium">
              {lastUpdate.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-green-400 text-xs font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              متصل
            </div>
          </div>
        </div>
      </div>

      {/* News ticker */}
      <NewsTicker articles={demoArticles} />

      {/* Main content */}
      <div className="px-6 py-8 space-y-10 max-w-[1920px] mx-auto">
        {/* Next Match Hero */}
        {nextMatch && (
          <section>
            <NextMatchHero match={nextMatch} />
          </section>
        )}

        {/* Finished Results */}
        {finishedMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-[#006233] text-white text-base font-bold px-4 py-2 rounded-full border border-[#FFD700]/30">
                ✓ النتائج ({finishedMatches.length})
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {finishedMatches.map((match) => (
                <TVMatchCard key={match._index} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Groups */}
        <section>
          <StandingsQuickView />
        </section>

        {/* Upcoming */}
        {upcomingMatches.length > 1 && (
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-[#006233] text-white text-base font-bold px-4 py-2 rounded-full border border-[#FFD700]/30">
                ⏰ المباريات القادمة ({upcomingMatches.length - 1})
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingMatches.slice(1).map((match) => (
                <TVMatchCard key={match._index} match={match} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#006233]/80 border-t border-[#FFD700]/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="text-slate-400 text-sm">© 2026 Mauribin — FIFA World Cup</div>
          <div className="text-[#FFD700] text-sm font-bold">⚽ Mauribin TV Mode</div>
          <div className="text-slate-400 text-sm">تحديث: <span className="text-[#FFD700]">{refreshCountdown}s</span></div>
        </div>
      </div>

      {/* Refresh indicator */}
      <TVRefreshIndicator countdown={refreshCountdown} />
    </div>
  );
}
