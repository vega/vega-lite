var vl = {
  Encoding: require('./Encoding'),
  axis: require('./axis'),
  scale: require('./scale'),
  // schema: require('./schema')

};

global.TABLE = "table";
global.STACKED = "stacked";
global.INDEX = "index";

global.X = "x";
global.Y = "y";
global.ROW = "row";
global.COL = "col";
global.SIZE = "size";
global.SHAPE = "shape";
global.COLOR = "color";
global.ALPHA = "alpha";
global.TEXT = "text";

global.O = 1;
global.Q = 2;
global.T = 4;

vl.encodings = {X:X, Y:Y, ROW:ROW, COL:COL, SIZE:SIZE, SHAPE:SHAPE, COLOR:COLOR, ALPHA:ALPHA, TEXT:TEXT};

vl.dataTypes = {"O": O, "Q": Q, "T": T};

// inverse mapping e.g., 1=>O
vl.dataTypeNames = ["O","Q","T"].reduce(function(r,x) {
  r[vl.dataTypes[x]] = x; return r;
},{});


// vl.schema.aggr.enum
vl.quantAggTypes = ["avg", "sum", "min", "max", "count"];

// vl.schema.timefns
vl.timeFuncs = ["month", "year", "day", "date", "hour", "minute", "second"];
// vl.schema.scale_type.enum
vl.quantScales = ["-", "log","pow", "sqrt", "quantile"];

vl.DEFAULTS = {
  // template
  width: undefined,
  height: undefined,
  viewport: undefined,
  _minWidth: 20,
  _minHeight: 20,

  // data source
  dataUrl: undefined, //for easier export
  useVegaServer: false,
  vegaServerUrl: "http://localhost:3001",
  vegaServerTable: undefined,
  dataFormatType: "json",

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


vl.keys = function (obj) {
  var k = [], x;
  for (x in obj) k.push(x);
  return k;
}

vl.vals = function (obj) {
  var v = [], x;
  for (x in obj) v.push(obj[x]);
  return v;
}

vl.duplicate = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

vl.any = function(arr, f){
  var i=0, k;
  for (k in arr) {
    if(f(arr[k], k, i++)) return true;
  }
  return false;
}

vl.all = function(arr, f){
  var i=0, k;
  for (k in arr) {
    if(!f(arr[k], k, i++)) return false;
  }
  return true;
}

vl.merge = function(dest, src){
  return vl.keys(src).reduce(function(c, k){
    c[k] = src[k];
    return c;
  }, dest);
};

vl.error = function(msg){
  console.error("[VL Error]", msg);
}

module.exports = vl;