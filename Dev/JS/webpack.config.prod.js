const path = require("path");

module.exports = {
    mode: "production",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, ".."),
        filename: "temp.js"
    }
};

// npx webpack build --config webpack.config.prod.js
