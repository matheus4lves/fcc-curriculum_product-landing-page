const path = require("path");
const postcssPlugins = [require("postcss-mixins"), require("postcss-nested"), require("postcss-simple-vars"), require("autoprefixer"), require("postcss-import")];
const { mergeWithRules } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const ALL_FILES = glob.sync(path.join(__dirname, "./src/**/*.html"));
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

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

// Do not use style-loader and mini-css-extract-plugin together.
// See: https://www.npmjs.com/package/mini-css-extract-plugin
const productionCssConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
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
    clean: true,
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

exports.extractCss = () =>
  mergeWithRules({
    module: {
      rules: ["append"],
    },
    plugins: ["append"],
  })(htmlConfig, productionCssConfig, postcssConfig);

exports.eliminateUnusedCss = () => ({
  plugins: [
    new PurgeCSSPlugin({
      paths: ALL_FILES, // Consider extracting as a parameter
    }),
  ],
});

exports.loadJavaScript = () => ({
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
});

exports.minifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [new CssMinimizerWebpackPlugin({ minimizerOptions: options })],
  },
});

exports.minifyJavaScript = () => ({
  optimization: { minimizer: [new TerserWebpackPlugin()] },
});
