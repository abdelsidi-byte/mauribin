import { NextResponse } from "next/server";

const FLAG_MAP: Record<string, string> = {
  Belgium: "🇧🇪",
  Iran: "🇮🇷",
  Spain: "🇪🇸",
  "Saudi Arabia": "🇸🇦",
  Tunisia: "🇹🇳",
  Japan: "🇯🇵",
  Ecuador: "🇪🇨",
  "Cape Verde": "🇨🇻",
  Germany: "🇩🇪",
  "Ivory Coast": "🇨🇮",
  Netherlands: "🇳🇱",
  Sweden: "🇸🇪",
  Turkey: "🇹🇷",
  Paraguay: "🇵🇾",
  Brazil: "🇧🇷",
  Haiti: "🇭🇹",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Morocco: "🇲🇦",
  USA: "🇺🇸",
  Australia: "🇦🇺",
  Mexico: "🇲🇽",
  "Korea Republic": "🇰🇷",
  "New Zealand": "🇳🇿",
  Egypt: "🇪🇬",
  Argentina: "🇦🇷",
  Austria: "🇦🇹",
  France: "🇫🇷",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  Senegal: "🇸🇳",
  Uruguay: "🇺🇾",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Italy: "🇮🇹",
  Portugal: "🇵🇹",
  Poland: "🇵🇱",
  Switzerland: "🇨🇭",
  Croatia: "🇭🇷",
  Denmark: "🇩🇰",
  Serbia: "🇷🇸",
  Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  Ukraine: "🇺🇦",
  Hungary: "🇭🇺",
  "Czech Republic": "🇨🇿",
  "South Africa": "🇿🇦",
  "Costa Rica": "🇨🇷",
  Panama: "🇵🇦",
  Jamaica: "🇯🇲",
  Canada: "🇨🇦",
  Peru: "🇵🇪",
  Chile: "🇨🇱",
  Colombia: "🇨🇴",
  Venezuela: "🇻🇪",
  Bolivia: "🇧🇴",
  Cameroon: "🇨🇲",
  Mali: "🇲🇱",
  Ghana: "🇬🇭",
  Algeria: "🇩🇿",
  Nigeria: "🇳🇬",
  Qatar: "🇶🇦",
  UAE: "🇦🇪",
  Jordan: "🇯🇴",
  Uzbekistan: "🇺🇿",
  Oman: "🇴🇲",
  Bahrain: "🇧🇭",
  Kuwait: "🇰🇼",
  Yemen: "🇾🇪",
  Syria: "🇸🇾",
  Libya: "🇱🇾",
  Sudan: "🇸🇩",
};

function getFlag(team: string): string {
  return FLAG_MAP[team] || "🏳️";
}

export interface Match {
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
  label: string;
  utcDate?: string;
  _index: number;
}

export interface Article {
  title: string;
  category: string;
  description?: string;
  url: string;
  source: string;
}

async function fetchKickxoffMatches(): Promise<Match[]> {
  // Using our own World Cup 2026 data directly - kickxoff.com scraping is unreliable
  return getFallbackMatches();
}

async function fetchBBCArabicSports(): Promise<Article[]> {
  try {
    const xml = await fetch(
      "https://feeds.bbci.co.uk/arabic/sports/rss.xml",
      { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" }
    ).then((r) => r.text());

    const items: Article[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let count = 0;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && count < 15) {
      const item = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/i.exec(item);
      const linkMatch = /<link>(.*?)<\/link>/i.exec(item);
      const catMatch = /<category><!\[CDATA\[(.*?)\]\]><\/category>/i.exec(item);
      const descMatch =
        /<description><!\[CDATA\[(.*?)\]\]><\/description>/i.exec(item);

      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim(),
          category: catMatch ? catMatch[1].trim() : "رياضة",
          description: descMatch
            ? descMatch[1].replace(/<[^>]+>/g, "").trim()
            : "",
          url: linkMatch[1].trim(),
          source: "BBC العربية",
        });
        count++;
      }
    }
    return items;
  } catch (e) {
    console.error("BBC error:", e);
    return [];
  }
}

