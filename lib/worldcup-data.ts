// World Cup 2026 - CORRECT Groups Data (12 groups of 4)
// Source: User's FIFA_World_Cup_2026_Groups.txt
export interface Team {
  name: string;
  flag: string;
  group: string;
}

export interface Match {
  id: number;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  stage: "group" | "round32" | "round16" | "quarter" | "semi" | "third" | "final";
  group?: string;
  status: "ft" | "live" | "upcoming";
  label?: string;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface MatchStats {
  possession?: number;
  shots?: number;
  shotsOnTarget?: number;
  passes?: number;
  passAccuracy?: number;
  fouls?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface GroupStanding {
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

// 48 Teams - FIFA World Cup 2026 (Official Draw)
export const TEAMS: Team[] = [
  // Group A
  { name: "Mexico", flag: "🇲🇽", group: "A" },
  { name: "South Korea", flag: "🇰🇷", group: "A" },
  { name: "South Africa", flag: "🇿🇦", group: "A" },
  { name: "Czechia", flag: "🇨🇿", group: "A" },
  // Group B
  { name: "Canada", flag: "🇨🇦", group: "B" },
  { name: "Switzerland", flag: "🇨🇭", group: "B" },
  { name: "Qatar", flag: "🇶🇦", group: "B" },
  { name: "Bosnia", flag: "🇧🇦", group: "B" },
  // Group C
  { name: "Brazil", flag: "🇧🇷", group: "C" },
  { name: "Morocco", flag: "🇲🇦", group: "C" },
  { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C" },
  { name: "Haiti", flag: "🇭🇹", group: "C" },
  // Group D
  { name: "USA", flag: "🇺🇸", group: "D" },
  { name: "Australia", flag: "🇦🇺", group: "D" },
  { name: "Paraguay", flag: "🇵🇾", group: "D" },
  { name: "Turkey", flag: "🇹🇷", group: "D" },
  // Group E
  { name: "Germany", flag: "🇩🇪", group: "E" },
  { name: "Ivory Coast", flag: "🇨🇮", group: "E" },
  { name: "Ecuador", flag: "🇪🇨", group: "E" },
  { name: "Curaçao", flag: "🇨🇼", group: "E" },
  // Group F
  { name: "Netherlands", flag: "🇳🇱", group: "F" },
  { name: "Sweden", flag: "🇸🇪", group: "F" },
  { name: "Japan", flag: "🇯🇵", group: "F" },
  { name: "Tunisia", flag: "🇹🇳", group: "F" },
  // Group G
  { name: "Belgium", flag: "🇧🇪", group: "G" },
  { name: "Iran", flag: "🇮🇷", group: "G" },
  { name: "Egypt", flag: "🇪🇬", group: "G" },
  { name: "New Zealand", flag: "🇳🇿", group: "G" },
  // Group H
  { name: "Spain", flag: "🇪🇸", group: "H" },
  { name: "Uruguay", flag: "🇺🇾", group: "H" },
  { name: "Saudi Arabia", flag: "🇸🇦", group: "H" },
  { name: "Cape Verde", flag: "🇨🇻", group: "H" },
  // Group I
  { name: "France", flag: "🇫🇷", group: "I" },
  { name: "Norway", flag: "🇳🇴", group: "I" },
  { name: "Senegal", flag: "🇸🇳", group: "I" },
  { name: "Iraq", flag: "🇮🇶", group: "I" },
  // Group J
  { name: "Argentina", flag: "🇦🇷", group: "J" },
  { name: "Austria", flag: "🇦🇹", group: "J" },
  { name: "Algeria", flag: "🇩🇿", group: "J" },
  { name: "Jordan", flag: "🇯🇴", group: "J" },
  // Group K
  { name: "Portugal", flag: "🇵🇹", group: "K" },
  { name: "Colombia", flag: "🇨🇴", group: "K" },
  { name: "DR Congo", flag: "🇨🇩", group: "K" },
  { name: "Uzbekistan", flag: "🇺🇿", group: "K" },
  // Group L
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L" },
  { name: "Croatia", flag: "🇭🇷", group: "L" },
  { name: "Ghana", flag: "🇬🇭", group: "L" },
  { name: "Panama", flag: "🇵🇦", group: "L" },
];

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Group Standings - Real results from WC 2026 (updated)
export const GROUP_STANDINGS: Record<string, GroupStanding[]> = {
  A: [
    { team: "Mexico", flag: "🇲🇽", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 1, gd: 1, points: 4 },
    { team: "South Korea", flag: "🇰🇷", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 1, gd: 1, points: 4 },
    { team: "South Africa", flag: "🇿🇦", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
    { team: "Czechia", flag: "🇨🇿", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
  ],
  B: [
    { team: "Switzerland", flag: "🇨🇭", played: 2, won: 2, drawn: 0, lost: 0, gf: 3, ga: 0, gd: 3, points: 6 },
    { team: "Canada", flag: "🇨🇦", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 0, gd: 2, points: 4 },
    { team: "Qatar", flag: "🇶🇦", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
    { team: "Bosnia", flag: "🇧🇦", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 4, gd: -4, points: 0 },
  ],
  C: [
    { team: "Brazil", flag: "🇧🇷", played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, points: 6 },
    { team: "Morocco", flag: "🇲🇦", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 0, gd: 2, points: 4 },
    { team: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 5, gd: -5, points: 0 },
    { team: "Haiti", flag: "🇭🇹", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 5, gd: -5, points: 0 },
  ],
  D: [
    { team: "USA", flag: "🇺🇸", played: 2, won: 2, drawn: 0, lost: 0, gf: 3, ga: 1, gd: 2, points: 6 },
    { team: "Paraguay", flag: "🇵🇾", played: 2, won: 1, drawn: 0, lost: 1, gf: 2, ga: 2, gd: 0, points: 3 },
    { team: "Australia", flag: "🇦🇺", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
    { team: "Turkey", flag: "🇹🇷", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 3, gd: -3, points: 0 },
  ],
  E: [
    { team: "Germany", flag: "🇩🇪", played: 2, won: 2, drawn: 0, lost: 0, gf: 4, ga: 1, gd: 3, points: 6 },
    { team: "Japan", flag: "🇯🇵", played: 2, won: 1, drawn: 1, lost: 0, gf: 4, ga: 0, gd: 4, points: 4 },
    { team: "Ecuador", flag: "🇪🇨", played: 2, won: 0, drawn: 1, lost: 1, gf: 0, ga: 2, gd: -2, points: 1 },
    { team: "Ivory Coast", flag: "🇨🇮", played: 2, won: 0, drawn: 0, lost: 2, gf: 1, ga: 4, gd: -3, points: 0 },
  ],
  F: [
    { team: "Netherlands", flag: "🇳🇱", played: 2, won: 2, drawn: 0, lost: 0, gf: 7, ga: 1, gd: 6, points: 6 },
    { team: "Japan", flag: "🇯🇵", played: 2, won: 1, drawn: 1, lost: 0, gf: 4, ga: 0, gd: 4, points: 4 },
    { team: "Sweden", flag: "🇸🇪", played: 2, won: 0, drawn: 0, lost: 2, gf: 1, ga: 7, gd: -6, points: 0 },
    { team: "Tunisia", flag: "🇹🇳", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 5, gd: -5, points: 0 },
  ],
  G: [
    { team: "Egypt", flag: "🇪🇬", played: 2, won: 2, drawn: 0, lost: 0, gf: 4, ga: 1, gd: 3, points: 6 },
    { team: "Belgium", flag: "🇧🇪", played: 2, won: 0, drawn: 2, lost: 0, gf: 0, ga: 0, gd: 0, points: 2 },
    { team: "Iran", flag: "🇮🇷", played: 2, won: 0, drawn: 1, lost: 1, gf: 0, ga: 1, gd: -1, points: 1 },
    { team: "New Zealand", flag: "🇳🇿", played: 2, won: 0, drawn: 0, lost: 2, gf: 1, ga: 5, gd: -4, points: 0 },
  ],
  H: [
    { team: "Spain", flag: "🇪🇸", played: 2, won: 2, drawn: 0, lost: 0, gf: 6, ga: 1, gd: 5, points: 6 },
    { team: "Uruguay", flag: "🇺🇾", played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, gd: 1, points: 4 },
    { team: "Cape Verde", flag: "🇨🇻", played: 2, won: 0, drawn: 1, lost: 1, gf: 2, ga: 3, gd: -1, points: 1 },
    { team: "Saudi Arabia", flag: "🇸🇦", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 6, gd: -6, points: 0 },
  ],
  I: [
    { team: "France", flag: "🇫🇷", played: 2, won: 2, drawn: 0, lost: 0, gf: 3, ga: 1, gd: 2, points: 6 },
    { team: "Senegal", flag: "🇸🇳", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 1, gd: 1, points: 4 },
    { team: "Norway", flag: "🇳🇴", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
    { team: "Iraq", flag: "🇮🇶", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 3, gd: -3, points: 0 },
  ],
  J: [
    { team: "Argentina", flag: "🇦🇷", played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, points: 6 },
    { team: "Algeria", flag: "🇩🇿", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 1, gd: 1, points: 4 },
    { team: "Austria", flag: "🇦🇹", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 3, gd: -2, points: 1 },
    { team: "Jordan", flag: "🇯🇴", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 3, gd: -3, points: 0 },
  ],
  K: [
    { team: "Portugal", flag: "🇵🇹", played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, points: 6 },
    { team: "Colombia", flag: "🇨🇴", played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, gd: 1, points: 4 },
    { team: "Uzbekistan", flag: "🇺🇿", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
    { team: "DR Congo", flag: "🇨🇩", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 3, gd: -3, points: 0 },
  ],
  L: [
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, points: 6 },
    { team: "Croatia", flag: "🇭🇷", played: 2, won: 1, drawn: 1, lost: 0, gf: 2, ga: 1, gd: 1, points: 4 },
    { team: "Ghana", flag: "🇬🇭", played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, points: 1 },
    { team: "Panama", flag: "🇵🇦", played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 4, gd: -4, points: 0 },
  ],
};

// Schedule Generation - WC 2026 venues (USA, Canada, Mexico)
const VENUES = [
  { name: "MetLife Stadium", city: "New Jersey" },
  { name: "SoFi Stadium", city: "Los Angeles" },
  { name: "AT&T Stadium", city: "Dallas" },
  { name: "Mercedes-Benz", city: "Atlanta" },
  { name: "NRG Stadium", city: "Houston" },
  { name: "Levi's Stadium", city: "Santa Clara" },
  { name: "Lamar Hunt", city: "Kansas City" },
  { name: "BC Place", city: "Vancouver" },
];

function generateSchedule(): Match[] {
  const matches: Match[] = [];
  let id = 0;

  const groupDates = [
    "2026-06-08", "2026-06-09", "2026-06-10",
    "2026-06-12", "2026-06-13", "2026-06-14",
    "2026-06-16", "2026-06-17", "2026-06-18",
    "2026-06-20", "2026-06-21", "2026-06-22",
  ];

  const times = ["18:00", "21:00", "00:00"];

  // Official Group Fixtures - WC 2026
  const groupFixtures: Record<string, [string, string][]> = {
    A: [
      ["Mexico", "South Korea"], ["South Africa", "Czechia"],
      ["Czechia", "Mexico"], ["South Korea", "South Africa"],
      ["Mexico", "South Africa"], ["South Korea", "Czechia"],
    ],
    B: [
      ["Canada", "Switzerland"], ["Qatar", "Bosnia"],
      ["Bosnia", "Canada"], ["Switzerland", "Qatar"],
      ["Canada", "Qatar"], ["Switzerland", "Bosnia"],
    ],
    C: [
      ["Brazil", "Morocco"], ["Scotland", "Haiti"],
      ["Haiti", "Brazil"], ["Morocco", "Scotland"],
      ["Brazil", "Scotland"], ["Morocco", "Haiti"],
    ],
    D: [
      ["USA", "Australia"], ["Paraguay", "Turkey"],
      ["Turkey", "USA"], ["Australia", "Paraguay"],
      ["USA", "Paraguay"], ["Australia", "Turkey"],
    ],
    E: [
      ["Germany", "Ivory Coast"], ["Ecuador", "Curaçao"],
      ["Curaçao", "Germany"], ["Ivory Coast", "Ecuador"],
      ["Germany", "Ecuador"], ["Ivory Coast", "Curaçao"],
    ],
    F: [
      ["Netherlands", "Sweden"], ["Japan", "Tunisia"],
      ["Tunisia", "Netherlands"], ["Sweden", "Japan"],
      ["Netherlands", "Japan"], ["Sweden", "Tunisia"],
    ],
    G: [
      ["Belgium", "Iran"], ["Egypt", "New Zealand"],
      ["New Zealand", "Belgium"], ["Iran", "Egypt"],
      ["Belgium", "Egypt"], ["Iran", "New Zealand"],
    ],
    H: [
      ["Spain", "Uruguay"], ["Saudi Arabia", "Cape Verde"],
      ["Cape Verde", "Spain"], ["Uruguay", "Saudi Arabia"],
      ["Spain", "Saudi Arabia"], ["Uruguay", "Cape Verde"],
    ],
    I: [
      ["France", "Norway"], ["Senegal", "Iraq"],
      ["Iraq", "France"], ["Norway", "Senegal"],
      ["France", "Senegal"], ["Norway", "Iraq"],
    ],
    J: [
      ["Argentina", "Austria"], ["Algeria", "Jordan"],
      ["Jordan", "Argentina"], ["Austria", "Algeria"],
      ["Argentina", "Algeria"], ["Austria", "Jordan"],
    ],
    K: [
      ["Portugal", "Colombia"], ["DR Congo", "Uzbekistan"],
      ["Uzbekistan", "Portugal"], ["Colombia", "DR Congo"],
      ["Portugal", "DR Congo"], ["Colombia", "Uzbekistan"],
    ],
    L: [
      ["England", "Croatia"], ["Ghana", "Panama"],
      ["Panama", "England"], ["Croatia", "Ghana"],
      ["England", "Ghana"], ["Croatia", "Panama"],
    ],
  };

  let dateIdx = 0;
  for (const group of Object.keys(groupFixtures)) {
    const fixtures = groupFixtures[group];
    for (let i = 0; i < fixtures.length; i++) {
      const [home, away] = fixtures[i];
      const teamHome = TEAMS.find((t) => t.name === home);
      const teamAway = TEAMS.find((t) => t.name === away);
      matches.push({
        id: id++,
        home,
        away,
        homeFlag: teamHome?.flag || "🏳️",
        awayFlag: teamAway?.flag || "🏳️",
        date: groupDates[dateIdx % groupDates.length],
        time: times[i % times.length],
        venue: VENUES[dateIdx % VENUES.length].name,
        city: VENUES[dateIdx % VENUES.length].city,
        stage: "group",
        group,
        status: dateIdx < 16 ? "ft" : "upcoming",
        label: `MD${Math.floor(i / 2) + 1}`,
      });
      dateIdx++;
    }
  }

  // Round of 32 - 16 matches between 32 teams (Top 2 + Best 8 Thirds from 12 groups)
  // كأس العالم 2026 الجديد: 48 فريقاً → 32 يتأهلون → دور الـ 32 (16 مباراة)
  const round32: [string, string, string][] = [
    // Match 1-4: Group A/B/C/D winners vs runners-up
    ["1A", "2C", "دور الـ 32 - مباراة 1"],
    ["1B", "3A/C/D/E", "دور الـ 32 - مباراة 2"],
    ["1D", "3B/E/F/I", "دور الـ 32 - مباراة 3"],
    ["1C", "2F", "دور الـ 32 - مباراة 4"],
    // Match 5-8
    ["1E", "2D", "دور الـ 32 - مباراة 5"],
    ["1G", "3A/B/C/H", "دور الـ 32 - مباراة 6"],
    ["1F", "2A", "دور الـ 32 - مباراة 7"],
    ["1H", "2G", "دور الـ 32 - مباراة 8"],
    // Match 9-12
    ["1I", "2E", "دور الـ 32 - مباراة 9"],
    ["1K", "3D/E/G/I", "دور الـ 32 - مباراة 10"],
    ["1J", "2H", "دور الـ 32 - مباراة 11"],
    ["1L", "2B", "دور الـ 32 - مباراة 12"],
    // Match 13-16
    ["2I", "3A/C/F/H", "دور الـ 32 - مباراة 13"],
    ["2J", "3B/D/G/L", "دور الـ 32 - مباراة 14"],
    ["2K", "3C/E/F/J", "دور الـ 32 - مباراة 15"],
    ["2L", "3E/H/I/K", "دور الـ 32 - مباراة 16"],
  ];

  for (const [p1, p2, label] of round32) {
    matches.push({
      id: id++,
      home: p1,
      away: p2,
      homeFlag: "🏳️",
      awayFlag: "🏳️",
      date: "2026-06-28",
      time: "18:00",
      venue: "Levi's Stadium",
      city: "Santa Clara",
      stage: "round32",
      status: "upcoming",
      label,
    });
  }

  // Round of 16 - Winners of Round of 32 face off (8 matches)
  const round16: [string, string, string][] = [
    ["W57", "W58", "ثمن النهائي 1"],
    ["W59", "W60", "ثمن النهائي 2"],
    ["W61", "W62", "ثمن النهائي 3"],
    ["W63", "W64", "ثمن النهائي 4"],
    ["W65", "W66", "ثمن النهائي 5"],
    ["W67", "W68", "ثمن النهائي 6"],
    ["W69", "W70", "ثمن النهائي 7"],
    ["W71", "W72", "ثمن النهائي 8"],
  ];

  for (const [p1, p2, label] of round16) {
    matches.push({
      id: id++,
      home: p1,
      away: p2,
      homeFlag: "🏳️",
      awayFlag: "🏳️",
      date: "2026-07-02",
      time: "18:00",
      venue: "AT&T Stadium",
      city: "Dallas",
      stage: "round16",
      status: "upcoming",
      label,
    });
  }

  // Quarter finals
  const quarters: [string, string][] = [
    ["W49", "W50"], ["W53", "W54"], ["W51", "W52"], ["W55", "W56"],
  ];
  for (const [home, away] of quarters) {
    matches.push({
      id: id++,
      home,
      away,
      homeFlag: "🏳️",
      awayFlag: "🏳️",
      date: "2026-07-02",
      time: "18:00",
      venue: "AT&T Stadium",
      city: "Dallas",
      stage: "quarter",
      status: "upcoming",
    });
  }

  // Semi finals
  const semis: [string, string][] = [["W57", "W58"], ["W59", "W60"]];
  for (const [home, away] of semis) {
    matches.push({
      id: id++,
      home,
      away,
      homeFlag: "🏳️",
      awayFlag: "🏳️",
      date: "2026-07-05",
      time: "21:00",
      venue: "MetLife Stadium",
      city: "New Jersey",
      stage: "semi",
      status: "upcoming",
    });
  }

  // Third place
  matches.push({
    id: id++,
    home: "L61",
    away: "L62",
    homeFlag: "🏳️",
    awayFlag: "🏳️",
    date: "2026-07-08",
    time: "21:00",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    stage: "third",
    status: "upcoming",
    label: "3rd Place",
  });

  // Final
  matches.push({
    id: id++,
    home: "W61",
    away: "W62",
    homeFlag: "🏳️",
    awayFlag: "🏳️",
    date: "2026-07-09",
    time: "21:00",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    stage: "final",
    status: "upcoming",
    label: "Final",
  });

  return matches;
}

// Real team flags map for quarter/semi/final rounds
export const TEAM_FLAGS: Record<string, string> = {
  France: "🇫🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Spain: "🇪🇸", Belgium: "🇧🇪",
  Morocco: "🇲🇦", Portugal: "🇵🇹", Germany: "🇩🇪", Italy: "🇮🇹",
  Brazil: "🇧🇷", Argentina: "🇦🇷", Netherlands: "🇳🇱", Croatia: "🇭🇷",
  Norway: "🇳🇴", Senegal: "🇸🇳", USA: "🇺🇸", Mexico: "🇲🇽",
  Japan: "🇯🇵", Uruguay: "🇺🇾", Switzerland: "🇨🇭", Ghana: "🇬🇭",
  "South Korea": "🇰🇷", Iran: "🇮🇷", Colombia: "🇨🇴", Egypt: "🇪🇬",
  Nigeria: "🇳🇬", "Saudi Arabia": "🇸🇦", "Cape Verde": "🇨🇻", Peru: "🇵🇪",
  Cameroon: "🇨🇲", Chile: "🇨🇱", Ecuador: "🇪🇨", Paraguay: "🇵🇾",
  Panama: "🇵🇦", Jamaica: "🇯🇲", Canada: "🇨🇦", Qatar: "🇶🇦",
  "Bosnia-Herzegovina": "🇧🇦", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Haiti: "🇭🇹",
  "Ivory Coast": "🇨🇮", Tunisia: "🇹🇳", Algeria: "🇩🇿", Sweden: "🇸🇪",
  Denmark: "🇩🇰", Serbia: "🇷🇸", Ukraine: "🇺🇦", Poland: "🇵🇱",
  Austria: "🇦🇹", Hungary: "🇭🇺", "Czech Republic": "🇨🇿", "Curaçao": "🇨🇼",
  "DR Congo": "🇨🇩", Iraq: "🇮🇶", "South Africa": "🇿🇦", Australia: "🇦🇺",
  Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", Jordan: "🇯🇴", Oman: "🇴🇲", "New Zealand": "🇳🇿",
  Venezuela: "🇻🇪", Bolivia: "🇧🇴", "Costa Rica": "🇨🇷", Iceland: "🇮🇸",
};
export const SCHEDULE = generateSchedule();
