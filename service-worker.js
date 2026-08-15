const CACHE_NAME = "fec-admin-offline-v1";

const OFFLINE_PAGE = "./offline.html";

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.add(OFFLINE_PAGE);

            })

    );

    self.skipWaiting();
});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});


self.addEventListener("fetch", event => {

    if (event.request.mode === "navigate") {

        event.respondWith(

            fetch(event.request)
                .catch(() => {

                    return caches.match(OFFLINE_PAGE);

                })

        );

    }

});
