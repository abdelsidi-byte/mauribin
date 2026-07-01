// ─── Arabic Text Normalization ─────────────────────────────────────────────────
// Remove diacritics, normalize alef/yaa/taa variations, strip "ال" definite article
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    // Remove Arabic diacritics (tashkeel)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    // Normalize alef variations → ا
    .replace(/[إأآا]/g, "ا")
    // Normalize yaa variations → ي
    .replace(/[ىي]/g, "ي")
    // Normalize taa marbouta → ه
    .replace(/ة/g, "ه")
    // Strip leading definite article "ال"
    .replace(/^ال/, "")
    // Remove all non-alphanumeric (keep Arabic, latin, digits)
    .replace(/[^\u0600-\u06FFa-z0-9\s]/gi, "");
}

// ─── Match Scoring ────────────────────────────────────────────────────────────
// Returns relevance score (higher = better match) or 0 for no match
export function scoreMatch(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = normalizeArabic(query);
  const t = normalizeArabic(target);
  if (!q || !t) return 0;

  // Exact match
  if (q === t) return 100;
  // Starts with
  if (t.startsWith(q)) return 80;
  // Contains
  if (t.includes(q)) return 60;

  // Reverse: target starts with query (e.g. "البرازيل" vs "برازيل")
  if (q.includes(t) && t.length >= 2) return 40;

  // Fuzzy: check if all chars of query appear in target in order
  // Allow 1 char skip for queries >= 4 chars
  let qi = 0;
  let skips = 0;
  const maxSkips = q.length >= 4 ? 1 : 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
    else if (skips < maxSkips) skips++;
    else break;
  }
  if (qi === q.length) return 30;

  // Bonus: first 3 chars match (very strong fuzzy)
  if (q.length >= 3 && t.startsWith(q.substring(0, 3))) {
    return 25;
  }

  return 0;
}

// ─── Search Result Types ──────────────────────────────────────────────────────
export type SearchResultType = "team" | "match" | "group" | "venue" | "city";

export interface SearchResult {
  type: SearchResultType;
  id: string | number;
  title: string;
  titleAr?: string;
  subtitle?: string;
  href: string;
  badge?: string;
  flag?: string;
  score: number;
  meta?: Record<string, any>;
}

// ─── Search Teams ─────────────────────────────────────────────────────────────
import { TEAMS, GROUPS, SCHEDULE, GROUP_STANDINGS, type Match } from "./worldcup-data";
import { TEAM_LABELS, type Locale } from "./i18n";

// Build reverse index: arabic name → english name
const ARABIC_TO_ENGLISH: Record<string, string> = {};
const ALL_ARABIC_VARIANTS: Record<string, string> = {};  // any normalized form → english

// Common Arabic team name aliases (manual additions for teams not in TEAM_LABELS)
const ARABIC_ALIASES: Record<string, string> = {
  "البرازيل": "Brazil",
  "البراز": "Brazil",
  "برازيل": "Brazil",
  "فرنسا": "France",
  "فرنسه": "France",
  "المغرب": "Morocco",
  "مغرب": "Morocco",
  "مصر": "Egypt",
  "امريكا": "USA",
  "الولايات المتحدة": "USA",
  "كوريا الجنوبيه": "South Korea",
  "كوريا": "South Korea",
  "الراس الاخضر": "Cape Verde",
  "كاب فيردي": "Cape Verde",
  "كوت ديفوار": "Ivory Coast",
  "ساحل العاج": "Ivory Coast",
  "البوسنه": "Bosnia",
  "البوسنة": "Bosnia",
  "تشيكي": "Czechia",
  "التشيك": "Czechia",
  "استراليا": "Australia",
  "نيوزيلندا": "New Zealand",
  "نيوزيلاندا": "New Zealand",
  "هولندا": "Netherlands",
  "السويد": "Sweden",
  "اليابان": "Japan",
  "تونس": "Tunisia",
  "بلجيكا": "Belgium",
  "ايران": "Iran",
  "اسبانيا": "Spain",
  "الأرجنتين": "Argentina",
  "الارجنتين": "Argentina",
  "ألمانيا": "Germany",
  "السعودية": "Saudi Arabia",
  "المملكة العربية السعودية": "Saudi Arabia",
  "المكسيك": "Mexico",
  "كندا": "Canada",
  "سويسرا": "Switzerland",
  "قطر": "Qatar",
  "الكونغو الديمقراطية": "DR Congo",
  "الكونغو": "DR Congo",
  "نيجيريا": "Nigeria",
  "الكاميرون": "Cameroon",
  "غانا": "Ghana",
  "السنغال": "Senegal",
  "مالي": "Mali",
  "جنوب افريقيا": "South Africa",
};

