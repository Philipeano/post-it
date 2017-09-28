<<<<<<< HEAD
<<<<<<< HEAD
import webpack from 'webpack';
import path from 'path';

export default {
=======
// import webpack from 'webpack';
// import path from 'path';
=======
>>>>>>> server
const path = require('path');

module.exports = {
>>>>>>> server
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
