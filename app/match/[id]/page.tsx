import { CommentsSectionWrapper } from "@/components/CommentsSectionWrapper";
import { cookies } from "next/headers";
import { type Locale, translate } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ id: string }>;
}

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

async function getLocaleFromCookie(): Promise<Locale> {
  try {
    const store = await cookies();
    const v = store.get("mauribin:locale")?.value;
    if (v === "fr" || v === "en" || v === "ar") return v;
  } catch {
    /* noop */
  }
  return "ar";
}

function getEventType(e: any): string {
  if (!e.type) return "";
  if (typeof e.type === "string") return e.type;
  return e.type?.type || "";
}

async function fetchMatchFromESPN(id: string) {
  try {
    const eventId = id.replace(/^wc-/, "");
    const url = `${ESPN_BASE}/summary?event=${eventId}`;
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();

    const header = data.header || {};
    const headerComps = header.competitions || [];
    const competition = headerComps[0] || {};
    const competitors = competition.competitors || [];

    const homeComp = competitors.find((c: any) => c.homeAway === "home") || competitors[0];
    const awayComp = competitors.find((c: any) => c.homeAway === "away") || competitors[1];
    const homeTeamData = homeComp.team || {};
    const awayTeamData = awayComp.team || {};

    const homeTeam = {
      name: homeTeamData.displayName || "Home",
      abbr: homeTeamData.abbreviation || "HOM",
      logo: (homeTeamData.logos || [])[0]?.href || "",
      score: homeComp.score || "0",
      winner: homeComp.winner || false,
    };
    const awayTeam = {
      name: awayTeamData.displayName || "Away",
      abbr: awayTeamData.abbreviation || "AWY",
      logo: (awayTeamData.logos || [])[0]?.href || "",
      score: awayComp.score || "0",
      winner: awayComp.winner || false,
    };

    const statusType = competition.status?.type || {};
    const status = statusType.detail || statusType.description || "FT";
    const date = competition.date || header.date || "";

    const gameInfo = data.gameInfo || {};
    const venue = gameInfo.venue?.fullName || "";

    const goals: any[] = [];
    const keyEvents = data.keyEvents || [];
    for (const event of keyEvents) {
      const eventType = getEventType(event);
      if (eventType === "goal") {
        const fullText = event.text || "";
        const clock = event.clock?.displayValue || event.time?.value || "?";
        const teamName = event.team?.displayName || "";
        const team: "home" | "away" = teamName === homeTeam.name ? "home" : "away";

        // Extract scorer: "Goal! Curaçao 0, Côte d'Ivoire 1. Nicolas Pépé (Côte d'Ivoire)..."
        let scorer = "Unknown";
        const nameMatch = fullText.match(/Goal!\s+[^)]+\)\s+([^.]+)/);
        if (nameMatch) {
          scorer = nameMatch[1].trim();
        }

        goals.push({ scorer, team, minute: String(clock), text: fullText });
      }
    }

    const events: any[] = [];
    for (const event of keyEvents) {
      const eventType = getEventType(event);
      if (["goal", "yellow-card", "red-card", "kickoff", "start-2nd-half", "halftime", "end-regular-time"].includes(eventType)) {
        const clock = event.clock?.displayValue || event.time?.value || "";
        events.push({
          type: eventType,
          minute: String(clock),
          text: event.text || "",
        });
      }
    }

    return {
      id: String(eventId),
      date,
      competition: competition.name || "FIFA World Cup 2026",
      venue,
      status,
      homeTeam,
      awayTeam,
      goals,
      events,
    };
  } catch (err) {
    console.error("[MatchPage] ESPN fetch error:", err);
    return null;
  }
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();
  const t = (k: string) => translate(locale, k);

  const matchDetail = await fetchMatchFromESPN(id);

  if (!matchDetail || !matchDetail.homeTeam) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold text-white mb-2">{t("details.notFound")}</h1>
          <p className="text-slate-400 mb-4">{t("details.notFoundHint")}</p>
          <a href="/" className="text-[#FFD700] hover:underline">{t("details.backHome")}</a>
        </div>
      </div>
    );
  }

  const { homeTeam, awayTeam, status, goals, events, venue, competition, date } = matchDetail;
  const isLive = status === "1st Half" || status === "2nd Half" || status.includes("Half");
  const isFinished = status === "FT" || status === "Full Time";

  const FlagImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    if (src && typeof src === "string" && src.startsWith("http")) {
      return <img src={src} alt={alt} className={className} />;
    }
    return <span className={className}>{src || "🏳️"}</span>;
  };

  const matchDate = date ? new Date(date) : new Date();
  const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const dayName = dayNames[matchDate.getDay()];
  const hours = matchDate.getUTCHours().toString().padStart(2, "0");
  const mins = matchDate.getUTCMinutes().toString().padStart(2, "0");
  const dateLabel = `${dayName} ${hours}:${mins} ت ع`;

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006233] via-[#004225] to-[#002815] py-6 px-4 border-b-4 border-[#FFD700]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <a href="/" className="text-white hover:text-[#FFD700] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div className="text-center">
              <span className="text-[#FFD700] text-sm font-bold">{competition}</span>
            </div>
            <div className="w-8" />
          </div>

          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              {isLive && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-red-400 text-sm font-bold animate-pulse">مباشر</span>
                </div>
              )}
              {isFinished && (
                <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">انتهت</span>
              )}
              {!isLive && !isFinished && (
                <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{status}</span>
              )}
            </div>
            <p className="text-slate-300 text-sm">{dateLabel}</p>
            {venue && <p className="text-slate-400 text-xs mt-1">🏟️ {venue}</p>}
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                <FlagImage src={homeTeam.logo} alt={homeTeam.name} className="w-20 h-20 object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white">{homeTeam.name}</h2>
            </div>

            <div className="text-center px-6">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white">{homeTeam.score}</span>
                  <span className="text-3xl font-black text-[#FFD700]">-</span>
                  <span className="text-5xl font-black text-white">{awayTeam.score}</span>
                </div>
              ) : (
                <div className="text-5xl font-black text-[#FFD700]">VS</div>
              )}
            </div>

            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                <FlagImage src={awayTeam.logo} alt={awayTeam.name} className="w-20 h-20 object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white">{awayTeam.name}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex">
          <button className="flex-1 py-3 text-center text-[#FFD700] border-b-2 border-[#FFD700] font-bold">{t("details.title")}</button>
          <button className="flex-1 py-3 text-center text-slate-400 border-b-2 border-transparent">{t("details.stats")}</button>
          <button className="flex-1 py-3 text-center text-slate-400 border-b-2 border-transparent">{t("details.events")}</button>
        </div>
      </div>

      {/* Match Details */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Match Events */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#FFD700] mb-4">⚽ {t("details.matchEvents")}</h3>
          {goals && goals.length > 0 ? (
            <div className="space-y-3">
              {goals.map((goal: any, idx: number) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${goal.team === "home" ? "bg-[#006233]/20 flex-row-reverse" : "bg-slate-700/50"}`}>
                  <FlagImage src={goal.team === "home" ? homeTeam.logo : awayTeam.logo} alt="" className="w-6 h-6" />
                  <span className={`font-bold ${goal.team === "home" ? "text-[#FFD700]" : "text-slate-300"}`}>{goal.scorer}</span>
                  <span className="text-slate-400 text-sm">({goal.minute}')</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">{t("details.noEvents")}</p>
          )}
        </div>

        {/* All Events Timeline */}
        {events && events.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-[#FFD700] mb-4">📋 الأحداث</h3>
            <div className="space-y-2">
              {events.map((event: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 w-10">{event.minute}</span>
                  <span className="text-lg">
                    {event.type === "goal" ? "⚽" :
                     event.type === "yellow-card" ? "🟨" :
                     event.type === "red-card" ? "🟥" :
                     event.type === "kickoff" ? "▶️" :
                     event.type === "halftime" ? "⏸️" :
                     event.type === "start-2nd-half" ? "▶️" :
                     event.type === "end-regular-time" ? "🏁" : "•"}
                  </span>
                  <span className="text-slate-300 capitalize">{event.text || event.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Highlights */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#FFD700] mb-4">🎬 {t("details.highlights")}</h3>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${homeTeam.name} vs ${awayTeam.name} World Cup 2026 highlights`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            {t("details.watchHighlights")}
          </a>
        </div>

        {/* Comments */}
        <CommentsSectionWrapper matchId={String(id)} />
      </div>
    </div>
  );
}
