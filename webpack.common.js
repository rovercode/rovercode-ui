/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  output: {
    filename: 'app.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      SENTRY_DSN: JSON.stringify(process.env.FRONTEND_SENTRY_DSN),
      PXT_HEX_URL: JSON.stringify(process.env.PXT_HEX_URL
        || 'https://rovercode-pxt.s3.us-east-2.amazonaws.com/alpha/rovercode.hex'),
      SAVE_DEBOUNCE_TIME: JSON.stringify(process.env.SAVE_DEBOUNCE_TIME),
      SEARCH_DEBOUNCE_TIME: JSON.stringify(process.env.SEARCH_DEBOUNCE_TIME),
      SUBSCRIPTION_SERVICE: JSON.stringify(process.env.SUBSCRIPTION_SERVICE
        || 'http://localhost:3000'),
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      title: 'Rovercode',
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/favicon.png',
      cache: true,
      inject: true,
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }),
  ],
  devtool: 'source-map',
};
