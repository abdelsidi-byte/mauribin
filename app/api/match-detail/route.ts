import { NextResponse } from "next/server";
import { MATCH_DATA, localizeTeam, getFlag } from "@/app/match/[id]/matchData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";

  const match = MATCH_DATA.find(m => {
    if (m.slug?.toLowerCase() === id.toLowerCase()) return true;
    if (m.id && String(m.id) === id) return true;
    return false;
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

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
    events: (match.events || []).map(ev => ({
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
