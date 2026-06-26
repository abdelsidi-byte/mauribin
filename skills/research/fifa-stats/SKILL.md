---
name: fifa-worldcup-stats
description: Use when fetching FIFA World Cup 2026 statistics, team data, standings, or match stats from ESPN's public API. Scrapes fifa.com when API unavailable.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [fifa, worldcup, football, statistics, api, espn]
    related_skills: [mauribin, news-lookup-rss, blogwatcher]
---

# FIFA World Cup 2026 Statistics

## Overview

Fetch FIFA World Cup 2026 data using ESPN's free public API (no key required). FIFA's own API (`api.fifa.com`) is often blocked/DNS-failed from servers, so ESPN is the reliable fallback.

## Working Endpoints

### Teams & Logos
```bash
curl -s "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams"
```
Returns all 48 teams with:
- `team.id` — ESPN team ID
- `team.displayName` — full name
- `team.abbreviation` — 3-letter code
- `team.logos[0].href` — team logo URL (500px)
- `team.color` — primary color hex

### Team Statistics
```bash
# Replace {id} with ESPN team ID
curl -s "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/{id}/statistics"
```

### Standings / Groups
```bash
curl -s "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/standings"
```

### Match Schedule
```bash
curl -s "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard"
```

### Match Details
```bash
# Replace {id} with match ID
curl -s "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event={id}"
```

## Quick Test
```bash
# Test all endpoints
curl -s "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Teams: {len(d[\"sports\"][0][\"leagues\"][0][\"teams\"])}')"
```

## Python Fetch Script

```python
#!/usr/bin/env python3
"""fetch_fifa_stats.py - Fetch FIFA WC 2026 data from ESPN API"""
import json, sys, urllib.request
from typing import Optional

BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world"

def fetch(endpoint: str) -> Optional[dict]:
    url = f"{BASE_URL}/{endpoint}"
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"ERROR fetching {url}: {e}", file=sys.stderr)
        return None

def get_teams() -> list:
    """Get all 48 teams with logos and colors."""
    data = fetch("teams")
    if not data:
        return []
    teams = data["sports"][0]["leagues"][0]["teams"]
    return [
        {
            "id": t["team"]["id"],
            "name": t["team"]["displayName"],
            "abbr": t["team"]["abbreviation"],
            "logo": t["team"]["logos"][0]["href"] if t["team"].get("logos") else "",
            "color": t["team"].get("color", "000000"),
        }
        for t in teams
    ]

def get_standings() -> dict:
    """Get group standings."""
    data = fetch("standings")
    if not data:
        return {}
    # Structure varies - inspect output
    return data

def get_team_stats(team_id: str) -> dict:
    """Get detailed team statistics."""
    return fetch(f"teams/{team_id}/statistics") or {}

if __name__ == "__main__":
    print("=== FIFA WC 2026 Teams ===")
    teams = get_teams()
    for t in teams[:5]:
        print(f"  {t['abbr']}: {t['name']} ({t['id']})")
    print(f"  ... +{len(teams)-5} more")
```

## Common Issues

1. **DNS failure on api.fifa.com** — Normal from servers. Use ESPN API instead.
2. **CORS errors** — API returns JSON, use server-side fetch only.
3. **Empty response** — Check `sports[0].leagues[0].teams` path in response.
4. **Team IDs differ from FIFA IDs** — ESPN IDs are different; use displayName for matching.

## Fallback: Scrape fifa.com

If API fails, use curl + grep for basic data:
```bash
curl -sL "https://www.fifa.com/ar/tournaments/mens/worldcup/canadamexicousa2026" | grep -oP '"name":"[^"]+"' | head -20
```
Note: fifa.com is JS-rendered — curl only gets shell HTML.

## Verification
- [ ] ESPN teams endpoint returns 48 teams
- [ ] Team logos are accessible URLs (PNG format)
- [ ] Colors are valid hex codes
- [ ] Standings endpoint returns group data
