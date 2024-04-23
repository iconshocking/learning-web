// NOTE: this file isn't needed since it just imports the default mocker service worker, but we
// could put our own custom logic here in addition if we wanted to

// importScripts only exists inside workers global scope
importScripts("./mockServiceWorker.js");
