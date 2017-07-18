const webpack = require('webpack');

module.exports = {
  entry: './template/js/index.js',
  output: {
    path: './template/bundle',
    filename: 'index.js',
    resolve: { extensions: ['', '.js', '.jsx'] },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
