import postcssNesting from "postcss-nesting";
import postcssSimpleVars from "postcss-simple-vars";

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [postcssNesting, postcssSimpleVars],
};

export default config;
