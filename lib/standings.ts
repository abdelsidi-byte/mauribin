// World Cup 2026 Group Standings - calculated dynamically from real match results
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
  Canada: "🇨🇦", Switzerland: "🇨🇭", Qatar: "🇶🇦", "Bosnia-Herzegovina": "🇧🇦",
  Brazil: "🇧🇷", Morocco: "🇲🇦", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Haiti: "🇭🇹",
  USA: "🇺🇸", "United States": "🇺🇸", Australia: "🇦🇺", Paraguay: "🇵🇾", Turkey: "🇹🇷", Türkiye: "🇹🇷",
  Germany: "🇩🇪", "Ivory Coast": "🇨🇮", "Côte d'Ivoire": "🇨🇮", Ecuador: "🇪🇨", Curaçao: "🇨🇼",
  Netherlands: "🇳🇱", Sweden: "🇸🇪", Japan: "🇯🇵", Tunisia: "🇹🇳",
  Belgium: "🇧🇪", Iran: "🇮🇷", Egypt: "🇪🇬", "New Zealand": "🇳🇿",
  Spain: "🇪🇸", Uruguay: "🇺🇾", "Saudi Arabia": "🇸🇦", "Cape Verde": "🇨🇻",
  France: "🇫🇷", Norway: "🇳🇴", Senegal: "🇸🇳", Iraq: "🇮🇶",
  Argentina: "🇦🇷", Austria: "🇦🇹", Algeria: "🇩🇿", Jordan: "🇯🇴",
  Portugal: "🇵🇹", Colombia: "🇨🇴", "DR Congo": "🇨🇩", Uzbekistan: "🇺🇿",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Croatia: "🇭🇷", Ghana: "🇬🇭", Panama: "🇵🇦",
};

function emptyStanding(team: string): TeamStanding {
  return {
    team,
    flag: FLAG_MAP[team] || "🏳️",
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0,
  };
}

export function calculateStandings(matches: {
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  state: string;
}[]): GroupStanding[] {
  const teamStats: Record<string, TeamStanding> = {};
  
  // Initialize all WC 2026 teams
  const allTeams = [
    // Group A
    "Mexico", "South Korea", "South Africa", "Czechia",
    // Group B
    "Canada", "Switzerland", "Qatar", "Bosnia-Herzegovina",
    // Group C
    "Brazil", "Morocco", "Scotland", "Haiti",
    // Group D
    "United States", "Australia", "Paraguay", "Türkiye",
    // Group E
    "Germany", "Côte d'Ivoire", "Ecuador", "Curaçao",
    // Group F
    "Netherlands", "Sweden", "Japan", "Tunisia",
    // Group G
    "Belgium", "Iran", "Egypt", "New Zealand",
    // Group H
    "Spain", "Uruguay", "Saudi Arabia", "Cape Verde",
    // Group I
    "France", "Norway", "Senegal", "Iraq",
    // Group J
    "Argentina", "Austria", "Algeria", "Jordan",
    // Group K
    "Portugal", "Colombia", "DR Congo", "Uzbekistan",
    // Group L
    "England", "Croatia", "Ghana", "Panama",
  ];
  
  allTeams.forEach((team) => {
    teamStats[team] = emptyStanding(team);
  });

  // Process only finished matches
  matches
    .filter((m) => m.state === "ft")
    .forEach((m) => {
      if (m.homeScore === null || m.awayScore === null) return;
      const home = m.home;
      const away = m.away;
      
      if (!teamStats[home] || !teamStats[away]) return;
      
      teamStats[home].played++;
      teamStats[away].played++;
      teamStats[home].gf += m.homeScore;
      teamStats[away].gf += m.awayScore;
      teamStats[home].ga += m.awayScore;
      teamStats[away].ga += m.homeScore;
      teamStats[home].gd = teamStats[home].gf - teamStats[home].ga;
      teamStats[away].gd = teamStats[away].gf - teamStats[away].ga;
      
      if (m.homeScore > m.awayScore) {
        teamStats[home].won++;
        teamStats[home].points += 3;
        teamStats[away].lost++;
      } else if (m.homeScore < m.awayScore) {
        teamStats[away].won++;
        teamStats[away].points += 3;
        teamStats[home].lost++;
      } else {
        teamStats[home].drawn++;
        teamStats[away].drawn++;
        teamStats[home].points += 1;
        teamStats[away].points += 1;
      }
    });

  const GROUP_DEFS = [
    { letter: "A", arName: "أ", teams: ["Mexico", "South Korea", "South Africa", "Czechia"] },
    { letter: "B", arName: "ب", teams: ["Canada", "Switzerland", "Qatar", "Bosnia-Herzegovina"] },
    { letter: "C", arName: "ج", teams: ["Brazil", "Morocco", "Scotland", "Haiti"] },
    { letter: "D", arName: "د", teams: ["United States", "Australia", "Paraguay", "Türkiye"] },
    { letter: "E", arName: "هـ", teams: ["Germany", "Côte d'Ivoire", "Ecuador", "Curaçao"] },
    { letter: "F", arName: "و", teams: ["Netherlands", "Sweden", "Japan", "Tunisia"] },
    { letter: "G", arName: "ز", teams: ["Belgium", "Iran", "Egypt", "New Zealand"] },
    { letter: "H", arName: "ح", teams: ["Spain", "Uruguay", "Saudi Arabia", "Cape Verde"] },
    { letter: "I", arName: "ط", teams: ["France", "Norway", "Senegal", "Iraq"] },
    { letter: "J", arName: "ي", teams: ["Argentina", "Austria", "Algeria", "Jordan"] },
    { letter: "K", arName: "ك", teams: ["Portugal", "Colombia", "DR Congo", "Uzbekistan"] },
    { letter: "L", arName: "ل", teams: ["England", "Croatia", "Ghana", "Panama"] },
  ];

  return GROUP_DEFS.map(({ letter, arName, teams }) => {
    const groupTeams = teams.map((t) => ({ ...teamStats[t] }));
    groupTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    });
    return {
      group: `المجموعة ${arName}`,
      teams: groupTeams,
    };
  });
}
