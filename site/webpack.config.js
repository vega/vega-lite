const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../build/site/static/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build/site')
  },
  devtool: 'cheap-source-map'
};
