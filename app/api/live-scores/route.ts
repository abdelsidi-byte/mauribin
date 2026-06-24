import { NextResponse } from "next/server";

const API_KEY = "74324d6063934f75b808c611780d7b68";

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
}

function getFlag(team: string): string {
  const FLAG_MAP: Record<string, string> = {
    Belgium: "🇧🇪", Iran: "🇮🇷", Spain: "🇪🇸", "Saudi Arabia": "🇸🇦",
    Tunisia: "🇹🇳", Japan: "🇯🇵", Ecuador: "🇪🇨", "Cape Verde": "🇨🇻",
    Germany: "🇩🇪", "Ivory Coast": "🇨🇮", "Côte d'Ivoire": "🇨🇮",
    Netherlands: "🇳🇱", Sweden: "🇸🇪", Turkey: "🇹🇷", Paraguay: "🇵🇾",
    Brazil: "🇧🇷", Haiti: "🇭🇹", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Morocco: "🇲🇦",
    USA: "🇺🇸", "United States": "🇺🇸", Australia: "🇦🇺", Mexico: "🇲🇽",
    "Korea Republic": "🇰🇷", "South Korea": "🇰🇷", "New Zealand": "🇳🇿",
    Egypt: "🇪🇬", Argentina: "🇦🇷", Austria: "🇦🇹", France: "🇫🇷",
    Iraq: "🇮🇶", Norway: "🇳🇴", Senegal: "🇸🇳", Uruguay: "🇺🇾",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Italy: "🇮🇹", Portugal: "🇵🇹", Poland: "🇵🇱",
    Switzerland: "🇨🇭", Croatia: "🇭🇷", Denmark: "🇩🇰", Serbia: "🇷🇸",
    Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", Ukraine: "🇺🇦", Hungary: "🇭🇺",
    "Czech Republic": "🇨🇿", "Czechia": "🇨🇿", "South Africa": "🇿🇦",
    "Costa Rica": "🇨🇷", Panama: "🇵🇦", Jamaica: "🇯🇲", Canada: "🇨🇦",
    Peru: "🇵🇪", Chile: "🇨🇱", Colombia: "🇨🇴", Venezuela: "🇻🇪",
    Bolivia: "🇧🇴", Cameroon: "🇨🇲", Mali: "🇲🇱", Ghana: "🇬🇭",
    Algeria: "🇩🇿", Nigeria: "🇳🇬", Qatar: "🇶🇦", UAE: "🇦🇪",
    "Bosnia-Herzegovina": "🇧🇦", "Bosnia and Herzegovina": "🇧🇦",
    Jordan: "🇯🇴", Uzbekistan: "🇺🇿", Oman: "🇴🇲", Bahrain: "🇧🇭",
    Kuwait: "🇰🇼", Yemen: "🇾🇪", Syria: "🇸🇾", Libya: "🇱🇾", Sudan: "🇸🇩",
    "Curaçao": "🇨🇼", "DR Congo": "🇨🇩", "Congo": "🇨🇩",
  };
  return FLAG_MAP[team] || "🏳️";
}

function getMatchState(status: string): { state: string; label: string } {
  const s = status.toLowerCase();
  if (s === "live" || s === "in_play" || s === "paused") return { state: "live", label: "مباشر" };
  if (s === "finished" || s === "ft") return { state: "ft", label: "انتهت" };
  if (s === "timed" || s === "scheduled" || s === "postponed") return { state: "upcoming", label: "قادم" };
  if (s === "halftime" || s === "ht") return { state: "live", label: "الشوط الثاني" };
  return { state: "upcoming", label: "قادم" };
}

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    
    // Fetch range: 2 days ago to tomorrow to catch live + recent + upcoming
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${twoDaysAgo}&dateTo=${tomorrow}`,
      {
        headers: { "X-Auth-Token": API_KEY },
        next: { revalidate: 30 }, // ISR: cache for 30 seconds
      }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const apiMatches = data.matches || [];

    const matches = apiMatches.map((m: any) => {
      const home = m.homeTeam?.name || m.homeTeam?.shortName || "Unknown";
      const away = m.awayTeam?.name || m.awayTeam?.shortName || "Unknown";
      const score = m.score?.fullTime || {};
      const { state, label } = getMatchState(m.status);
      
      return {
        id: m.id,
        home,
        away,
        homeScore: score.home ?? null,
        awayScore: score.away ?? null,
        state,
        label,
        utcDate: m.utcDate,
        status: m.status,
        matchday: m.matchday,
        slug: slugify(home, away),
        homeFlag: getFlag(home),
        awayFlag: getFlag(away),
      };
    });

    const stateOrder: Record<string, number> = { live: 0, upcoming: 1, ft: 2 };
    matches.sort((a: any, b: any) => {
      if (stateOrder[a.state] !== stateOrder[b.state]) return stateOrder[a.state] - stateOrder[b.state];
      return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
    });

    return NextResponse.json({ matches, source: "api" });
  } catch (e) {
    console.error("API fetch failed:", e);
    const fallback = [
      { home: "Morocco", away: "Haiti", homeScore: 3, awayScore: 2, state: "live", label: "مباشر", utcDate: "2026-06-24T22:00:00Z" },
      { home: "Scotland", away: "Brazil", homeScore: 0, awayScore: 3, state: "live", label: "مباشر", utcDate: "2026-06-24T22:00:00Z" },
      { home: "South Africa", away: "Korea Republic", homeScore: null, awayScore: null, state: "upcoming", label: "01:00", utcDate: "2026-06-25T01:00:00Z" },
      { home: "Czechia", away: "Mexico", homeScore: null, awayScore: null, state: "upcoming", label: "01:00", utcDate: "2026-06-25T01:00:00Z" },
    ].map(m => ({ ...m, slug: slugify(m.home, m.away), homeFlag: getFlag(m.home), awayFlag: getFlag(m.away) }));
    
    return NextResponse.json({ matches: fallback, source: "fallback" });
  }
}
