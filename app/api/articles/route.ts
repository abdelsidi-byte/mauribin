import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchBBCArabicSports(): Promise<any[]> {
  try {
    const xml = await fetch(
      "https://feeds.bbci.co.uk/arabic/sports/rss.xml",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());

    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;

    let count = 0;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && count < 15) {
      const item = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/i.exec(item);
      const linkMatch = /<link>(.*?)<\/link>/i.exec(item);
      const catMatch = /<category><!\[CDATA\[(.*?)\]\]><\/category>/i.exec(item);
      const descMatch = /<description><!\[CDATA\[(.*?)\]\]><\/description>/i.exec(item);

      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim(),
          category: catMatch ? catMatch[1].trim() : "رياضة",
          description: descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "",
          url: linkMatch[1].trim(),
          source: "BBC العربية",
          imageUrl: null,
        });
        count++;
      }
    }

    return items;
  } catch (e) {
    console.error("BBC Arabic error:", e);
    return [];
  }
}

export async function GET() {
  const articles = await fetchBBCArabicSports();
  return NextResponse.json(
    { articles, count: articles.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
