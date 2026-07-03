import { NextResponse } from "next/server";

const API_KEY = "74324d6063934f75b808c611780d7b68";

// Simple in-memory cache for serverless (survives ~10s warm Lambda window)
// Key: date string, Value: { timestamp, data }
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 15_000; // 15 seconds — balance between freshness and load

function getCacheKey(from: string, to: string): string {
  return `${from}→${to}`;
}

function slugify(home: string, away: string): string {
  return `${home.toLowerCase().replace(/\s+/g, "-")}-vs-${away.toLowerCase().replace(/\s+/g, "-")}`;
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

function getMatchState(status: string): { state: string; label: string } {
  const s = status.toLowerCase();
  if (s === "live" || s === "in_play" || s === "paused") return { state: "live", label: "مباشر" };
  if (s === "finished" || s === "ft") return { state: "ft", label: "انتهت" };
  if (s === "timed" || s === "scheduled" || s === "postponed") return { state: "upcoming", label: "قادم" };
  if (s === "halftime" || s === "ht") return { state: "live", label: "الشوط الثاني" };
  return { state: "upcoming", label: "قادم" };
}

/**
 * Get the CURRENT score for a match, handling live updates correctly.
 * Priority for LIVE matches:
 *   1. halfTime + regularTime + extraTime (current cumulative score)
 *   2. If regularTime is missing but fullTime differs from halfTime,
 *      assume the difference is goals scored in the 2nd half
 *   3. As last resort, use fullTime
 * Priority for FINISHED matches:
 *   1. fullTime (final score)
 */
function getCurrentScore(m: any): { home: number | null; away: number | null } {
  const status = (m.status || "").toUpperCase();
  const score = m.score || {};

  if (status === "IN_PLAY" || status === "LIVE" || status === "PAUSED" || status === "HALFTIME") {
    const ht = score.halfTime;
    const reg = score.regularTime;
    const ext = score.extraTime;
    const ft = score.fullTime;

    // Case 1: regularTime exists - sum all parts
    if (reg && (reg.home !== null || reg.away !== null)) {
      const home = (ht?.home ?? 0) + (reg.home ?? 0) + (ext?.home ?? 0);
      const away = (ht?.away ?? 0) + (reg.away ?? 0) + (ext?.away ?? 0);
      return { home, away };
    }

    // Case 2: regularTime missing but fullTime has values
    // The difference between fullTime and halfTime represents goals scored in 2nd half
    if (ft && (ft.home !== null || ft.away !== null)) {
      const home = ft.home ?? 0;
      const away = ft.away ?? 0;
      return { home, away };
    }

    // Case 3: Only halfTime available
    if (ht) {
      return { home: ht.home ?? 0, away: ht.away ?? 0 };
    }
  }

  // For FINISHED or SCHEDULED matches, use fullTime
  return {
    home: score.fullTime?.home ?? null,
    away: score.fullTime?.away ?? null,
  };
}

function formatLabel(utcDate: string): string {
  try {
    const d = new Date(utcDate);
    const now = new Date();
    // The API returns UTC timestamps, so use UTC getters to match the date
    if (d.toDateString() === now.toDateString()) {
      return `اليوم ${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}`;
    }
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    return `${days[d.getUTCDay()]} ${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}`;
  } catch {
    return utcDate;
  }
}

export async function GET() {
  try {
    const now = new Date();
    const localYear = now.getFullYear();
    const localMonth = now.getMonth();
    const localDay = now.getDate();

    // Today's midnight in LOCAL time
    const todayLocal = new Date(localYear, localMonth, localDay, 0, 0, 0, 0);
    const tomorrowLocal = new Date(localYear, localMonth, localDay + 1, 0, 0, 0, 0);
    const yesterdayLocal = new Date(localYear, localMonth, localDay - 1, 0, 0, 0, 0);

    // Fetch range: yesterday to tomorrow+1day (covers all timezone offsets)
    const fromUTC = yesterdayLocal.toISOString().split("T")[0];
    const toUTC = new Date(tomorrowLocal.getTime() + 86400000).toISOString().split("T")[0];

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // ── CACHE: serve fresh data to all clients from one API call ──
    const cacheKey = getCacheKey(fromUTC, toUTC);
    const cached = cache.get(cacheKey);
    const nowMs = Date.now();
    const isCacheValid = cached && (nowMs - cached.timestamp < CACHE_TTL_MS);

    if (isCacheValid) {
      console.log(`[LIVE-SCORES] ✅ Cache hit (${Math.round((nowMs - cached.timestamp) / 1000)}s old)`);
      return NextResponse.json({
        ...cached.data,
        _cached: true,
        _age_seconds: Math.round((nowMs - cached.timestamp) / 1000),
      });
    }
    console.log(`[LIVE-SCORES] 🔄 Cache miss — fetching from football-data.org`);
    // ── End cache ──

    const res = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${fromUTC}&dateTo=${toUTC}`,
      { headers: { "X-Auth-Token": API_KEY }, cache: "no-store" }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const apiMatches: any[] = data.matches || [];

    console.log(`[LIVE-SCORES] API returned: ${apiMatches.length} matches`);

    // Filter to matches whose UTC date falls within [today midnight, tomorrow midnight) LOCAL time
    const todayStart = todayLocal.getTime();
    const todayEnd = tomorrowLocal.getTime();

    const todayMatches = apiMatches.filter((m) => {
      const matchDate = new Date(m.utcDate).getTime();
      const inRange = matchDate >= todayStart && matchDate < todayEnd;
      return inRange;
    });

    console.log(`[LIVE-SCORES] After date filter: ${todayMatches.length}`);
    todayMatches.forEach((m) => {
      console.log(`  -> ${m.homeTeam?.name} vs ${m.awayTeam?.name} at ${m.utcDate}`);
    });

    // Deduplicate by ID
    const seen = new Set();
    const unique = todayMatches.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      // Skip matches with missing team names
      if (!m.homeTeam?.name || !m.awayTeam?.name) return false;
      return true;
    });

    const matches = unique.map((m, idx) => {
      const home = m.homeTeam?.name || m.homeTeam?.shortName || "Unknown";
      const away = m.awayTeam?.name || m.awayTeam?.shortName || "Unknown";
      const { state, label } = getMatchState(m.status);
      // Use getCurrentScore to handle live matches correctly (with VAR cancellations)
      const currentScore = getCurrentScore(m);
      const utcDate = m.utcDate;
      const matchLabel = state === "upcoming" ? formatLabel(utcDate) : label;
      // Calculate elapsed minutes for live matches
      let elapsed = 0;
      if (state === "live" && utcDate) {
        const mins = Math.floor((Date.now() - new Date(utcDate).getTime()) / 60000);
        elapsed = Math.max(0, Math.min(120, mins));
      }

      return {
        id: m.id,
        _index: idx,
        home,
        away,
        homeScore: currentScore.home,
        awayScore: currentScore.away,
        state,
        label: matchLabel,
        utcDate,
        status: m.status,
        matchday: m.matchday,
        elapsed,
        slug: slugify(home, away),
        homeFlag: getFlag(home),
        awayFlag: getFlag(away),
      };
    });

    // Sort: live → upcoming → finished
    const stateOrder: Record<string, number> = { live: 0, upcoming: 1, ft: 2 };
    matches.sort((a, b) => {
      if (stateOrder[a.state] !== stateOrder[b.state]) return stateOrder[a.state] - stateOrder[b.state];
      if (a.state === "live") return 0;
      return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
    });

    console.log(`[LIVE-SCORES] Final: ${matches.length} matches`);
    matches.forEach((m) => {
      console.log(`  -> ${m.home} vs ${m.away} [${m.state}] at ${m.utcDate}`);
    });

    const responseBody = {
      matches,
      source: "api",
      debug: {
        todayLocal: todayLocal.toDateString(),
        timezone: userTimezone,
        apiCount: apiMatches.length,
        filteredCount: todayMatches.length,
        finalCount: matches.length,
      },
    };

    // ── Save to cache ──
    cache.set(cacheKey, { timestamp: nowMs, data: responseBody });
    console.log(`[LIVE-SCORES] 💾 Cached with TTL=${CACHE_TTL_MS / 1000}s`);
    // ── End cache ──

    return NextResponse.json(responseBody);
  } catch (e) {
    console.error("[LIVE-SCORES] Error:", e);
    return NextResponse.json({ matches: [], source: "error", error: String(e) }, { status: 500 });
  }
}
