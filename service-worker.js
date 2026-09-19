const VERSION = "game-library-web-v5";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./offline.html",
  "./icons/icon-64.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cache the Three.js dependency used by 3D Hoops after it is first loaded.
  if (url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response && (response.ok || response.type === "opaque")) {
          cache.put(request, response.clone());
        }
        return response;
      })
    );
    return;
  }

  // Do not interfere with YouTube/video resources.
  if (url.origin !== self.location.origin) return;

  // HTML/navigation: network first so updates appear, cached fallback when offline.
  if (request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match("./offline.html");
        })
    );
    return;
  }

  // Same-origin static assets: cache first, then network and remember them.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
