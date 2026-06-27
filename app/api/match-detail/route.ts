import { NextResponse } from "next/server";
import { MATCH_FIXTURE_IDS, getSlug } from "@/lib/fixtureIds";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

const TEAM_NAME_MAP: Record<string, string> = {
  "Mexico":"المكسيك","South Korea":"كوريا الجنوبية","South Africa":"جنوب أفريقيا",Czechia:"التشيك",
  "Canada":"كندا",Switzerland:"سويسرا",Qatar:"قطر","Bosnia-Herzegovina":"البوسنة والهرسك",
  Brazil:"البرازيل",Morocco:"المغرب",Scotland:"أسكتلندا",Haiti:"هايتي",
  USA:"الولايات المتحدة",Australia:"أستراليا",Paraguay:"باراغواي",Turkey:"تركيا",
  Germany:"ألمانيا","Ivory Coast":"ساحل العاج",Ecuador:"الإكوادور",Curaçao:"كوراساو",
  Netherlands:"هولندا",Sweden:"السويد",Japan:"اليابان",Tunisia:"تونس",
  Belgium:"بلجيكا",Iran:"إيران",Egypt:"مصر","New Zealand":"نيوزيلندا",
  Spain:"إسبانيا",Uruguay:"أوروغواي","Saudi Arabia":"السعودية","Cape Verde":"الرأس الأخضر",
  France:"فرنسا",Norway:"النرويج",Senegal:"السنغال",Iraq:"العراق",
  Argentina:"الأرجنتين",Austria:"النمسا",Algeria:"الجزائر",Jordan:"الأردن",
  Portugal:"البرتغال",Colombia:"كولومبيا","DR Congo":"الكونغو",Uzbekistan:"أوزبكستان",
  England:"إنجلترا",Croatia:"كرواتيا",Ghana:"غانا",Panama:"بنما",
};

const FLAG_MAP: Record<string, string> = {
  Belgium:"🇧🇪",Iran:"🇮🇷",Spain:"🇪🇸","Saudi Arabia":"🇸🇦",Tunisia:"🇹🇳",Japan:"🇯🇵",Ecuador:"🇪🇨","Cape Verde":"🇨🇻",
  Germany:"🇩🇪","Ivory Coast":"🇨🇮","Côte d'Ivoire":"🇨🇮",Netherlands:"🇳🇱",Sweden:"🇸🇪",Paraguay:"🇵🇾",
  Brazil:"🇧🇷",Haiti:"🇭🇹",Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",Morocco:"🇲🇦",
  USA:"🇺🇸","United States":"🇺🇸",Australia:"🇦🇺",Mexico:"🇲🇽","South Korea":"🇰🇷","New Zealand":"🇳🇿",
  Egypt:"🇪🇬",Argentina:"🇦🇷",Austria:"🇦🇹",France:"🇫🇷",Iraq:"🇮🇶",Norway:"🇳🇴",Senegal:"🇸🇳",Uruguay:"🇺🇾",
  England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Italy:"🇮🇹",Portugal:"🇵🇹",Switzerland:"🇨🇭",Croatia:"🇭🇷",
  "Bosnia-Herzegovina":"🇧🇦","Bosnia and Herzegovina":"🇧🇦","Bosnia":"🇧🇦",
  "Curaçao":"🇨🇼","DR Congo":"🇨🇩",Qatar:"🇶🇦",Jordan:"🇯🇴",Uzbekistan:"🇺🇿",
  Ghana:"🇬🇭",Algeria:"🇩🇿",Colombia:"🇨🇴",Panama:"🇵🇦",
};

function getFlag(name: string): string { return FLAG_MAP[name] || "🏳️"; }
function localize(name: string): string { return TEAM_NAME_MAP[name] || name; }

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    return `${days[d.getUTCDay()]} ${d.getUTCHours().toString().padStart(2,"0")}:${d.getUTCMinutes().toString().padStart(2,"0")} ت ع`;
  } catch { return iso; }
}

