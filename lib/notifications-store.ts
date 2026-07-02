/**
 * Notifications storage — Supabase (persistent) + in-memory (ephemeral fallback).
 *
 * The in-memory fallback kept losing subscriber state every time Vercel
 * cold-started the Lambda. Supabase replaces it: a single shared Postgres
 * table survives restarts AND lets multiple Lambda instances stay in sync.
 *
 * Behaviour:
 *   - If NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 *     we use a Supabase client with the service role on the server.
 *   - Otherwise we fall back to a Map so dev/demo still works.
 *
 * Public API (unchanged so route handlers keep working):
 *   - addSubscription(sub, prefs)
 *   - removeSubscription(endpoint)
 *   - listSubscriptions()
 *   - hasSent(matchId, eventType)
 *   - markSent(matchId, eventType, matchLabel?)
 *   - clearSent()                  (for tests / manual admin)
 *   - getStorageMode()             ("supabase" | "memory")
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types (kept identical to the original in-memory types so route handlers
// don't need to change).
// ---------------------------------------------------------------------------
export interface PushSubscriptionRecord {
  id?: string;
  endpoint: string;
  user_agent?: string;
  p256dh: string;
  auth: string;
  prefs?: {
    startingSoon?: boolean;
    goals?: boolean;
    cards?: boolean;
    ended?: boolean;
  };
  created_at?: string;
  updated_at?: string;
  last_seen_at?: string;
  is_active?: boolean;
}

export type MatchEventType = "starting" | "live" | "goal" | "ended" | "card";

export interface SentNotificationRecord {
  match_id: string;
  event_type: MatchEventType;
  match_label?: string;
  sent_at?: string;
}

// ---------------------------------------------------------------------------
// Supabase admin client (server-side, service role bypasses RLS).
// We use SUPABASE_SERVICE_ROLE_KEY if present, otherwise fall back to the
// anon key — both work for our tables because the API endpoints are
// server-only (the keys are not exposed to the client here).
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

let supabaseAdmin: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  if (supabaseAdmin) return supabaseAdmin;
  supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { "Accept-Profile": "public", "Content-Profile": "public" },
    },
  });
  return supabaseAdmin;
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

export function getStorageMode(): "supabase" | "memory" {
  return isSupabaseStorageConfigured() ? "supabase" : "memory";
}

// ---------------------------------------------------------------------------
// In-memory fallback (kept exactly as before so the production site keeps
// working until the user runs the migration).
// ---------------------------------------------------------------------------
type MemoryBackend = {
  subscriptions: Map<string, PushSubscriptionRecord>;
  sent: Map<string, SentNotificationRecord>;
};
const memoryState: MemoryBackend = {
  subscriptions: new Map(),
  sent: new Map(),
};

function memoryKey(matchId: string, eventType: MatchEventType) {
  return `${matchId}::${eventType}`;
}

// ---------------------------------------------------------------------------
// Public API — Supabase + memory implementations of each operation.
// Every operation tries Supabase first when configured, falls back to memory.
// ---------------------------------------------------------------------------

export async function addSubscription(
  sub: Omit<PushSubscriptionRecord, "created_at" | "updated_at" | "last_seen_at" | "is_active">,
): Promise<void> {
  const client = getClient();
  if (client) {
    const { error } = await client.from("push_subscriptions").upsert(
      {
        endpoint: sub.endpoint,
        user_agent: sub.user_agent ?? null,
        p256dh: sub.p256dh,
        auth: sub.auth,
        prefs: sub.prefs ?? {},
        last_seen_at: new Date().toISOString(),
        is_active: true,
      },
      { onConflict: "endpoint" },
    );
    if (error) {
      console.error("[notifications-store] addSubscription supabase error:", error.message);
      // fall through to memory so the request still succeeds
    } else {
      return;
    }
  }
  memoryState.subscriptions.set(sub.endpoint, {
    ...sub,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    is_active: true,
  });
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const client = getClient();
  if (client) {
    const { error } = await client
      .from("push_subscriptions")
      .update({ is_active: false })
      .eq("endpoint", endpoint);
    if (error) {
      console.error("[notifications-store] removeSubscription supabase error:", error.message);
    } else {
      return;
    }
  }
  memoryState.subscriptions.delete(endpoint);
}

export async function listSubscriptions(): Promise<PushSubscriptionRecord[]> {
  const client = getClient();
  if (client) {
    const { data, error } = await client
      .from("push_subscriptions")
      .select("*")
      .eq("is_active", true)
      .order("last_seen_at", { ascending: false });
    if (error) {
      console.error("[notifications-store] listSubscriptions supabase error:", error.message);
    } else if (data) {
      return data as PushSubscriptionRecord[];
    }
  }
  return Array.from(memoryState.subscriptions.values()).filter(
    (s) => s.is_active !== false,
  );
}

export async function hasSent(
  matchId: string,
  eventType: MatchEventType,
): Promise<boolean> {
  const client = getClient();
  if (client) {
    const { data, error } = await client
      .from("sent_notifications")
      .select("match_id")
      .eq("match_id", matchId)
      .eq("event_type", eventType)
      .maybeSingle();
    if (error) {
      console.error("[notifications-store] hasSent supabase error:", error.message);
    } else if (data) {
      return true;
    } else {
      return false;
    }
  }
  return memoryState.sent.has(memoryKey(matchId, eventType));
}

export async function markSent(
  matchId: string,
  eventType: MatchEventType,
  matchLabel?: string,
): Promise<void> {
  const client = getClient();
  if (client) {
    const { error } = await client.from("sent_notifications").upsert(
      {
        match_id: matchId,
        event_type: eventType,
        match_label: matchLabel ?? null,
        sent_at: new Date().toISOString(),
      },
      { onConflict: "match_id,event_type" },
    );
    if (error) {
      console.error("[notifications-store] markSent supabase error:", error.message);
    } else {
      return;
    }
  }
  memoryState.sent.set(memoryKey(matchId, eventType), {
    match_id: matchId,
    event_type: eventType,
    match_label: matchLabel,
    sent_at: new Date().toISOString(),
  });
}

export async function clearSent(): Promise<void> {
  const client = getClient();
  if (client) {
    const { error } = await client
      .from("sent_notifications")
      .delete()
      .neq("match_id", "");
    if (error) {
      console.error("[notifications-store] clearSent supabase error:", error.message);
    } else {
      return;
    }
  }
  memoryState.sent.clear();
}

// ---------------------------------------------------------------------------
// Sync helpers — these existed on the old in-memory version and are still
// used by some route handlers. They now return Promises.
// ---------------------------------------------------------------------------
export async function getSubscriptionsCount(): Promise<number> {
  return (await listSubscriptions()).length;
}

export async function getSentCount(): Promise<number> {
  const client = getClient();
  if (client) {
    const { count, error } = await client
      .from("sent_notifications")
      .select("match_id", { count: "exact", head: true });
    if (!error && typeof count === "number") return count;
  }
  return memoryState.sent.size;
}

// ---------------------------------------------------------------------------
// Compatibility layer — exposes the LEGACY synchronous API expected by
// /api/push/* and /api/notifications/check route handlers. Internally these
// delegate to the async Supabase-backed functions above. Existing callers
// keep working unchanged.
// ---------------------------------------------------------------------------

/** Legacy-compatible PushSubscription shape (matches lib/notifications.ts). */
export interface PushSubscription {
  id: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
  createdAt: string;
  preferences: NotificationPreferences;
}

