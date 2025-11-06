import path from "path";

export default {
    mode: "development",
    entry: "./Main.ts",
    output: {
        path: path.resolve(import.meta.dirname, ".."),
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

// rspack build
