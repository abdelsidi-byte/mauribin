import { NextResponse } from "next/server";
import { MATCH_DATA, localizeTeam, getFlag } from "@/app/match/[id]/matchData";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Find in matchData first (has embedded stats)
  const match = MATCH_DATA.find(m => {
    if (m.slug?.toLowerCase() === id.toLowerCase()) return true;
    if (m.id && String(m.id) === id) return true;
    if (m.espnId === id) return true;
    return false;
  });

  if (match) {
    const home = {
      name: localizeTeam(match.home),
      originalName: match.home,
      flag: getFlag(match.home),
      logo: "",
    };
    const away = {
      name: localizeTeam(match.away),
      originalName: match.away,
      flag: getFlag(match.away),
      logo: "",
    };
    const isLive = match.state === "live";
    const isFinished = match.state === "ft";
    const isUpcoming = match.state === "upcoming";

    return NextResponse.json({
      fixture_id: match.id || 0,
      espnId: match.espnId || String(match.id || ""),
      slug: match.slug,
      league: { id: 1, name: match.league || "كأس العالم 2026", flag: "" },
      round: match.group || "",
      date: match.date || "",
      venue: match.venue || "",
      referee: "",
      home,
      away,
      status: isLive ? "1st Half" : isFinished ? "FT" : isUpcoming ? "Scheduled" : "",
      statusShort: match.state === "ft" ? "FT" : match.state === "live" ? "LIVE" : match.state,
      elapsed: match.elapsed || 0,
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
      isLive,
      isFinished,
      isUpcoming,
      formattedDate: match.label || match.date || "",
      statistics: Object.entries(match.stats || {}).map(([type, vals]) => ({
        type,
        home: (vals as any).home,
        away: (vals as any).away,
      })),
      events: (match.events || []).map((ev: any) => ({
        elapsed: parseInt(ev.minute) || 0,
        minute: ev.minute,
        team_name: localizeTeam(ev.team === "home" ? match.home : match.away),
        player: ev.player,
        assist: ev.assist || "",
        type: ev.type,
        detail: ev.player,
        icon: ev.type === "goal" ? "⚽" : ev.type === "yellow-card" ? "🟨" : ev.type === "red-card" ? "🟥" : "•",
      })),
      lineups: [],
      h2h: [],
    });
  }

  // Fallback: try ESPN scoreboard API
  try {
    const ESPN_API = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
    const res = await fetch(ESPN_API, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`ESPN error: ${res.status}`);

    const data = await res.json();
    const events = data.events || [];
    const event = events.find((e: any) => String(e.id) === id);

    if (!event) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const comp = event.competitions?.[0] || {};
    const statusType = comp.status?.type || {};
    const competitors = comp.competitors || [];
    const home = competitors.find((c: any) => c.homeAway === "home");
    const away = competitors.find((c: any) => c.homeAway === "away");

    return NextResponse.json({
      fixture_id: event.id,
      espnId: event.id,
      slug: event.name?.toLowerCase().replace(/\s+/g, "-"),
      league: { id: 1, name: "كأس العالم 2026", flag: "" },
      round: comp.round || "",
      date: event.date,
      venue: comp.venue?.fullName || "",
      referee: "",
      home: {
        name: home?.team?.displayName || "Home",
        originalName: home?.team?.displayName || "Home",
        flag: "",
        logo: home?.team?.logos?.[0]?.href || "",
      },
      away: {
        name: away?.team?.displayName || "Away",
        originalName: away?.team?.displayName || "Away",
        flag: "",
        logo: away?.team?.logos?.[0]?.href || "",
      },
      status: statusType.detail || "",
      statusShort: statusType.state || "",
      elapsed: statusType.clock?.value || 0,
      homeScore: parseInt(home?.score || "0"),
      awayScore: parseInt(away?.score || "0"),
      isLive: statusType.state === "in",
      isFinished: statusType.state === "post",
      isUpcoming: statusType.state === "pre",
      formattedDate: event.date || "",
      statistics: [],
      events: (comp.plays || []).slice(0, 20).map((play: any) => ({
        elapsed: play.clock?.value || 0,
        minute: play.clock?.displayValue || "",
        team_name: play.team?.displayName || "",
        player: play.athletesInvolved?.[0]?.displayName || play.text || "",
        type: play.type?.toLowerCase() || "",
        detail: play.text || "",
        icon: play.type?.toLowerCase()?.includes("goal") ? "⚽" : "•",
      })),
      lineups: [],
      h2h: [],
    });
  } catch (err) {
    console.error("[/api/match-detail/id]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
