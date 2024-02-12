import { defineConfig } from "vite";

export default defineConfig({
  // these configurations are true by default, so toggling them is useful to debug to make sure
  // minification/tree-shaking occurs
  build: {
    // minify: false,
    rollupOptions: {
      // treeshake: false,
    },
  },
});
