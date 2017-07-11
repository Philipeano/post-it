const path = require('path');
const webpack = require('webpack');

const DIST_DIR   = path.join(__dirname, 'bundle');
const CLIENT_DIR = path.join(__dirname, 'js');

module.exports = {
    context: CLIENT_DIR,

    entry: 'index.js',

    output: {
        path:     DIST_DIR,
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};