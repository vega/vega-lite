var globals = require('./globals');

var consts = module.exports = {};

consts.encodingTypes = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, ALPHA, TEXT];

consts.dataTypes = {'O': O, 'Q': Q, 'T': T};

consts.dataTypeNames = ['O', 'Q', 'T'].reduce(function(r, x) {
  r[consts.dataTypes[x]] = x; return r;
},{});

consts.DEFAULTS = {
  // single plot
  singleHeight: 200, // will be overwritten by bandWidth * (cardinality + padding)
  singleWidth: 200, // will be overwritten by bandWidth * (cardinality + padding)
  largeBandSize: 21,

  smallBandSize: 13, //small multiples or single plot with high cardinality

  // small multiples
  cellPadding: 0.1,
  cellBackgroundColor: '#fdfdfd',
  textCellWidth: 90,

  // marks
  strokeWidth: 2,

  // scales
  timeScaleLabelLength: 3
};
