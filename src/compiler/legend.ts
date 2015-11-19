import * as util from '../util';
import {COLOR, SIZE, SHAPE} from '../channel';
import Encoding from '../Encoding';
import * as time from './time';
import {TEMPORAL} from '../type';

export function defs(encoding: Encoding, styleCfg) {
  var defs = [];

  if (encoding.has(COLOR) && encoding.fieldDef(COLOR).legend) {
    defs.push(def(encoding, COLOR, {
      fill: COLOR
      // TODO: consider if this should be stroke for line
    }, styleCfg));
  }

  if (encoding.has(SIZE) && encoding.fieldDef(SIZE).legend) {
    defs.push(def(encoding, SIZE, {
      size: SIZE
    }, styleCfg));
  }

  if (encoding.has(SHAPE) && encoding.fieldDef(SHAPE).legend) {
    defs.push(def(encoding, SHAPE, {
      shape: SHAPE
    }, styleCfg));
  }
  return defs;
}

export function def(encoding: Encoding, name: String, def, styleCfg) {
  let legend = encoding.fieldDef(name).legend;

  // 1.1 Add properties with special rules
  def.title = title(encoding, name);

  // 1.2 Add properties without rules
  ['orient', 'format', 'values'].forEach(function(property) {
    let value = legend[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  let props = legend.properties || {};
  ['title', 'labels', 'symbols', 'legend'].forEach(function(group) {
    let value = properties[group] ?
      properties[group](encoding, name, props[group], styleCfg) : // apply rule
      props[group]; // no rule -- just default values
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[group] = value;
    }
  });

  return def;
}

export function title(encoding: Encoding, name: String) {
  let leg = encoding.fieldDef(name).legend;

  if (leg.title) return leg.title;

  return encoding.fieldTitle(name);
}

namespace properties {
  export function labels(encoding: Encoding, name, spec) {
    var fieldDef = encoding.fieldDef(name);
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.type === TEMPORAL && timeUnit && time.hasScale(timeUnit)) {
      return util.extend({
        text: {
          scale: 'time-'+ timeUnit
        }
      }, spec || {});
    }
    return spec;
  }

  export function symbols(encoding: Encoding, name, spec, styleCfg) {
    let symbols:any = {};
    let marktype = encoding.marktype();

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
        if (encoding.fieldDef(SHAPE).filled) {
          if (encoding.has(COLOR) && name === COLOR) {
            symbols.fill = {scale: COLOR, field: 'data'};
          } else {
            symbols.fill = {value: encoding.value(COLOR)};
          }
          symbols.stroke = {value: 'transparent'};
        } else {
          if (encoding.has(COLOR) && name === COLOR) {
            symbols.stroke = {scale: COLOR, field: 'data'};
          } else {
            symbols.stroke = {value: encoding.value(COLOR)};
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

    var opacity = encoding.fieldDef(COLOR).opacity || styleCfg.opacity;
    if (opacity) {
      symbols.opacity = {value: opacity};
    }

    symbols = util.extend(symbols, spec || {});

    return util.keys(symbols).length > 0 ? symbols : undefined;
  }
}
