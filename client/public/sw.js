// ORION FLUX — Zero-Stale Cache Invalidation Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});

self.addEventListener('fetch', (e) => {
  // Always network-first, never block
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
