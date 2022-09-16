const path = require("path");
const postcssPlugins = [require("postcss-mixins"), require("postcss-nested"), require("postcss-simple-vars"), require("autoprefixer"), require("postcss-import")];
const { mergeWithRules } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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

const htmlConfig = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
    ],
  },
};

exports.devServer = () => ({
  devServer: {
    host: "local-ip",
    liveReload: true,
    port: parseInt(process.env.PORT, 10) || 8080,
    static: {
      directory: path.join(__dirname, "dist"),
    },
  },
});

exports.output = () => ({
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
});

exports.module = () =>
  mergeWithRules({
    module: {
      rules: ["append"],
    },
  })(htmlConfig, cssConfig, postcssConfig);

exports.page = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
});
