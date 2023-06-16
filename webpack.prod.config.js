const { join, resolve, basename } = require("node:path");

require("dotenv").config({});

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { EsbuildPlugin } = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const cacheDirectory = process.env.CACHE_DIRECTORY
  ? join(__dirname, process.env.CACHE_DIRECTORY)
  : join(__dirname, ".cache");

module.exports = {
  mode: "production",
  cache: {
    type: "filesystem",
    cacheDirectory,
    compression: "gzip",
  },
  entry: {
    bundle: ["./src/index"],
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
    },
  },
  output: {
    path: join(__dirname, "dist"),
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
          MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: "[name].css?h=[chunkhash]",
      chunkFilename: "chunk.[chunkhash].css",
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
    minimizer: [
      new EsbuildPlugin({
        target: "es2020",
        css: false,
        minify: true,
        legalComments: "none",
      }),
    ],
  },
  bail: true,
};
