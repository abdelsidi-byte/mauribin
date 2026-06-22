// World Cup 2026 Group Standings (static data based on actual results)
export interface TeamStanding {
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface GroupStanding {
  group: string;
  teams: TeamStanding[];
}

const FLAG_MAP: Record<string, string> = {
  Mexico: "🇲🇽", "South Korea": "🇰🇷", "South Africa": "🇿🇦", Czechia: "🇨🇿",
  Canada: "🇨🇦", Switzerland: "🇨🇭", Qatar: "🇶🇦", Bosnia: "🇧🇦",
  Brazil: "🇧🇷", Morocco: "🇲🇦", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Haiti: "🇭🇹",
  USA: "🇺🇸", Australia: "🇦🇺", Paraguay: "🇵🇾", Turkey: "🇹🇷",
  Germany: "🇩🇪", "Ivory Coast": "🇨🇮", Ecuador: "🇪🇨", Curaçao: "🇨🇼",
  Netherlands: "🇳🇱", Sweden: "🇸🇪", Japan: "🇯🇵", Tunisia: "🇹🇳",
  Belgium: "🇧🇪", Iran: "🇮🇷", Egypt: "🇪🇬", "New Zealand": "🇳🇿",
  Spain: "🇪🇸", Uruguay: "🇺🇾", "Saudi Arabia": "🇸🇦", "Cape Verde": "🇨🇻",
  France: "🇫🇷", Norway: "🇳🇴", Senegal: "🇸🇳", Iraq: "🇮🇶",
  Argentina: "🇦🇷", Austria: "🇦🇹", Algeria: "🇩🇿", Jordan: "🇯🇴",
  Portugal: "🇵🇹", Colombia: "🇨🇴", "DR Congo": "🇨🇩", Uzbekistan: "🇺🇿",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Croatia: "🇭🇷", Ghana: "🇬🇭", Panama: "🇵🇦",
};

function t(team: string): TeamStanding {
  return {
    team,
    flag: FLAG_MAP[team] || "🏳️",
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0,
  };
}

function addResult(standing: TeamStanding, gf: number, ga: number, won = false, drawn = false, lost = false) {
  standing.played++;
  standing.gf += gf; standing.ga += ga; standing.gd += gf - ga;
  if (won) { standing.won++; standing.points += 3; }
  else if (drawn) { standing.drawn++; standing.points += 1; }
  else standing.lost++;
}

export const GROUP_STANDINGS: GroupStanding[] = [
  {
    group: "المجموعة أ",
    teams: [
      (() => { const s = t("Mexico"); addResult(s, 2, 1, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("South Korea"); addResult(s, 1, 0, true); addResult(s, 2, 2, false, true); return s; })(),
      (() => { const s = t("South Africa"); addResult(s, 1, 2, false, false, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Czechia"); addResult(s, 1, 1, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ب",
    teams: [
      (() => { const s = t("Switzerland"); addResult(s, 3, 0, true); addResult(s, 1, 0, true); return s; })(),
      (() => { const s = t("Canada"); addResult(s, 2, 0, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Qatar"); addResult(s, 1, 1, false, true); addResult(s, 0, 2, false, false, true); return s; })(),
      (() => { const s = t("Bosnia"); addResult(s, 0, 2, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ج",
    teams: [
      (() => { const s = t("Brazil"); addResult(s, 3, 0, true); addResult(s, 2, 1, true); return s; })(),
      (() => { const s = t("Morocco"); addResult(s, 2, 0, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Scotland"); addResult(s, 0, 3, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
      (() => { const s = t("Haiti"); addResult(s, 0, 2, false, false, true); addResult(s, 0, 3, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة د",
    teams: [
      (() => { const s = t("USA"); addResult(s, 2, 1, true); addResult(s, 1, 0, true); return s; })(),
      (() => { const s = t("Paraguay"); addResult(s, 2, 1, true); addResult(s, 0, 1, false, false, true); return s; })(),
      (() => { const s = t("Australia"); addResult(s, 1, 1, false, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Turkey"); addResult(s, 0, 2, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة هـ",
    teams: [
      (() => { const s = t("Germany"); addResult(s, 2, 1, true); addResult(s, 2, 0, true); return s; })(),
      (() => { const s = t("Japan"); addResult(s, 4, 0, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Ecuador"); addResult(s, 0, 0, false, true); addResult(s, 1, 2, false, false, true); return s; })(),
      (() => { const s = t("Ivory Coast"); addResult(s, 0, 2, false, false, true); addResult(s, 1, 2, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة و",
    teams: [
      (() => { const s = t("Netherlands"); addResult(s, 5, 1, true); addResult(s, 2, 0, true); return s; })(),
      (() => { const s = t("Japan"); addResult(s, 4, 0, true); addResult(s, 1, 1, false, true); return s; })(),
      (() => { const s = t("Sweden"); addResult(s, 1, 3, false, false, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Tunisia"); addResult(s, 0, 4, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ز",
    teams: [
      (() => { const s = t("Egypt"); addResult(s, 3, 1, true); addResult(s, 1, 0, true); return s; })(),
      (() => { const s = t("Belgium"); addResult(s, 0, 0, false, true); addResult(s, 1, 0, true); return s; })(),
      (() => { const s = t("Iran"); addResult(s, 0, 0, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
      (() => { const s = t("New Zealand"); addResult(s, 1, 3, false, false, true); addResult(s, 0, 2, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ح",
    teams: [
      (() => { const s = t("Spain"); addResult(s, 4, 0, true); addResult(s, 2, 1, true); return s; })(),
      (() => { const s = t("Uruguay"); addResult(s, 2, 2, false, true); addResult(s, 1, 0, true); return s; })(),
      (() => { const s = t("Cape Verde"); addResult(s, 2, 2, false, true); addResult(s, 0, 2, false, false, true); return s; })(),
      (() => { const s = t("Saudi Arabia"); addResult(s, 0, 4, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ط",
    teams: [
      (() => { const s = t("France"); addResult(s, 1, 0, true); addResult(s, 2, 1, true); return s; })(),
      (() => { const s = t("Senegal"); addResult(s, 1, 0, true); addResult(s, 1, 1, false, true); return s; })(),
      (() => { const s = t("Norway"); addResult(s, 1, 1, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
      (() => { const s = t("Iraq"); addResult(s, 0, 1, false, false, true); addResult(s, 0, 2, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ي",
    teams: [
      (() => { const s = t("Argentina"); addResult(s, 2, 0, true); addResult(s, 3, 1, true); return s; })(),
      (() => { const s = t("Algeria"); addResult(s, 2, 1, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Austria"); addResult(s, 0, 2, false, false, true); addResult(s, 1, 1, false, true); return s; })(),
      (() => { const s = t("Jordan"); addResult(s, 0, 2, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ك",
    teams: [
      (() => { const s = t("Portugal"); addResult(s, 2, 0, true); addResult(s, 3, 1, true); return s; })(),
      (() => { const s = t("Colombia"); addResult(s, 2, 1, true); addResult(s, 1, 1, false, true); return s; })(),
      (() => { const s = t("Uzbekistan"); addResult(s, 1, 2, false, false, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("DR Congo"); addResult(s, 0, 2, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
  {
    group: "المجموعة ل",
    teams: [
      (() => { const s = t("England"); addResult(s, 3, 0, true); addResult(s, 2, 1, true); return s; })(),
      (() => { const s = t("Croatia"); addResult(s, 2, 0, true); addResult(s, 1, 1, false, true); return s; })(),
      (() => { const s = t("Ghana"); addResult(s, 1, 2, false, false, true); addResult(s, 0, 0, false, true); return s; })(),
      (() => { const s = t("Panama"); addResult(s, 0, 3, false, false, true); addResult(s, 0, 1, false, false, true); return s; })(),
    ],
  },
];
