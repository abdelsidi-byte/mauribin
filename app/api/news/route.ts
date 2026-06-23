import { NextResponse } from "next/server";

const RSS_URLS = [
  "https://news.google.com/rss/search?q=World+Cup+2026&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=World+Cup+2026+results&hl=en-US&gl=US&ceid=US:en",
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
  // Pattern: TeamName X-Y TeamName
  const pattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(\d+)[-–](\d+)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
  const match = pattern.exec(text);
  if (match) {
    return `${match[1]} ${match[2]}-${match[3]} ${match[4]}`;
  }
  return null;
}

async function fetchRss(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 } // Cache 5 min
    });
    const xml = await res.text();
    
    // Simple XML parsing
    const items: any[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      const itemXml = match[1];
      const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(itemXml);
      const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(itemXml);
      const pubMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemXml);
      
      const title = titleMatch ? cleanHtml(titleMatch[1]) : "";
      const link = linkMatch ? linkMatch[1] : "";
      const pubDate = pubMatch ? cleanHtml(pubMatch[1]) : "";
      const score = extractScore(title);
      
      items.push({ title, link, pubDate, score });
    }
    
    return items;
  } catch (e) {
    console.error("RSS fetch error:", e);
    return [];
  }
}

export async function GET() {
  const allNews: any[] = [];
  
  // Fetch from all RSS sources
  const results = await Promise.all(RSS_URLS.map(fetchRss));
  for (const items of results) {
    allNews.push(...items);
  }
  
  // Sort: items with scores first
  allNews.sort((a, b) => {
    if (a.score && !b.score) return -1;
    if (!a.score && b.score) return 1;
    return 0;
  });
  
  // Take top 20
  const news = allNews.slice(0, 20);
  
  return NextResponse.json({
    news,
    total: news.length,
    scoresFound: news.filter(n => n.score).length,
    updated: new Date().toISOString()
  });
}
