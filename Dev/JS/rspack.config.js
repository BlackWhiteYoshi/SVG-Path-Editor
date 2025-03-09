const path = require("path");

module.exports = {
    mode: "development",
    entry: "./main.ts",
    output: {
        path: path.resolve(__dirname, ".."),
        filename: "site.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript"
                        }
                    }
                },
                type: "javascript/auto"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    watch: true
};

// npx rspack build
