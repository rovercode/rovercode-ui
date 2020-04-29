/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
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
      LOGGER_ENDPOINT: JSON.stringify(process.env.FRONTEND_LOGGER_ENDPOINT),
      SAVE_DEBOUNCE_TIME: JSON.stringify(process.env.SAVE_DEBOUNCE_TIME),
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      title: 'Rovercode',
    }),
    new MiniCssExtractPlugin({
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
