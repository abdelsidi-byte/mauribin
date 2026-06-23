import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { home, away, homeScore, awayScore, state, label } = body;
    
    if (!home || !away) {
      return NextResponse.json({ error: "Missing home or away team" }, { status: 400 });
    }

    // Log the update request (for debugging)
    console.log("📝 Score Update:", { home, away, homeScore, awayScore, state, label });

    return NextResponse.json({
      success: true,
      message: `Updated: ${home} ${homeScore}-${awayScore} ${away}`,
      data: { home, away, homeScore, awayScore, state, label },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  // Simple update via query params for easy testing
  const { searchParams } = new URL(request.url);
  const home = searchParams.get("home");
  const away = searchParams.get("away");
  const homeScore = searchParams.get("homeScore");
  const awayScore = searchParams.get("awayScore");
  const state = searchParams.get("state") || "live";

  if (!home || !away) {
    return NextResponse.json({
      usage: "POST /api/update-scores",
      example: {
        home: "France",
        away: "Iraq",
        homeScore: 2,
        awayScore: 1,
        state: "live",
        label: "مباشر"
      }
    });
  }

  console.log("📝 Score Update (GET):", { home, away, homeScore, awayScore, state });

  return NextResponse.json({
    success: true,
    message: `Updated: ${home} ${homeScore}-${awayScore} ${away}`,
    data: { home, away, homeScore, awayScore, state },
    timestamp: new Date().toISOString(),
  });
}
