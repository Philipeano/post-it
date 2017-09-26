import path from 'path';

export default {
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
