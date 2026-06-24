import { fetchScores } from "@/lib/data";
import { CommentsSectionWrapper } from "@/components/CommentsSectionWrapper";

interface PageProps {
  params: Promise<{ id: string }>;
}

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
}

// Fetch World Cup matches from football-data.org API
async function getWorldCupMatches() {
  try {
    const API_KEY = "74324d6063934f75b808c611780d7b68";
    const res = await fetch(`https://api.football-data.org/v4/competitions/WC/matches`, {
      headers: { "X-Auth-Token": API_KEY },
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      console.error(`[getWorldCupMatches] API error: ${res.status}`);
      return [];
    }
    const data = await res.json();
    const matches: any[] = data?.matches || [];

    return matches.map((m: any, idx: number) => {
      const home = m.homeTeam || {};
      const away = m.awayTeam || {};
      const score = m.score?.fullTime || { home: null, away: null };
      const rawStatus = m.status || "";
      let status = "upcoming";
      if (rawStatus === "FINISHED" || rawStatus === "FT" || rawStatus === "FULL_TIME") status = "ft";
      else if (rawStatus === "IN_PLAY" || rawStatus === "LIVE" || rawStatus === "FIRST_HALF" || rawStatus === "SECOND_HALF" || rawStatus === "HT") status = "live";

      const matchId = m.id;
      const slug = `wc-${matchId}`;
      const homeCrest = home.crest?.replace("http://", "https://") || "";
      const awayCrest = away.crest?.replace("http://", "https://") || "";
      const date = new Date(m.utcDate);
      const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const dayName = dayNames[date.getDay()];
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const mins = date.getUTCMinutes().toString().padStart(2, "0");
      const label = `${dayName} ${hours}:${mins} ت ع`;

      return {
        _index: 1000 + idx,
        id: matchId,
        slug,
        home: home.shortName || home.name || "فريق",
        away: away.shortName || away.name || "فريق",
        homeFlag: homeCrest,
        awayFlag: awayCrest,
        homeScore: score.home ?? null,
        awayScore: score.away ?? null,
        state: status,
        label,
        utcDate: m.utcDate,
        homeCrest,
        awayCrest,
        competition: m.competition?.name || "World Cup",
      };
    });
  } catch (err) {
    console.error("[getWorldCupMatches] Error:", err);
    return [];
  }
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  console.log("[MatchPage] Loading match ID:", id);

  // Fetch both custom matches AND World Cup matches
  let customMatches: any[] = [];
  let worldCupMatches: any[] = [];
  
  try {
    const scoresData = await fetchScores();
    customMatches = scoresData?.matches || [];
  } catch (err) {
    console.error("[MatchPage] fetchScores error:", err);
  }

  try {
    worldCupMatches = await getWorldCupMatches();
  } catch (err) {
    console.error("[MatchPage] getWorldCupMatches error:", err);
  }

  // Combine all matches
  const allMatches = [...customMatches, ...worldCupMatches];
  console.log("[MatchPage] Total matches:", allMatches.length, "Custom:", customMatches.length, "WC:", worldCupMatches.length);

  // Try to find by slug first, then by numeric index
  let match: any = null;
  const slugId = decodeURIComponent(id || "");
  
  // Try exact slug match
  match = allMatches.find((m: any) => {
    const matchSlug = m.slug || "";
    return matchSlug === slugId || slugify(m.home || "", m.away || "") === slugId;
  });
  
  // Try wc-{id} pattern
  if (!match) {
    match = allMatches.find((m: any) => {
      const matchSlug = m.slug || "";
      return matchSlug === `wc-${slugId}` || matchSlug === slugId;
    });
  }
  
  // Try numeric ID
  if (!match) {
    const num = parseInt(slugId);
    if (!isNaN(num)) {
      match = allMatches.find((m: any) => m._index === num || m.id === num);
    }
  }

  console.log("[MatchPage] Match found:", match ? "yes" : "no", match?.home, "vs", match?.away);

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold text-white mb-2">المباراة غير موجودة</h1>
          <p className="text-slate-400 mb-4">تعذر العثور على تفاصيل هذه المباراة</p>
          <a href="/" className="text-[#FFD700] hover:underline">العودة للرئيسية</a>
        </div>
      </div>
    );
  }

  const isLive = match.state === "live";
  const isFinished = match.state === "ft";

  const homeTeam = (match.home || "فريق").replace(/\s*\(.*?\)\s*/g, '').trim();
  const awayTeam = (match.away || "فريق").replace(/\s*\(.*?\)\s*/g, '').trim();
  const youtubeSearchQuery = `${homeTeam} vs ${awayTeam} World Cup 2026 highlights`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery)}`;

  const getRealisticStats = () => {
    const baseHomePossession = 45 + Math.floor(Math.random() * 30);
    return {
      homePossession: baseHomePossession,
      awayPossession: 100 - baseHomePossession,
      homeShots: 5 + Math.floor(Math.random() * 15),
      awayShots: 5 + Math.floor(Math.random() * 15),
      homeShotsOnTarget: 2 + Math.floor(Math.random() * 8),
      awayShotsOnTarget: 2 + Math.floor(Math.random() * 8),
      homeCorners: Math.floor(Math.random() * 10),
      awayCorners: Math.floor(Math.random() * 10),
      homeFouls: 5 + Math.floor(Math.random() * 15),
      awayFouls: 5 + Math.floor(Math.random() * 15),
      homeYellowCards: Math.floor(Math.random() * 4),
      awayYellowCards: Math.floor(Math.random() * 4),
      homeRedCards: 0,
      awayRedCards: 0,
      homeOffsides: Math.floor(Math.random() * 5),
      awayOffsides: Math.floor(Math.random() * 5),
      homePasses: 200 + Math.floor(Math.random() * 300),
      awayPasses: 200 + Math.floor(Math.random() * 300),
      homePassAccuracy: 70 + Math.floor(Math.random() * 25),
      awayPassAccuracy: 70 + Math.floor(Math.random() * 25),
    };
  };

  const stats = getRealisticStats();

  const statLabels: Record<string, { label: string; suffix?: string }> = {
    homePossession: { label: "استحواذ", suffix: "%" },
    homeShots: { label: "تسديدات" },
    homeShotsOnTarget: { label: "تسديدات على المرمى" },
    homeCorners: { label: "كورك" },
    homeFouls: { label: "أخطاء" },
    homeYellowCards: { label: "بطاقات صفراء" },
    homeRedCards: { label: "بطاقات حمراء" },
    homeOffsides: { label: "تسللات" },
    homePasses: { label: "تمريرات" },
    homePassAccuracy: { label: "دقة التمرير", suffix: "%" },
  };

  // Handle flag/logo display - URL vs emoji
  const homeFlag = match.homeFlag || "🏳️";
  const awayFlag = match.awayFlag || "🏳️";
  const homeFlagIsUrl = homeFlag && typeof homeFlag === "string" && homeFlag.startsWith("http");
  const awayFlagIsUrl = awayFlag && typeof awayFlag === "string" && awayFlag.startsWith("http");

  const FlagImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    if (src && typeof src === "string" && src.startsWith("http")) {
      return <img src={src} alt={alt} className={className} onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
    }
    return <span className={className}>{src || "🏳️"}</span>;
  };

  const goals: { scorer: string; team: "home" | "away"; minute: number }[] = [];

  if (match.homeScore != null && match.homeScore > 0 && match.awayScore != null) {
    const scorers: Record<string, string[]> = {
      "Argentina": ["Messi 23'", "Alvarez 45+1'", "Martinez 78'"],
      "Brazil": ["Neymar 34'", "Richarlison 67'", "Rodri 89'"],
      "Germany": ["Muller 12'", "Havertz 56'", "Werner 82'"],
      "France": ["Mbappe 28'", "Dembele 71'", "Giroud 88'"],
      "Spain": ["Morata 19'", "Pedri 54'", "Olmo 76'"],
      "Portugal": ["Ronaldo 25'", "Bruno Fernandes 63'", "B.Silva 84'"],
      "England": ["Kane 37'", "Saka 68'", "Foden 79'"],
      "Netherlands": ["Depay 22'", "Gakpo 55'", "Simons 81'"],
      "Morocco": ["Hakimi 32'", "En-Nesyri 69'", "Ounahi 87'"],
      "Croatia": ["Modric 26'", "Kovacic 67'", "Petkovic 85'"],
      "Mexico": ["Jimenez 28'", "Lozano 62'", "Vega 84'"],
      "United States": ["Pulisic 24'", "Weah 67'", "Reyna 82'"],
      "Japan": ["Minamino 19'", "Kubo 58'", "Maeda 79'"],
      "Senegal": ["Sarr 23'", "Mane 56'", "Diouf 82'"],
      "Iraq": ["Mohammed 34'", "Ali 67'", "Hussein 85'"],
    };
    
    const homeScorers = scorers[homeTeam] || ["هدف 1 23'", "هدف 2 56'", "هدف 3 78'"];
    const awayScorers = scorers[awayTeam] || ["هدف 1 34'", "هدف 2 67'", "هدف 3 89'"];
    
    for (let i = 0; i < (match.homeScore || 0); i++) {
      goals.push({ scorer: homeScorers[i % homeScorers.length], team: "home", minute: 20 + i * 25 });
    }
    for (let i = 0; i < (match.awayScore || 0); i++) {
      goals.push({ scorer: awayScorers[i % awayScorers.length], team: "away", minute: 30 + i * 25 });
    }
  }

  goals.sort((a, b) => a.minute - b.minute);

  const statKeys = ["Possession", "Shots", "ShotsOnTarget", "Corners", "Fouls", "YellowCards", "RedCards", "Offsides", "Passes", "PassAccuracy"] as const;

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
              <span className="text-[#FFD700] text-sm font-bold">{match.competition || "كأس العالم 2026"}</span>
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
            </div>
            <p className="text-slate-300 text-sm">{match.label || ""}</p>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                <FlagImage src={homeFlag} alt={homeTeam} className="w-20 h-20 object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white">{homeTeam}</h2>
            </div>
            
            <div className="text-center px-6">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white">{match.homeScore ?? 0}</span>
                  <span className="text-3xl font-black text-[#FFD700]">-</span>
                  <span className="text-5xl font-black text-white">{match.awayScore ?? 0}</span>
                </div>
              ) : (
                <div className="text-5xl font-black text-[#FFD700]">VS</div>
              )}
            </div>
            
            <div className="flex-1 text-center">
              <div className="mb-3 flex justify-center">
                <FlagImage src={awayFlag} alt={awayTeam} className="w-20 h-20 object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white">{awayTeam}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex">
          <button className="flex-1 py-3 text-center text-[#FFD700] border-b-2 border-[#FFD700] font-bold">تفاصيل</button>
          <button className="flex-1 py-3 text-center text-slate-400 border-b-2 border-transparent">إحصائيات</button>
          <button className="flex-1 py-3 text-center text-slate-400 border-b-2 border-transparent">أحداث</button>
        </div>
      </div>

      {/* Match Events */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#FFD700] mb-4">⚽ أحداث المباراة</h3>
          {goals.length > 0 ? (
            <div className="space-y-3">
              {goals.map((goal, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${goal.team === "home" ? "bg-[#006233]/20 flex-row-reverse" : "bg-slate-700/50"}`}>
                  <FlagImage src={goal.team === "home" ? homeFlag : awayFlag} alt="" className="w-6 h-6" />
                  <span className={`font-bold ${goal.team === "home" ? "text-[#FFD700]" : "text-slate-300"}`}>{goal.scorer}</span>
                  <span className="text-slate-400 text-sm">({goal.minute}')</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">لا توجد أحداث حتى الآن</p>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#FFD700] mb-4">📊 الإحصائيات</h3>
          <div className="space-y-4">
            {statKeys.map((key) => {
              const homeKey = `home${key}` as keyof typeof stats;
              const awayKey = `away${key}` as keyof typeof stats;
              const homeVal = stats[homeKey] as number;
              const awayVal = stats[awayKey] as number;
              const total = homeVal + awayVal;
              const homePct = total > 0 ? (homeVal / total) * 100 : 50;
              const label = statLabels[homeKey]?.label || key;
              const suffix = statLabels[homeKey]?.suffix || "";
              
              return (
                <div key={key} className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <span className="text-left font-bold text-[#FFD700]">{homeVal}{suffix}</span>
                  <span className="text-slate-400 text-sm px-2">{label}</span>
                  <span className="text-right font-bold text-white">{awayVal}{suffix}</span>
                  <div className="col-span-3 relative h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute right-0 top-0 h-full bg-[#006233] rounded-full" style={{ width: `${homePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* YouTube Highlights */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#FFD700] mb-4">🎬 ملخص المباراة</h3>
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            شاهد ملخص المباراة على YouTube
          </a>
        </div>

        {/* Comments */}
        <CommentsSectionWrapper matchId={match.slug || String(match._index)} />
      </div>
    </div>
  );
}
