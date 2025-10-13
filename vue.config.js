const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  publicPath: "",
  devServer: {
    historyApiFallback: true,
    // disableHostCheck: false,
    compress: true,
    server: {
      type: "https",
    },
  },
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    css: {
      extract: {
        ignoreOrder: true,
      },
    },
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
      }),
    ],
    devtool: "source-map",
    optimization: {
      minimize: process.env.NODE_ENV === "production",
      minimizer:
        process.env.NODE_ENV === "production"
          ? [
              new TerserPlugin({
                minify: TerserPlugin.uglifyJsMinify,
                terserOptions: {
                  compress: {
                    drop_console: true,
                  },
                },
              }),
            ]
          : [],
    },
  },
};
