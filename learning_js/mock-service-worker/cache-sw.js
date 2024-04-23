import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

cleanupOutdatedCaches();
// self.__WB_MANIFEST is replaced by VitePWA when set to "injectManifest"
precacheAndRoute(self.__WB_MANIFEST);
