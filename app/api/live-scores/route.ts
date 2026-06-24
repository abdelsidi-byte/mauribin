import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jkdceywetodcbmndpsjh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZGNleXdldG9kY21uZHBzamgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNzgwMCwiZXhwIjoxOTU4ODkzODAwfQ.K5T7gT3gR8VHx6D4F8J8K2N6M5L1P9Q0V7W3X4Y9Z"
);

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, '-')}-vs-${away.toLowerCase().replace(/\s+/g, '-')}`;
}

function getFlag(team: string): string {
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
    "Bosnia-Herzegovina": "🇧🇦", "Bosnia and Herzegovina": "🇧🇦",
    Jordan: "🇯🇴", Uzbekistan: "🇺🇿", Oman: "🇴🇲", Bahrain: "🇧🇭",
    Kuwait: "🇰🇼", Yemen: "🇾🇪", Syria: "🇸🇾", Libya: "🇱🇾", Sudan: "🇸🇩",
    "Curaçao": "🇨🇼", "DR Congo": "🇨🇩", "Congo": "🇨🇩",
  };
  return FLAG_MAP[team] || "🏳️";
}

function getFallbackMatches(): any[] {
  const matches = [
    { home: "Ecuador", away: "Curaçao", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T17:00:00Z", _index: 0 },
    { home: "Tunisia", away: "Japan", homeScore: 0, awayScore: 4, state: "ft", label: "انتهت", utcDate: "2026-06-22T14:00:00Z", _index: 1 },
    { home: "Spain", away: "Saudi Arabia", homeScore: 4, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T11:00:00Z", _index: 2 },
    { home: "Belgium", away: "Iran", homeScore: 0, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-22T08:00:00Z", _index: 3 },
    { home: "Uruguay", away: "Cape Verde", homeScore: 2, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-21T20:00:00Z", _index: 4 },
    { home: "New Zealand", away: "Egypt", homeScore: 1, awayScore: 3, state: "ft", label: "انتهت", utcDate: "2026-06-21T14:00:00Z", _index: 5 },
    { home: "Argentina", away: "Austria", homeScore: 2, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-21T20:00:00Z", _index: 6 },
    { home: "France", away: "Iraq", homeScore: 3, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-23T14:00:00Z", _index: 7 },
    { home: "Norway", away: "Senegal", homeScore: 3, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-23T14:00:00Z", _index: 8 },
    { home: "Jordan", away: "Algeria", homeScore: 1, awayScore: 2, state: "ft", label: "انتهت", utcDate: "2026-06-22T20:00:00Z", _index: 9 },
    { home: "Portugal", away: "Uzbekistan", homeScore: 5, awayScore: 0, state: "ft", label: "انتهت", utcDate: "2026-06-24T15:00:00Z", _index: 10 },
    { home: "Bosnia-Herzegovina", away: "Qatar", homeScore: 2, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-25T10:00:00Z", _index: 13 },
    { home: "Switzerland", away: "Canada", homeScore: 1, awayScore: 1, state: "ft", label: "انتهت", utcDate: "2026-06-25T10:00:00Z", _index: 14 },
    { home: "Morocco", away: "Haiti", homeScore: 0, awayScore: 1, state: "live", label: "مباشر", utcDate: "2026-06-24T22:00:00Z", _index: 15 },
    { home: "Scotland", away: "Brazil", homeScore: 0, awayScore: 2, state: "live", label: "مباشر", utcDate: "2026-06-24T22:00:00Z", _index: 16 },
  ];
  return matches.map(m => ({ ...m, slug: slugify(m.home, m.away), homeFlag: getFlag(m.home), awayFlag: getFlag(m.away) }));
}

async function loadCustomScores(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from("custom_scores")
      .select("*")
      .single();
    if (error || !data) return null;
    if (data.matches && Array.isArray(data.matches)) {
      return data.matches.map((m: any, i: number) => ({
        ...m,
        homeFlag: getFlag(m.home),
        awayFlag: getFlag(m.away),
        slug: slugify(m.home, m.away),
        _index: m._index ?? i,
      }));
    }
  } catch (e) { /* ignore */ }
  return null;
}

export async function GET() {
  try {
    const customMatches = await loadCustomScores();
    if (customMatches) {
      return NextResponse.json({ matches: customMatches });
    }
    const matches = getFallbackMatches();
    return NextResponse.json({ matches });
  } catch (e) {
    return NextResponse.json({ matches: getFallbackMatches() });
  }
}
