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
  try {
    const res = await fetch("https://www.kickxoff.com/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Extract JSON data embedded in Next.js script tags
    // Pattern: "initial":[...] or self.__next_f.push([1,"2:[..."])
    const patterns = [
      /"initial":(\[[\s\S]*?\])\}\]\}\]/,
      /self\.__next_f\.push\(\[1,"2:\\"(\[[\s\S]*?\])/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (!match) continue;

      try {
        // Unescape JSON
        let jsonStr = match[1]
          .replace(/\\"/g, '"')
          .replace(/\\n/g, ' ')
          .replace(/\\r/g, '')
          .replace(/\\'/g, "'");

        // Find the array of matches - it's after "initial":
        const arrayMatch = jsonStr.match(/\[[\s\S]*?\{[\s\S]*?"home"[\s\S]*?\}\][\s\S]*?\]/);
        if (!arrayMatch) continue;

        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].home) {
          return parsed.map((m: any, i: number) => ({
            home: m.home,
            away: m.away,
            homeFlag: getFlag(m.home),
            awayFlag: getFlag(m.away),
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            state: m.state || (m.label?.toLowerCase().includes("ft") ? "ft" : "upcoming"),
            label: m.label || (m.homeScore === null ? "Upcoming" : "FT"),
            utcDate: m.utcDate,
            _index: i,
          }));
        }
      } catch (e) {
        continue;
      }
    }

    // Fallback to local data
    return getFallbackMatches();
  } catch (e) {
    console.error("kickxoff fetch error:", e);
    return getFallbackMatches();
  }
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
  const worldCupMatches: any[] = [
    // No live matches right now - next match is France vs Iraq
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
