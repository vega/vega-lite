import * as util from '../util';
import {Enctype, Type} from '../consts';
import Encoding from '../Encoding';
import * as time from './time';

export function defs(encoding: Encoding, styleCfg) {
  var defs = [];

  if (encoding.has(Enctype.COLOR) && encoding.encDef(Enctype.COLOR).legend) {
    defs.push(def(encoding, Enctype.COLOR, {
      fill: Enctype.COLOR
      // TODO: consider if this should be stroke for line
    }, styleCfg));
  }

  if (encoding.has(Enctype.SIZE) && encoding.encDef(Enctype.SIZE).legend) {
    defs.push(def(encoding, Enctype.SIZE, {
      size: Enctype.SIZE
    }, styleCfg));
  }

  if (encoding.has(Enctype.SHAPE) && encoding.encDef(Enctype.SHAPE).legend) {
    defs.push(def(encoding, Enctype.SHAPE, {
      shape: Enctype.SHAPE
    }, styleCfg));
  }
  return defs;
}

export function def(encoding: Encoding, name: String, def, styleCfg) {
  let legend = encoding.encDef(name).legend;

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
  let leg = encoding.encDef(name).legend;

  if (leg.title) return leg.title;

  return encoding.fieldTitle(name);
}

namespace properties {
  export function labels(encoding: Encoding, name, spec) {
    var encDef = encoding.encDef(name);
    var timeUnit = encDef.timeUnit;
    if (encDef.type == Type.T && timeUnit && time.hasScale(timeUnit)) {
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

    symbols = util.extend(symbols, spec || {});

    return util.keys(symbols).length > 0 ? symbols : undefined;
  }
}
