const path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  publicPath: '/',
  bundlePath: path.join(__dirname, '/dist/')
};