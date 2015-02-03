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

axis.defs = function(names, encoding, layout, opt) {
  return names.reduce(function(a, name) {
    a.push(axis.def(name, encoding, layout, opt));
    return a;
  }, []);
};

axis.def = function(name, encoding, layout, opt) {
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
    def = axis_title(def, name, encoding, layout, opt);
  }

  if (isRow || isCol) {
    def.properties = {
      ticks: { opacity: {value: 0} },
      majorTicks: { opacity: {value: 0} },
      axis: { opacity: {value: 0} }
    };
  }

  if (isCol) {
    def.orient = 'top';
  }

  if (isRow) {
    def.offset = axisTitleOffset(encoding, layout, Y) + 20;
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

function axis_title(axis, name, encoding, layout, opt) {
  var maxLength = null,
    fieldTitle = encoding.fieldTitle(name);
  if (name===X) {
    maxlength = layout.cellWidth / layout.characterWidth;
  } else if (name === Y) {
    maxlength = layout.cellHeight / layout.characterWidth;
  }

  axis.title = maxlength ? util.truncate(fieldTitle, maxlength) : fieldTitle;

  if (encoding.isOrdinalScale(name)) {
    axis.titleOffset = axisTitleOffset(encoding, layout, name);
  }
  return axis;
}

function axisTitleOffset(encoding, layout, name) {
  return encoding.axis(name).titleOffset ||
      layout[name].axisTitleOffset;
}
