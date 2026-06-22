#!/usr/bin/env python3
"""
Scrape World Cup 2026 match results from Wikipedia
Run via cron: 0 * * * * /home/ubuntu/mauribin/scripts/scrape_wc2026.py
"""
import json
import re
import sys
from datetime import datetime, timezone

try:
    from urllib.request import urlopen, Request
except ImportError:
    from urllib2 import urlopen, Request

WIKI_API = "https://en.wikipedia.org/w/api.php"
WIKI_PAGE = "2026_FIFA_World_Cup"
OUTPUT_FILE = "/home/ubuntu/mauribin/public/wc2026_scores.json"

FLAG_MAP = {
    "Argentina": "🇦🇷", "Austria": "🇦🇹", "Algeria": "🇩🇿", "Australia": "🇦🇺",
    "Belgium": "🇧🇪", "Bosnia and Herzegovina": "🇧🇦", "Brazil": "🇧🇷", "Canada": "🇨🇦",
    "Qatar": "🇶🇦", "Cape Verde": "🇨🇻", "Chile": "🇨🇱", "China": "🇨🇳",
    "Colombia": "🇨🇴", "Costa Rica": "🇨🇷", "Croatia": "🇭🇷", "Czech Republic": "🇨🇿",
    "Czechia": "🇨🇿", "Côte d'Ivoire": "🇨🇮", "DR Congo": "🇨🇩", "Ecuador": "🇪🇨",
    "Egypt": "🇪🇬", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "France": "🇫🇷", "Ghana": "🇬🇭",
    "Germany": "🇩🇪", "Greece": "🇬🇷", "Haiti": "🇭🇹", "Honduras": "🇭🇳",
    "India": "🇮🇳", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Italy": "🇮🇹",
    "Jamaica": "🇯🇲", "Japan": "🇯🇵", "Jordan": "🇯🇴", "South Korea": "🇰🇷",
    "Korea Republic": "🇰🇷", "Kuwait": "🇰🇼", "Morocco": "🇲🇦", "Mexico": "🇲🇽",
    "Netherlands": "🇳🇱", "New Zealand": "🇳🇿", "Nigeria": "🇳🇬", "North Korea": "🇰🇵",
    "Norway": "🇳🇴", "Oman": "🇴🇲", "Panama": "🇵🇦", "Paraguay": "🇵🇾",
    "Peru": "🇵🇪", "Poland": "🇵🇱", "Portugal": "🇵🇹", "Romania": "🇷🇴",
    "Saudi Arabia": "🇸🇦", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Senegal": "🇸🇳",
    "Serbia": "🇷🇸", "Slovakia": "🇸🇰", "Slovenia": "🇸🇮", "South Africa": "🇿🇦",
    "Spain": "🇪🇸", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Tunisia": "🇹🇳",
    "Türkiye": "🇹🇷", "Turkey": "🇹🇷", "Ukraine": "🇺🇦", "United States": "🇺🇸",
    "USA": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿", "Venezuela": "🇻🇪",
    "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Curaçao": "🇨🇼", "Iraq": "🇮🇶",
}

def get_flag(team: str) -> str:
    return FLAG_MAP.get(team, "🏳️")

def fetch_wiki_html():
    url = f"{WIKI_API}?action=parse&page={WIKI_PAGE}&prop=text&format=json&noimages=1"
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; Mauribin/1.0)"})
    with urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())
    return data["parse"]["text"]["*"]

def parse_scores(html):
    """Parse match scores from Wikipedia HTML"""
    matches = []
    
    # Try to find match tables
    # Look for patterns like: Team A 2–1 Team B (Group D)
    # or in table format with scores
    
    # Pattern for scorelines in text
    # e.g., "Argentina 2–1 Brazil"
    score_pattern = re.compile(
        r'<td[^>]*>([A-Z][a-z]+(?: [A-Z][a-z]+)*)</td><td[^>]*>(\d+)</td><td[^>]*>–</td><td[^>]*>(\d+)</td><td[^>]*>([A-Z][a-z]+(?: [A-Z][a-z]+)*)</td>',
        re.IGNORECASE
    )
    
    # Try table-based extraction
    tables = re.findall(r'<table[^>]*class="[^"]*football[^"]*"[^>]*>([\s\S]*?)</table>', html, re.IGNORECASE)
    
    match_index = 0
    for table in tables:
        rows = re.findall(r'<tr>([\s\S]*?)</tr>', table)
        for row in rows:
            cells = re.findall(r'<td[^>]*>([\s\S]*?)</td>', row, re.IGNORECASE)
            if len(cells) >= 5:
                home = re.sub(r'<[^>]+>', '', cells[0]).strip()
                away = re.sub(r'<[^>]+>', '', cells[4]).strip()
                try:
                    home_score = int(re.sub(r'<[^>]+>', '', cells[1]).strip())
                    away_score = int(re.sub(r'<[^>]+>', '', cells[3]).strip())
                    
                    if home and away and home not in ['', '-'] and away not in ['', '-']:
                        matches.append({
                            "home": home,
                            "away": away,
                            "homeFlag": get_flag(home),
                            "awayFlag": get_flag(away),
                            "homeScore": home_score,
                            "awayScore": away_score,
                            "state": "ft",
                            "label": "FT",
                            "utcDate": "",
                            "_index": match_index
                        })
                        match_index += 1
                except (ValueError, IndexError):
                    continue
    
    # Fallback: look for any score pattern in format X–Y or X-Y
    if not matches:
        alt_pattern = re.compile(
            r'([A-Z][a-z]+(?: [a-z]+)?)\s+(\d+)\s*[–\-]\s*(\d+)\s+([A-Z][a-z]+(?: [a-z]+)?)\s+\(([A-Z])',
            re.MULTILINE
        )
        for m in alt_pattern.finditer(html[:50000]):
            home = m.group(1).strip()
            away = m.group(4).strip()
            try:
                matches.append({
                    "home": home,
                    "away": away,
                    "homeFlag": get_flag(home),
                    "awayFlag": get_flag(away),
                    "homeScore": int(m.group(2)),
                    "awayScore": int(m.group(3)),
                    "state": "ft",
                    "label": "FT",
                    "utcDate": "",
                    "_index": match_index
                })
                match_index += 1
            except ValueError:
                continue
    
    return matches

def main():
    print(f"[{datetime.now(timezone.utc).isoformat()}] Scraping Wikipedia for WC2026 scores...")
    
    try:
        html = fetch_wiki_html()
        matches = parse_scores(html)
        print(f"Found {len(matches)} match results")
        
        for m in matches[:5]:
            print(f"  {m['home']} {m['homeScore']}-{m['awayScore']} {m['away']}")
        
        # Save to public folder (Next.js serves static files from /public)
        output = {
            "matches": matches,
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "source": "Wikipedia"
        }
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        print(f"Saved to {OUTPUT_FILE}")
        
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
