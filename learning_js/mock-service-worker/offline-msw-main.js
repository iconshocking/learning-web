if (!("serviceWorker" in navigator)) {
  // return
}

// need to copy node_modules/msw/lib/mockServiceWorker.js into your project or run `npx msw init
// <PUBLIC_DIR>` in order to have the service worker file that this file configures and starts
if (import.meta.env.DEV) {
  console.log("Registering mock service worker...");
  const { setupWorker } = await import("msw/browser");
  const { handlers } = await import("./handlers-msw");
  const worker = setupWorker();
  // for proper mocking, requests should be blocked until the worker is ready
  await worker.start({ serviceWorker: { url: "/mock-sw.js" } }, { onUnhandledRequest: "bypass" });
  worker.use(...handlers);
} else {
  navigator.serviceWorker.register("/cache-sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}
