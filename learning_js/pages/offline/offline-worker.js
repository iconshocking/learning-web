// self refers to global scope of service itself (returns Window for normal browser scripts)
self.addEventListener("install", (e) => {
  // waitUntil() holds the resolution of the event until the passed promise resolves successfully (or rejects -
  // for 'install' events, the service worker is discarded)
  e.waitUntil(
    caches.open("video-store").then((cache) =>
      // fetches the responses and then adds them
      cache.addAll([
        "/pages/offline/offline.html",
        "/pages/offline/offline.js",
      ]),
    ),
  );
});

// intercept "fetch" events
self.addEventListener("fetch", (e) => {
  console.log(e.request.url);
  // check cache for match or fetch from network
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
