import {FieldDef} from '../schema/fielddef.schema';

import {COLOR, SIZE, SHAPE, Channel} from '../channel';
import {title as fieldTitle} from '../fielddef';
import {AREA, BAR, TICK, TEXT, LINE, POINT, CIRCLE, SQUARE} from '../mark';
import {TEMPORAL} from '../type';
import {extend, keys} from '../util';
import {Model} from './Model';

export function compileLegends(model: Model) {
  var defs = [];

  if (model.has(COLOR) && model.fieldDef(COLOR).legend) {
    defs.push(compileLegend(model, COLOR, {
      fill: model.scale(COLOR)
      // TODO: consider if this should be stroke for line
    }));
  }

  if (model.has(SIZE) && model.fieldDef(SIZE).legend) {
    defs.push(compileLegend(model, SIZE, {
      size: model.scale(SIZE)
    }));
  }

  if (model.has(SHAPE) && model.fieldDef(SHAPE).legend) {
    defs.push(compileLegend(model, SHAPE, {
      shape: model.scale(SHAPE)
    }));
  }
  return defs;
}

export function compileLegend(model: Model, channel: Channel, def) {
  const fieldDef = model.fieldDef(channel);
  const legend = fieldDef.legend;

  // 1.1 Add properties with special rules
  def.title = title(fieldDef);

  // 1.2 Add properties without rules
  ['orient', 'format', 'values'].forEach(function(property) {
    const value = legend[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const props = (typeof legend !== 'boolean' && legend.properties) || {};
  ['title', 'labels', 'symbols', 'legend'].forEach(function(group) {
    let value = properties[group] ?
      properties[group](fieldDef, props[group], model, channel) : // apply rule
      props[group]; // no rule -- just default values
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[group] = value;
    }
  });

  return def;
}

export function title(fieldDef: FieldDef) {
  const legend = fieldDef.legend;
  if (typeof legend !== 'boolean' && legend.title) {
    return legend.title;
  }

  return fieldTitle(fieldDef);
}

namespace properties {
  export function labels(fieldDef: FieldDef, spec, model: Model, channel: Channel) {
    const timeUnit = fieldDef.timeUnit;
    const labelTemplate = model.labelTemplate(channel);
    if (fieldDef.type === TEMPORAL && timeUnit && labelTemplate) {
      return extend({
        text: {
          template: '{{datum.data | ' + labelTemplate + '}}'
        }
      }, spec || {});
    }
    return spec;
  }

  export function symbols(fieldDef: FieldDef, spec, model: Model, channel: Channel) {
    let symbols:any = {};
    const mark = model.mark();

    switch (mark) {
      case BAR:
      case TICK:
      case TEXT:
        symbols.stroke = {value: 'transparent'};
        symbols.shape = {value: 'square'};
        break;

      case CIRCLE:
      case SQUARE:
        symbols.shape = {value: mark};
        /* fall through */
      case POINT:
        // fill or stroke
        if (model.marksConfig('filled')) {
          if (model.has(COLOR) && channel === COLOR) {
            symbols.fill = {scale: model.scale(COLOR), field: 'data'};
          } else {
            symbols.fill = {value: fieldDef.value};
          }
          symbols.stroke = {value: 'transparent'};
        } else {
          if (model.has(COLOR) && channel === COLOR) {
            symbols.stroke = {scale: model.scale(COLOR), field: 'data'};
          } else {
            symbols.stroke = {value: fieldDef.value};
          }
          symbols.fill = {value: 'transparent'};
          symbols.strokeWidth = {value: model.config('marks').strokeWidth};
        }

        break;
      case LINE:
      case AREA:
        // TODO use shape here after implementing #508
        break;
    }

    var opacity = model.marksConfig('opacity');
    if (opacity) { symbols.opacity = {value: opacity}; }

    symbols = extend(symbols, spec || {});

    return keys(symbols).length > 0 ? symbols : undefined;
  }
}
