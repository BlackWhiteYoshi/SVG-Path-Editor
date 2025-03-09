const path = require("path");

module.exports = {
    mode: "production",
    devtool: false,
    entry: "./main.ts",
    output: {
        path: path.resolve(__dirname, ".."),
        filename: "temp.js"
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
    }
};

// npx rspack build --config webpack.config.prod.js
