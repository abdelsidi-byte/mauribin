// Mauribin Service Worker - PWA
const CACHE_NAME = 'mauribin-v2';
const STATIC_ASSETS = [
  '/',
  '/news',
  '/standings',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale While Revalidate (perfect for Next.js ISR)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // API calls: network only (always fresh scores)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return cached API data if available
        return caches.match(request).then(cached => {
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'offline', matches: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Static assets: cache first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(network => {
          if (network.ok) {
            const clone = network.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return network;
        });
      })
    );
    return;
  }

  // HTML pages: Stale While Revalidate
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(network => {
        // Update cache with fresh version
        if (network.ok) {
          const clone = network.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return network;
      }).catch(() => {
        // Network failed, return cached or offline page
        return cached || caches.match('/');
      });
      
      // Return cached immediately, update in background
      return cached || fetchPromise;
    })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'تحديث جديد من Mauribin',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'فتح' },
      { action: 'close', title: 'إغلاق' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Mauribin', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') return;
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-matches') {
    event.waitUntil(syncMatches());
  }
});

async function syncMatches() {
  try {
    const res = await fetch('/api/live-scores');
    const data = await res.json();
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/api/live-scores', new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (e) {
    console.log('Sync failed:', e);
  }
}
