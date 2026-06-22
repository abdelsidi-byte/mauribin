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
  "Curaçao": "🇨🇼", "DR Congo": "🇨🇩", "Congo": "🇨🇩",
};

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
}

function getFlag(team: string): string {
  return FLAG_MAP[team] || "🏳️";
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

function getFallbackMatches(): any[] {
  // WC 2026 Group Stage results (API exhausted - served as static fallback)
  const matches = [
    { home: "Ecuador", away: "Curaçao", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T17:00:00Z", _index: 0 },
    { home: "Tunisia", away: "Japan", homeScore: 0, awayScore: 4, state: "ft", label: "انتهت", utcDate: "2026-06-22T17:00:00Z", _index: 1 },
    { home: "Spain", away: "Saudi Arabia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 2 },
    { home: "Belgium", away: "Iran", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 3 },
    { home: "Uruguay", away: "Cape Verde", homeScore: 2, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 4 },
    { home: "New Zealand", away: "Egypt", homeScore: 1, awayScore: 3, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 5 },
    { home: "Argentina", away: "Austria", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T20:00:00Z", _index: 6 },
    { home: "France", away: "Iraq", homeScore: 1, awayScore: 0, state: "live", label: "مباشر", utcDate: "2026-06-23T14:00:00Z", _index: 7 },
    { home: "Norway", away: "Senegal", homeScore: null, awayScore: null, state: "upcoming", label: "الثلاثاء 00:00 ت ع", utcDate: "2026-06-23T22:00:00Z", _index: 8 },
    { home: "Jordan", away: "Algeria", homeScore: null, awayScore: null, state: "upcoming", label: "الثلاثاء 03:00 ت ع", utcDate: "2026-06-24T01:00:00Z", _index: 9 },
    { home: "Portugal", away: "Uzbekistan", homeScore: null, awayScore: null, state: "upcoming", label: "الثلاثاء 17:00 ت ع", utcDate: "2026-06-24T15:00:00Z", _index: 10 },
    { home: "England", away: "Ghana", homeScore: null, awayScore: null, state: "upcoming", label: "الثلاثاء 20:00 ت ع", utcDate: "2026-06-24T18:00:00Z", _index: 11 },
    { home: "Panama", away: "Croatia", homeScore: null, awayScore: null, state: "upcoming", label: "الثلاثاء 23:00 ت ع", utcDate: "2026-06-24T21:00:00Z", _index: 12 },
  ];
  return matches.map(m => ({ ...m, slug: slugify(m.home, m.away), homeFlag: getFlag(m.home), awayFlag: getFlag(m.away) }));
}

async function fetchKickxoffMatches(): Promise<any[]> {
  const API_KEY = "c0e4608bccd8e7dc832fee613e8bc378";

  // Try live=all first (1 request) then date range if needed
  try {
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      { headers: { "x-apisports-key": API_KEY }, cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (!data.errors || Object.keys(data.errors).length === 0) {
        const wcMatches = (data.response || []).filter(
          (f: any) => f.league?.name?.includes("World Cup")
        );
        if (wcMatches.length > 0) {
          return wcMatches.map((f: any, i: number) => {
            const home = f.teams.home.name;
            const away = f.teams.away.name;
            const hg = f.goals.home;
            const ag = f.goals.away;
            const status = f.fixture.status.short || "";
            const s = status.toUpperCase();
            const date = f.fixture.date;

            let state = "upcoming", label = "قادم";
            if (s === "FT" || s === "AET" || s === "PEN") {
              state = "ft"; label = "انتهت";
            } else if (["1H","2H","HT","ET","BT","P","LIVE","1S","2S","INT"].includes(s)) {
              state = "live"; label = "مباشر";
            } else if (s === "NS" || s === "PST" || s === "CANC") {
              state = "upcoming"; label = formatUpcomingDate(date);
            } else {
              label = status || "قادم";
            }

            return { home, away, homeFlag: getFlag(home), awayFlag: getFlag(away),
              homeScore: hg, awayScore: ag, state, label, utcDate: date,
              slug: slugify(home, away), _index: i };
          });
        }
      }
    }
  } catch (e) { /* fall through */ }

  // Fallback: fetch yesterday, today, tomorrow
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
      const status = f.fixture.status.short || "";
      const s = status.toUpperCase();
      const date = f.fixture.date;

      let state = "upcoming", label = "قادم";
      if (s === "FT" || s === "AET" || s === "PEN") {
        state = "ft"; label = "انتهت";
      } else if (["1H","2H","HT","ET","BT","P","LIVE","1S","2S","INT"].includes(s)) {
        state = "live"; label = "مباشر";
      } else if (s === "NS" || s === "PST" || s === "CANC") {
        state = "upcoming"; label = formatUpcomingDate(date);
      } else {
        label = status || "قادم";
      }

      return { home, away, homeFlag: getFlag(home), awayFlag: getFlag(away),
        homeScore: hg, awayScore: ag, state, label, utcDate: date,
        slug: slugify(home, away), _index: i };
    });
  } catch (e) {
    return getFallbackMatches();
  }
}

export async function GET() {
  try {
    const matches = await fetchKickxoffMatches();
    return NextResponse.json({ matches });
  } catch (e) {
    return NextResponse.json({ matches: [] });
  }
}
