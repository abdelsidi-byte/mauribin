import { CommentsSectionWrapper } from "@/components/CommentsSectionWrapper";
import { cookies } from "next/headers";
import { type Locale, translate } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ id: string }>;
}

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

// Fetch match details from local API (which calls ESPN)
async function getMatchDetail(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mauribin.vercel.app";
    const res = await fetch(`${baseUrl}/api/match-detail/${id}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();
  const t = (k: string) => translate(locale, k);

  // Try to fetch real match details from ESPN API
  const matchDetail = await getMatchDetail(id);

  // Fallback: if not found, show not found
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

  const { homeTeam, awayTeam, status, goals, stats, events, venue, competition, date } = matchDetail;

  const isLive = status === "1st Half" || status === "2nd Half" || status === "Halftime" || status.includes("Half");
  const isFinished = status === "FT" || status === "Full Time";

  const FlagImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    if (src && typeof src === "string" && src.startsWith("http")) {
      return <img src={src} alt={alt} className={className} onError={(e) => { e.currentTarget.style.display = "none"; }} />;
    }
    return <span className={className}>{src || "🏳️"}</span>;
  };

  // Format date
  const matchDate = date ? new Date(date) : new Date();
  const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const dayName = dayNames[matchDate.getDay()];
  const hours = matchDate.getUTCHours().toString().padStart(2, "0");
  const mins = matchDate.getUTCMinutes().toString().padStart(2, "0");
  const dateLabel = `${dayName} ${hours}:${mins} ت ع`;

  const statLabels: Record<string, { label: string; suffix?: string }> = {
    possession: { label: t("details.possession"), suffix: "%" },
    shots: { label: t("details.shots") },
    shotsOnTarget: { label: t("details.shotsOnTarget") },
    corners: { label: t("details.corners") },
    fouls: { label: t("details.fouls") },
    yellowCards: { label: t("details.yellowCards") },
    redCards: { label: t("details.redCards") },
    offsides: { label: t("details.offsides") },
    passes: { label: t("details.passes") },
    passAccuracy: { label: t("details.passAccuracy"), suffix: "%" },
  };

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
              <span className="text-[#FFD700] text-sm font-bold">{competition || "كأس العالم 2026"}</span>
            </div>
            <div className="w-8" />
          </div>

          {/* Match Title */}
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
              {status && !isLive && !isFinished && (
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
                  <span className="text-5xl font-black text-white">{homeTeam.score ?? 0}</span>
                  <span className="text-3xl font-black text-[#FFD700]">-</span>
                  <span className="text-5xl font-black text-white">{awayTeam.score ?? 0}</span>
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

        {/* Statistics */}
        {stats && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-[#FFD700] mb-4">📊 {t("details.stats")}</h3>
            <div className="space-y-4">
              {Object.entries(statLabels).map(([key, meta]) => {
                const homeVal = parseFloat(stats.home[key as keyof typeof stats.home] as string) || 0;
                const awayVal = parseFloat(stats.away[key as keyof typeof stats.away] as string) || 0;
                const total = homeVal + awayVal;
                const homePct = total > 0 ? (homeVal / total) * 100 : 50;
                const suffix = meta.suffix || "";

                return (
                  <div key={key} className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                    <span className="text-left font-bold text-[#FFD700]">{homeVal}{suffix}</span>
                    <span className="text-slate-400 text-sm px-2">{meta.label}</span>
                    <span className="text-right font-bold text-white">{awayVal}{suffix}</span>
                    <div className="col-span-3 relative h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="absolute right-0 top-0 h-full bg-[#006233] rounded-full" style={{ width: `${homePct}%` }} />
                    </div>
                  </div>
                );
              })}
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
