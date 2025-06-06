const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
require('dotenv').config();

const config = {
  entry: {
    popup: path.join(__dirname, "src/popup.tsx"),
    content: path.join(__dirname, "src/content.ts"),
    background: path.join(__dirname, "src/background.ts"),
  },
  output: { path: path.join(__dirname, "dist"), filename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    }
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_URL_USER_CONNECTED': JSON.stringify(process.env.REACT_APP_URL_USER_CONNECTED),
      'process.env.REACT_APP_URL_STREAM': JSON.stringify(process.env.REACT_APP_URL_STREAM),
      'process.env.REACT_APP_DEFAULT_WATCHERS': JSON.stringify(process.env.REACT_APP_DEFAULT_WATCHERS)
    })
  ],
  devtool: "cheap-module-source-map",
  mode: "development" // production || development
};

module.exports = config;
