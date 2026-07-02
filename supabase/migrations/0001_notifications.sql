-- ============================================================================
-- Mauribin: Push Notifications Storage (Supabase Migration)
-- Version: 0001
-- Purpose: Persistent storage for Web Push subscriptions and dedup memory
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================================

-- --------------------------------------------------------------------------
-- Table 1: push_subscriptions
-- Stores one row per (endpoint + user-agent) device/browser combo.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           BIGSERIAL PRIMARY KEY,
  endpoint     TEXT        NOT NULL,
  user_agent   TEXT,
  p256dh       TEXT        NOT NULL,
  auth         TEXT        NOT NULL,
  prefs        JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,

  -- Endpoints are guaranteed unique by the browser's Push API
  CONSTRAINT push_subscriptions_endpoint_unique UNIQUE (endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subs_active
  ON public.push_subscriptions (is_active);

CREATE INDEX IF NOT EXISTS idx_push_subs_last_seen
  ON public.push_subscriptions (last_seen_at DESC);

-- Auto-bump updated_at whenever the row is modified
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_push_subs_updated_at ON public.push_subscriptions;
CREATE TRIGGER trg_push_subs_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------------------------
-- Table 2: sent_notifications (the dedup log)
-- One row per (match_id + event_type) — prevents re-sending every minute.
-- Periodic cleanup of rows older than 30 days (see `cleanup_old_notifications`).
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sent_notifications (
  id           BIGSERIAL PRIMARY KEY,
  match_id     TEXT        NOT NULL,
  event_type   TEXT        NOT NULL,   -- 'starting' | 'live' | 'goal' | 'ended' | 'card'
  match_label  TEXT,                    -- denormalized "Brazil vs France" for debugging
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Same match+event never sent twice (server restart-safe dedup)
  CONSTRAINT sent_notifications_unique_event UNIQUE (match_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_sent_notif_sent_at
  ON public.sent_notifications (sent_at DESC);

-- --------------------------------------------------------------------------
-- Optional: cron-style cleanup of stale dedup rows (run via Supabase
-- Scheduled Functions or pg_cron — see SUPABASE_SETUP.md). Keeps the
-- table small (a single WC tournament produces ~1k rows max).
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM public.sent_notifications
    WHERE sent_at < NOW() - INTERVAL '30 days'
    RETURNING 1
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------------
-- Row Level Security (RLS)
-- We use the service_role key from the server, so RLS is bypassed there.
-- These policies are a safety net in case anon key is ever exposed.
-- --------------------------------------------------------------------------
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sent_notifications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to register their own subscription only
DROP POLICY IF EXISTS "anon can insert own subscription" ON public.push_subscriptions;
CREATE POLICY "anon can insert own subscription"
  ON public.push_subscriptions FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Service role (used by the API) has full access — this RLS only blocks anon
DROP POLICY IF EXISTS "anon can read own subscription" ON public.push_subscriptions;
CREATE POLICY "anon can read own subscription"
  ON public.push_subscriptions FOR SELECT
  TO anon
  USING (FALSE);   -- expose nothing to the public

DROP POLICY IF EXISTS "anon can update own subscription" ON public.push_subscriptions;
CREATE POLICY "anon can update own subscription"
  ON public.push_subscriptions FOR UPDATE
  TO anon
  USING (FALSE);

-- Lock down the dedup log entirely from the public
DROP POLICY IF EXISTS "anon no read sent_notifications" ON public.sent_notifications;
CREATE POLICY "anon no read sent_notifications"
  ON public.sent_notifications FOR ALL
  TO anon
  USING (FALSE);

-- --------------------------------------------------------------------------
-- Verification queries (run these after migration to confirm)
-- --------------------------------------------------------------------------
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name IN ('push_subscriptions','sent_notifications');
-- SELECT COUNT(*) FROM public.push_subscriptions;
-- SELECT * FROM public.sent_notifications ORDER BY sent_at DESC LIMIT 20;
