const path = require("path");
const postcssPlugins = [require("postcss-mixins"), require("postcss-nested"), require("postcss-simple-vars"), require("autoprefixer")];
const { mergeWithRules } = require("webpack-merge");

const cssConfig = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

const postcssConfig = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: postcssPlugins,
              },
            },
          },
        ],
      },
    ],
  },
};

const mergedCssConfig = mergeWithRules({
  module: {
    rules: {
      test: "match",
      use: {
        loader: "match",
        options: "replace",
      },
    },
  },
})(cssConfig, postcssConfig);

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

exports.output = () => ({
  output: {
    path: path.resolve(__dirname, "src"),
    filename: "bundle.js",
  },
});

exports.loadPostcss = () => mergedCssConfig;
