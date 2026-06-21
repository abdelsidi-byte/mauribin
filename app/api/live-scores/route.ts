import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FLAG_MAP: Record<string, string> = {
  "Belgium": "🇧🇪", "Iran": "🇮🇷", "Spain": "🇪🇸", "Saudi Arabia": "🇸🇦",
  "Tunisia": "🇹🇳", "Japan": "🇯🇵", "Ecuador": "🇪🇨", "Curaçao": "🇨🇼",
  "Germany": "🇩🇪", "Ivory Coast": "🇨🇮", "Netherlands": "🇳🇱", "Sweden": "🇸🇪",
  "Turkey": "🇹🇷", "Paraguay": "🇵🇾", "Brazil": "🇧🇷", "Haiti": "🇭🇹",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Morocco": "🇲🇦", "USA": "🇺🇸", "Australia": "🇦🇺",
  "Mexico": "🇲🇽", "Korea Republic": "🇰🇷", "Uruguay": "🇺🇾", "Cape Verde": "🇨🇻",
  "New Zealand": "🇳🇿", "Egypt": "🇪🇬", "Argentina": "🇦🇷", "Austria": "🇦🇹",
  "France": "🇫🇷", "Iraq": "🇮🇶", "Portugal": "🇵🇹", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Norway": "🇳🇴", "Nigeria": "🇳🇬", "South Africa": "🇿🇦",
};

export async function GET() {
  try {
    const res = await fetch("https://www.kickxoff.com", {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });
    const html = await res.text();

    const re = /\\"home\\":\\"([^\\]+)\\",\\"away\\":\\"([^\\]+)\\",\\"homeScore\\":(\d+|null),\\"awayScore\\":(\d+|null),\\"state\\":\\"([^\\]+)\\",\\"label\\":\\"([^\\]+)\\",\\"utcDate\\":\\"([^\\]+)\\"/g;
    const matches = [];
    let m;
    while ((m = re.exec(html)) !== null) {
      const home = m[1], away = m[2];
      const homeScore = m[3] === "null" ? null : parseInt(m[3]);
      const awayScore = m[4] === "null" ? null : parseInt(m[4]);
      const state = m[5], label = m[6], utcDate = m[7];

      matches.push({
        home, away,
        homeFlag: FLAG_MAP[home] || "🏳️",
        awayFlag: FLAG_MAP[away] || "🏳️",
        homeScore, awayScore,
        state, label, utcDate,
      });
    }

    return NextResponse.json({ matches, updated: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: "فشل في جلب النتائج" }, { status: 500 });
  }
}
