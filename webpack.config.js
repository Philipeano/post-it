const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './template/js/index.js',
  output: {
    path: path.resolve(__dirname, './template/bundle'),
    filename: 'index.js',
    // publicPath: "assets",
    // resolve: { extensions: ['', '.js', '.jsx'] },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}


