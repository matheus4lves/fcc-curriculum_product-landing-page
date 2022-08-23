const path = require("path");

exports.devServer = () => ({
  devServer: {
    host: "local-ip",
    liveReload: true,
    port: parseInt(process.env.PORT, 10) || 8080,
    static: {
      directory: path.join(__dirname, "src"),
    },
  },
});

exports.devOutput = () => ({
  output: {
    path: path.resolve(__dirname, "src"),
    filename: "bundle.js",
  },
});
