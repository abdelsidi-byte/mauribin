// Match notification scheduler
// Checks upcoming/live matches and sends push notifications to subscribers
import { NextResponse } from "next/server";
import { SCHEDULE } from "@/lib/worldcup-data";
import { getAllSubscriptions, hasSent, markSent, getStorageMode } from "@/lib/notifications-store";

export const dynamic = "force-dynamic";

interface MatchNotification {
  id: string;
  type: "starting" | "live" | "goal" | "ended";
  matchId: number;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  homeFlag?: string;
  awayFlag?: string;
  message: string;
  timestamp: number;
}

// Recent notifications kept in memory (display-only, not critical for dedup)
const recentNotifications: MatchNotification[] = [];

export async function GET() {
  const now = Date.now();

  // Pre-compute all "already sent?" lookups in parallel
  const matchIds = SCHEDULE.map((m) => String(m.id));
  const lookupKeys = matchIds.flatMap((id) => [
    { match_id: id, event_type: "starting" as const },
    { match_id: id, event_type: "live" as const },
    { match_id: id, event_type: "ended" as const },
  ]);

  // Lightweight dedup map: key -> "already sent?"
  const sentLookup = new Map<string, boolean>();
  await Promise.all(
    lookupKeys.map(async (k) => {
      const sent = await hasSent(k.match_id, k.event_type);
      sentLookup.set(`${k.match_id}::${k.event_type}`, sent);
    }),
  );

  const newNotifications: MatchNotification[] = [];
  const markSentQueue: Array<{ match_id: string; type: MatchNotification["type"]; label: string }> = [];

  for (const match of SCHEDULE) {
    const matchTime = new Date(`${match.date}T${match.time || "20:00"}:00Z`).getTime();
    const timeUntilStart = matchTime - now;
    const minutesUntil = Math.floor(timeUntilStart / 60000);
    const isLive = match.status === "live";
    const isFinished = match.status === "ft";
    const matchKey = String(match.id);

    // 1) Notify 15 minutes before match starts
    if (
      minutesUntil > 0 &&
      minutesUntil <= 15 &&
      !sentLookup.get(`${matchKey}::starting`)
    ) {
      const notif: MatchNotification = {
        id: `start-${match.id}`,
        type: "starting",
        matchId: match.id,
        home: match.home,
        away: match.away,
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
        message: `${match.home} vs ${match.away} تبدأ بعد ${minutesUntil} دقيقة!`,
        timestamp: now,
      };
      markSentQueue.push({ match_id: matchKey, type: "starting", label: `${match.home} vs ${match.away}` });
      newNotifications.push(notif);
    }

    // 2) Notify when match starts (LIVE)
    if (
      isLive &&
      !sentLookup.get(`${matchKey}::live`)
    ) {
      const notif: MatchNotification = {
        id: `live-${match.id}`,
        type: "live",
        matchId: match.id,
        home: match.home,
        away: match.away,
        homeScore: match.homeScore ?? undefined,
        awayScore: match.awayScore ?? undefined,
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
        message: `🔴 مباشر الآن: ${match.home} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.away}`,
        timestamp: now,
      };
      markSentQueue.push({ match_id: matchKey, type: "live", label: `${match.home} vs ${match.away}` });
      newNotifications.push(notif);
    }

    // 3) Notify on goal scored (live + score changed)
    if (
      isLive &&
      match.homeScore !== null &&
      match.awayScore !== null
    ) {
      const totalGoals = (match.homeScore ?? 0) + (match.awayScore ?? 0);
      const goalKey = `goals-${match.id}-${totalGoals}`;
      const goalSentKey = `${matchKey}::goal:${totalGoals}`;
      if (!sentLookup.get(goalSentKey)) {
        const previousNotifs = recentNotifications.filter(
          (n) => n.matchId === match.id && n.type === "goal"
        );
        const lastTotal =
          previousNotifs.length > 0
            ? (previousNotifs[previousNotifs.length - 1].homeScore ?? 0) +
              (previousNotifs[previousNotifs.length - 1].awayScore ?? 0)
            : -1;
        if (totalGoals > lastTotal && previousNotifs.length > 0) {
          markSentQueue.push({ match_id: goalSentKey, type: "goal", label: `${match.home} ${match.homeScore}-${match.awayScore} ${match.away}` });
          const notif: MatchNotification = {
            id: goalKey,
            type: "goal",
            matchId: match.id,
            home: match.home,
            away: match.away,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            homeFlag: match.homeFlag,
            awayFlag: match.awayFlag,
            message: `⚽ هدف! ${match.home} ${match.homeScore} - ${match.awayScore} ${match.away}`,
            timestamp: now,
          };
          newNotifications.push(notif);
        }
      }
    }

    // 4) Notify when match ends
    if (
      isFinished &&
      !sentLookup.get(`${matchKey}::ended`)
    ) {
      markSentQueue.push({ match_id: matchKey, type: "ended", label: `${match.home} vs ${match.away}` });
      newNotifications.push({
        id: `ended-${match.id}`,
        type: "ended",
        matchId: match.id,
        home: match.home,
        away: match.away,
        homeScore: match.homeScore ?? undefined,
        awayScore: match.awayScore ?? undefined,
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
        message: `🏁 انتهت: ${match.home} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.away}`,
        timestamp: now,
      });
    }
  }

  // Persist all dedup marks in one parallel burst
  await Promise.all(
    markSentQueue.map((q) => markSent(q.match_id, q.type, q.label)),
  );

  // Add to recent (keep last 100)
  recentNotifications.push(...newNotifications);
  if (recentNotifications.length > 100) {
    recentNotifications.splice(0, recentNotifications.length - 100);
  }

  // Get subscribers count
  const subscribers = getAllSubscriptions();

  // Log to console
  if (newNotifications.length > 0) {
    console.log(`[Notifications] Generated ${newNotifications.length} notifications`);
    console.log(`[Notifications] Subscribers: ${subscribers.length}`);
  }

  return NextResponse.json({
    checked: SCHEDULE.length,
    notificationsGenerated: newNotifications.length,
    subscribers: subscribers.length,
    storage: getStorageMode(),
    notifications: newNotifications,
    recent: recentNotifications.slice(-10),
    timestamp: new Date().toISOString(),
  });
}