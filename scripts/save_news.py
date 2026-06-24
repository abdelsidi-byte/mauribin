#!/usr/bin/env python3
"""
⚽ Mauribin News Fetcher
Fetches World Cup + Football news, saves to public/news_data.json
Runs every 30 min via cron job.
"""
import json
import os
import re
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime
from pathlib import Path

# Paths
MAURIBIN_DIR = Path("/home/ubuntu/mauribin")
NEWS_FILE = MAURIBIN_DIR / "public" / "news_data.json"
CACHE_FILE = Path(os.path.expanduser("~/.hermes/cache/mauribin-news-cache.json"))
IMG_DIR = Path("/tmp/mauribin-news-images")

# Discord webhook for alerts (optional)
DISCORD_WEBHOOK = None  # Will use hermes send instead

RSS_URLS = [
    "https://news.google.com/rss/search?q=World+Cup+2026&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=World+Cup+2026+results&hl=en-US&gl=US&ceid=US:en",
    "https://feeds.bbci.co.uk/sport/football/rss.xml",
]


def load_cached_titles():
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, 'r') as f:
                data = json.load(f)
                return set(data.get('titles', []))
        except Exception:
            return set()
    return set()


def save_cached_titles(titles):
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE_FILE, 'w') as f:
        json.dump({'titles': list(titles), 'last_update': datetime.now().isoformat()}, f)


def clean_html(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&quot;', '"').replace('&#39;', "'").replace('&apos;', "'")
    return text.strip()


def extract_score(text):
    """Extract score pattern: Team X-Y Team"""
    pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(\d+)[-–](\d+)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b'
    match = re.search(pattern, text)
    if match:
        return f"{match.group(1)} {match.group(2)}-{match.group(3)} {match.group(4)}"
    return None


def fetch_rss(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            xml_data = response.read().decode('utf-8')

        items = []
        item_matches = re.findall(r'<item>([\s\S]*?)</item>', xml_data)
        for item_xml in item_matches[:10]:
            title_match = re.search(r'<title[^>]*>([\s\S]*?)</title>', item_xml)
            link_match = re.search(r'<link[^>]*>([\s\S]*?)</link>', item_xml)
            pub_match = re.search(r'<pubDate[^>]*>([\s\S]*?)</pubDate>', item_xml)

            title = clean_html(title_match.group(1)) if title_match else ""
            link = link_match.group(1).strip() if link_match else ""
            pub = clean_html(pub_match.group(1)) if pub_match else ""

            if title and link:
                score = extract_score(title)
                items.append({
                    'title': title,
                    'link': link,
                    'pubDate': pub,
                    'score': score,
                })
        return items
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []


def translate_to_arabic(text):
    """Translate to Arabic using MyMemory API"""
    try:
        clean = re.sub(r'<[^>]+>', '', text).strip()[:300]
        if not clean:
            return text
        url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(clean)}&langpair=en|ar"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            result = data.get('responseData', {}).get('translatedText', '')
            if result and len(result) > 3:
                return result
            return text
    except Exception:
        return text


def send_to_hermes(channel, message):
    """Send message via hermes CLI"""
    try:
        import subprocess
        result = subprocess.run(
            ['hermes', 'send', '-t', f'discord:{channel}', message],
            capture_output=True, timeout=10
        )
        return result.returncode == 0
    except Exception:
        return False


def main():
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    MAURIBIN_DIR.mkdir(parents=True, exist_ok=True)

    cached_titles = load_cached_titles()

    # Fetch from all RSS sources
    all_items = []
    for url in RSS_URLS:
        items = fetch_rss(url)
        all_items.extend(items)

    # Remove duplicates by title
    seen_titles = set()
    unique_items = []
    for item in all_items:
        title_lower = item['title'].lower()
        if title_lower not in seen_titles:
            seen_titles.add(title_lower)
            unique_items.append(item)

    # Sort: scores first
    unique_items.sort(key=lambda x: x.get('score') is None)

    # Keep top 20
    news = unique_items[:20]

    # New items count
    new_items = [n for n in news if n['title'] not in cached_titles]
    new_count = len(new_items)

    # Save to public/news_data.json
    data = {
        "news": news,
        "total": len(news),
        "scoresFound": sum(1 for n in news if n.get('score')),
        "updated": datetime.now().isoformat(),
    }

    with open(NEWS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[{datetime.now().isoformat()}] Saved {len(news)} items to {NEWS_FILE}")
    print(f"  - Scores: {data['scoresFound']}")
    print(f"  - New: {new_count}")

    # Update cache
    all_titles = cached_titles | set(n['title'] for n in news)
    if len(all_titles) > 100:
        all_titles = set(list(all_titles)[-100:])
    save_cached_titles(all_titles)

    # Optional: send new items to Discord
    if new_count > 0 and new_count <= 5:
        lines = [f"📰 *Mauribin - آخر الأخبار* | {datetime.now().strftime('%H:%M')}\n"]
        lines.append(f"📊 {len(news)} خبر | ⚽ {data['scoresFound']} نتيجة\n")
        lines.append("━" * 30)
        for item in new_items[:5]:
            title_ar = translate_to_arabic(item['title'])
            if item.get('score'):
                lines.append(f"⚽ **{item['score']}**")
            lines.append(f"📰 {title_ar}")
        msg = "\n".join(lines)
        # Send to the news Discord channel
        send_to_hermes("1506310609090646066", msg)


if __name__ == '__main__':
    main()
