import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matches } = body;

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Save to a JSON file that will be used as data source
    const dataPath = path.join(process.cwd(), "data", "scores.json");
    
    // Ensure data directory exists
    const dataDir = path.dirname(dataPath);
    try {
      require("fs").mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    // Save the updated matches
    writeFileSync(dataPath, JSON.stringify({ matches, updatedAt: new Date().toISOString() }, null, 2));

    return NextResponse.json({ success: true, message: "Scores updated" });
  } catch (error) {
    console.error("Error saving scores:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
