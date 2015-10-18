'use strict';

require('../globals');

var time = require('./time'),
  util = require('../util'),
  setter = util.setter,
  getter = util.getter;

var legend = module.exports = {};

legend.defs = function(encoding, style) {
  var defs = [];

  if (encoding.has(COLOR) && encoding.encDef(COLOR).legend) {
    defs.push(legend.def(COLOR, encoding, {
      fill: COLOR
    }, style));
  }

  if (encoding.has(SIZE) && encoding.encDef(SIZE).legend) {
    defs.push(legend.def(SIZE, encoding, {
      size: SIZE
    }, style));
  }

  if (encoding.has(SHAPE) && encoding.encDef(SHAPE).legend) {
    defs.push(legend.def(SHAPE, encoding, {
      shape: SHAPE
    }, style));
  }
  return defs;
};

legend.def = function(name, encoding, def, style) {
  var timeUnit = encoding.encDef(name).timeUnit;

  def.title = legend.title(name, encoding);
  def.orient = encoding.encDef(name).legend.orient;

  def = legend.style(name, encoding, def, style);

  if (encoding.isType(name, T) &&
    timeUnit &&
    time.hasScale(timeUnit)
  ) {
    setter(def, ['properties', 'labels', 'text', 'scale'], 'time-'+ timeUnit);
  }

  return def;
};

legend.style = function(name, e, def, style) {
  var symbols = getter(def, ['properties', 'symbols']),
    marktype = e.marktype();

  switch (marktype) {
    case 'bar':
    case 'tick':
    case 'text':
      symbols.stroke = {value: 'transparent'};
      symbols.shape = {value: 'square'};
      break;

    case 'circle':
    case 'square':
      symbols.shape = {value: marktype};
      /* fall through */
    case 'point':
      // fill or stroke
      if (e.encDef(SHAPE).filled) {
        if (e.has(COLOR) && name === COLOR) {
          symbols.fill = {scale: COLOR, field: 'data'};
        } else {
          symbols.fill = {value: e.value(COLOR)};
        }
        symbols.stroke = {value: 'transparent'};
      } else {
        if (e.has(COLOR) && name === COLOR) {
          symbols.stroke = {scale: COLOR, field: 'data'};
        } else {
          symbols.stroke = {value: e.value(COLOR)};
        }
        symbols.fill = {value: 'transparent'};
        symbols.strokeWidth = {value: e.config('strokeWidth')};
      }

      break;
    case 'line':
    case 'area':
      // TODO use shape here after implementing #508
      break;
  }

  var opacity = e.encDef(COLOR).opacity || style.opacity;
  if (opacity) {
    symbols.opacity = {value: opacity};
  }
  return def;
};

legend.title = function(name, encoding) {
  var leg = encoding.encDef(name).legend;

  if (leg.title) return leg.title;

  return encoding.fieldTitle(name);
};
