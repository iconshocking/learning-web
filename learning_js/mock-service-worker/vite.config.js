import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    // maps transpiled/minified code to original code for easier debugging
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "./offline-msw.html",
        // add service worker as an entry point since:
        //  - 1) it is not imported like a standard module
        //  - 2) it needs to not be bundled into a JS file with other JS
        "cache-sw": "./cache-sw.js",
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === "cache-sw"
            ? "[name].js" // keep service worker in root
            : "assets/[name]-[hash].js"; // others in `assets/` like normal
        },
      },
    },
  },
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      workbox: {
        globPatterns: ["**/*.{js,css,html}"],
      },
      srcDir: "./",
      filename: "cache-sw.js",
      injectManifest: {
        enableWorkboxModulesLogs: true,
      },
      // whether to manually register the service worker
      injectRegister: false,
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
