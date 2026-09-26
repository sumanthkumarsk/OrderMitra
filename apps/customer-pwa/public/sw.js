self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('ordermitra-customer').then((cache) => cache.addAll([
      '/OrderMitra/customer/',
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
