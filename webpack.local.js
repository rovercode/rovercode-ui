const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './',
    proxy: {
      '/api': 'http://localhost:8000',
      '/jwt': 'http://localhost:8000',
    },
  },
});
