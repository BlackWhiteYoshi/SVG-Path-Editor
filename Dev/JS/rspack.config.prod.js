const path = require("path");

module.exports = {
    mode: "production",
    devtool: false,
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, ".."),
        filename: "temp.js"
    }
};

// npx rspack build --config webpack.config.prod.js
