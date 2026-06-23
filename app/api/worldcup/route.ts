import { NextResponse } from "next/server";
import { parseMatches, getCachedMatches, refreshWorldCupData, calculateStandings } from "@/lib/worldcup-api";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026";

// GET /api/worldcup - returns all matches with standings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const group = searchParams.get("group");
    const matchId = searchParams.get("id");
    
    // Force refresh
    if (action === "refresh") {
      const result = await refreshWorldCupData();
      return NextResponse.json(result);
    }
    
    // Get standings
    if (action === "standings") {
      const matches = await parseMatches();
      const standings = calculateStandings(matches);
      const result: Record<string, any> = {};
      standings.forEach((teams, groupLetter) => {
        result[`Group ${groupLetter}`] = teams;
      });
      return NextResponse.json({ standings: result });
    }
    
    // Get single match
    if (matchId) {
      const matches = await parseMatches();
      const match = matches.find(m => m.id === matchId);
      if (!match) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 });
      }
      return NextResponse.json({ match });
    }
    
    // Get group matches
    if (group) {
      const matches = await parseMatches();
      const groupMatches = matches.filter(m => m.group === `Group ${group}`);
      return NextResponse.json({ matches: groupMatches });
    }
    
    // Default: return all matches with standings
    const matches = await parseMatches();
    const standings = calculateStandings(matches);
    
    const standingsResult: Record<string, any> = {};
    standings.forEach((teams, groupLetter) => {
      standingsResult[`Group ${groupLetter}`] = teams;
    });
    
    return NextResponse.json({
      matches,
      standings: standingsResult,
      source: "OpenFootball/worldcup.json",
      total: matches.length,
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch World Cup data", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
