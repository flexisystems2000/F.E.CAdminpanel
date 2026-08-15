const CACHE_NAME = "fec-admin-offline-v5";
const OFFLINE_PAGE = "./offline.html";

// ======================================================
// INSTALL – precache the offline page
// ======================================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_PAGE);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// ======================================================
// ACTIVATE – clean up old caches
// ======================================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  // Take control of all open clients right away
  self.clients.claim();
});

// ======================================================
// FETCH
// ======================================================
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle page navigations (HTML)
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  // For other assets (JS, CSS, images, etc.)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Optionally cache successful responses
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// ======================================================
// NAVIGATION HANDLER (the important part)
// ======================================================
async function handleNavigation(request) {
  try {
    // Always try the network first
    const networkResponse = await fetch(request, {
      cache: "no-store",
    });

    // If we got a valid response, return it
    if (networkResponse && networkResponse.ok) {
      return networkResponse;
    }

    // Server returned an error → show offline page
    return await caches.match(OFFLINE_PAGE);
  } catch (error) {
    // Network completely failed → show offline page
    const offlineResponse = await caches.match(OFFLINE_PAGE);

    if (offlineResponse) {
      return offlineResponse;
    }

    // Absolute last resort
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline</title>
        </head>
        <body style="font-family:Arial;text-align:center;padding:40px;">
          <h1>You're Offline</h1>
          <p>Please check your internet connection.</p>
          <button onclick="location.reload()">Try Again</button>
        </body>
      </html>
      `,
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
