/**
 * World Cup 2026 Data Service
 * Fetches from OpenFootball/worldcup.json on GitHub
 * https://github.com/openfootball/worldcup.json
 */

import { createClient } from "@supabase/supabase-js";

// Supabase config - using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026";

// Types
export interface Team {
  name: string;
  flag_icon: string;
  nickname?: string;
}

export interface Goal {
  name: string;
  minute: number;
}

export interface Match {
  id: string;
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score?: { ft: number[]; ht: number[] };
  goals1?: Goal[];
  goals2?: Goal[];
  group?: string;
  ground: string;
  homeScore: number | null;
  awayScore: number | null;
  state: "upcoming" | "live" | "ft";
  label: string;
  team1Flag?: string;
  team2Flag?: string;
}

export interface GroupStanding {
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

// Fetch teams from GitHub
export async function fetchTeams(): Promise<Team[]> {
  try {
    const response = await fetch(`${GITHUB_RAW_BASE}/worldcup.teams.json`);
    if (!response.ok) throw new Error("Failed to fetch teams");
    return await response.json();
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// Fetch matches from GitHub
export async function fetchMatches(): Promise<any[]> {
  try {
    const response = await fetch(`${GITHUB_RAW_BASE}/worldcup.json`);
    if (!response.ok) throw new Error("Failed to fetch matches");
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

// Parse match state from date/time
function parseMatchState(date: string, time: string): { state: "upcoming" | "live" | "ft"; label: string } {
  const now = new Date();
  
  // Parse time like "13:00 UTC-6" or "19:00 UTC"
  const timeStr = time || "12:00 UTC";
  const tzMatch = timeStr.match(/(\d+):(\d+)\s*UTC([+-])(\d+)/);
  let matchDate: Date;
  
  if (tzMatch) {
    const hours = parseInt(tzMatch[1]);
    const mins = parseInt(tzMatch[2]);
    const sign = tzMatch[3] === "+" ? 1 : -1;
    const offset = parseInt(tzMatch[4]);
    const utcHours = hours + (sign * offset);
    
    matchDate = new Date(date + "T00:00:00Z");
    matchDate.setUTCHours(utcHours, mins, 0, 0);
  } else {
    matchDate = new Date(`${date}T${timeStr.replace(" UTC", "")}Z`);
  }
  
  const isPast = matchDate < now;
  const diffHours = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isLive = diffHours >= -2 && diffHours <= 0;
  
  if (isPast) {
    return { state: "ft", label: "انتهت" };
  }
  
  if (isLive) {
    return { state: "live", label: "مباشر" };
  }
  
  return { state: "upcoming", label: matchDate.toLocaleDateString("ar-MR", { weekday: "long", hour: "2-digit", minute: "2-digit" }) };
}

// Parse matches into standard format
export async function parseMatches(): Promise<Match[]> {
  const teams = await fetchTeams();
  const rawMatches = await fetchMatches();
  
  const teamMap = new Map(teams.map(t => [t.name, t]));
  
  // Parse matches
  const now = new Date();
  const parsedMatches = rawMatches.map((m: any, index: number) => {
    // Parse time like "13:00 UTC-6" or "19:00 UTC"
    const timeStr = m.time || "12:00 UTC";
    const tzMatch = timeStr.match(/(\d+):(\d+)\s*UTC([+-])(\d+)/);
    let matchDate: Date;
    let isPast: boolean;
    let isLive: boolean;
    
    if (tzMatch) {
      const hours = parseInt(tzMatch[1]);
      const mins = parseInt(tzMatch[2]);
      const sign = tzMatch[3] === "+" ? 1 : -1;
      const offset = parseInt(tzMatch[4]);
      const utcHours = hours + (sign * offset);
      
      matchDate = new Date(m.date + "T00:00:00Z");
      matchDate.setUTCHours(utcHours, mins, 0, 0);
    } else {
      matchDate = new Date(`${m.date}T${timeStr.replace(" UTC", "")}Z`);
    }
    
    isPast = matchDate < now;
    const diffHours = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    isLive = diffHours >= -2 && diffHours <= 0;
    
    const team1Data = teamMap.get(m.team1) as any;
    const team2Data = teamMap.get(m.team2) as any;
    
    return {
      id: `${m.date}-${m.team1}-vs-${m.team2}`.toLowerCase().replace(/\s+/g, "-"),
      round: m.round,
      date: m.date,
      time: m.time,
      team1: m.team1,
      team2: m.team2,
      group: m.group,
      ground: m.ground,
      homeScore: m.score?.ft?.[0] ?? null,
      awayScore: m.score?.ft?.[1] ?? null,
      goals1: m.goals1 || [],
      goals2: m.goals2 || [],
      state: (isPast ? "ft" : isLive ? "live" : "upcoming") as "ft" | "live" | "upcoming",
      label: isPast ? "انتهت" : isLive ? "مباشر" : "قادم",
      team1Flag: team1Data?.flag_icon || "🏳️",
      team2Flag: team2Data?.flag_icon || "🏳️",
    };
  });
  
  return parsedMatches;
}

// Create matches table in Supabase
export async function createMatchesTable(): Promise<void> {
  if (!supabase) return;
  
  // Table creation requires raw SQL via RPC or we can just ensure the table exists via insert
  // For now, skip table creation - we'll rely on upsert to create it
  console.log("createMatchesTable: Supabase will auto-create table on upsert");
}

// Upsert matches to Supabase
export async function upsertMatches(matches: Match[]): Promise<{ success: boolean; count: number }> {
  if (!supabase) {
    return { success: false, count: 0 };
  }
  
  try {
    const records = matches.map(m => ({
      id: m.id,
      round: m.round,
      date: m.date,
      time: m.time,
      team1: m.team1,
      team2: m.team2,
      score: m.score,
      goals1: m.goals1,
      goals2: m.goals2,
      group_name: m.group,
      ground: m.ground,
      home_score: m.homeScore,
      away_score: m.awayScore,
      state: m.state,
      label: m.label,
    }));
    
    const { error } = await supabase.from("matches").upsert(records, { onConflict: "id" });
    
    if (error) throw error;
    
    return { success: true, count: records.length };
  } catch (error) {
    console.error("Upsert error:", error);
    return { success: false, count: 0 };
  }
}

// Fetch matches from Supabase cache
export async function getCachedMatches(): Promise<Match[]> {
  if (!supabase) {
    return parseMatches();
  }
  
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("date", { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map((row: any) => ({
      id: row.id,
      round: row.round,
      date: row.date,
      time: row.time,
      team1: row.team1,
      team2: row.team2,
      group: row.group_name,
      ground: row.ground,
      homeScore: row.home_score,
      awayScore: row.away_score,
      goals1: row.goals1 || [],
      goals2: row.goals2 || [],
      state: row.state,
      label: row.label,
    }));
  } catch (e) {
    console.error("Cache fetch error:", e);
    return parseMatches();
  }
}

// Calculate group standings
export function calculateStandings(matches: Match[]): Map<string, GroupStanding[]> {
  const standings = new Map<string, GroupStanding[]>();
  
  // Initialize groups
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  groups.forEach(g => standings.set(g, []));
  
  // Process finished matches
  matches
    .filter(m => m.state === "ft" && m.group)
    .forEach(match => {
      const groupLetter = match.group?.replace("Group ", "") || "";
      const group = standings.get(groupLetter) || [];
      
      // Find or create team entries
      let team1Entry = group.find(t => t.team === match.team1);
      let team2Entry = group.find(t => t.team === match.team2);
      
      if (!team1Entry) {
        team1Entry = { team: match.team1, flag: match.team1Flag || "🏳️", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
        group.push(team1Entry);
      }
      if (!team2Entry) {
        team2Entry = { team: match.team2, flag: match.team2Flag || "🏳️", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
        group.push(team2Entry);
      }
      
      // Update stats
      [team1Entry, team2Entry].forEach(t => {
        t.played += 1;
        t.gf += t.team === match.team1 ? (match.homeScore || 0) : (match.awayScore || 0);
        t.ga += t.team === match.team1 ? (match.awayScore || 0) : (match.homeScore || 0);
        
        const isHome = t.team === match.team1;
        const myScore = isHome ? (match.homeScore || 0) : (match.awayScore || 0);
        const oppScore = isHome ? (match.awayScore || 0) : (match.homeScore || 0);
        
        if (myScore > oppScore) {
          t.won += 1;
          t.points += 3;
        } else if (myScore === oppScore) {
          t.drawn += 1;
          t.points += 1;
        } else {
          t.lost += 1;
        }
      });
      
      team1Entry.gd = team1Entry.gf - team1Entry.ga;
      team2Entry.gd = team2Entry.gf - team2Entry.ga;
      
      // Sort by points, then goal difference
      group.sort((a, b) => b.points - a.points || b.gd - a.gd);
    });
  
  return standings;
}

// Refresh data from GitHub
export async function refreshWorldCupData(): Promise<{ success: boolean; matches: number; message: string }> {
  try {
    const matches = await parseMatches();
    
    // Try to cache in Supabase
    if (supabase) {
      await upsertMatches(matches);
    }
    
    return {
      success: true,
      matches: matches.length,
      message: `Successfully fetched ${matches.length} matches`,
    };
  } catch (error) {
    console.error("❌ Refresh failed:", error);
    return {
      success: false,
      matches: 0,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// Export a simple function for fetching World Cup matches
export async function fetchWorldCupMatches(): Promise<{ matches: Match[]; source: string; total: number }> {
  try {
    const matches = await parseMatches();
    return {
      matches,
      source: "OpenFootball/worldcup.json",
      total: matches.length,
    };
  } catch (error) {
    console.error("Failed to fetch World Cup matches:", error);
    return { matches: [], source: "error", total: 0 };
  }
}
