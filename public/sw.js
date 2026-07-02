// Mauribin Service Worker v4 — Robust PWA + Push
const CACHE_NAME = 'mauribin-v4';
const STATIC_ASSETS = [
  '/',
  '/news',
  '/standings',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v4...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        // Add assets individually so one failure doesn't block the whole SW
        const results = await Promise.allSettled(
          STATIC_ASSETS.map(url => cache.add(url).catch(err => ({ url, err })))
        );
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length) {
          console.warn('[SW] Some assets failed to cache:', failed.length, 'failures');
        }
      })
      .then(() => {
        console.log('[SW] Install complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Install failed:', err);
        // Don't throw — let SW still activate even if caching partially fails
      })
  );
});

// ─── Activate ──────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v4...');
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((keys) =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      ),
      // Take control of all clients immediately
      self.clients.claim(),
    ]).then(() => {
      console.log('[SW] Activate complete, now controlling clients');
    })
  );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // API routes → always network, no caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then(cached =>
          cached || new Response(
            JSON.stringify({ error: 'offline', matches: [] }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        );
      })
    );
    return;
  }

  // Static assets → cache first, update in background
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((network) => {
          if (network.ok) {
            const clone = network.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return network;
        }).catch(() => cached); // fallback to cache on network failure

        return cached || networkFetch;
      })
    );
    return;
  }

  // HTML pages → stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((network) => {
        if (network.ok) {
          const clone = network.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return network;
      }).catch(() => cached || caches.match('/'));

      return cached || networkFetch;
    })
  );
});

// ─── Push ───────────────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.warn('[SW] Push received with no data');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Mauribin', body: event.data.text() };
  }

  const options = {
    body: data.body || 'تحديث جديد',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    tag: 'mauribin-notif',
    requireInteraction: data.type === 'goal' || data.type === 'redCard',
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: '⚽ فتح' },
      { action: 'close', title: '✕ إغلاق' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '⚽ Mauribin', options)
  );
});

// ─── Notification click ─────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ─── Message handler (communication with main thread) ───────────────────────
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  if (type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested');
    self.skipWaiting();
  }

  if (type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_NAME });
  }

  if (type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Cache cleared');
      event.ports[0]?.postMessage({ ok: true });
    });
  }
});

console.log('[SW] Mauribin SW v4 loaded');
