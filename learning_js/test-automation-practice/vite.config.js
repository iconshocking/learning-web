import { default as devEslint } from "@nabla/vite-plugin-eslint";
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
      eslint({
        include: ["**/*.js"],
        exclude: ["node_modules", "dist"],
      }),
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
