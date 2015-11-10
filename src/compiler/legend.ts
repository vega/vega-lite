import {setter, getter} from '../util';
import {Enctype, Type} from '../consts';

import * as time from './time';

export default function(encoding, styleCfg) {
  var defs = [];

  if (encoding.has(Enctype.COLOR) && encoding.encDef(Enctype.COLOR).legend) {
    defs.push(def(Enctype.COLOR, encoding, {
      fill: Enctype.COLOR
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
};

export function def(name, encoding, def, styleCfg) {
  var timeUnit = encoding.encDef(name).timeUnit;

  def.title = title(name, encoding);
  def.orient = encoding.encDef(name).legend.orient;

  def = style(name, encoding, def, styleCfg);

  if (encoding.isType(name, Type.T) &&
    timeUnit &&
    time.hasScale(timeUnit)
  ) {
    setter(def, ['properties', 'labels', 'text', 'scale'], 'time-'+ timeUnit);
  }

  return def;
};

function style(name, e, def, styleCfg) {
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
      if (e.encDef(Enctype.SHAPE).filled) {
        if (e.has(Enctype.COLOR) && name === Enctype.COLOR) {
          symbols.fill = {scale: Enctype.COLOR, field: 'data'};
        } else {
          symbols.fill = {value: e.value(Enctype.COLOR)};
        }
        symbols.stroke = {value: 'transparent'};
      } else {
        if (e.has(Enctype.COLOR) && name === Enctype.COLOR) {
          symbols.stroke = {scale: Enctype.COLOR, field: 'data'};
        } else {
          symbols.stroke = {value: e.value(Enctype.COLOR)};
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

  var opacity = e.encDef(Enctype.COLOR).opacity || styleCfg.opacity;
  if (opacity) {
    symbols.opacity = {value: opacity};
  }
  return def;
};

export function title(name, encoding) {
  var leg = encoding.encDef(name).legend;

  if (leg.title) return leg.title;

  return encoding.fieldTitle(name);
};
