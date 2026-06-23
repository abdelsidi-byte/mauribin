import { NextResponse } from "next/server";

const API_KEY = "74324d6063934f75b808c611780d7b68";
const BASE_URL = "https://api.football-data.org/v4";

interface Match {
  id: number;
  homeTeam: { name: string; shortName: string; crest: string };
  awayTeam: { name: string; shortName: string; crest: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null };
  };
  status: string;
  utcDate: string;
  competition: { name: string; code: string };
  minute?: number;
}

function parseMatch(fm: any) {
  const home = fm.homeTeam;
  const away = fm.awayTeam;
  const score = fm.score?.fullTime || { home: null, away: null };
  const status = fm.status === "FINISHED" ? "ft" : fm.status === "LIVE" ? "live" : "upcoming";
  
  return {
    id: fm.id,
    team1: home.shortName || home.name,
    team1Full: home.name,
    team2: away.shortName || away.name,
    team2Full: away.name,
    homeScore: score.home,
    awayScore: score.away,
    state: status,
    date: fm.utcDate,
    competition: fm.competition?.name || "World Cup",
    minute: fm.minute,
    // Store original API data for reference
    apiId: fm.id,
    homeCrest: home.crest,
    awayCrest: away.crest,
  };
}

export async function GET() {
  try {
    // Fetch all WC matches
    const res = await fetch(`${BASE_URL}/competitions/WC/matches`, {
      headers: { "X-Auth-Token": API_KEY },
      next: { revalidate: 60 } // Cache 1 min
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    const matches: any[] = data.matches || [];
    
    const parsed = matches.map(parseMatch);
    
    // Sort: live first, then by date
    parsed.sort((a, b) => {
      if (a.state === "live" && b.state !== "live") return -1;
      if (b.state === "live" && a.state !== "live") return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    const finished = parsed.filter(m => m.state === "ft");
    const live = parsed.filter(m => m.state === "live");
    const upcoming = parsed.filter(m => m.state === "upcoming");
    
    return NextResponse.json({
      total: parsed.length,
      finished: finished.length,
      live: live.length,
      upcoming: upcoming.length,
      source: "football-data.org",
      matches: parsed
    });
    
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
