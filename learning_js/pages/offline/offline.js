if ("serviceWorker" in navigator) {
  // service worker registrations last forever, but the service worker thread will be ended upon navigating away from the origin
  // (unless the service worker is in use by other pages)
  navigator.serviceWorker
    // service workers can have a reduced scope via options parameter, but it cannot be higher than the directory the file is in
    // (can only be done with 'service-worker-allowed' header)
    .register("/pages/offline/offline-worker.js") // URL is relative to origin, not this script's file location
    .then(() => console.log("Service Worker Registered"));
}
