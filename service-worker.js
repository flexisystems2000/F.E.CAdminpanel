const CACHE_NAME = "fec-admin-offline-v6";

// Install
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate – clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch – do NOT hijack navigations with offline.html
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  // Let page navigations go to the network normally.
  // If they fail, the browser/WebView handles it.
  // This prevents the offline.html trap loop.
  if (request.mode === "navigate") {
    return; // important: do not call event.respondWith
  }

  // For other assets only
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
