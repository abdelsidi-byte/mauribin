import { NextResponse } from "next/server";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

export const dynamic = "force-dynamic";

interface TeamStats {
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
}

interface Goal {
  scorer: string;
  team: "home" | "away";
  minute: string;
  assist?: string;
  text: string;
}

interface MatchDetail {
  id: string;
  date: string;
  competition: string;
  venue: string;
  referee?: string;
  attendance?: string;
  homeTeam: { name: string; abbr: string; logo: string; score: string; winner: boolean };
  awayTeam: { name: string; abbr: string; logo: string; score: string; winner: boolean };
  status: string;
  stats?: { home: TeamStats; away: TeamStats };
  goals: Goal[];
  events: Array<{ type: string; minute?: string; text: string }>;
}

function extractTeamStats(stats: Array<{ name: string; displayValue: string }>): TeamStats {
  const get = (name: string) => stats.find(s => s.name === name)?.displayValue || "0";
  return {
    possession: get("Possession"),
    shots: get("Total Shots"),
    shotsOnTarget: get("Shots on Target"),
    corners: get("Corner Kicks"),
    fouls: get("Fouls"),
    yellowCards: get("Yellow Cards"),
    redCards: get("Red Cards"),
    offsides: get("Offsides"),
    passes: get("Passes"),
    passAccuracy: get("Pass Accuracy %"),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Match ID required" }, { status: 400 });
  }

  try {
    // Try multiple event ID formats
    const eventId = id.replace(/^wc-/, "").replace(/^wc/, "");
    const url = `${ESPN_BASE}/summary?event=${eventId}`;

    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const data = await res.json();

    // Extract header info
    const header = data.header || {};
    const headerComps = header.competitions || [];
    const competition = headerComps[0] || {};
    const venue = competition.venue || {};
    const gameInfo = data.gameInfo || {};

    // Extract teams and score
    const competitors = competition.competitors || [];
    const homeComp = competitors.find((c: { homeAway: string }) => c.homeAway === "home") || competitors[0];
    const awayComp = competitors.find((c: { homeAway: string }) => c.homeAway === "away") || competitors[1];

    const homeTeam = {
      name: homeComp.team?.displayName || "Home",
      abbr: homeComp.team?.abbreviation || "HOM",
      logo: homeComp.team?.logos?.[0]?.href || "",
      score: homeComp.score || "0",
      winner: homeComp.winner || false,
    };

    const awayTeam = {
      name: awayComp.team?.displayName || "Away",
      abbr: awayComp.team?.abbreviation || "AWY",
      logo: awayComp.team?.logos?.[0]?.href || "",
      score: awayComp.score || "0",
      winner: awayComp.winner || false,
    };

    // Extract status
    const status = competition.status?.type?.detail || "FT";
    const date = competition.date || header.date || "";

    // Extract goals from keyEvents
    const goals: Goal[] = [];
    const keyEvents = data.keyEvents || [];
    for (const event of keyEvents) {
      const eventType = typeof event.type === 'string' ? event.type : event.type?.type || "";
      if (eventType === "goal") {
        const text: string = event.text || "";
        // Parse "Goal! TeamA 0, TeamB 1. PlayerName (Team) description"
        const goalMatch = text.match(/Goal!\s*(?:(\w+)\s*(\d+),\s*(\w+)\s*(\d+)\.\s*)?(.+)/);
        let scorer = "Unknown";
        let minute = event.clock?.displayValue || event.time?.value || "?";
        let team: "home" | "away" = homeTeam.name.includes(eventType) ? "home" : "away";

        // Try to determine team from text
        if (text.toLowerCase().includes(homeTeam.name.toLowerCase()) || text.toLowerCase().includes(homeTeam.abbr.toLowerCase())) {
          team = "home";
        } else if (text.toLowerCase().includes(awayTeam.name.toLowerCase()) || text.toLowerCase().includes(awayTeam.abbr.toLowerCase())) {
          team = "away";
        }

        // Extract player name - usually in parentheses after team score
        const playerMatch = text.match(/\)\s*([^,]+)/);
        if (playerMatch) {
          scorer = playerMatch[1].trim();
        }

        goals.push({ scorer, team, minute: String(minute), text });
      }
    }

    // Extract stats from boxscore
    let homeStats: TeamStats | undefined;
    let awayStats: TeamStats | undefined;

    const boxscore = data.boxscore;
    if (boxscore?.teams?.length >= 2) {
      const homeBox = boxscore.teams.find((t: { homeAway: string }) => t.homeAway === "home");
      const awayBox = boxscore.teams.find((t: { homeAway: string }) => t.homeAway === "away");
      if (homeBox?.stats) homeStats = extractTeamStats(homeBox.stats);
      if (awayBox?.stats) awayStats = extractTeamStats(awayBox.stats);
    }

    // Build events list (goals, cards, etc)
    const events: Array<{ type: string; minute?: string; text: string }> = [];
    for (const event of keyEvents) {
      const eventType = typeof event.type === 'string' ? event.type : event.type?.type || "";
      if (["goal", "yellowcard", "redcard", "kickoff", "period_start", "period_end"].includes(eventType)) {
        const minute = event.clock?.displayValue || event.time?.value || "";
        events.push({
          type: eventType,
          minute: String(minute),
          text: event.text || "",
        });
      }
    }

    const result: MatchDetail = {
      id: String(eventId),
      date,
      competition: competition.name || "FIFA World Cup 2026",
      venue: venue.fullName || "",
      referee: gameInfo.referee?.displayName,
      attendance: competition.attendance?.toString(),
      homeTeam,
      awayTeam,
      status,
      stats: homeStats && awayStats ? { home: homeStats, away: awayStats } : undefined,
      goals,
      events,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[match-detail API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch match details" }, { status: 500 });
  }
}
