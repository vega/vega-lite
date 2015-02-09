var globals = require('../globals'),
  util = require('../util');

module.exports = function(encoding, stats) {
  var enc = encoding;

  var estimateOpacity = function() {
    if (!stats) {
      return 1;
    }

    var numPoints = 0;
    var opacityFactor = 1;

    var numBins = function(field) {
      var bins = util.getbins(stats[enc.fieldName(field)], enc.config('maxbins'));
      return (bins.stop - bins.start) / bins.step;
    }

    // estimate the number of points based on aggregation and binning
    if (!enc.has(X) && !enc.has(Y)) {
      numPoints = 1;
    } else if (!enc.has(X)) {
      numPoints = stats[enc.fieldName(Y)].count;
      opacityFactor *= 0.6;
    } else if (!enc.has(Y)) {
      numPoints = stats[enc.fieldName(X)].count;
      opacityFactor *= 0.6;
    } else if (enc.bin(X) && enc.aggr(Y)) {
      numPoints = numBins(X);
    } else if (enc.bin(Y) && enc.aggr(X)) {
      numPoints = numBins(Y);
    } else if (enc.aggr(Y)) {
      numPoints = stats[enc.fieldName(X)].cardinality;
    } else if (enc.aggr(X)) {
      numPoints = stats[enc.fieldName(Y)].cardinality;
    } else {
      numPoints = stats[enc.fieldName(X)].count;
    }

    // small multiples divide number of points
    var numMultiples = 1;
    if (enc.has(ROW)) {
      // 0.8  because of skew
      numMultiples *= 0.8 * stats[enc.fieldName(ROW)].cardinality;
    }
    if (enc.has(COL)) {
      numMultiples *= 0.8 * stats[enc.fieldName(COL)].cardinality;
    }
    numPoints /= numMultiples;

    // reduce the opacity if we use binning or ordinal type
    if (enc.isOrdinalScale(X) || enc.bin(X)) {
      opacityFactor *= 0.9;
    }
    if (enc.isOrdinalScale(Y) || enc.bin(Y)) {
      opacityFactor *= 0.9;
    }

    var opacity = 0;
    if (numPoints < 20) {
      opacity = 1;
    } else if (numPoints < 200) {
      opacity = 0.8;
    } else if (numPoints < 1000) {
      opacity = 0.6;
    } else {
      opacity = 0.3;
    }

    // console.log(numPoints)
    // console.log(opacityFactor)
    // console.log(opacityFactor * opacity)

    return opacityFactor * opacity;
  }

  return {
    opacity: estimateOpacity()
  }
};
