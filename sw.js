const CACHE_VERSION = 'sfc-v9';
// Reason: self.registration.scope gives the correct base URL whether the app
// is served from the root (local dev) or a sub-path (GitHub Pages /sparefoodcalculator/).
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'styles.css',
  BASE + 'app.js',
  BASE + 'i18n.js',
  BASE + 'ingredients.js',
  BASE + 'search.js',
  BASE + 'recipes.js',
  BASE + 'category-template.js',
  BASE + 'ui.js',
  BASE + 'manifest.json',
  BASE + 'robots.txt',
  BASE + 'sitemap.xml',
  // JS modules
  BASE + 'js/safe-dom.js',
  BASE + 'js/quantities.js',
  BASE + 'js/sustainability.js',
  BASE + 'js/sustainability-ui.js',
  BASE + 'js/side-stats.js',
  BASE + 'js/recipe-ui.js',
  BASE + 'js/category-render.js',
  BASE + 'js/search-suggest.js',
  BASE + 'js/search-worker-client.js',
  BASE + 'js/workers/search-worker.js',
  // Data
  BASE + 'data/sustainability.js',
  BASE + 'data/recipes.json',
  // Pages
  BASE + 'pages/contact.html',
  BASE + 'pages/dessert.html',
  BASE + 'pages/fisch.html',
  BASE + 'pages/haendl.html',
  BASE + 'pages/impressum.html',
  BASE + 'pages/ingredients-catalog.html',
  BASE + 'pages/ingredients-generator.html',
  BASE + 'pages/kuchen.html',
  BASE + 'pages/rind.html',
  BASE + 'pages/salat.html',
  BASE + 'pages/schwein.html',
  BASE + 'pages/search.html',
  BASE + 'pages/suppen.html',
  BASE + 'pages/vorspeisen.html',
  BASE + 'pages/hauptgericht.html',
  BASE + 'pages/pasta.html',
  BASE + 'pages/beilage.html',
  BASE + 'pages/snack.html',
  BASE + 'pages/fruehstueck.html',
  // Images
  BASE + 'images/icon-192.png',
  BASE + 'images/icon-512.png',
  BASE + 'images/hero-image.webp',
  BASE + 'images/frucht-rahmen.webp',
  BASE + 'images/star-trails.Background.webp',
  BASE + 'images/Gem%C3%BCse%20und%20Fr%C3%BCchte.webp',
  BASE + 'images/Gem%C3%BCse%20und%20Fr%C3%BCchte%20Dark.webp'
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

// Fetch handler:
//   - Navigation requests: network-first, fall back to cache, then to /index.html.
//     Reason: prevents stale shell HTML being served forever after a deploy.
//   - All other GETs: cache-first, populate cache on miss.
//   - cache.put() is wrapped in event.waitUntil so the SW is kept alive until
//     the write finishes (otherwise the SW can be killed mid-write).
self.addEventListener('fetch', function(event) {
  var request = event.request;

  // Only handle GET — POST/PUT/etc. should go straight to the network.
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          if (response && response.ok) {
            var clone = response.clone();
            event.waitUntil(
              caches.open(CACHE_VERSION).then(function(cache) {
                return cache.put(request, clone);
              })
            );
          }
          return response;
        })
        .catch(function() {
          return caches.match(request).then(function(cached) {
            return cached || caches.match(BASE + 'index.html');
          });
        })
    );
    return;
  }

  // Non-navigation GETs: cache-first.
  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) return cached;
      return fetch(request).then(function(response) {
        if (response && response.ok) {
          var clone = response.clone();
          event.waitUntil(
            caches.open(CACHE_VERSION).then(function(cache) {
              return cache.put(request, clone);
            })
          );
        }
        return response;
      });
    }).catch(function() {
      // Best-effort offline fallback for sub-resources: nothing useful to return.
      return Response.error();
    })
  );
});
