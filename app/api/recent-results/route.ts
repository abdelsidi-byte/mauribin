import { NextResponse } from "next/server";

const ESPN_API = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(ESPN_API, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);

    const data = await res.json();
    const events = data.events || [];

    // Get all completed matches, sorted by date descending
    const completedMatches = events
      .filter((e: { competitions?: Array<{ status?: { type?: { state?: string } } }> }) =>
        e.competitions?.[0]?.status?.type?.state === "post"
      )
      .sort((a: { date: string }, b: { date: string }) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 10)
      .map((e: {
        id: string;
        date: string;
        competitions?: Array<{
          status?: { type?: { detail?: string } };
          competitors?: Array<{
            team?: { displayName?: string; abbreviation?: string; logos?: Array<{ href?: string }> };
            score?: string;
            winner?: boolean;
            homeAway?: string;
          }>;
        }>;
      }) => {
        const comp = e.competitions?.[0] || {};
        const status = comp.status?.type?.detail || "FT";
        const competitors = comp.competitors || [];
        const home = competitors.find((c) => c.homeAway === "home");
        const away = competitors.find((c) => c.homeAway === "away");

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
      count: completedMatches.length,
      matches: completedMatches,
    });
  } catch (error) {
    console.error("Error fetching recent results:", error);
    return NextResponse.json({ error: "Failed to fetch", matches: [] }, { status: 500 });
  }
}
