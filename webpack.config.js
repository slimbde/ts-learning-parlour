const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
//console.log("isDev", isDev);

const optimization = () => {
  const config = { splitChunks: { chunks: "all" } };

  if (!isDev)
    config.minimizer = [
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin(),
    ]

  return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;



/////////////////////////// EXPORTS
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: ["@babel/polyfill", "./index.ts"],
    //analytics: "./analytics.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: filename(`js`)
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  optimization: optimization(),
  devServer: {
    port: 2500,
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    proxy: {                                    // to enable proxying install 'http-proxy-middleware'
      "/php-api": {                             // what to substitute
        target: "http://php-rest-api",          // where to redirect
        secure: false,                          // disable https
        changeOrigin: true,                     // on an other server
        //pathRewrite: { "^/php-api": "" }        // clear 'php-api' from request string
      }
    }
    //hot: isDev, - this should be disabled. Otherwise html page doesn't refresh
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./index.html", minify: { collapseWhitespace: !isDev } }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./assets/favicon.ico" }
      ]
    }),
    new MiniCssExtractPlugin({ filename: filename(`css`) }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: isDev, reloadAll: true }
          }
          , 'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|ttf|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: {
          loader: "ts-loader",
          //options: {
          //  presets: ["@babel/preset-env"],
          //  plugins: ["@babel/plugin-proposal-class-properties"]
          //}
        }
      }
    ],
  }
}