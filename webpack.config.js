module.exports = {
  entry: './js/index.js',
  output: {
    path: './bundle',
    filename: 'bundle.js',
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


// const path = require('path');
// const webpack = require('webpack');
//
// const DIST_DIR   = path.join(__dirname, 'bundle');
// const CLIENT_DIR = path.join(__dirname, 'js');
//
// module.exports = {
//     context: CLIENT_DIR,
//
//     entry: 'index.js',
//
//     output: {
//         path:     DIST_DIR,
//         filename: 'index.js'
//     },
//
//     resolve: {
//         extensions: ['', '.js', '.jsx']
//     }
// };

