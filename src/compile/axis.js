var globals = require('../globals'),
  util = require('../util'),
  setter = util.setter,
  time = require('./time');

var axis = module.exports = {};

axis.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s === X || s === Y) a[props[x].scale] = 1;
    return a;
  }, {}));
};

axis.defs = function(names, encoding, opt) {
  return names.reduce(function(a, name) {
    a.push(axis.def(name, encoding, opt));
    return a;
  }, []);
};

axis.def = function(name, encoding, opt) {
  var type = name;
  var isCol = name == COL, isRow = name == ROW;
  if (isCol) type = 'x';
  if (isRow) type = 'y';

  var def = {
    type: type,
    scale: name
  };

  if (encoding.axis(name).grid) {
    def.grid = true;
    def.layer = 'back';
  }

  if (encoding.axis(name).title) {
    def = axis_title(def, name, encoding, opt);
  }

  if (isRow || isCol) {
    def.properties = {
      ticks: { opacity: {value: 0} },
      majorTicks: { opacity: {value: 0} },
      axis: { opacity: {value: 0} }
    };
  }

  if (isCol) {
    def.offset = [opt.xAxisMargin || 0, encoding.config('yAxisMargin')];
    def.orient = 'top';
  }

  if (name == X && encoding.isOrdinalScale(X)) {
    setter(def, ['properties','labels'], {
      angle: {value: 270},
      align: {value: 'right'},
      baseline: {value: 'middle'}
    });
  }

  if (encoding.axis(name).format) {
    def.format = encoding.axis(name).format;
  } else if (encoding.isType(name, Q)) {
    def.format = "s";
  } else if (encoding.isType(name, T) && !encoding.fn(name)) {
    def.format = "%Y-%m-%d";
  }

  var fn;
  // add custom label for time type
  if (encoding.isType(name, T) && (fn = encoding.fn(name)) && (time.hasScale(fn))) {
    setter(def, ['properties','labels','text','scale'], 'time-'+ fn);
  }

  return def;
};

function axis_title(axis, name, encoding, opt) {
  axis.title = encoding.fieldTitle(name);
  if (encoding.isOrdinalScale(name)) {
    axis.titleOffset = encoding.axis(name).titleOffset;

    // TODO: set appropriate titleOffset
    // maybe based on some string length from stats
  }
  return axis;
}
