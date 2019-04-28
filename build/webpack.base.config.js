const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('./config');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    bundle: './app/App.jsx'
  },
  output: {
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name]-[id].[chunkhash:8].bundle.js',
    publicPath: '/',
    path: path.join(__dirname, '/dist/')
  },
  module: {
    loaders: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: ['jsx-loader', 'babel-loader']
    }, {
      test: /\.scss$/,
      exclude: /^node_modules$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192',
    }, {
      test: /\.css$/,
      exclude: /^node_modules$/,
      loaders: ['style-loader', 'css-loader']
    }, {
      test: /\.(woff|eot|ttf|svg|gif)$/,
      loader: 'file-loader?name=iconfont/[path][name].[ext]',
    }]
  },
};