import { NextResponse } from "next/server";

const RSS_URLS = [
  "https://news.google.com/rss/search?q=World+Cup+2026&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en",
  "https://feeds.bbci.co.uk/sport/football/rss.xml",
];

function cleanHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractScore(text: string): string | null {
  const pattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(\d+)[-–](\d+)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
  const match = pattern.exec(text);
  if (match) {
    return `${match[1]} ${match[2]}-${match[3]} ${match[4]}`;
  }
  return null;
}

async function translateToArabic(text: string): Promise<string> {
  try {
    const clean = cleanHtml(text).slice(0, 200);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|ar`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const result = data?.responseData?.translatedText || "";
    if (result && result.length > 3) return result;
    return text;
  } catch {
    return text;
  }
}

async function fetchRss(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 }
    });
    const xml = await res.text();

    const items: any[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemXml = match[1];
      const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(itemXml);
      const linkMatch = /<link[^>]*>([\s\S]*?)<\/link>/i.exec(itemXml);
      const pubMatch = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i.exec(itemXml);

      const title = titleMatch ? cleanHtml(titleMatch[1]) : "";
      const link = linkMatch ? linkMatch[1] : "";
      const pubDate = pubMatch ? cleanHtml(pubMatch[1]) : "";
      const score = extractScore(title);

      if (title && link) {
        items.push({ title, link, pubDate, score });
      }
    }

    return items;
  } catch (e) {
    console.error("RSS fetch error:", e);
    return [];
  }
}

export async function GET() {
  const allNews: any[] = [];

  const results = await Promise.all(RSS_URLS.map(fetchRss));
  for (const items of results) {
    allNews.push(...items);
  }

  // Deduplicate by title
  const seen = new Set<string>();
  const unique = allNews.filter(item => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: scores first
  unique.sort((a, b) => {
    if (a.score && !b.score) return -1;
    if (!a.score && b.score) return 1;
    return 0;
  });

  const news = unique.slice(0, 20);

  // Translate titles to Arabic
  const translated = await Promise.all(
    news.map(async (item) => ({
      ...item,
      titleAr: await translateToArabic(item.title),
    }))
  );

  return NextResponse.json({
    news: translated,
    total: translated.length,
    scoresFound: translated.filter(n => n.score).length,
    updated: new Date().toISOString()
  });
}
