const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    // fetch polyfill to support iOS
    'whatwg-fetch',
    path.join(__dirname, 'client', 'client.js')
  ],

  output: {
    path: path.join(__dirname, 'app', 'public'),
    filename: 'js/bundle.js'
  },

  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: 'node_modules',
      query: {
        presets: ['airbnb', 'es2015', 'react']
      }
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!sass-loader'
      })
    }]
  },

  plugins: [
    new webpack.ProvidePlugin({
      // fetch polyfill to support iOS
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin('styles/main.css')
  ]
};
