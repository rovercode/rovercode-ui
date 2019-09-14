const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './',
    proxy: {
      '/api': {
        target: 'https://alpha.rovercode.com',
        changeOrigin: true,
      },
      '/jwt': {
        target: 'https://alpha.rovercode.com',
        changeOrigin: true,
      },
    },
  },
});
