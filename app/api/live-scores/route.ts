import { NextResponse } from "next/server";

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
  Jordan: "🇯🇴", Uzbekistan: "🇺🇿", Oman: "🇴🇲", Bahrain: "🇧🇭",
  Kuwait: "🇰🇼", Yemen: "🇾🇪", Syria: "🇸🇾", Libya: "🇱🇾", Sudan: "🇸🇩",
  "Curaçao": "🇨🇼", "DR Congo": "🇨🇩",
};

function getFlag(team: string): string {
  return FLAG_MAP[team] || "🏳️";
}

async function fetchKickxoffMatches(): Promise<any[]> {
  const API_KEY = "c0e4608bccd8e7dc832fee613e8bc378";
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dates = [yesterday, today, tomorrow];

  try {
    const allMatches: any[] = [];
    for (const date of dates) {
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/fixtures?date=${date}`,
          { headers: { "x-apisports-key": API_KEY }, cache: "no-store" }
        );
        if (!res.ok) continue;
        const data = await res.json();
        if (data.errors && Object.keys(data.errors).length > 0) continue;
        const wcMatches = (data.response || []).filter(
          (f: any) => f.league?.name?.includes("World Cup")
        );
        allMatches.push(...wcMatches);
      } catch (e) { continue; }
    }

    if (allMatches.length === 0) return getFallbackMatches();

    return allMatches.map((f: any, i: number) => {
      const home = f.teams.home.name;
      const away = f.teams.away.name;
      const hg = f.goals.home;
      const ag = f.goals.away;
      const status = f.fixture.status.short;
      const date = f.fixture.date;

      let state = "upcoming";
      let label = "Upcoming";
      if (status === "FT" || status === "AET" || status === "PEN") {
        state = "ft"; label = "FT";
      } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status)) {
        state = "live"; label = "LIVE";
      } else if (status === "NS") {
        state = "upcoming";
        label = formatUpcomingDate(date);
      }

      return {
        home, away,
        homeFlag: getFlag(home),
        awayFlag: getFlag(away),
        homeScore: hg, awayScore: ag,
        state, label, utcDate: date, _index: i,
      };
    });
  } catch (e) {
    console.error("API-Football error:", e);
    return getFallbackMatches();
  }
}

function formatUpcomingDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const hours = d.getUTCHours().toString().padStart(2, "0");
    const mins = d.getUTCMinutes().toString().padStart(2, "0");
    if (d.toDateString() === now.toDateString()) return `اليوم ${hours}:${mins} ت ع`;
    const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    return `${days[d.getUTCDay()]} ${hours}:${mins} ت ع`;
  } catch { return isoDate; }
}

async function fetchBBCArabicNews(): Promise<any[]> {
  try {
    const xml = await fetch(
      "https://feeds.bbci.co.uk/arabic/sports/rss.xml",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());

    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    // Sports keywords to filter (Arabic + English + team names)
    const SPORTS_KEYWORDS = [
      // Arabic
      'كأس العالم', 'مباراة', 'مباريات', 'منتخب', 'فوز', 'هزيمة', 'تعادل', 'دوري', 'كرة قدم',
      'هداف', 'لاعب', 'لاعبون', 'مدرب', 'نادي', 'نوادي', 'بطولة', 'مونديال', 'الدوري',
      'فيفا', 'الاتحاد', 'الأهلي', 'الزمالك', 'ريال مدريد', 'برشلونة', 'تشيلسي', 'مانشستر',
      'محمد صلاح', 'صلاح', 'ليفربول', 'الهلال', 'النصر', 'الاتحاد', 'الشباب', 'النصي',
      'المنتخب', 'المنتخبات', 'غربلة', 'بطولة', 'الدوري', 'الكأس', 'كأس', 'لقب', 'بطل',
      // English
      'World Cup', 'match', 'score', 'goal', 'team', 'league', 'cup', 'WorldCup',
      'football', 'soccer', 'player', 'coach', 'tournament',
    ];

    // Blocklist for non-sports articles (political/controversial topics that appear in BBC Sports)
    const BLOCK_KEYWORDS = [
      'ترامب', 'إيلون ماسك', 'elon', 'spacex', 'tesla',
      'تغريدة', 'في التليغراف', 'التحالف', 'قاعدة عسكرية', 'سوري',
      'دبلوماسية', 'سياسة خارجية', 'طائرة قطرية', 'تريليونير',
    ];

    const isSportsRelated = (title: string, desc: string): boolean => {
      const text = `${title} ${desc}`.toLowerCase();
      // Must contain at least one sports keyword
      const hasSportsKeyword = SPORTS_KEYWORDS.some(k => text.includes(k.toLowerCase()));
      // Must NOT contain any block keyword
      const hasBlockKeyword = BLOCK_KEYWORDS.some(k => text.includes(k.toLowerCase()));
      return hasSportsKeyword && !hasBlockKeyword;
    };

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/i.exec(item);
      const linkMatch = /<link>(.*?)<\/link>/i.exec(item);
      const catMatch = /<category><!\[CDATA\[(.*?)\]\]><\/category>/i.exec(item);
      const descMatch =
        /<description><!\[CDATA\[(.*?)\]\]><\/description>/i.exec(item);

      if (titleMatch && linkMatch) {
        const title = titleMatch[1].trim();
        const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";

        // Only add sports-related articles
        if (isSportsRelated(title, desc)) {
          items.push({
            title,
            category: catMatch ? catMatch[1].trim() : "رياضة",
            description: desc,
            url: linkMatch[1].trim(),
            source: "BBC العربية",
          });
        }
      }
    }
    return items.slice(0, 10); // Limit to 10 sports articles
  } catch (e) {
    console.error("BBC error:", e);
    return [];
  }
}

function getFallbackMatches(): any[] {
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
    state: m.state || "ft",
    label: m.label || "FT",
    utcDate: new Date(now.getTime() - (m.daysAgo * 86400000)).toISOString(),
    _index: i,
  }));
}

export async function GET() {
  const [matches, stories] = await Promise.all([
    fetchKickxoffMatches(),
    fetchBBCArabicNews(),
  ]);

  return NextResponse.json(
    { matches, matchesCount: matches.length, stories },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}
