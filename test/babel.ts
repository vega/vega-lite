// Helper required by Mocha to force Babel to run on vega-parser files
// (which aren't parsed by default as they reside in node_modules).
require('babel-core/register')({
  ignore: /node_modules\/(?!vega-parser)/
});
