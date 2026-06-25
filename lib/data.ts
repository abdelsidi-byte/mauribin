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
    // === FINISHED MATCHES (from standings file) ===
    // Group A
    { home: "Mexico", away: "South Africa", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-11T19:00:00Z", _index: 0 },
    { home: "South Korea", away: "Czechia", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-12T02:00:00Z", _index: 1 },
    { home: "Mexico", away: "South Korea", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-19T20:00:00Z", _index: 2 },
    { home: "South Africa", away: "Czechia", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-18T20:00:00Z", _index: 3 },
    { home: "South Africa", away: "South Korea", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-25T20:00:00Z", _index: 4 },
    { home: "Czechia", away: "Mexico", homeScore: 0, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-25T20:00:00Z", _index: 5 },
    // Group B
    { home: "Canada", away: "Bosnia-Herzegovina", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-12T19:00:00Z", _index: 6 },
    { home: "Qatar", away: "Switzerland", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T14:00:00Z", _index: 7 },
    { home: "Switzerland", away: "Bosnia-Herzegovina", homeScore: 4, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-18T14:00:00Z", _index: 8 },
    { home: "Canada", away: "Qatar", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-18T19:00:00Z", _index: 9 },
    { home: "Switzerland", away: "Canada", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-24T14:00:00Z", _index: 10 },
    { home: "Bosnia-Herzegovina", away: "Qatar", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-24T19:00:00Z", _index: 11 },
    // Group C
    { home: "Brazil", away: "Morocco", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T20:00:00Z", _index: 12 },
    { home: "Haiti", away: "Scotland", homeScore: 0, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-14T20:00:00Z", _index: 13 },
    { home: "Scotland", away: "Brazil", homeScore: 0, awayScore: 3, state: "ft", label: "انتهت", utcDate: "2026-06-24T22:00:00Z", _index: 14 },
    { home: "Morocco", away: "Haiti", homeScore: 4, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-24T22:00:00Z", _index: 15 },
    { home: "Scotland", away: "Morocco", homeScore: 0, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-19T22:00:00Z", _index: 16 },
    { home: "Brazil", away: "Haiti", homeScore: 3, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-20T22:00:00Z", _index: 17 },
    // Group D
    { home: "USA", away: "Paraguay", homeScore: 4, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-13T02:00:00Z", _index: 18 },
    { home: "Australia", away: "Turkey", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-14T02:00:00Z", _index: 19 },
    { home: "USA", away: "Australia", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-19T02:00:00Z", _index: 20 },
    { home: "Turkey", away: "Paraguay", homeScore: 0, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-20T02:00:00Z", _index: 21 },
    // Group E
    { home: "Germany", away: "Curaçao", homeScore: 7, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-14T14:00:00Z", _index: 22 },
    { home: "Ivory Coast", away: "Ecuador", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-14T17:00:00Z", _index: 23 },
    { home: "Germany", away: "Ivory Coast", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-20T17:00:00Z", _index: 24 },
    { home: "Ecuador", away: "Curaçao", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 25 },
    // Group F
    { home: "Netherlands", away: "Japan", homeScore: 2, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-14T11:00:00Z", _index: 26 },
    { home: "Sweden", away: "Tunisia", homeScore: 5, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-15T14:00:00Z", _index: 27 },
    { home: "Japan", away: "Tunisia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T17:00:00Z", _index: 28 },
    { home: "Netherlands", away: "Sweden", homeScore: 5, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-20T14:00:00Z", _index: 29 },
    // Group G
    { home: "Belgium", away: "Iran", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-15T14:00:00Z", _index: 30 },
    { home: "New Zealand", away: "Egypt", homeScore: 1, awayScore: 3, state: "ft", label: "انتهت", utcDate: "2026-06-15T17:00:00Z", _index: 31 },
    { home: "Belgium", away: "New Zealand", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 32 },
    { home: "Egypt", away: "Iran", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-16T14:00:00Z", _index: 33 },
    // Group H
    { home: "Spain", away: "Saudi Arabia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 34 },
    { home: "Uruguay", away: "Cape Verde", homeScore: 2, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-21T17:00:00Z", _index: 35 },
    { home: "Spain", away: "Cape Verde", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-15T11:00:00Z", _index: 36 },
    { home: "Saudi Arabia", away: "Uruguay", homeScore: 0, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-15T17:00:00Z", _index: 37 },
    // Group I
    { home: "France", away: "Senegal", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-16T14:00:00Z", _index: 38 },
    { home: "Norway", away: "Iraq", homeScore: 4, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-16T17:00:00Z", _index: 39 },
    { home: "France", away: "Iraq", homeScore: 3, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 40 },
    { home: "Norway", away: "Senegal", homeScore: 3, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-23T14:00:00Z", _index: 41 },
    // Group J
    { home: "Argentina", away: "Austria", homeScore: 3, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-17T14:00:00Z", _index: 42 },
    { home: "Jordan", away: "Algeria", homeScore: 1, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-17T17:00:00Z", _index: 43 },
    { home: "Argentina", away: "Algeria", homeScore: 3, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T17:00:00Z", _index: 44 },
    { home: "Austria", away: "Jordan", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-23T17:00:00Z", _index: 45 },
    // Group K
    { home: "Portugal", away: "Uzbekistan", homeScore: 5, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-23T15:00:00Z", _index: 46 },
    { home: "Colombia", away: "DR Congo", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-24T15:00:00Z", _index: 47 },
    // Group L
    { home: "England", away: "Croatia", homeScore: 4, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-17T14:00:00Z", _index: 48 },
    { home: "Ghana", away: "Panama", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-17T17:00:00Z", _index: 49 },
    { home: "England", away: "Ghana", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-23T14:00:00Z", _index: 50 },
    { home: "Croatia", away: "Panama", homeScore: 1, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-25T17:00:00Z", _index: 51 },
    // Group D - 26/06
    { home: "Australia", away: "Paraguay", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 02:00", utcDate: "2026-06-26T07:00:00Z", _index: 55 },
    { home: "USA", away: "Turkey", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 02:00", utcDate: "2026-06-26T07:00:00Z", _index: 56 },
    { home: "France", away: "Norway", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 19:00", utcDate: "2026-06-26T19:00:00Z", _index: 57 },
    { home: "Senegal", away: "Iraq", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 19:00", utcDate: "2026-06-26T19:00:00Z", _index: 70 },
    // === UPCOMING MATCHES ===
    { home: "Germany", away: "Ecuador", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 14:00", utcDate: "2026-06-26T14:00:00Z", _index: 59 },
    { home: "Ivory Coast", away: "Curaçao", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 14:00", utcDate: "2026-06-26T14:00:00Z", _index: 60 },
    { home: "Netherlands", away: "Japan", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 14:00", utcDate: "2026-06-27T14:00:00Z", _index: 61 },
    { home: "Sweden", away: "Tunisia", homeScore: null, awayScore: null, state: "upcoming", label: "الجمعة 20:00", utcDate: "2026-06-27T20:00:00Z", _index: 62 },
    { home: "Japan", away: "Sweden", homeScore: null, awayScore: null, state: "upcoming", label: "السبت 14:00", utcDate: "2026-06-28T14:00:00Z", _index: 63 },
    { home: "Tunisia", away: "Netherlands", homeScore: null, awayScore: null, state: "upcoming", label: "السبت 17:00", utcDate: "2026-06-28T17:00:00Z", _index: 64 },
    { home: "Germany", away: "Ivory Coast", homeScore: null, awayScore: null, state: "upcoming", label: "السبت 17:00", utcDate: "2026-06-29T17:00:00Z", _index: 65 },
    { home: "Ecuador", away: "Curaçao", homeScore: null, awayScore: null, state: "upcoming", label: "السبت 14:00", utcDate: "2026-06-29T14:00:00Z", _index: 66 },
    { home: "Spain", away: "Cape Verde", homeScore: null, awayScore: null, state: "upcoming", label: "السبت 14:00", utcDate: "2026-06-28T14:00:00Z", _index: 67 },
    { home: "Uruguay", away: "Saudi Arabia", homeScore: null, awayScore: null, state: "upcoming", label: "السبت 17:00", utcDate: "2026-06-28T17:00:00Z", _index: 68 },
    { home: "Argentina", away: "Austria", homeScore: null, awayScore: null, state: "upcoming", label: "الأحد 17:00", utcDate: "2026-06-29T17:00:00Z", _index: 71 },
    { home: "Algeria", away: "Jordan", homeScore: null, awayScore: null, state: "upcoming", label: "الأحد 14:00", utcDate: "2026-06-29T14:00:00Z", _index: 72 },
    { home: "Portugal", away: "Colombia", homeScore: null, awayScore: null, state: "upcoming", label: "الإثنين 17:00", utcDate: "2026-06-30T17:00:00Z", _index: 73 },
    { home: "DR Congo", away: "Uzbekistan", homeScore: null, awayScore: null, state: "upcoming", label: "الإثنين 14:00", utcDate: "2026-06-30T14:00:00Z", _index: 74 },
    { home: "England", away: "Panama", homeScore: null, awayScore: null, state: "upcoming", label: "الإثنين 14:00", utcDate: "2026-06-30T14:00:00Z", _index: 75 },
    { home: "Ghana", away: "Croatia", homeScore: null, awayScore: null, state: "upcoming", label: "الإثنين 17:00", utcDate: "2026-06-30T17:00:00Z", _index: 76 },
  ];
  return matches.map(m => ({
    ...m,
    slug: slugify(m.home, m.away),
    homeFlag: getFlag(m.home),
    awayFlag: getFlag(m.away),
  })) as Match[];
}

export async function fetchScores() {
  // Use real standings data from fallback (all finished + upcoming matches)
  return { matches: getFallbackMatches() };
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
// Updated Thu Jun 25 09:50:02 AM CST 2026
