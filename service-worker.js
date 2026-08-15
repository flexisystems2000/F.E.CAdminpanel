const CACHE_NAME = "fec-admin-offline-v4";

const OFFLINE_PAGE = "./offline.html";


// ======================================================
// INSTALL
// ======================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.add(OFFLINE_PAGE);

            })

    );

    self.skipWaiting();
});


// ======================================================
// ACTIVATE
// ======================================================

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


// ======================================================
// FETCH
// ======================================================

self.addEventListener("fetch", event => {

    const request = event.request;


    /*
     * Handle every HTML/page navigation.
     */

    if (request.mode === "navigate") {

        event.respondWith(

            handlePageNavigation(request)

        );

        return;
    }


    /*
     * Other resources.
     */

    event.respondWith(

        fetch(request)
            .catch(() => {

                return caches.match(request);

            })

    );

});


// ======================================================
// PAGE NAVIGATION
// ======================================================

async function handlePageNavigation(request) {

    /*
     * If browser reports offline,
     * immediately show offline page.
     */

    if (self.navigator &&
        self.navigator.onLine === false) {

        return caches.match(OFFLINE_PAGE);
    }


    /*
     * Browser thinks we're online.
     * Verify by actually requesting the page.
     */

    try {

        const response = await fetch(
            request,
            {
                cache: "no-store"
            }
        );


        /*
         * Successful server response.
         */

        if (response &&
            response.status >= 200 &&
            response.status < 400) {

            return response;
        }


        /*
         * Server couldn't provide the page.
         */

        return caches.match(OFFLINE_PAGE);

    } catch (error) {

        /*
         * No network connection.
         */

        return caches.match(OFFLINE_PAGE);

    }

}
