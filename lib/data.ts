import { NextResponse } from "next/server";

const FLAG_MAP: Record<string, string> = {
  Belgium: "🇧🇪", Iran: "🇮🇷", Spain: "🇪🇸", "Saudi Arabia": "🇸🇦",
  Tunisia: "🇹🇳", Japan: "🇯🇵", Ecuador: "🇪🇨", "Cape Verde": "🇨🇻",
  Germany: "🇩🇪", "Ivory Coast": "🇨🇮", "Côte d'Ivoire": "🇨🇮",
  Netherlands: "🇳🇱", Sweden: "🇸🇪", Paraguay: "🇵🇾",
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
  Jordan: "🇯🇴", Uzbekistan: "🇺🇿", Oman: "🇴🇲", Bahrain: "🇧🇭",
  Kuwait: "🇰🇼", Yemen: "🇾🇪", Syria: "🇸🇾", Libya: "🇱🇾", Sudan: "🇸🇩",
  "Bosnia and Herzegovina": "🇧🇦", "Bosnia": "🇧🇦", "Dominican Republic": "🇩🇴",
  "Curaçao": "🇨🇼", "DR Congo": "🇨🇩", "Congo": "🇨🇩",
  "New Caledonia": "🇳🇨", "Faroe Islands": "🇫🇴", "North Korea": "🇰🇵",
  "Republic of Ireland": "🇮🇪", Ireland: "🇮🇪", "Northern Ireland": "🇬🇧",
  "Trinidad and Tobago": "🇹🇹", Honduras: "🇭🇳", ElSalvador: "🇸🇻",
  "El Salvador": "🇸🇻", Guatemala: "🇬🇹", Nicaragua: "🇳🇮",
  China: "🇨🇳", "Hong Kong": "🇭🇰", Taiwan: "🇹🇼", Macao: "🇲🇴",
  India: "🇮🇳", Pakistan: "🇵🇰", Bangladesh: "🇧🇩", "Sri Lanka": "🇱🇰",
  Thailand: "🇹🇭", Vietnam: "🇻🇳", Indonesia: "🇮🇩", Malaysia: "🇲🇾",
  Singapore: "🇸🇬", Philippines: "🇵🇭", Myanmar: "🇲🇲", Cambodia: "🇰🇭",
  Mongolia: "🇲🇳", Kazakhstan: "🇰🇿",
  Iceland: "🇮🇸", Finland: "🇫🇮", Estonia: "🇪🇪", Latvia: "🇱🇻",
  Lithuania: "🇱🇹", Belarus: "🇧🇾", Moldova: "🇲🇩", Romania: "🇷🇴",
  Bulgaria: "🇧🇬", Greece: "🇬🇷", Turkey: "🇹🇷",
  Albania: "🇦🇱", "North Macedonia": "🇲🇰", Kosovo: "🇽🇰",
  Montenegro: "🇲🇪", Slovenia: "🇸🇮", Slovakia: "🇸🇰",
  "Liechtenstein": "🇱🇮", Luxembourg: "🇱🇺", Malta: "🇲🇹",
  Israel: "🇮🇱", Palestine: "🇵🇸", Lebanon: "🇱🇧",
  Comoros: "🇰🇲", Madagascar: "🇲🇬", Mauritius: "🇲🇺", Seychelles: "🇸🇨",
  Mauritania: "🇲🇷", "Burkina Faso": "🇧🇫",
  "Guinea-Bissau": "🇬🇼", Guinea: "🇬🇳", "Sierra Leone": "🇸🇱",
  Liberia: "🇱🇷", Togo: "🇹🇬", Benin: "🇧🇯", "Equatorial Guinea": "🇬🇶",
  Gabon: "🇬🇦", "Central African Republic": "🇨🇫", Chad: "🇹🇩",
  Niger: "🇳🇪", Gambia: "🇬🇲",
  Uganda: "🇺🇬", Kenya: "🇰🇪", Tanzania: "🇹🇿", Rwanda: "🇷🇼",
  Burundi: "🇧🇮", Ethiopia: "🇪🇹", Eritrea: "🇪🇷", Djibouti: "🇩🇯",
  Somalia: "🇸🇴", "South Sudan": "🇸🇸", Zimbabwe: "🇿🇼",
  Zambia: "🇿🇲", Malawi: "🇲🇼", Mozambique: "🇲🇿", Angola: "🇦🇴",
  Namibia: "🇳🇦", Botswana: "🇧🇼", Lesotho: "🇱🇸", Eswatini: "🇸🇿",
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
  const API_KEY = "c0e4608bccd8e7dc832fee613e8bc378";
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  try {
    // Try fetching World Cup fixtures for yesterday, today, tomorrow
    const dates = [yesterday, today, tomorrow];
    const allMatches: any[] = [];

    for (const date of dates) {
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/fixtures?date=${date}`,
          {
            headers: { "x-apisports-key": API_KEY },
            cache: "no-store",
          }
        );
        if (!res.ok) continue;
        const data = await res.json();
        if (data.errors && Object.keys(data.errors).length > 0) continue;

        // Filter only World Cup matches
        const wcMatches = (data.response || []).filter(
          (f: any) => f.league?.name?.includes("World Cup")
        );
        allMatches.push(...wcMatches);
      } catch (e) {
        continue;
      }
    }

    if (allMatches.length === 0) {
      console.log("No WC matches from API-Football, using fallback");
      return getFallbackMatches();
    }

    // Map API-Football response to our Match format
    return allMatches.map((f: any, i: number) => {
      const home = f.teams.home.name;
      const away = f.teams.away.name;
      const hg = f.goals.home;
      const ag = f.goals.away;
      const status = f.fixture.status.short; // FT, 1H, 2H, NS, etc.
      const date = f.fixture.date;

      let state = "upcoming";
      let label = "Upcoming";
      if (status === "FT" || status === "AET" || status === "PEN") {
        state = "ft";
        label = "FT";
      } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status)) {
        state = "live";
        label = "مباشر";
      } else if (status === "NS") {
        state = "upcoming";
        label = formatUpcomingDate(date);
      } else {
        state = "upcoming";
        label = status;
      }

      return {
        home,
        away,
        homeFlag: getFlag(home),
        awayFlag: getFlag(away),
        homeScore: hg,
        awayScore: ag,
        state,
        label,
        utcDate: date,
        _index: i,
      };
    });
  } catch (e) {
    console.error("API-Football fetch error:", e);
    return getFallbackMatches();
  }
}

function formatUpcomingDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const hours = d.getUTCHours().toString().padStart(2, "0");
    const mins = d.getUTCMinutes().toString().padStart(2, "0");

    if (d.toDateString() === now.toDateString()) {
      return `اليوم ${hours}:${mins} ت ع`;
    }
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dayName = days[d.getUTCDay()];
    return `${dayName} ${hours}:${mins} ت ع`;
  } catch {
    return isoDate;
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
