var globals = require('../globals'),
  util = require('../util'),
  schema = require('../schema/schema'),
  time = require('./time');

module.exports = vllayout;
var CHARACTER_WIDTH = 6;

function vllayout(encoding, stats) {
  var layout = box(encoding, stats);
  layout = offset(encoding, stats, layout);
  layout.characterWidth = CHARACTER_WIDTH;
  return layout;
}

function getCardinality(encoding, encType, stats) {
  var field = encoding.fieldName(encType);
  if (encoding.bin(encType)) {
    var bins = util.getbins(stats[field]);
    return (bins.stop - bins.start) / bins.step;
  }
  if (encoding.isType(encType, T)) {
    return time.cardinality(encoding, encType, stats);
  }
  return stats[field].cardinality;
}

/*
  HACK to set chart size
  NOTE: this fails for plots driven by derived values (e.g., aggregates)
  One solution is to update Vega to support auto-sizing
  In the meantime, auto-padding (mostly) does the trick
 */
function box(encoding, stats) {
  var hasRow = encoding.has(ROW),
      hasCol = encoding.has(COL),
      marktype = encoding.marktype();

  var cellWidth, cellHeight, cellPadding = encoding.config('cellPadding');

  // set cellWidth
  if (encoding.has(X)) {
    if (encoding.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      var xCardinality = getCardinality(encoding, X, stats);
      cellWidth = (xCardinality + encoding.band(X).padding) * encoding.bandSize(X);
    } else {
      cellWidth = hasCol ? encoding.enc(COL).width :  encoding.config("singleWidth");
    }
  } else {
    if (marktype === TEXT) {
      cellWidth = encoding.config('textCellWidth');
    } else {
      cellWidth = encoding.bandSize(X);
    }
  }

  // set cellHeight
  if (encoding.has(Y)) {
    if (encoding.isOrdinalScale(Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      var yCardinality = getCardinality(encoding, Y, stats);
      cellHeight = (yCardinality + encoding.band(Y).padding) * encoding.bandSize(Y);
    } else {
      cellHeight = hasRow ? encoding.enc(ROW).height :  encoding.config("singleHeight");
    }
  } else {
    cellHeight = encoding.bandSize(Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = getCardinality(encoding, COL, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality = getCardinality(encoding, ROW, stats);
    height = cellHeight * ((1 + cellPadding) * (rowCardinality - 1) + 1);
  }

  return {
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    width: width,
    height: height
  };
}

function offset(encoding, stats, layout) {
  [X, Y].forEach(function (x) {
    var maxLength;
    if (encoding.isOrdinalScale(x) || encoding.isType(x, T)) {
      maxLength = stats[encoding.fieldName(x)].maxlength;
    } else if (encoding.isType(x, Q)) {
      maxLength = Math.min(stats[encoding.fieldName(x)].maxlength, 7);
    }

    layout[x] = {
      axisTitleOffset: CHARACTER_WIDTH *  maxLength + 20
    };
  });
  return layout;
}
