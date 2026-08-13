const CACHE_NAME = "matrix-v8-core-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./index.css",
  "./alert.css",
  "./index.js",
  "./manifest.json",
];

// Instalacja i buforowanie zasobów statycznych
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// Czyszczenie starych cache'y
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
});

// Strategia: Cache First dla statyków, Network First dla zapytań do API/GitHub
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Zewnętrzne API i JSONy - Network First
  if (
    url.hostname.includes("api.github.com") ||
    url.hostname.includes("raw.githubusercontent.com")
  ) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches
            .open("matrix-v8-data-v1")
            .then((cache) => cache.put(e.request, clonedResponse));
          return response;
        })
        .catch(() => caches.match(e.request)),
    );
    return;
  }

  // Statyczne zasoby - Cache First
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }),
  );
});
