const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const express = require("express");

const app = express();

const start = (cfg) => {
  const compiler = webpack(cfg.webpack_config, (err) => {
    console.log("Webpack compiled", err ? "error" : "success");
  });

  const instance = webpackDevMiddleware(compiler, {
    index: false,
    publicPath: cfg.webpack_config.output.publicPath,
  });

  app.use(instance);

  instance.waitUntilValid(() => {
    if (typeof process.send === "function") {
      process.send("ready");
    }
  });

  app.use(webpackHotMiddleware(compiler));

  app.get("*", (req, res) => {
    const search = req.url.split("?")[1] || "";
    res.redirect(`/index.html?${search}`);
  });

  return app;
};

const addr = "0.0.0.0";
const port = 3000;
start({
  webpack_config: require("./webpack.dev.config"),
}).listen(port, addr, () => {
  console.log(`Listening at http://${addr}:${port}`);
});