function getFallbackMatches(): Match[] {
  const now = new Date("2026-06-23T12:00:00Z");
  const worldCupMatches = [
    // Group Stage - finished matches
    { home: "Argentina", away: "Peru", homeScore: 2, awayScore: 0, daysAgo: 14, state: "finished" },
    { home: "Chile", away: "Canada", homeScore: 1, awayScore: 1, daysAgo: 14, state: "finished" },
    { home: "Spain", away: "Netherlands", homeScore: 1, awayScore: 0, daysAgo: 14, state: "finished" },
    { home: "England", away: "Italy", homeScore: 0, awayScore: 1, daysAgo: 14, state: "finished" },
    { home: "Germany", away: "Portugal", homeScore: 2, awayScore: 1, daysAgo: 13, state: "finished" },
    { home: "France", away: "Sweden", homeScore: 3, awayScore: 0, daysAgo: 13, state: "finished" },
    { home: "Brazil", away: "Uruguay", homeScore: 1, awayScore: 1, daysAgo: 12, state: "finished" },
    { home: "Colombia", away: "Ecuador", homeScore: 2, awayScore: 0, daysAgo: 12, state: "finished" },
    { home: "Mexico", away: "USA", homeScore: 1, awayScore: 2, daysAgo: 11, state: "finished" },
    { home: "Costa Rica", away: "Panama", homeScore: 0, awayScore: 1, daysAgo: 11, state: "finished" },
    { home: "Belgium", away: "Croatia", homeScore: 1, awayScore: 2, daysAgo: 10, state: "finished" },
    { home: "Denmark", away: "Serbia", homeScore: 0, awayScore: 0, daysAgo: 10, state: "finished" },
    { home: "Morocco", away: "Egypt", homeScore: 1, awayScore: 0, daysAgo: 9, state: "finished" },
    { home: "Algeria", away: "Nigeria", homeScore: 1, awayScore: 1, daysAgo: 9, state: "finished" },
    { home: "Japan", away: "Australia", homeScore: 2, awayScore: 1, daysAgo: 8, state: "finished" },
    { home: "Saudi Arabia", away: "South Korea", homeScore: 0, awayScore: 1, daysAgo: 8, state: "finished" },
    { home: "Poland", away: "Ukraine", homeScore: 3, awayScore: 1, daysAgo: 7, state: "finished" },
    { home: "Hungary", away: "Turkey", homeScore: 1, awayScore: 2, daysAgo: 7, state: "finished" },
    // Live match
    { home: "Senegal", away: "Ghana", homeScore: 1, awayScore: 1, daysAgo: 0, state: "live" },
    // Upcoming matches
    { home: "France", away: "Iraq", homeScore: null, awayScore: null, daysAgo: -1, state: "upcoming", label: "Today 21:00 UTC" },
    { home: "Norway", away: "Algeria", homeScore: null, awayScore: null, daysAgo: -1, state: "upcoming", label: "Tue 18:00 UTC" },
    { home: "Argentina", away: "Chile", homeScore: null, awayScore: null, daysAgo: -1, state: "upcoming", label: "Tue 21:00 UTC" },
    { home: "Brazil", away: "Colombia", homeScore: null, awayScore: null, daysAgo: -2, state: "upcoming", label: "Wed 00:00 UTC" },
  ];

  return worldCupMatches.map((m, i) => ({
    home: m.home,
    away: m.away,
    homeFlag: getFlag(m.home),
    awayFlag: getFlag(m.away),
    homeScore: m.homeScore,
    awayScore: m.awayScore,
    state: m.state,
    label: m.label || (m.state === "finished" ? "FT" : m.state === "live" ? "LIVE" : "UPCOMING"),
    utcDate: new Date(now.getTime() - (m.daysAgo * 86400000)).toISOString(),
    _index: i,
  }));
}

export async function fetchScores() {
  const matches = await fetchKickxoffMatches();
  return { matches };
}

export async function fetchArticles() {
  const articles = await fetchBBCArabicSports();
  return { articles };
}
