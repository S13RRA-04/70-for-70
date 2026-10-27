// Service worker for the "For the 22" participant app (app.forthe22.org
// only — see src/components/app/register-service-worker.tsx, which only
// registers this on that host). Deliberately simple for MVP: no precache
// manifest, no build-tool integration — runtime caching of what a
// participant actually visits, so recently viewed pages (current
// challenge, progress, promo kit assets) still work offline, per the PWA
// spec's "Offline Behavior" requirement. Bump CACHE_VERSION to invalidate
// everything on the next deploy.

const CACHE_VERSION = "for-the-22-v1";
const CORE_ASSETS = ["/app-icons/icon-192.png", "/app-icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations (page loads): network-first, falling back to whatever
  // cached page matches, so a page the participant already opened once
  // still renders offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? caches.match("/app"))),
    );
    return;
  }

  // Everything else (icons, static assets, promo kit images): cache-first,
  // populating the cache on first successful fetch.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
