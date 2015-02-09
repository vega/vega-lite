var globals = require('../globals'),
  util = require('../util');

var style = module.exports = {};

style.autoStyle = function(encoding, stats) {

  var enc = encoding;

  var estimateOpacity = function() {
    if (!stats) {
      return 1;
    }

    var numPoints = 0;
    var alphaFactor = 1;


    if (!enc.has(X) && !enc.has(Y)) {
      numPoints = 1;
    } else if (!enc.has(X)) {
      numPoints = stats[enc.fieldName(Y)].count;
    } else if (!enc.has(Y)) {
      numPoints = stats[enc.fieldName(X)].count;
    } else if (enc.bin(X) && enc.aggr(Y)) {
      var bins = util.getbins(stats[enc.fieldName(X)], enc.config('maxbins'));
      numPoints = 1.0 * (bins.stop - bins.start) / bins.step;
    } else if (enc.bin(Y) && enc.aggr(X)) {
      var bins = util.getbins(stats[enc.fieldName(Y)], enc.config('maxbins'));
      numPoints = 1.0 * (bins.stop - bins.start) / bins.step;
    } else if (enc.aggr(Y)) {
      numPoints = stats[enc.fieldName(X)].cardinality;
    } else if (enc.aggr(X)) {
      numPoints = stats[enc.fieldName(Y)].cardinality;
    } else {
      numPoints = stats[enc.fieldName(X)].count;
    }

    // reduce the opacity if we use binning or ordinal type
    if (enc.isType(X, O) || enc.bin(X)) {
      alphaFactor *= 0.9;
    }
    if (enc.isType(Y, O) || enc.bin(Y)) {
      alphaFactor *= 0.9;
    }

    var opacity = 0;
    if (numPoints < 20) {
      opacity = 1;
    } else if (numPoints < 200) {
      opacity = 0.8;
    } else if (numPoints < 1000) {
      opacity = 0.5;
    } else {
      opacity = 0.3;
    }

    return alphaFactor * opacity;
  }

  return {
    opacity: estimateOpacity()
  }
};
