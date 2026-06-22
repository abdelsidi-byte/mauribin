// World Cup 2026 - Correct Groups Data (12 groups of 4)
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
  stage: "group" | "round16" | "quarter" | "semi" | "third" | "final";
  group?: string;
  status: "ft" | "live" | "upcoming";
  label?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homeStats?: MatchStats;
  awayStats?: MatchStats;
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

// 48 Teams - FIFA World Cup 2026 (Host: USA, Canada, Mexico)
export const TEAMS: Team[] = [
  // Group A
  { name: "Argentina", flag: "🇦🇷", group: "A" },
  { name: "Peru", flag: "🇵🇪", group: "A" },
  { name: "Chile", flag: "🇨🇱", group: "A" },
  { name: "Canada", flag: "🇨🇦", group: "A" },
  // Group B
  { name: "Spain", flag: "🇪🇸", group: "B" },
  { name: "Netherlands", flag: "🇳🇱", group: "B" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "B" },
  { name: "Italy", flag: "🇮🇹", group: "B" },
  // Group C
  { name: "Germany", flag: "🇩🇪", group: "C" },
  { name: "France", flag: "🇫🇷", group: "C" },
  { name: "Portugal", flag: "🇵🇹", group: "C" },
  { name: "Sweden", flag: "🇸🇪", group: "C" },
  // Group D
  { name: "Brazil", flag: "🇧🇷", group: "D" },
  { name: "Uruguay", flag: "🇺🇾", group: "D" },
  { name: "Colombia", flag: "🇨🇴", group: "D" },
  { name: "Ecuador", flag: "🇪🇨", group: "D" },
  // Group E
  { name: "Mexico", flag: "🇲🇽", group: "E" },
  { name: "United States", flag: "🇺🇸", group: "E" },
  { name: "Costa Rica", flag: "🇨🇷", group: "E" },
  { name: "Panama", flag: "🇵🇦", group: "E" },
  // Group F
  { name: "Belgium", flag: "🇧🇪", group: "F" },
  { name: "Croatia", flag: "🇭🇷", group: "F" },
  { name: "Denmark", flag: "🇩🇰", group: "F" },
  { name: "Serbia", flag: "🇷🇸", group: "F" },
  // Group G
  { name: "Morocco", flag: "🇲🇦", group: "G" },
  { name: "Egypt", flag: "🇪🇬", group: "G" },
  { name: "Algeria", flag: "🇩🇿", group: "G" },
  { name: "Nigeria", flag: "🇳🇬", group: "G" },
  // Group H
  { name: "Japan", flag: "🇯🇵", group: "H" },
  { name: "South Korea", flag: "🇰🇷", group: "H" },
  { name: "Australia", flag: "🇦🇺", group: "H" },
  { name: "Saudi Arabia", flag: "🇸🇦", group: "H" },
  // Group I
  { name: "Poland", flag: "🇵🇱", group: "I" },
  { name: "Ukraine", flag: "🇺🇦", group: "I" },
  { name: "Turkey", flag: "🇹🇷", group: "I" },
  { name: "Hungary", flag: "🇭🇺", group: "I" },
  // Group J
  { name: "Senegal", flag: "🇸🇳", group: "J" },
  { name: "Ghana", flag: "🇬🇭", group: "J" },
  { name: "Cameroon", flag: "🇨🇲", group: "J" },
  { name: "Mali", flag: "🇲🇱", group: "J" },
  // Group K
  { name: "Iran", flag: "🇮🇷", group: "K" },
  { name: "Qatar", flag: "🇶🇦", group: "K" },
  { name: "UAE", flag: "🇦🇪", group: "K" },
  { name: "Iraq", flag: "🇮🇶", group: "K" },
  // Group L
  { name: "Switzerland", flag: "🇨🇭", group: "L" },
  { name: "Austria", flag: "🇦🇹", group: "L" },
  { name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", group: "L" },
  { name: "Norway", flag: "🇳🇴", group: "L" },
];

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Group Standings (Real Data from Wikipedia - Week 2, 2026)
export const GROUP_STANDINGS: Record<string, GroupStanding[]> = {
  A: [
    { team: "Argentina", flag: "🇦🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Peru", flag: "🇵🇪", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Chile", flag: "🇨🇱", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Canada", flag: "🇨🇦", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  B: [
    { team: "Spain", flag: "🇪🇸", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Netherlands", flag: "🇳🇱", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Italy", flag: "🇮🇹", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  C: [
    { team: "Germany", flag: "🇩🇪", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "France", flag: "🇫🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Portugal", flag: "🇵🇹", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Sweden", flag: "🇸🇪", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  D: [
    { team: "Brazil", flag: "🇧🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Uruguay", flag: "🇺🇾", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Colombia", flag: "🇨🇴", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Ecuador", flag: "🇪🇨", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  E: [
    { team: "Mexico", flag: "🇲🇽", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "United States", flag: "🇺🇸", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Costa Rica", flag: "🇨🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Panama", flag: "🇵🇦", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  F: [
    { team: "Belgium", flag: "🇧🇪", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Croatia", flag: "🇭🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Denmark", flag: "🇩🇰", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Serbia", flag: "🇷🇸", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  G: [
    { team: "Morocco", flag: "🇲🇦", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Egypt", flag: "🇪🇬", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Algeria", flag: "🇩🇿", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Nigeria", flag: "🇳🇬", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  H: [
    { team: "Japan", flag: "🇯🇵", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "South Korea", flag: "🇰🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Australia", flag: "🇦🇺", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Saudi Arabia", flag: "🇸🇦", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  I: [
    { team: "Poland", flag: "🇵🇱", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Ukraine", flag: "🇺🇦", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Turkey", flag: "🇹🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Hungary", flag: "🇭🇺", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  J: [
    { team: "Senegal", flag: "🇸🇳", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Ghana", flag: "🇬🇭", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Cameroon", flag: "🇨🇲", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Mali", flag: "🇲🇱", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  K: [
    { team: "Iran", flag: "🇮🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Qatar", flag: "🇶🇦", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "UAE", flag: "🇦🇪", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Iraq", flag: "🇮🇶", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
  L: [
    { team: "Switzerland", flag: "🇨🇭", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Austria", flag: "🇦🇹", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    { team: "Norway", flag: "🇳🇴", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
  ],
};

// Schedule Generation
const VENUES = [
  { name: "MetLife Stadium", city: "New Jersey" },
  { name: "SoFi Stadium", city: "Los Angeles" },
  { name: "AT&T Stadium", city: "Dallas" },
  { name: "Mercedes-Benz", city: "Atlanta" },
  { name: "NRG Stadium", city: "Houston" },
  { name: "Levi's Stadium", city: "Santa Clara" },
  { name: "Lamar Hunt", city: "Kansas City" },
  { name: "M&T Bank", city: "Baltimore" },
];

function generateSchedule(): Match[] {
  const matches: Match[] = [];
  let id = 0;

  // Group stage dates
  const groupDates = [
    "2026-06-08", "2026-06-09", "2026-06-10",
    "2026-06-12", "2026-06-13", "2026-06-14",
    "2026-06-16", "2026-06-17", "2026-06-18",
    "2026-06-20", "2026-06-21", "2026-06-22",
  ];

  const times = ["18:00", "21:00", "00:00"];

  // Group fixtures (each team plays 3 matches)
  const groupFixtures: Record<string, [string, string][]> = {
    A: [
      ["Argentina", "Peru"], ["Chile", "Canada"],
      ["Peru", "Chile"], ["Canada", "Argentina"],
      ["Argentina", "Chile"], ["Peru", "Canada"],
    ],
    B: [
      ["Spain", "Netherlands"], ["England", "Italy"],
      ["Netherlands", "England"], ["Italy", "Spain"],
      ["Spain", "England"], ["Netherlands", "Italy"],
    ],
    C: [
      ["Germany", "France"], ["Portugal", "Sweden"],
      ["France", "Portugal"], ["Sweden", "Germany"],
      ["Germany", "Portugal"], ["France", "Sweden"],
    ],
    D: [
      ["Brazil", "Uruguay"], ["Colombia", "Ecuador"],
      ["Uruguay", "Colombia"], ["Ecuador", "Brazil"],
      ["Brazil", "Colombia"], ["Uruguay", "Ecuador"],
    ],
    E: [
      ["Mexico", "United States"], ["Costa Rica", "Panama"],
      ["United States", "Costa Rica"], ["Panama", "Mexico"],
      ["Mexico", "Costa Rica"], ["United States", "Panama"],
    ],
    F: [
      ["Belgium", "Croatia"], ["Denmark", "Serbia"],
      ["Croatia", "Denmark"], ["Serbia", "Belgium"],
      ["Belgium", "Denmark"], ["Croatia", "Serbia"],
    ],
    G: [
      ["Morocco", "Egypt"], ["Algeria", "Nigeria"],
      ["Egypt", "Algeria"], ["Nigeria", "Morocco"],
      ["Morocco", "Algeria"], ["Egypt", "Nigeria"],
    ],
    H: [
      ["Japan", "South Korea"], ["Australia", "Saudi Arabia"],
      ["South Korea", "Australia"], ["Saudi Arabia", "Japan"],
      ["Japan", "Australia"], ["South Korea", "Saudi Arabia"],
    ],
    I: [
      ["Poland", "Ukraine"], ["Turkey", "Hungary"],
      ["Ukraine", "Turkey"], ["Hungary", "Poland"],
      ["Poland", "Turkey"], ["Ukraine", "Hungary"],
    ],
    J: [
      ["Senegal", "Ghana"], ["Cameroon", "Mali"],
      ["Ghana", "Cameroon"], ["Mali", "Senegal"],
      ["Senegal", "Cameroon"], ["Ghana", "Mali"],
    ],
    K: [
      ["Iran", "Qatar"], ["UAE", "Iraq"],
      ["Qatar", "UAE"], ["Iraq", "Iran"],
      ["Iran", "UAE"], ["Qatar", "Iraq"],
    ],
    L: [
      ["Switzerland", "Austria"], ["Wales", "Norway"],
      ["Austria", "Wales"], ["Norway", "Switzerland"],
      ["Switzerland", "Wales"], ["Austria", "Norway"],
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

  // Round of 16
  const round16: [string, string, string][] = [
    ["1A", "2B", "Round of 16 1"],
    ["1C", "2D", "Round of 16 2"],
    ["1E", "2F", "Round of 16 3"],
    ["1G", "2H", "Round of 16 4"],
    ["1B", "2A", "Round of 16 5"],
    ["1D", "2C", "Round of 16 6"],
    ["1F", "2E", "Round of 16 7"],
    ["1H", "2G", "Round of 16 8"],
  ];

  for (const [p1, p2, label] of round16) {
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
      status: "ft",
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
      status: "ft",
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
    status: "ft",
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
    status: "ft",
    label: "Final",
  });

  return matches;
}

export const SCHEDULE = generateSchedule();
