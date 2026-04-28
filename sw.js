const CACHE_VERSION = 'sfc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/i18n.js',
  '/ingredients.js',
  '/search.js',
  '/recipes.js',
  '/ui.js',
  '/manifest.json',
  '/pages/contact.html',
  '/pages/dessert.html',
  '/pages/fisch.html',
  '/pages/haendl.html',
  '/pages/impressum.html',
  '/pages/ingredients-catalog.html',
  '/pages/ingredients-generator.html',
  '/pages/kuchen.html',
  '/pages/rind.html',
  '/pages/salat.html',
  '/pages/schwein.html',
  '/pages/search.html',
  '/pages/suppen.html',
  '/pages/vorspeisen.html',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/hero-image.webp',
  '/images/frucht-rahmen.webp',
  '/images/star-trails.Background.webp',
  '/images/Gem%C3%BCse%20und%20Fr%C3%BCchte.webp',
  '/images/Gem%C3%BCse%20und%20Fr%C3%BCchte%20Dark.webp'
];

// Install: cache all static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE_VERSION; })
          .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        // Cache successful GET responses for future offline use
        if (response.ok && event.request.method === 'GET') {
          var clone = response.clone();
          caches.open(CACHE_VERSION).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(function() {
      // Offline fallback: return index for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
