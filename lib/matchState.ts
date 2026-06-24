/**
 * Match State Utility
 * Determines if a match is: live, finished, or upcoming
 */

/**
 * Maps API status values to our internal state
 */
const STATUS_MAP: Record<string, string> = {
  // Finished states
  FINISHED: "finished",
  FT: "finished",
  FULL_TIME: "finished",
  COMPLETED: "finished",
  ENDED: "finished",
  AWARDED: "finished",

  // Live states
  LIVE: "live",
  IN_PLAY: "live",
  FIRST_HALF: "live",
  SECOND_HALF: "live",
  HALF_TIME: "live",
  EXTRA_TIME: "live",
  PENALTIES: "live",
  "1H": "live",
  "2H": "live",
  HT: "live",
  ET: "live",
  BT: "live",
  "1S": "live",
  "2S": "live",
  PENS: "live",

  // Paused/Suspended
  SUSPENDED: "live",
  INTERRUPTED: "live",
  INT: "live",

  // Timed/Scheduled
  TIMED: "upcoming",
  SCHEDULED: "upcoming",
  POSTPONED: "upcoming",
  CANCELLED: "upcoming",
  ABANDONED: "finished",
};

/**
 * Get match state from API status string
 */
export function getStatusFromAPI(status: string | null | undefined): string {
  if (!status) return "upcoming";
  const normalized = status.toUpperCase().trim();
  return STATUS_MAP[normalized] || "upcoming";
}

/**
 * Check if a match should be shown as live based on:
 * 1. Status from API
 * 2. Defensive time check (if ended >2 hours ago, show as finished)
 */
export function getMatchState(
  status: string | null | undefined,
  utcDate: string | null | undefined,
  _leagueType: "football-data" | "custom" = "football-data"
): "live" | "finished" | "upcoming" {
  const state = getStatusFromAPI(status);

  // Defensive: if match ended more than 4 hours ago, force to finished
  if (state === "live" && utcDate) {
    const matchTime = new Date(utcDate).getTime();
    const now = Date.now();
    const fourHoursMs = 4 * 60 * 60 * 1000;

    if (matchTime + fourHoursMs < now) {
      console.warn(`[matchState] Match ${utcDate} marked live but time check suggests finished. Forcing to finished.`);
      return "finished";
    }
  }

  return state as "live" | "finished" | "upcoming";
}

/**
 * Check if a custom score match is finished
 */
export function isCustomMatchFinished(
  state: string | null | undefined
): boolean {
  if (!state) return false;
  const s = state.toLowerCase();
  return s === "ft" || s === "finished" || s === "ended" || s === "full_time" || s === "completed";
}

/**
 * Check if a match should show as live (custom scores)
 */
export function isCustomMatchLive(
  state: string | null | undefined
): boolean {
  if (!state) return false;
  const s = state.toLowerCase();
  return s === "live" || s === "in_play" || s === "first_half" || s === "second_half" || s === "half_time";
}
