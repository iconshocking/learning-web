import eslint from "@rollup/plugin-eslint";
import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
// import babel from "vite-plugin-babel";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (mode === "development") {
    return {
      plugins: [devEslint()],
    };
  }
  /* NOTE: Vite tree-shakes and minifies CSS and JS automatically, so if an export is needed but
  not used via an entrypoint, extra configuration is needed. */
  return {
    /* Setting this target prevents any transpilation, so we can test the babel/legacy plugins.
    Vite's default targets are the minimum browser verseins that have full support for native ESM.
    */
    targets: "esnext",
    // postcss is supported by default via postcss.config.cjs
    plugins: [
      // eslint plugin default includes standard JS/TS/JSX/Vue/Svelte files and excludes node_modules
      {
        ...eslint(),
        // only applies to the build command
        apply: "build",
      },
      {
        ...eslint({
          failOnWarning: false,
          failOnError: false,
        }),
        // only applies to the serve command, so won't fail the dev server
        apply: "serve",
        // Vite plugin execution order:
        // - Alias
        // - enforce: 'pre'
        // - Vite core plugins
        // - plugins without enforce value
        // - Vite build plugins
        // - enforce: 'post'
        // - Vite post build plugins (minify, manifest, reporting)
        enforce: "post",
      },
      legacy({ targets: ["defaults", "IE 11"] }),
      /* Proof of concept for adding babel into the plugin pipeline, but legacy() is generally more
      useful since vite already supports transpilation to specific targets while legacy() transpiles
      support for pre-ESM browsers using nomodule attribute for scripts, which are ignored by
      ESM-suppporting browsers. */
      /* babel({
        filter: /\.js$/,
        babelConfig: {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: "3.36.0",
                debug: true,
              },
            ],
          ],
          targets: ["> 0.25%", "not dead", "IE 11"],
        },
      }), */
    ],
  };
});
