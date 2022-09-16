const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const mode = process.env.mode;

const commonConfig = merge([{ entry: ["./src/scripts", "./src/index.html"] }, parts.module(), parts.page()]);
const devConfig = merge([parts.output(), parts.devServer()]);

const getConfig = mode => {
  switch (mode) {
    case "development":
      return merge(commonConfig, devConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
