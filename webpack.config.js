const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

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
            {
                test: /\.ts$/,
                use: ["ts-loader"],
                enforce: "pre",
            },
            {
                test: /\.ts$/,
                enforce: "pre",
                loader: "eslint-loader",
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
        config.optimization.minimizer = [new TerserPlugin()];
    }
    return config;
};
