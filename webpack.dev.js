const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    port: 8080,
    // open: true,
    watchFiles: ["src/index.js"],
  },
});
