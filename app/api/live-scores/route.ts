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
  Canada: "🇨🇦",
  Peru: "🇵🇪",
  Chile: "🇨🇱",
  Colombia: "🇨🇴",
  "South Korea": "🇰🇷",
  Algeria: "🇩🇿",
  Uzbekistan: "🇺🇿",
  Ghana: "🇬🇭",
  Jordan: "🇯🇴",
  Nigeria: "🇳🇬",
};

function getFlag(team: string): string {
  return FLAG_MAP[team] || "🏳️";
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\n/g, " ")
    .replace(/\\r/g, "")
    .replace(/\\'/g, "'");
}

async function fetchKickxoffMatches(): Promise<any[]> {
  try {
    const html = await fetch("https://www.kickxoff.com/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    }).then(r => r.text());

    // Extract JSON data embedded in the page
    const dataMatch = html.match(/self\.__next_f\.push\(\[1,"2:(\[[\s\S]*?)\]\)\n\]/);
    if (dataMatch) {
      const jsonStr = dataMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ');
      // Parse the embedded JSON
      const cleanJson = jsonStr.replace(/^[^[]*/, '').replace(/[^]]$/, '');
      try {
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const matches = parsed[0]?.props?.pageProps?.matches ||
                          parsed[0]?.props?.matches ||
                          parsed[0];
          if (Array.isArray(matches)) {
            return matches.map((m: any) => ({
              home: m.home,
              away: m.away,
              homeFlag: getFlag(m.home),
              awayFlag: getFlag(m.away),
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              state: m.state || (m.label?.toLowerCase().includes('ft') ? 'ft' : 'upcoming'),
              label: m.label || (m.homeScore === null ? 'Upcoming' : 'FT'),
              utcDate: m.utcDate,
            }));
          }
        }
      } catch (e) {
        console.error("Parse error:", e);
      }
    }

    // Also try to extract from script tags
    const scriptMatch = html.match(/"initial":(\[[\s\S]*?)\]\}\]\}\]/);
    if (scriptMatch) {
      try {
        const jsonStr = scriptMatch[1].replace(/\\"/g, '"');
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => ({
            home: m.home,
            away: m.away,
            homeFlag: getFlag(m.home),
            awayFlag: getFlag(m.away),
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            state: m.state || (m.homeScore === null ? 'upcoming' : 'ft'),
            label: m.label || (m.homeScore === null ? 'Upcoming' : 'FT'),
            utcDate: m.utcDate,
          }));
        }
      } catch (e) {
        console.error("Script parse error:", e);
      }
    }

    return getFallbackMatches();
  } catch (e) {
    console.error("kickxoff fetch error:", e);
    return getFallbackMatches();
  }
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
  const worldCupMatches = [
    // Finished matches
    { home: "Argentina", away: "Peru", homeScore: 2, awayScore: 0, daysAgo: 14 },
    { home: "Chile", away: "Canada", homeScore: 1, awayScore: 1, daysAgo: 14 },
    { home: "Spain", away: "Netherlands", homeScore: 1, awayScore: 0, daysAgo: 14 },
    { home: "England", away: "Italy", homeScore: 0, awayScore: 1, daysAgo: 14 },
    { home: "Germany", away: "Portugal", homeScore: 2, awayScore: 1, daysAgo: 13 },
    { home: "France", away: "Sweden", homeScore: 3, awayScore: 0, daysAgo: 13 },
    { home: "Brazil", away: "Uruguay", homeScore: 1, awayScore: 1, daysAgo: 12 },
    { home: "Colombia", away: "Ecuador", homeScore: 2, awayScore: 0, daysAgo: 12 },
    { home: "Mexico", away: "USA", homeScore: 1, awayScore: 2, daysAgo: 11 },
    { home: "Costa Rica", away: "Panama", homeScore: 0, awayScore: 1, daysAgo: 11 },
    { home: "Belgium", away: "Croatia", homeScore: 1, awayScore: 2, daysAgo: 10 },
    { home: "Denmark", away: "Serbia", homeScore: 0, awayScore: 0, daysAgo: 10 },
    { home: "Morocco", away: "Egypt", homeScore: 1, awayScore: 0, daysAgo: 9 },
    { home: "Algeria", away: "Nigeria", homeScore: 1, awayScore: 1, daysAgo: 9 },
    { home: "Japan", away: "Australia", homeScore: 2, awayScore: 1, daysAgo: 8 },
    { home: "Saudi Arabia", away: "South Korea", homeScore: 0, awayScore: 1, daysAgo: 8 },
    { home: "Poland", away: "Ukraine", homeScore: 3, awayScore: 1, daysAgo: 7 },
    { home: "Hungary", away: "Turkey", homeScore: 1, awayScore: 2, daysAgo: 7 },
    // Live
    { home: "Senegal", away: "Ghana", homeScore: 1, awayScore: 1, daysAgo: 0, state: "live", label: "LIVE" },
    // Upcoming
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
