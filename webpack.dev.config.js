const { join, resolve, basename } = require("node:path");

require("dotenv").config({});

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "eval-source-map",
  devServer: {
    hot: true,
  },
  watch: true,
  mode: "development",
  node: false,
  entry: {
    bundle: [`webpack-hot-middleware/client?reload=true`, "react-hot-loader/patch", "./src/index"],
    polyfill: ["./src/polyfills"],
  },
  resolve: {
    fallback: {
      crypto: false,
      fs: false,
      http: false,
      https: false,
      os: false,
      path: false,
      net: false,
      stream: false,
      tls: false,
      url: false,
      zlib: false,
    },
    modules: [resolve(__dirname, "src"), resolve(__dirname, "node_modules")],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": resolve(__dirname, "src"),
      "react-dom": "@hot-loader/react-dom",
    },
  },
  output: {
    path: join(__dirname, "static"),
    filename: "[name].js?h=[fullhash]",
    chunkFilename: "chunk.[contenthash].js?h=[fullhash]",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              target: "es2020",
            },
          },
        ],
      },
      {
        test: /\.s?css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico|ttf|eot|woff(2))$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css?h=[chunkhash]",
      experimentalUseImportModule: false,
      insert: (linkTag) => {
        const preloadLinkTag = document.createElement("link");
        preloadLinkTag.rel = "preload";
        preloadLinkTag.as = "style";
        preloadLinkTag.href = linkTag.href;
        document.head.appendChild(preloadLinkTag);
        document.head.appendChild(linkTag);
      },
    }),
    new HtmlWebpackPlugin({
      title: "Test WalletConnect with TrustWallet",
      inject: "head",
      publicPath: "/",
    }),
    new WebpackManifestPlugin({}),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.EnvironmentPlugin({
      WC_ID: "",
      WALLET_ADDRESS: "",
    }),
  ],
  optimization: {
    runtimeChunk: "single",
  },
};
