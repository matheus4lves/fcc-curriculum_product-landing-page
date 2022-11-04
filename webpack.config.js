const { merge, mergeWithRules } = require("webpack-merge");
const parts = require("./webpack.parts");
const mode = process.env.mode;
const commonConfig = merge([{ entry: ["./src/scripts", "./src/index.html"] }, parts.output(), parts.page()]);
const devConfig = merge([parts.module(), parts.devServer()]);
const prodConfig = mergeWithRules({
  module: {
    rules: ["append"],
  },
  plugins: ["append"],
})([parts.extractCss(), parts.eliminateUnusedCss(), parts.loadJavaScript(), { optimization: { splitChunks: { chunks: "all" } } }, parts.minifyCSS({ options: { preset: ["default"] } })]);

const getConfig = mode => {
  switch (mode) {
    case "development":
      return merge(commonConfig, devConfig, { mode });
    case "production":
      return merge(commonConfig, prodConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
