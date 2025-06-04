import config from "./rspack.config.mjs";

config.mode = "production";
config.output.filename = "temp.js";
config.watch = false;
config.devtool = false;

export default config;

// npx rspack build --config webpack.config.prod.mjs