for (const [ar, en] of Object.entries(ARABIC_ALIASES)) {
  ARABIC_TO_ENGLISH[normalizeArabic(ar)] = en;
  ALL_ARABIC_VARIANTS[normalizeArabic(ar)] = en;
}

for (const [en, labels] of Object.entries(TEAM_LABELS)) {
  const labelsTyped = labels as Partial<Record<Locale, string>> | undefined;
  const ar = labelsTyped?.ar;
  if (ar) {
    ARABIC_TO_ENGLISH[normalizeArabic(ar)] = en;
    ALL_ARABIC_VARIANTS[normalizeArabic(ar)] = en;
  }
}

// Function: lookup Arabic → English
function arabicToEnglish(text: string): string | null {
  const normalized = normalizeArabic(text);
  return ALL_ARABIC_VARIANTS[normalized] || ARABIC_TO_ENGLISH[normalized] || null;
}

export function searchTeams(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  for (const team of TEAMS) {
    // Build candidates including English, Arabic from aliases, and TEAM_LABELS
    const candidates = [
      team.name,                                          // English
      team.name.toLowerCase(),                            // lowercase English
      // Arabic lookup: see if the query itself (or a part) maps to this team
      arabicToEnglish(team.name) || team.name,            // ensures TEAM_LABELS Arabic is indexed
      // Search query → English (so the candidate list includes our English name)
      arabicToEnglish(query) || "",
    ].filter(Boolean) as string[];

    // Also add Arabic names from TEAM_LABELS directly
    const labels = TEAM_LABELS[team.name];
    if (labels) {
      if (labels.ar) candidates.push(labels.ar);
      if (labels.fr) candidates.push(labels.fr);
      if (labels.en) candidates.push(labels.en);
    }

    let bestScore = 0;
    for (const c of candidates) {
      const s = scoreMatch(query, c);
      if (s > bestScore) bestScore = s;
    }

    // Special boost: if query matches this team's Arabic name via alias
    const queryArEn = arabicToEnglish(query);
    if (queryArEn && queryArEn.toLowerCase() === team.name.toLowerCase()) {
      bestScore = Math.max(bestScore, 90);
    }
    // Reverse: if this team's Arabic name contains the query
    const teamArName = labels?.ar;
    if (teamArName) {
      const arScore = scoreMatch(query, teamArName);
      if (arScore > bestScore) bestScore = arScore;
    }

    // Also search by group letter
    const groupScore = scoreMatch(query, team.group);
    if (groupScore > bestScore) bestScore = groupScore;

    if (bestScore > 0) {
      results.push({
        type: "team",
        id: team.name,
        title: team.name,
        titleAr: TEAM_LABELS[team.name]?.ar,
        subtitle: `المجموعة ${team.group}`,
        href: `/groups#group-${team.group}`,
        badge: team.group,
        flag: team.flag,
        score: bestScore,
        meta: { standings: GROUP_STANDINGS[team.group]?.find(s => s.team === team.name) },
      });
    }
  }
  return results;
}

// ─── Search Groups ────────────────────────────────────────────────────────────
const ARABIC_GROUP_LETTERS = ["أ", "ب", "ج", "د", "ه", "و", "ز", "ح", "ط", "ي", "ك", "ل"];

export function searchGroups(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  GROUPS.forEach((g, idx) => {
    const arabicLetter = ARABIC_GROUP_LETTERS[idx] ?? "";
    const candidates = [
      g,                                          // A, B, C, ...
      `المجموعة ${arabicLetter}`,                 // المجموعة أ
      `المجموعة ${g}`,                            // المجموعة A
      "المجموعة",                                  // general word
      "group",
    ];

    let bestScore = 0;
    for (const c of candidates) {
      const s = scoreMatch(query, c);
      if (s > bestScore) bestScore = s;
    }

    if (bestScore > 0) {
      const teams = GROUP_STANDINGS[g] ?? [];
      results.push({
        type: "group",
        id: g,
        title: `المجموعة ${arabicLetter}`,
        subtitle: `${teams.length} منتخبات`,
        href: `/groups#group-${g}`,
        badge: g,
        flag: teams.slice(0, 4).map(t => t.flag).join(" "),
        score: bestScore,
        meta: { teams },
      });
    }
  });
  return results;
}

