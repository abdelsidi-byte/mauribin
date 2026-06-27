// Mapping of team pair keys to ESPN match IDs for World Cup 2026
// Key format: "HomeTeam|AwayTeam"
// To find a match ID: open https://www.espn.com/soccer/fifa-world-cup/match/_/gameId/XXXXX

export const MATCH_FIXTURE_IDS: Record<string, number> = {
  // Group A
  "Mexico|South Africa": 12602614,
  "South Korea|Czechia": 12602615,
  "Mexico|South Korea": 12602616,
  "South Africa|Czechia": 12602617,
  "South Africa|South Korea": 12602618,
  "Czechia|Mexico": 12602619,

  // Group B
  "Canada|Bosnia-Herzegovina": 12602620,
  "Qatar|Switzerland": 12602621,
  "Switzerland|Bosnia-Herzegovina": 12602622,
  "Canada|Qatar": 12602623,
  "Switzerland|Canada": 12602624,
  "Bosnia-Herzegovina|Qatar": 12602625,

  // Group C
  "Brazil|Morocco": 12602626,
  "Haiti|Scotland": 12602627,
  "Scotland|Brazil": 12602628,
  "Morocco|Haiti": 12602629,
  "Scotland|Morocco": 12602630,
  "Brazil|Haiti": 12602631,

  // Group D
  "USA|Paraguay": 12602632,
  "Australia|Turkey": 12602633,
  "USA|Australia": 12602634,
  "Turkey|Paraguay": 12602635,

  // Group E
  "Germany|Curaçao": 12602636,
  "Ivory Coast|Ecuador": 12602637,
  "Germany|Ivory Coast": 12602638,
  "Ecuador|Curaçao": 12602639,

  // Group F
  "Netherlands|Japan": 12602640,
  "Sweden|Tunisia": 12602641,
  "Japan|Tunisia": 12602642,
  "Netherlands|Sweden": 12602643,

  // Group G
  "Belgium|Iran": 12602644,
  "New Zealand|Egypt": 12602645,
  "Belgium|New Zealand": 12602646,
  "Egypt|Iran": 12602647,

  // Group H
  "Spain|Saudi Arabia": 12602648,
  "Uruguay|Cape Verde": 12602649,
  "Spain|Cape Verde": 12602650,
  "Saudi Arabia|Uruguay": 12602651,

  // Group I
  "France|Senegal": 12602652,
  "Norway|Iraq": 12602653,
  "France|Iraq": 12602654,
  "Norway|Senegal": 12602655,

  // Group J
  "Argentina|Austria": 12602656,
  "Jordan|Algeria": 12602657,
  "Argentina|Algeria": 12602658,
  "Austria|Jordan": 12602659,

  // Group K
  "Portugal|Uzbekistan": 12602660,
  "Colombia|DR Congo": 12602661,

  // Group L
  "England|Croatia": 12602662,
  "Ghana|Panama": 12602663,
  "England|Ghana": 12602664,
  "Croatia|Panama": 12602665,
};

export function getFixtureId(home: string, away: string): number | null {
  const key1 = `${home}|${away}`;
  const key2 = `${away}|${home}`;
  return MATCH_FIXTURE_IDS[key1] ?? MATCH_FIXTURE_IDS[key2] ?? null;
}

export function getSlug(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, "-")}-vs-${away.toLowerCase().replace(/\s+/g, "-")}`;
}
