import {setter, getter} from '../util';
import {Enctype, Type} from '../consts';

import * as time from './time';

export function defs(encoding, styleCfg) {
  var defs = [];

  if (encoding.has(Enctype.COLOR) && encoding.encDef(Enctype.COLOR).legend) {
    defs.push(def(Enctype.COLOR, encoding, {
      fill: Enctype.COLOR
      // TODO: consider if this should be stroke for line
    }, styleCfg));
  }

  if (encoding.has(Enctype.SIZE) && encoding.encDef(Enctype.SIZE).legend) {
    defs.push(def(Enctype.SIZE, encoding, {
      size: Enctype.SIZE
    }, styleCfg));
  }

  if (encoding.has(Enctype.SHAPE) && encoding.encDef(Enctype.SHAPE).legend) {
    defs.push(def(Enctype.SHAPE, encoding, {
      shape: Enctype.SHAPE
    }, styleCfg));
  }
  return defs;
}

export function def(name, encoding, def, styleCfg) {
  var timeUnit = encoding.encDef(name).timeUnit;

  def.title = title(name, encoding);
  def.orient = encoding.encDef(name).legend.orient;
  // TODO: add format 

  def = style(name, encoding, def, styleCfg);

  if (encoding.isType(name, Type.T) &&
    timeUnit &&
    time.hasScale(timeUnit)
  ) {
    setter(def, ['properties', 'labels', 'text', 'scale'], 'time-'+ timeUnit);
  }

  return def;
}

export function title(name, encoding) {
  var leg = encoding.encDef(name).legend;

  if (leg.title) return leg.title;

  return encoding.fieldTitle(name);
}

function style(name, encoding, def, styleCfg) {
  var symbols = getter(def, ['properties', 'symbols']),
    marktype = encoding.marktype();

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
      if (encoding.encDef(Enctype.SHAPE).filled) {
        if (encoding.has(Enctype.COLOR) && name === Enctype.COLOR) {
          symbols.fill = {scale: Enctype.COLOR, field: 'data'};
        } else {
          symbols.fill = {value: encoding.value(Enctype.COLOR)};
        }
        symbols.stroke = {value: 'transparent'};
      } else {
        if (encoding.has(Enctype.COLOR) && name === Enctype.COLOR) {
          symbols.stroke = {scale: Enctype.COLOR, field: 'data'};
        } else {
          symbols.stroke = {value: encoding.value(Enctype.COLOR)};
        }
        symbols.fill = {value: 'transparent'};
        symbols.strokeWidth = {value: encoding.config('strokeWidth')};
      }

      break;
    case 'line':
    case 'area':
      // TODO use shape here after implementing #508
      break;
  }

  var opacity = encoding.encDef(Enctype.COLOR).opacity || styleCfg.opacity;
  if (opacity) {
    symbols.opacity = {value: opacity};
  }
  return def;
}
