# 🗄️ Supabase Setup for Mauribin Notifications

## Why?
Without persistent storage, push subscriptions and "already-sent" markers
were lost every time Vercel cold-started the Lambda. Supabase replaces the
in-memory `Map` with a Postgres table that survives restarts and shares state
across Lambda instances.

## What you need
1. A free Supabase account (https://supabase.com → "Start your project")
2. A new project (any region, free tier is fine)
3. Two values from the project dashboard:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **service_role key** (NOT the anon key — we need server-side access)

---

## Step 1 — Run the migration (60 seconds)

1. Open https://app.supabase.com → pick your project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `supabase-migration.sql` from the repo root
5. Paste the entire contents into the SQL editor
6. Click **Run** (or press Ctrl+Enter)

You should see: `Success. No rows returned` ✅

The migration creates:
- `push_subscriptions` — one row per subscribed device
- `sent_notifications` — dedup log so we never send the same event twice
- An RLS policy that blocks direct public reads (we use service_role)
- A `cleanup_old_notifications()` function you can schedule later

### Quick verification

After running, paste this in SQL Editor to confirm:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
  AND table_name IN ('push_subscriptions','sent_notifications');
```

You should see **2 rows**.

---

## Step 2 — Add environment variables to Vercel (60 seconds)

You need to add **two** environment variables to your Vercel project:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | The **Project URL** from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | The **service_role** secret (Settings → API) |

> ⚠️ The `service_role` key bypasses Row Level Security. Keep it server-only. **Never** prefix it with `NEXT_PUBLIC_`.

### Two ways to add them:

#### Option A — Vercel Dashboard (recommended)

1. Open https://vercel.com/dashboard → mauribin project
2. Settings → **Environment Variables**
3. Add `SUPABASE_URL` + value, environment: Production
4. Add `SUPABASE_SERVICE_ROLE_KEY` + value, environment: Production
5. Click **Save**
6. Deployments tab → click ⋯ on the latest → **Redeploy**

#### Option B — CLI

```bash
cd /home/ubuntu/mauribin
vercel env add SUPABASE_URL production
# paste your URL when prompted
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# paste your service_role key when prompted
vercel deploy --prod --yes
```

---

## Step 3 — Verify it's working (30 seconds)

After the redeploy finishes, run:

```bash
curl -s https://mauribin.vercel.app/api/notifications/check | jq
```

Look at the response. You should see:

```json
{
  "storage": "supabase",   ← should say "supabase", NOT "memory"
  "subscribers": 0,
  "notificationsGenerated": 0,
  ...
}
```

If `storage: "memory"` — your env vars didn't reach Vercel. Re-check Step 2.

### Try a subscription

```bash
curl -X POST https://mauribin.vercel.app/api/push/subscribe \
  -H "Content-Type: application/json" \
  -d '{"subscription":{"endpoint":"https://test.example/sub/1","keys":{"p256dh":"abc","auth":"xyz"}}}'
```

Then in Supabase → **Table Editor** → `push_subscriptions`, you should see
**1 row**. If you see it — you're all set.

---

## What happens if you skip this setup?

Nothing breaks. The app **already** falls back to in-memory storage when
Supabase env vars are missing. So you can:

- ✅ Deploy today without Supabase (works, just ephemeral on Vercel)
- ✅ Add Supabase later when you have time
- ✅ Migrate existing data: nothing to migrate (in-memory was ephemeral)

The `getStorageMode()` response field lets you see which backend is active
at any time.

---

## Troubleshooting

### "storage: memory" but env vars set

1. Hard refresh Vercel project settings
2. Trigger a redeploy (env vars don't apply to old builds)
3. Wait 30 seconds for the deploy to finish, then re-check

### "permission denied for table push_subscriptions"

You're using the **anon** key instead of the **service_role** key. Go back to
Supabase → Settings → API → copy the `service_role` secret.

### Subscriptions disappear after a few hours

This is normal during the FREE tier — projects pause after 1 week of
inactivity. Either upgrade or set up a scheduled ping
(Supabase Dashboard → Database → Scheduled Functions → `SELECT 1` every day).

### Want to wipe and start fresh

```sql
TRUNCATE public.push_subscriptions RESTART IDENTITY;
TRUNCATE public.sent_notifications RESTART IDENTITY;
```

---

## File layout

```
mauribin/
├── SUPABASE_SETUP.md                  ← you are here
├── supabase-migration.sql             ← paste this into SQL Editor
└── supabase/
    └── migrations/
        └── 0001_notifications.sql     ← same file, organized for future use
```

---

## Optional: scheduled cleanup (recommended)

In Supabase Dashboard → **Database** → **Scheduled Functions**, create:

- **Function name:** `cleanup_old_notifications_daily`
- **Schedule:** `0 3 * * *` (3 AM UTC every day)
- **SQL:**

```sql
SELECT public.cleanup_old_notifications();
```

This deletes dedup rows older than 30 days so the table stays small.
