import { fetchScores, fetchArticles } from "@/lib/data";
import { HomeClient } from "@/components/HomeClient";
import { VideoSection } from "@/components/VideoSection";
import { getMatchState } from "@/lib/matchState";

async function getWorldCupMatches() {
  try {
    const API_KEY = "74324d6063934f75b808c611780d7b68";
    const res = await fetch(`https://api.football-data.org/v4/competitions/WC/matches`, {
      headers: { "X-Auth-Token": API_KEY },
      next: { revalidate: 60 }
    });
    const data = await res.json();
    const matches: any[] = data.matches || [];
    return matches.map((m: any, idx: number) => {
      const home = m.homeTeam;
      const away = m.awayTeam;
      const score = m.score?.fullTime || { home: null, away: null };
      const status = getMatchState(m.status, m.utcDate, "football-data");
      const slug = `wc-${m.id}`;
      const homeCrest = home.crest?.replace("http://", "https://") || "";
      const awayCrest = away.crest?.replace("http://", "https://") || "";
      const date = new Date(m.utcDate);
      const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const dayName = dayNames[date.getDay()];
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const mins = date.getUTCMinutes().toString().padStart(2, "0");
      const label = `${dayName} ${hours}:${mins} ت ع`;
      if (!["live", "finished", "upcoming"].includes(status)) {
        console.warn(`[page.tsx] Unknown status "${m.status}" for ${home.name} vs ${away.name}`);
      }
      return {
        _index: 1000 + idx, id: m.id, slug,
        home: home.shortName || home.name,
        away: away.shortName || away.name,
        homeFlag: homeCrest, awayFlag: awayCrest,
        homeScore: score.home, awayScore: score.away,
        state: status, label, utcDate: m.utcDate,
        homeCrest, awayCrest,
        competition: m.competition?.name || "World Cup",
      };
    });
  } catch { return []; }
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [scoresData, articlesData, worldCupMatches] = await Promise.all([
    fetchScores(), fetchArticles(), getWorldCupMatches(),
  ]);

  const matches = scoresData.matches || [];
  const articles = articlesData.articles || [];

  worldCupMatches.sort((a: any, b: any) => {
    if (a.state === "upcoming" && b.state !== "upcoming") return -1;
    if (b.state === "upcoming" && a.state !== "upcoming") return 1;
    if (a.state === "upcoming" && b.state === "upcoming") {
      return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
    }
    return 0;
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <VideoSection />
      </div>
      <HomeClient matches={matches} articles={articles} worldCupMatches={worldCupMatches} />
    </>
  );
}