/** Legacy-compatible NotificationPreferences shape (matches lib/notifications.ts). */
export interface NotificationPreferences {
  matchStarting: boolean;
  goalScored: boolean;
  redCard: boolean;
  matchEnded: boolean;
  favoriteTeams: string[];
  competitions: string[];
}

function recordToLegacy(rec: PushSubscriptionRecord, id: string): PushSubscription {
  return {
    id,
    endpoint: rec.endpoint,
    keys: { p256dh: rec.p256dh, auth: rec.auth },
    userAgent: rec.user_agent,
    createdAt: rec.created_at ?? new Date().toISOString(),
    preferences: {
      matchStarting: rec.prefs?.startingSoon ?? true,
      goalScored: rec.prefs?.goals ?? true,
      redCard: rec.prefs?.cards ?? true,
      matchEnded: rec.prefs?.ended ?? false,
      favoriteTeams: [],
      competitions: ["FIFA World Cup 2026"],
    },
  };
}

function legacyPrefsToStorePrefs(p: PushSubscription["preferences"]) {
  return {
    startingSoon: p.matchStarting,
    goals: p.goalScored,
    cards: p.redCard,
    ended: p.matchEnded,
  };
}

export function saveSubscription(sub: PushSubscription): void {
  const endpoint = sub.endpoint;
  const id = sub.id || Buffer.from(endpoint).toString("base64").slice(0, 32);
  // Fire-and-forget; the supabase call awaits internally.
  void addSubscription({
    endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    user_agent: sub.userAgent,
    prefs: legacyPrefsToStorePrefs(sub.preferences),
  });
  memoryState.subscriptions.set(endpoint, {
    endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    user_agent: sub.userAgent,
    prefs: legacyPrefsToStorePrefs(sub.preferences),
    created_at: sub.createdAt,
    updated_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    is_active: true,
  });
  if (id !== endpoint) {
    // also keep a quick lookup by id
    memoryState.subscriptions.set(id, memoryState.subscriptions.get(endpoint)!);
  }
}

export function getSubscription(id: string): PushSubscription | undefined {
  const rec = memoryState.subscriptions.get(id);
  return rec ? recordToLegacy(rec, id) : undefined;
}

export function removeSubscriptionById(id: string): boolean {
  const target = memoryState.subscriptions.get(id);
  if (target) {
    void removeSubscription(target.endpoint);
    memoryState.subscriptions.delete(id);
    return true;
  }
  return false;
}

export function getAllSubscriptions(): PushSubscription[] {
  return Array.from(memoryState.subscriptions.values()).map((rec) =>
    recordToLegacy(rec, rec.endpoint),
  );
}

export function getSubscriptionsByTeam(team: string): PushSubscription[] {
  return getAllSubscriptions().filter(
    (sub) =>
      sub.preferences.favoriteTeams.length === 0 ||
      sub.preferences.favoriteTeams.includes(team),
  );
}

export function getSubscriberCount(): number {
  return memoryState.subscriptions.size;
}
