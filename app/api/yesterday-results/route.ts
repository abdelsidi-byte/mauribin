import { NextResponse } from "next/server";

const ESPN_API = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(ESPN_API, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      throw new Error(`ESPN API error: ${res.status}`);
    }
    
    const data = await res.json();
    const events = data.events || [];
    
    // Filter for yesterday's matches (2026-06-25)
    const yesterday = "2026-06-25";
    const yesterdayMatches = events
      .filter((e: { date: string }) => e.date?.startsWith(yesterday))
      .map((e: { id: string; date: string; name: string; competitions: Array<{ status: { type: { detail: string } }; competitors: Array<{ team: { displayName: string; abbreviation: string; logos: Array<{ href: string }> }; score: string; winner: boolean }> }> }) => {
        const comp = e.competitions?.[0] || {};
        const status = comp.status?.type?.detail || "FT";
        const competitors = comp.competitors || [];
        const home = competitors[0];
        const away = competitors[1];
        
        return {
          id: e.id,
          date: e.date,
          home: {
            name: home?.team?.displayName || "Unknown",
            abbr: home?.team?.abbreviation || "???",
            logo: home?.team?.logos?.[0]?.href || "",
            score: home?.score || "0",
            winner: home?.winner || false,
          },
          away: {
            name: away?.team?.displayName || "Unknown",
            abbr: away?.team?.abbreviation || "???",
            logo: away?.team?.logos?.[0]?.href || "",
            score: away?.score || "0",
            winner: away?.winner || false,
          },
          status,
        };
      });
    
    return NextResponse.json({
      date: yesterday,
      count: yesterdayMatches.length,
      matches: yesterdayMatches,
    });
  } catch (error) {
    console.error("Error fetching yesterday results:", error);
    return NextResponse.json(
      { error: "Failed to fetch yesterday results", matches: [] },
      { status: 500 }
    );
  }
}
