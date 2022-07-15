const pages = ["/", "/images/favicon.png"];

/* eslint-disable */
self.addEventListener("install", event => {
    event.waitUntil(caches.open("dwc")
        .then(cache => cache.addAll(pages)));
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(res =>
                res || fetch(event.request)
            )
    );
});