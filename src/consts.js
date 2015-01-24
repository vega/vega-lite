var globals = require('./globals');

var consts = module.exports = {};

consts.encodingTypes = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, ALPHA, TEXT];

consts.dataTypes = {"O": O, "Q": Q, "T": T};

consts.dataTypeNames = ["O","Q","T"].reduce(function(r,x) {
  r[consts.dataTypes[x]] = x; return r;
},{});

consts.DEFAULTS = {
  //small multiples
  cellHeight: 200, // will be overwritten by bandWidth
  cellWidth: 200, // will be overwritten by bandWidth
  cellPadding: 0.1,
  cellBackgroundColor: "#fdfdfd",
  xAxisMargin: 80,
  yAxisMargin: 0,
  textCellWidth: 90,

  // marks
  bandSize: 21,
  bandPadding: 1,
  pointSize: 50,
  pointShape: "circle",
  strokeWidth: 2,
  color: "steelblue",
  textColor: "black",
  textAlign: "left",
  textBaseline: "middle",
  textMargin: 4,
  font: "Helvetica Neue",
  fontSize: "12",
  fontWeight: "normal",
  fontStyle: "normal",
  opacity: 1,
  _thickOpacity: 0.5,
  _thinOpacity: 0.2,

  // scales
  // TODO remove _xZero, ...
  _xZero: true,
  _xReverse: false,
  _yZero: true,
  _yReverse: false,
  timeScaleNice: "day"
};