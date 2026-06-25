import { NextRequest, NextResponse } from 'next/server';
import { SCHEDULE } from '@/lib/worldcup-data';

// In-memory store (replace with Supabase in production)
interface Vote {
  matchId: number;
  vote: 'home' | 'draw' | 'away';
  userId: string;
  timestamp: number;
}

// Global in-memory votes (resets on server restart)
// For production: use Supabase or Vercel KV
declare global {
  var __predictionStore: Map<string, Vote[]> | undefined;
}

const store = globalThis.__predictionStore ?? new Map<string, Vote[]>();
if (!globalThis.__predictionStore) globalThis.__predictionStore = store;

function getMatchVotes(matchId: number): Vote[] {
  return store.get(String(matchId)) || [];
}

export async function GET(req: NextRequest) {
  const matchId = req.nextUrl.searchParams.get('matchId');
  
  if (matchId) {
    // Get votes for specific match
    const votes = getMatchVotes(parseInt(matchId));
    const counts = {
      home: votes.filter(v => v.vote === 'home').length,
      draw: votes.filter(v => v.vote === 'draw').length,
      away: votes.filter(v => v.vote === 'away').length,
    };
    return NextResponse.json({ matchId, counts, total: votes.length });
  }
  
  // Get all matches predictions summary
  const summary: Record<number, any> = {};
  SCHEDULE.forEach(match => {
    const votes = getMatchVotes(match.id);
    summary[match.id] = {
      home: votes.filter(v => v.vote === 'home').length,
      draw: votes.filter(v => v.vote === 'draw').length,
      away: votes.filter(v => v.vote === 'away').length,
      total: votes.length,
    };
  });
  
  return NextResponse.json({ predictions: summary });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { matchId, vote, userId } = body;
    
    if (!matchId || !['home', 'draw', 'away'].includes(vote) || !userId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    
    const key = String(matchId);
    const existing = store.get(key) || [];
    
    // Remove previous vote by this user (re-vote logic)
    const filtered = existing.filter(v => v.userId !== userId);
    
    // Add new vote
    filtered.push({
      matchId,
      vote,
      userId,
      timestamp: Date.now(),
    });
    
    store.set(key, filtered);
    
    // Return updated counts
    const counts = {
      home: filtered.filter(v => v.vote === 'home').length,
      draw: filtered.filter(v => v.vote === 'draw').length,
      away: filtered.filter(v => v.vote === 'away').length,
    };
    
    return NextResponse.json({ matchId, counts, total: filtered.length });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}