// ─── Search Matches ───────────────────────────────────────────────────────────
const STAGE_LABELS: Record<Match["stage"], string> = {
  group: "دور المجموعات",
  round32: "دور الـ 32",
  round16: "دور الـ 16",
  quarter: "ربع النهائي",
  semi: "نصف النهائي",
  third: "مباراة المركز الثالث",
  final: "النهائي",
};

export function searchMatches(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  for (const m of SCHEDULE) {
    const labelsHome = TEAM_LABELS[m.home];
    const labelsAway = TEAM_LABELS[m.away];

    const candidates = [
      m.home, m.away,
      m.home.toLowerCase(), m.away.toLowerCase(),
      arabicToEnglish(m.home) || "",
      arabicToEnglish(m.away) || "",
      labelsHome?.ar || "",
      labelsHome?.fr || "",
      labelsHome?.en || "",
      labelsAway?.ar || "",
      labelsAway?.fr || "",
      labelsAway?.en || "",
      m.venue ?? "",
      m.city ?? "",
      m.label ?? "",
      STAGE_LABELS[m.stage] ?? "",
      m.group ?? "",
    ].filter(Boolean);

    let bestScore = 0;
    for (const c of candidates) {
      const s = scoreMatch(query, c);
      if (s > bestScore) bestScore = s;
    }

    if (bestScore > 0) {
      results.push({
        type: "match",
        id: m.id,
        title: `${m.home} vs ${m.away}`,
        subtitle: `${STAGE_LABELS[m.stage]} • ${m.venue} • ${m.city}`,
        href: `/match/${m.id}`,
        badge: m.group,
        flag: `${m.homeFlag} ${m.awayFlag}`,
        score: bestScore,
        meta: m as unknown as Record<string, any>,
      });
    }
  }
  return results;
}

// ─── Search Venues & Cities ───────────────────────────────────────────────────
export function searchVenues(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const m of SCHEDULE) {
    if (m.venue) {
      const key = `${m.venue}-${m.city}`;
      if (!seen.has(key)) {
        seen.add(key);
        const s = scoreMatch(query, m.venue) || scoreMatch(query, m.city);
        if (s > 0) {
          const matches = SCHEDULE.filter(x => x.venue === m.venue);
          results.push({
            type: "venue",
            id: m.venue,
            title: m.venue,
            subtitle: `${m.city} • ${matches.length} مباراة`,
            href: `/schedule?venue=${encodeURIComponent(m.venue)}`,
            badge: "ملعب",
            score: s,
            meta: { venue: m.venue, city: m.city, matchCount: matches.length },
          });
        }
      }
    }
  }
  return results;
}

// ─── Main Search Function ─────────────────────────────────────────────────────
export interface SearchResponse {
  query: string;
  total: number;
  results: {
    teams: SearchResult[];
    groups: SearchResult[];
    matches: SearchResult[];
    venues: SearchResult[];
  };
  all: SearchResult[];
}

export function search(query: string, limit = 30): SearchResponse {
  const trimmed = query.trim();

  const teams = searchTeams(trimmed);
  const groups = searchGroups(trimmed);
  const matches = searchMatches(trimmed);
  const venues = searchVenues(trimmed);

  // Sort each by relevance score (descending)
  const sortByScore = (a: SearchResult, b: SearchResult) => b.score - a.score;
  teams.sort(sortByScore);
  groups.sort(sortByScore);
  matches.sort(sortByScore);
  venues.sort(sortByScore);

  // Combine all results, sorted by score
  const all = [...teams, ...groups, ...matches, ...venues]
    .sort(sortByScore)
    .slice(0, limit);

  return {
    query: trimmed,
    total: teams.length + groups.length + matches.length + venues.length,
    results: { teams, groups, matches, venues },
    all,
  };
}
