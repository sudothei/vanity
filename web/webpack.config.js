const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  env.API_PORT;
  env.API_HOSTNAME;
  console.log("API_PORT: ", env.API_PORT);
  console.log("API_HOSTNAME: ", env.API_HOSTNAME);
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    resolve: {
      modules: [path.join(__dirname, "src"), "node_modules"],
      alias: {
        react: path.join(__dirname, "node_modules", "react"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: { loader: "ts-loader" },
        },
        {
          test: /\.css$/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        },
        {
          test: /\.(webp)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new webpack.DefinePlugin(envKeys),
    ],
  };
};
