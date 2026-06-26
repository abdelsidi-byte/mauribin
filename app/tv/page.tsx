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

// ─── Demo match data (matches the same fallback data used by the rest of the app) ──
const DEMO_MATCHES: Match[] = [
  { home: "Germany", away: "Curaçao", homeScore: 7, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-14T14:00:00Z", _index: 22, homeFlag: "🇩🇪", awayFlag: "🇨🇼" },
  { home: "Ivory Coast", away: "Ecuador", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-14T17:00:00Z", _index: 23, homeFlag: "🇨🇮", awayFlag: "🇪🇨" },
  { home: "Germany", away: "Ivory Coast", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-20T17:00:00Z", _index: 24, homeFlag: "🇩🇪", awayFlag: "🇨🇮" },
  { home: "Ecuador", away: "Curaçao", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 25, homeFlag: "🇪🇨", awayFlag: "🇨🇼" },
  { home: "Mexico", away: "South Africa", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-11T19:00:00Z", _index: 0, homeFlag: "🇲🇽", awayFlag: "🇿🇦" },
  { home: "Brazil", away: "Morocco", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T20:00:00Z", _index: 12, homeFlag: "🇧🇷", awayFlag: "🇲🇦" },
  { home: "USA", away: "Paraguay", homeScore: 4, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T02:00:00Z", _index: 18, homeFlag: "🇺🇸", awayFlag: "🇵🇾" },
  { home: "Spain", away: "Saudi Arabia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 34, homeFlag: "🇪🇸", awayFlag: "🇸🇦" },
  { home: "France", away: "Senegal", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-16T14:00:00Z", _index: 38, homeFlag: "🇫🇷", awayFlag: "🇸🇳" },
  { home: "Argentina", away: "Austria", homeScore: 3, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-17T14:00:00Z", _index: 42, homeFlag: "🇦🇷", awayFlag: "🇦🇹" },
  { home: "Portugal", away: "Uzbekistan", homeScore: 5, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-23T15:00:00Z", _index: 46, homeFlag: "🇵🇹", awayFlag: "🇺🇿" },
  { home: "England", away: "Croatia", homeScore: 4, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-17T14:00:00Z", _index: 48, homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇭🇷" },
  // Live match
  { home: "France", away: "Norway", homeScore: 2, awayScore: 1, state: "live", label: "مباشر - الشوط الثاني", utcDate: "2026-06-29T14:00:00Z", _index: 57, homeFlag: "🇫🇷", awayFlag: "🇳🇴" },
  { home: "Germany", away: "Ecuador", homeScore: 2, awayScore: 1, state: "live", label: "مباشر - الشوط الثاني", utcDate: "2026-06-26T14:00:00Z", _index: 59, homeFlag: "🇩🇪", awayFlag: "🇪🇨" },
  // Upcoming
  { home: "Uruguay", away: "Saudi Arabia", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - غداً 17:00", utcDate: "2026-06-27T17:00:00Z", _index: 68, homeFlag: "🇺🇾", awayFlag: "🇸🇦" },
  { home: "Germany", away: "Ivory Coast", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - الأحد 17:00", utcDate: "2026-06-28T17:00:00Z", _index: 65, homeFlag: "🇩🇪", awayFlag: "🇨🇮" },
  { home: "Japan", away: "Sweden", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - الأحد 14:00", utcDate: "2026-06-28T14:00:00Z", _index: 63, homeFlag: "🇯🇵", awayFlag: "🇸🇪" },
  { home: "Tunisia", away: "Netherlands", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - الأحد 17:00", utcDate: "2026-06-28T17:00:00Z", _index: 64, homeFlag: "🇹🇳", awayFlag: "🇳🇱" },
  { home: "France", away: "Norway", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - الإثنين 14:00", utcDate: "2026-06-29T14:00:00Z", _index: 57, homeFlag: "🇫🇷", awayFlag: "🇳🇴" },
  { home: "Argentina", away: "Austria", homeScore: null, awayScore: null, state: "upcoming", label: "قادم - الإثنين 17:00", utcDate: "2026-06-29T17:00:00Z", _index: 71, homeFlag: "🇦🇷", awayFlag: "🇦🇹" },
];

// ─── Auto-scrolling news ticker ──────────────────────────────────────────────
function NewsTicker({ articles }: { articles: Article[] }) {
  const { t } = useI18n();

  if (articles.length === 0) return null;

  // Duplicate articles to create seamless loop
  const doubled = [...articles, ...articles];

  return (
    <div className="w-full bg-[#006233]/95 border-b border-[#FFD700]/30 overflow-hidden relative">
      {/* Label */}
      <div className="absolute right-0 top-0 bottom-0 z-10 bg-[#FFD700] flex items-center px-6 shrink-0">
        <span className="text-[#0a1628] font-black text-2xl">⚽ {t("news.title")}</span>
      </div>

      {/* Scrolling track */}
      <div className="flex items-center h-16 ml-48">
        <div
          className="flex gap-16 animate-ticker-scroll whitespace-nowrap"
          style={{ willChange: "transform" }}
        >
          {doubled.map((article, i) => (
            <span key={i} className="text-white text-2xl font-bold shrink-0 flex items-center gap-3">
              <span className="text-[#FFD700]">•</span>
              <span className="hover:text-[#FFD700] transition-colors">{article.title}</span>
            </span>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 60s linear infinite;
        }
        .animate-ticker-scroll:hover {
          animation-play-state: paused;
        }
      ` }} />
    </div>
  );
}

// ─── Hero: Next Match with countdown ─────────────────────────────────────────
function NextMatchHero({ match }: { match: Match | null }) {
  const { t, localizeTeam } = useI18n();

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!match || match.state !== "upcoming") return;

    const update = () => {
      const kickoff = new Date(match.utcDate!).getTime();
      const now = Date.now();
      const diff = kickoff - now;

      if (diff <= 0) {
        setCountdown(t("match.live"));
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (days > 0) setCountdown(`بعد ${days} يوم ${hours}س`);
      else if (hours > 0) setCountdown(`بعد ${hours}س ${mins}د`);
      else setCountdown(`بعد ${mins}:${secs.toString().padStart(2, "0")}`);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [match, t]);

  if (!match) {
    return (
      <div className="w-full bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] rounded-3xl p-12 border-2 border-[#FFD700]/40 text-center">
        <p className="text-[#FFD700] text-5xl font-black">{t("hero.noMatches")}</p>
      </div>
    );
  }

  const homeTeam = match.home;
  const awayTeam = match.away;
  const homeFlag = match.homeFlag || "🏳️";
  const awayFlag = match.awayFlag || "🏳️";
  const isHomeUrl = homeFlag.startsWith("http");
  const isAwayUrl = awayFlag.startsWith("http");

  const kickoffDate = new Date(match.utcDate!);
  const formattedDate = kickoffDate.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] rounded-3xl p-10 border-2 border-[#FFD700]/40 shadow-2xl">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
        <span className="text-[#FFD700] text-3xl font-black">{t("hero.nextMatch")}</span>
        <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      </div>

      {/* Date */}
      <div className="text-center mb-8">
        <p className="text-white/80 text-3xl font-bold">{formattedDate}</p>
        {match.state === "upcoming" && countdown && (
          <div className="inline-block bg-[#FFD700]/20 rounded-2xl px-8 py-3 mt-4">
            <span className="text-[#FFD700] text-5xl font-black">{countdown}</span>
          </div>
        )}
        {match.state === "live" && (
          <div className="inline-flex items-center gap-3 mt-4">
            <span className="relative flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
            </span>
            <span className="text-red-400 text-4xl font-black animate-pulse">{t("match.live")}</span>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-8">
        {/* Home */}
        <div className="flex-1 text-center">
          <div className="h-40 w-40 mx-auto mb-6 flex items-center justify-center">
            {isHomeUrl ? (
              <img
                src={homeFlag}
                alt={homeTeam}
                className="max-h-full max-w-full object-contain"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span className="text-8xl">{homeFlag}</span>
            )}
          </div>
          <h3 className="text-white text-4xl font-black">{localizeTeam(homeTeam)}</h3>
        </div>

        {/* VS / Score */}
        <div className="text-center px-10">
          {match.homeScore !== null && match.awayScore !== null ? (
            <div className="flex items-center gap-6">
              <span className="text-white text-8xl font-black">{match.homeScore}</span>
              <span className="text-[#FFD700] text-6xl font-black">-</span>
              <span className="text-white text-8xl font-black">{match.awayScore}</span>
            </div>
          ) : (
            <div className="text-[#FFD700] text-7xl font-black">VS</div>
          )}
          <p className="text-white/60 text-2xl mt-4">كأس العالم 2026</p>
        </div>

        {/* Away */}
        <div className="flex-1 text-center">
          <div className="h-40 w-40 mx-auto mb-6 flex items-center justify-center">
            {isAwayUrl ? (
              <img
                src={awayFlag}
                alt={awayTeam}
                className="max-h-full max-w-full object-contain"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span className="text-8xl">{awayFlag}</span>
            )}
          </div>
          <h3 className="text-white text-4xl font-black">{localizeTeam(awayTeam)}</h3>
        </div>
      </div>
    </div>
  );
}

// ─── Full-width live match card ───────────────────────────────────────────────
function TVMatchCard({ match }: { match: Match }) {
  const { t, localizeTeam } = useI18n();
  const homeTeam = match.home;
  const awayTeam = match.away;
  const homeFlag = match.homeFlag || "🏳️";
  const awayFlag = match.awayFlag || "🏳️";
  const isHomeUrl = homeFlag.startsWith("http");
  const isAwayUrl = awayFlag.startsWith("http");
  const isLive = match.state === "live";

  return (
    <div
      className={`flex-1 min-w-[400px] rounded-2xl p-8 border-2 flex items-center gap-6 ${
        isLive
          ? "bg-gradient-to-br from-slate-900 to-slate-800 border-red-500/60 shadow-lg shadow-red-900/30"
          : "bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/50"
      }`}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute -top-3 right-6 flex items-center gap-2 bg-red-600 text-white text-xl font-black px-5 py-1 rounded-full">
          <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
          {t("match.live")}
        </div>
      )}

      {/* Home team */}
      <div className="flex-1 flex items-center gap-5">
        <div className="h-24 w-24 flex items-center justify-center shrink-0">
          {isHomeUrl ? (
            <img
              src={homeFlag}
              alt={homeTeam}
              className="max-h-full max-w-full object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <span className="text-5xl">{homeFlag}</span>
          )}
        </div>
        <span className="text-white text-4xl font-black">{localizeTeam(homeTeam)}</span>
      </div>

      {/* Score */}
      <div className="text-center px-8">
        {match.homeScore !== null && match.awayScore !== null ? (
          <div className="flex items-center gap-5">
            <span className={`text-7xl font-black ${isLive ? "text-white" : "text-slate-300"}`}>
              {match.homeScore}
            </span>
            <span className="text-[#FFD700] text-5xl font-black">:</span>
            <span className={`text-7xl font-black ${isLive ? "text-white" : "text-slate-300"}`}>
              {match.awayScore}
            </span>
          </div>
        ) : (
          <span className="text-[#FFD700] text-5xl font-black">VS</span>
        )}
        <p className="text-slate-400 text-2xl mt-3">{match.label}</p>
      </div>

      {/* Away team */}
      <div className="flex-1 flex items-center gap-5 justify-start">
        <span className="text-white text-4xl font-black">{localizeTeam(awayTeam)}</span>
        <div className="h-24 w-24 flex items-center justify-center shrink-0">
          {isAwayUrl ? (
            <img
              src={awayFlag}
              alt={awayTeam}
              className="max-h-full max-w-full object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <span className="text-5xl">{awayFlag}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal scrolling live scores ticker (TV sports channel style) ──────
function LiveScoresRow({ matches }: { matches: Match[] }) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScores = useRef<Record<number, { home: number | null; away: number | null }>>({});
  const [flashMatch, setFlashMatch] = useState<number | null>(null);

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (matches.length === 0) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % Math.max(1, matches.length));
    }, 8000);
    return () => clearInterval(id);
  }, [matches.length]);

  // Scroll card into view
  useEffect(() => {
    if (!containerRef.current || matches.length === 0) return;
    const cards = containerRef.current.querySelectorAll("[data-tv-card]");
    const card = cards[currentIndex % matches.length] as HTMLElement;
    if (card) {
      const container = containerRef.current;
      const left = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [currentIndex, matches.length]);

  // Detect score changes for flash animation
  useEffect(() => {
    matches.forEach((m) => {
      const old = prevScores.current[m._index];
      if (old && m.state === "live") {
        if (m.homeScore !== null && (old.home ?? 0) < m.homeScore) {
          setFlashMatch(m._index);
          setTimeout(() => setFlashMatch(null), 2000);
        } else if (m.awayScore !== null && (old.away ?? 0) < m.awayScore) {
          setFlashMatch(m._index);
          setTimeout(() => setFlashMatch(null), 2000);
        }
      }
      prevScores.current[m._index] = { home: m.homeScore, away: m.awayScore };
    });
  }, [matches]);

  if (matches.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3 bg-red-600 text-white text-2xl font-black px-6 py-3 rounded-full animate-pulse">
          <span className="w-3 h-3 rounded-full bg-white" />
          {t("hero.liveNow")}
        </div>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-red-500/40 to-transparent" />
        <span className="text-slate-400 text-2xl font-bold">{matches.length} {t("hero.liveNow")}</span>
      </div>

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-hidden pb-4"
        style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
      >
        {matches.map((match) => (
          <div
            key={match._index}
            data-tv-card
            className={`shrink-0 transition-all duration-500 ${
              flashMatch === match._index ? "ring-4 ring-[#FFD700] rounded-2xl" : ""
            }`}
          >
            <TVMatchCard match={match} />
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-3 mt-4">
        {matches.slice(0, Math.min(8, matches.length)).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex % 8 ? "bg-[#FFD700] w-8" : "bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Groups / Standings quick view ──────────────────────────────────────────
type GroupData = { name: string; teams: string[] };

function StandingsQuickView() {
  const groups: GroupData[] = [
    { name: "المجموعة أ", teams: ["🇲🇦 المغرب", "🇭🇷 كرواتيا", "🇪🇸 إسبانيا", "🇨🇦 كندا"] },
    { name: "المجموعة ب", teams: ["🇩🇪 ألمانيا", "🇳🇱 هولندا", "🇧🇪 بلجيكا", "🇮🇹 إيطاليا"] },
    { name: "المجموعة ج", teams: ["🇧🇷 البرازيل", "🇦🇷 الأرجنتين", "🇫🇷 فرنسا", "🇵🇹 البرتغال"] },
    { name: "المجموعة د", teams: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿 إنجلترا", "🇺🇾 أوروغواي", "🇺🇸 أمريكا", "🇲🇦 السعودية"] },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3 bg-[#006233] text-white text-2xl font-black px-6 py-3 rounded-full border border-[#FFD700]/30">
          🏆 {groups.length} مجموعات
        </div>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((group) => (
          <div
            key={group.name}
            className="bg-gradient-to-b from-[#006233]/20 to-slate-900/80 rounded-2xl p-6 border border-[#FFD700]/20"
          >
            <h3 className="text-[#FFD700] text-2xl font-black mb-5 text-center">{group.name}</h3>
            <div className="space-y-4">
              {group.teams.map((team, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-3xl">{team.split(" ")[0]}</span>
                  <span className="text-white text-xl font-bold">{team.split(" ").slice(1).join(" ")}</span>
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
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-black/70 border border-[#FFD700]/30 backdrop-blur-sm">
      <div className={`w-3 h-3 rounded-full ${countdown <= 5 ? "bg-[#FFD700] animate-pulse" : "bg-green-400"}`} />
      <span className="text-white text-2xl font-bold">تحديث تلقائي</span>
      <span className="text-[#FFD700] text-2xl font-black">{countdown}s</span>
    </div>
  );
}

// ─── Main TV Page ─────────────────────────────────────────────────────────────
export default function TVPage() {
  const { t } = useI18n();

  // Use demo data for TV display
  const allMatches = DEMO_MATCHES;

  const liveMatches = allMatches.filter((m) => m.state === "live");
  const upcomingMatches = allMatches
    .filter((m) => m.state === "upcoming")
    .sort((a, b) => new Date(a.utcDate!).getTime() - new Date(b.utcDate!).getTime());
  const finishedMatches = allMatches
    .filter((m) => m.state === "ft")
    .slice(-6);

  const nextMatch = upcomingMatches[0] || null;

  const [refreshCountdown, setRefreshCountdown] = useState(15);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate auto-refresh (15 seconds)
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

  // Fake articles for ticker demo
  const demoArticles: Article[] = [
    { title: "🇲🇷 موريتانيا تتأهل لنهائيات كأس العالم 2026", source: "Mauribin", url: "#" },
    { title: "كأس العالم 2026: أرقام تاريخية في مرحلة المجموعات", source: "FIFA", url: "#" },
    { title: "أفضل 10 أهداف في تاريخ كأس العالم", source: "BBC Sport", url: "#" },
    { title: "تحليل: لماذا favorita البرازيل للفوز بالبطولة؟", source: "ESPN", url: "#" },
    { title: "إسبانيا تُعلن قائمة المنتخبات المشاركة", source: "RFEF", url: "#" },
    { title: "تقنية الفيديو VAR: كل ما تحتاج معرفته", source: "FIFA", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a0d] via-[#002515] to-[#001209] text-white overflow-x-hidden">
      {/* Fixed header */}
      <div className="sticky top-0 z-50 bg-[#006233]/95 border-b-2 border-[#FFD700]/40 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 py-5">
          {/* Logo */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD700] flex items-center justify-center">
              <span className="text-[#006233] text-4xl font-black">M</span>
            </div>
            <div>
              <h1 className="text-[#FFD700] text-5xl font-black leading-none">Mauribin</h1>
              <p className="text-white/70 text-2xl font-bold">موريبين | كأس العالم 2026</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <div className="text-[#FFD700] text-4xl font-black">كأس العالم</div>
            <div className="text-white/60 text-2xl font-bold">FIFA World Cup 2026</div>
          </div>

          {/* Status */}
          <div className="text-left">
            <div className="text-white text-2xl font-bold">
              {lastUpdate.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-green-400 text-xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              نظام التشغيل طبيعي
            </div>
          </div>
        </div>
      </div>

      {/* Auto-scrolling news ticker */}
      <NewsTicker articles={demoArticles} />

      {/* Main content */}
      <div className="px-8 py-10 space-y-12 max-w-[1920px] mx-auto">
        {/* NEXT MATCH HERO */}
        <section>
          <NextMatchHero match={nextMatch} />
        </section>

        {/* LIVE MATCHES */}
        {liveMatches.length > 0 && (
          <section>
            <LiveScoresRow matches={liveMatches} />
          </section>
        )}

        {/* FINISHED RECENTLY */}
        {finishedMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#006233] text-white text-2xl font-black px-6 py-3 rounded-full border border-[#FFD700]/30">
                ✓ {t("hero.results")} ({finishedMatches.length})
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {finishedMatches.map((match) => (
                <TVMatchCard key={match._index} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* STANDINGS QUICK VIEW */}
        <section>
          <StandingsQuickView />
        </section>

        {/* UPCOMING NEXT 4 */}
        {upcomingMatches.length > 1 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#006233] text-white text-2xl font-black px-6 py-3 rounded-full border border-[#FFD700]/30">
                ⏰ {t("hero.upcoming")}
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FFD700]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {upcomingMatches.slice(1, 5).map((match) => (
                <div
                  key={match._index}
                  className="bg-gradient-to-br from-[#006233]/20 to-slate-900/80 rounded-2xl p-6 border border-[#FFD700]/20 flex items-center gap-4"
                >
                  <div className="text-4xl">{match.homeFlag}</div>
                  <div className="flex-1">
                    <p className="text-white text-2xl font-black text-center">{match.home} vs {match.away}</p>
                    <p className="text-[#FFD700] text-xl font-bold text-center mt-2">{match.label}</p>
                  </div>
                  <div className="text-4xl">{match.awayFlag}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#006233]/80 border-t border-[#FFD700]/20 px-8 py-6">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="text-slate-400 text-2xl font-bold">
            © 2026 Mauribin — {t("common.competition")}
          </div>
          <div className="text-[#FFD700] text-2xl font-black">
            ⚽ Mauribin TV Mode — وضع التلفزيون
          </div>
          <div className="text-slate-400 text-2xl font-bold">
            {t("hero.refreshIn")}: <span className="text-[#FFD700]">{refreshCountdown}s</span>
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <TVRefreshIndicator countdown={refreshCountdown} />

      {/* Flash animation style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-gold {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      ` }} />
    </div>
  );
}
