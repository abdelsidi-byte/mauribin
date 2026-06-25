import { NextResponse } from "next/server";
import { calculateStandings } from "@/lib/standings";
import { fetchScores } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const scoresData = await fetchScores();
    const standings = calculateStandings(scoresData.matches);
    return NextResponse.json({ standings });
  } catch (e) {
    console.error("Standings calculation failed:", e);
    return NextResponse.json({ standings: [], error: "Failed to calculate" }, { status: 500 });
  }
}