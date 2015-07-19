'use strict';

require('../globals');

var time = require('./time'),
  util = require('../util'),
  setter = util.setter;

var legend = module.exports = {};

legend.defs = function(encoding, style) {
  var defs = [];

  if (encoding.has(COLOR) && encoding.field(COLOR).legend) {
    defs.push(legend.def(COLOR, encoding, {
      fill: COLOR,
      orient: 'right'
    }, style));
  }

  if (encoding.has(SIZE) && encoding.field(SIZE).legend) {
    defs.push(legend.def(SIZE, encoding, {
      size: SIZE,
      orient: defs.length === 1 ? 'left' : 'right'
    }, style));
  }

  if (encoding.has(SHAPE) && encoding.field(SHAPE).legend) {
    if (defs.length === 2) {
      // TODO: fix this
      console.error('Vega-lite currently only supports two legends');
      return defs;
    }
    defs.push(legend.def(SHAPE, encoding, {
      shape: SHAPE,
      orient: defs.length === 1 ? 'left' : 'right'
    }, style));
  }
  return defs;
};

legend.def = function(name, encoding, def, style) {
  var timeUnit = encoding.field(name).timeUnit;

  def.title = encoding.fieldTitle(name);

  if (style.opacity) {
    setter(def, ['properties', 'symbols', 'opacity', 'value'], style.opacity);
  }

  if (encoding.isType(name, T) &&
    timeUnit &&
    time.hasScale(timeUnit)
  ) {
    setter(def, ['properties', 'labels', 'text', 'scale'], 'time-'+ timeUnit);
  }

  return def;
};
