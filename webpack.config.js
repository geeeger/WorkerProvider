const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const config = {
    entry: "./src/index.ts",
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        libraryTarget: "umd",
        library: "WorkerProvider",
        libraryExport: "default"
    },
    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     exclude: /(node_modules)/,
            //     loader: "ts-loader",
            // },
            {
                test: /\.ts$/,
                use: ["ts-loader"],
                enforce: "pre",
            },
            {
                test: /\.ts$/,
                enforce: "pre",
                loader: "tslint-loader",
                exclude: /(node_modules)/,
                options: {
                    /* Loader options go here */
                },
            },
        ],
    }
};

module.exports = (_, argv) => {
    if (argv.mode === "development") {
        config.devtool = "source-map";
        config.output.filename = "index.js";
    }

    if (argv.mode === "production") {
        config.output.filename = "index.min.js";
        config.optimization = {};
        config.optimization.minimizer = [
            new UglifyJsPlugin()
        ];
    }
    return config;
};
