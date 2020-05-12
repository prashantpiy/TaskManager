const path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: "cheap-module-eval-source-map",
    entry: ["babel-polyfill", "./index.js"],
    output: {
        path: __dirname + "/src/",
        filename: "bundle.js",
        publicPath: '/'

    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["react", "es2015", "stage-2"],
                }
            }
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
};
