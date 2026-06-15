const CACHE = 'sevadesk-v2';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

// Network-first: always try to fetch the latest version.
// Only fall back to cache if the network request fails (offline).
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).then(function(response) {
      var copy = response.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
      return response;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
