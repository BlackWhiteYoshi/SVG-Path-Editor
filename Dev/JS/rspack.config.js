const path = require("path");

module.exports = {
    mode: "development",
    devtool: "eval",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, ".."),
        filename: "site.js"
    },
    watch: true
};

// npx rspack build
