/* eslint-disable import/no-extraneous-dependencies */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './',
    proxy: {
      '/api': 'http://localhost:8001',
      '/jwt': 'http://localhost:8001',
    },
  },
});