function getEventIcon(type: string, detail: string): string {
  const icons: Record<string, string> = {
    "goal":"⚽","Goal":"⚽","1st-half-goal":"⚽","2nd-half-goal":"⚽",
    "yellow-card":"🟨","Yellow Card":"🟨","caution":"🟨",
    "red-card":"🟥","Red Card":"🟥","sending-off":"🟥",
    "substitution":"🔄","Substitution":"🔄",
    "kickoff":"▶️","Kickoff":"▶️","start-2nd-half":"▶️",
    "halftime":"⏸️","Halftime":"⏸️",
    "full-time":"🏁","end-regular-time":"🏁",
    "penalty-shootout":"🎯",
  };
  return icons[type] || icons[detail] || "•";
}

function getEventType(e: any): string {
  if (!e.type) return "";
  if (typeof e.type === "string") return e.type;
  return e.type?.type || "";
}

// ─── ESPN Summary Fetch ────────────────────────────────────────────────────────
async function fetchFromESPN(eventId: string) {
  const url = `${ESPN_BASE}/summary?event=${eventId}`;
  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`ESPN HTTP ${res.status}`);
  return res.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // ─── Resolve eventId ──────────────────────────────────────────────────────
  let eventId: string | null = null;
  let homeName = "";
  let awayName = "";

  if (/^\d+$/.test(id)) {
    eventId = id;
  } else {
    // slug: france-vs-norway → find in MATCH_FIXTURE_IDS
    const parts = id.toLowerCase().split("-vs-");
    if (parts.length === 2) {
      for (const [key, fid] of Object.entries(MATCH_FIXTURE_IDS)) {
        const [h, a] = key.split("|");
        const hLower = h.toLowerCase().replace(/\s+/g, "-");
        const aLower = a.toLowerCase().replace(/\s+/g, "-");
        if (hLower === parts[0] || aLower === parts[1] || hLower.includes(parts[0]) || parts[0].includes(hLower)) {
          eventId = String(fid);
          homeName = h;
          awayName = a;
          break;
        }
      }
    }
  }

  if (!eventId) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  try {
    const data = await fetchFromESPN(eventId);

    // ─── Parse Header ─────────────────────────────────────────────────────
    const header = data.header || {};
    const headerComps = header.competitions || [];
    const competition = headerComps[0] || {};
    const competitors = competition.competitors || [];

    const homeComp = competitors.find((c: any) => c.homeAway === "home") || competitors[0];
    const awayComp = competitors.find((c: any) => c.homeAway === "away") || competitors[1];
    const hTeam = homeComp.team || {};
    const aTeam = awayComp.team || {};

    const originalHomeName = hTeam.displayName || homeName || "Home";
    const originalAwayName = aTeam.displayName || awayName || "Away";

    const home = {
      id: hTeam.id || 0,
      name: localize(originalHomeName),
      originalName: originalHomeName,
      logo: (hTeam.logos || [])[0]?.href || "",
      flag: getFlag(originalHomeName),
    };
    const away = {
      id: aTeam.id || 0,
      name: localize(originalAwayName),
      originalName: originalAwayName,
      logo: (aTeam.logos || [])[0]?.href || "",
      flag: getFlag(originalAwayName),
    };

    const homeScore = homeComp.score ?? 0;
    const awayScore = awayComp.score ?? 0;
    const statusType = competition.status?.type || {};
    const status = statusType.detail || statusType.description || "—";
    const statusShort = statusType.shortDetail || statusType.abbreviation || status;
    const elapsed = competition.timeSegment?.elapsed || 0;
    const date = competition.date || header.date || "";
    const venue = data.gameInfo?.venue?.fullName || competition.venue || "";

    const isLive = status === "1st Half" || status === "2nd Half" || status.includes("Half") || statusShort === "LIVE";
    const isFinished = status === "FT" || status === "Full Time";

    // ─── Parse Key Events (goals, cards) ─────────────────────────────────
    const events: any[] = [];
    const keyEvents = data.keyEvents || [];
    for (const event of keyEvents) {
      const eventType = getEventType(event);
      const clock = event.clock?.displayValue || event.time?.value || "";
      const text = event.text || eventType;
      const icon = getEventIcon(eventType, "");

      events.push({
        elapsed: parseInt(clock.replace("'", "")) || 0,
        minute: clock,
        team_name: localize(event.team?.displayName || ""),
        player: extractPlayer(text, eventType),
        assist: extractAssist(text),
        type: eventType,
        detail: text,
        icon,
      });
    }

    // ─── Parse Boxscore Statistics ─────────────────────────────────────────
    const statistics: any[] = [];
    const boxscore = data.boxscore || {};
    const teamsBox = boxscore.teams || [];
    for (const teamBox of teamsBox) {
      const stats = teamBox.statistics || [];
      for (const stat of stats) {
        statistics.push({
          teamId: teamBox.team?.id,
          teamName: localize(teamBox.team?.displayName || ""),
          type: stat.label || stat.name || "",
          home: stat.stats?.[0] ?? "—",
          away: stat.stats?.[1] ?? "—",
        });
      }
    }

    // Organize stats by type
    const statsMap: Record<string, { home: string; away: string }> = {};
    for (const s of statistics) {
      if (!statsMap[s.type]) statsMap[s.type] = { home: "—", away: "—" };
      if (s.teamId === home.id) statsMap[s.type].home = s.home;
      else statsMap[s.type].away = s.away;
    }

    const formattedStats = Object.entries(statsMap).map(([type, vals]) => ({
      type,
      home: vals.home,
      away: vals.away,
    }));

    // ─── Parse H2H (past meetings from competition) ───────────────────────
    // Use competition.brackets or past matches from same competition
    const h2h: any[] = [];
    const brackets = data.brackets || [];
    for (const bracket of brackets) {
      // look for same matchup in past
      // (simplified - can be extended)
    }

    // ─── Response ──────────────────────────────────────────────────────────
    return NextResponse.json({
      fixture_id: eventId,
      slug: getSlug(originalHomeName, originalAwayName),
      league: {
        id: 1,
        name: competition.name || "FIFA World Cup 2026",
        flag: "",
      },
      round: competition.round || "",
      date,
      venue,
      referee: "",
      home,
      away,
      status,
      statusShort,
      elapsed,
      homeScore,
      awayScore,
      isLive,
      isFinished,
      formattedDate: formatDate(date),
      statistics: formattedStats,
      events,
      lineups: [],
      h2h,
    });
  } catch (e: any) {
    console.error("[/api/match-detail]", e);
    return NextResponse.json({ error: "تعذر تحميل تفاصيل المباراة" }, { status: 500 });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function extractPlayer(text: string, type: string): string {
  if (type === "goal" || type === "1st-half-goal" || type === "2nd-half-goal") {
    // "Goal! Curaçao 0, Côte d'Ivoire 1. Nicolas Pépé (Côte d'Ivoire)"
    const m = text.match(/([A-Z][a-zà-ÿ]+ [A-Z][a-zà-ÿ]+)/);
    if (m) return m[1];
    // "Nicolas Pépé" pattern
    const m2 = text.match(/([A-Z][a-zà-ÿ]+ [A-Z][a-zà-ÿ]+)/);
    if (m2) return m2[1];
  }
  // For cards/substitutions, try to extract name after icon
  const parts = text.split(/\s+\d/);
  return parts[0]?.trim() || "";
}

function extractAssist(text: string): string {
  // Try "(assisted by X)" or "via X" patterns
  const m = text.match(/assisted by ([^.]+)/i) || text.match(/via ([^.]+)/i);
  return m ? m[1].trim() : "";
}
