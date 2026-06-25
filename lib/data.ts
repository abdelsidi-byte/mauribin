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
  "Bosnia-Herzegovina": "🇧🇦", "Bosnia and Herzegovina": "🇧🇦", "Bosnia": "🇧🇦", "Dominican Republic": "🇩🇴",
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

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
}

function getFlag(team: string): string {
  return FLAG_MAP[team] || "🏳️";
}

export interface Match {
  id?: number;
  slug?: string;
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
  const API_KEY = "74324d6063934f75b808c611780d7b68";

  // Fetch entire tournament (Jun 11 - today+1) so /standings has all played matches
  const dates: string[] = [];
  const start = new Date("2026-06-11");
  const end = new Date();
  end.setDate(end.getDate() + 1);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }

  try {
    const allMatches: any[] = [];

    // Try football-data.org first (tournament endpoint)
    try {
      const endStr = end.toISOString().split("T")[0];
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=2026-06-11&dateTo=${endStr}`,
        { headers: { "X-Auth-Token": API_KEY }, cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        const wcMatches = (data.matches || []).filter(
          (m: any) => m.status === "FINISHED" || m.status === "IN_PLAY" || m.status === "TIMED"
        );
        allMatches.push(...wcMatches);
      }
    } catch (e) { /* ignore */ }

    if (allMatches.length === 0) return getFallbackMatches();

    return allMatches.map((m: any, i: number) => {
      const home = m.homeTeam?.name || m.homeTeam?.shortName || "Unknown";
      const away = m.awayTeam?.name || m.awayTeam?.shortName || "Unknown";
      const hg = m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null;
      const ag = m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null;
      const status = m.status;
      const date = m.utcDate;

      let state = "upcoming";
      let label = "قادم";
      const s = status?.toUpperCase() || "";
      if (s === "FINISHED" || s === "FT" || s === "AET" || s === "PEN") {
        state = "ft"; label = "انتهت";
      } else if (["IN_PLAY", "PAUSED", "LIVE", "1H", "2H", "HT", "ET", "BT", "P"].includes(s)) {
        state = "live"; label = "مباشر";
      } else if (["TIMED", "SCHEDULED", "NS", "PST", "CANC"].includes(s)) {
        state = "upcoming"; label = formatUpcomingDate(date);
      } else {
        state = "upcoming"; label = status || "قادم";
      }

      return {
        home, away,
        homeFlag: getFlag(home),
        awayFlag: getFlag(away),
        homeScore: hg, awayScore: ag,
        state, label, utcDate: date,
        slug: slugify(home, away),
        _index: i,
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

function getFallbackMatches(): Match[] {
  const matches = [
    { home: "Ecuador", away: "Curaçao", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T17:00:00Z", _index: 0 },
    { home: "Tunisia", away: "Japan", homeScore: 0, awayScore: 4, state: "ft", label: "انتهت", utcDate: "2026-06-22T17:00:00Z", _index: 1 },
    { home: "Spain", away: "Saudi Arabia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 2 },
    { home: "Belgium", away: "Iran", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 3 },
    { home: "Uruguay", away: "Cape Verde", homeScore: 2, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 4 },
    { home: "New Zealand", away: "Egypt", homeScore: 1, awayScore: 3, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 5 },
    { home: "Argentina", away: "Austria", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T20:00:00Z", _index: 6 },
    { home: "France", away: "Iraq", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-23T14:00:00Z", _index: 7 },
    { home: "Norway", away: "Senegal", homeScore: 3, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-23T14:00:00Z", _index: 8 },
    { home: "Jordan", away: "Algeria", homeScore: 1, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-22T20:00:00Z", _index: 9 },
    { home: "Portugal", away: "Uzbekistan", homeScore: 5, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-24T15:00:00Z", _index: 10 },
    { home: "Bosnia-Herzegovina", away: "Qatar", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-25T10:00:00Z", _index: 13 },
    { home: "Switzerland", away: "Canada", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-25T10:00:00Z", _index: 14 },
    { home: "Morocco", away: "Haiti", homeScore: 3, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-24T22:00:00Z", _index: 15 },
    { home: "Scotland", away: "Brazil", homeScore: 0, awayScore: 3, state: "ft", label: "انتهت", utcDate: "2026-06-24T22:00:00Z", _index: 16 },
    { home: "South Africa", away: "Korea Republic", homeScore: null, awayScore: null, state: "upcoming", label: "غداً 01:00", utcDate: "2026-06-25T01:00:00Z", _index: 17 },
    { home: "Czechia", away: "Mexico", homeScore: null, awayScore: null, state: "upcoming", label: "غداً 01:00", utcDate: "2026-06-25T01:00:00Z", _index: 18 },
  ];
  return matches.map(m => ({
    ...m,
    slug: slugify(m.home, m.away),
    homeFlag: getFlag(m.home),
    awayFlag: getFlag(m.away),
  })) as Match[];
}

export async function fetchScores() {
  try {
    const matches = await fetchKickxoffMatches();
    if (!matches || matches.length === 0) {
      return { matches: getFallbackMatches() };
    }
    return { matches };
  } catch {
    return { matches: getFallbackMatches() };
  }
}

export async function fetchArticles() {
  try {
    const res = await fetch("/news_data.json", { cache: "no-store" });
    if (!res.ok) return { articles: [] };
    const data = await res.json();
    return { articles: data.news || [] };
  } catch {
    return { articles: [] };
  }
}
