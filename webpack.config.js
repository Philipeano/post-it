// import webpack from 'webpack';
// import path from 'path';
const path = require('path');
const webpack = require('webpack');

// export default {
module.exports = {
  entry: './template/js/index.js',
  output: {
    path: path.resolve(__dirname, './template/bundle'),
    filename: 'index.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: { extensions: ['.js', '.jsx'] }
};
