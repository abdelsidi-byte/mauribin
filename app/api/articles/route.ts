import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FLAG_MAP: Record<string, string> = {
  "Belgium": "🇧🇪", "Iran": "🇮🇷", "Spain": "🇪🇸", "Saudi Arabia": "🇸🇦",
  "Tunisia": "🇹🇳", "Japan": "🇯🇵", "Germany": "🇩🇪", "Ivory Coast": "🇨🇮",
  "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Turkey": "🇹🇷", "Paraguay": "🇵🇾",
  "Brazil": "🇧🇷", "Morocco": "🇲🇦", "USA": "🇺🇸", "Australia": "🇦🇺",
  "Mexico": "🇲🇽", "Korea Republic": "🇰🇷", "Argentina": "🇦🇷", "France": "🇫🇷",
  "Portugal": "🇵🇹", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Italy": "🇮🇹", "Croatia": "🇭🇷",
};

const TEAM_NAMES_AR: Record<string, string> = {
  "Belgium": "بلجيكا", "Iran": "إيران", "Spain": "إسبانيا", "Saudi Arabia": "السعودية",
  "Tunisia": "تونس", "Japan": "اليابان", "Germany": "ألمانيا", "Ivory Coast": "ساحل العاج",
  "Netherlands": "هولندا", "Sweden": "السويد", "Turkey": "تركيا", "Paraguay": "باراغواي",
  "Brazil": "البرازيل", "Morocco": "المغرب", "USA": "أمريكا", "Australia": "أستراليا",
  "Mexico": "المكسيك", "Korea Republic": "كوريا الجنوبية", "Argentina": "الأرجنتين",
  "France": "فرنسا", "Portugal": "البرتغال", "England": "إنجلترا", "Italy": "إيطاليا",
};

export async function GET() {
  try {
    const res = await fetch("https://www.kickxoff.com/news", {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 1800 },
    });
    const html = await res.text();

    // Extract article links
    const linkRe = /href="/news/([^"]+)"/g;
    const links: string[] = [];
    let lm;
    while ((lm = linkRe.exec(html)) !== null) {
      const slug = lm[1];
      if (!links.includes(slug) && slug.length > 5) {
        links.push(slug);
      }
    }

    // Take first 9 articles
    const articles = links.slice(0, 9).map((slug) => {
      // Extract title from slug
      const titleFromSlug = slug.replace(/-/g, " ").replace(/\w/g, (c) => c.toUpperCase());
      const homeTeam = Object.keys(TEAM_NAMES_AR).find((t) => slug.includes(t.toLowerCase().replace(" ", "-")));
      const awayTeam = Object.keys(TEAM_NAMES_AR).find((t) => t !== homeTeam && slug.includes(t.toLowerCase().replace(" ", "-")));

      return {
        slug,
        title: titleFromSlug,
        homeTeam: homeTeam ? TEAM_NAMES_AR[homeTeam] : null,
        awayTeam: awayTeam ? TEAM_NAMES_AR[awayTeam] : null,
        homeFlag: homeTeam ? FLAG_MAP[homeTeam] : "🏳️",
        awayFlag: awayTeam ? FLAG_MAP[awayTeam] : "🏳️",
        sourceUrl: `https://www.kickxoff.com/news/${slug}`,
        source: "KickXoff",
      };
    });

    return NextResponse.json({ articles, count: articles.length });
  } catch (err) {
    return NextResponse.json({ error: "فشل في جلب الأخبار" }, { status: 500 });
  }
}
