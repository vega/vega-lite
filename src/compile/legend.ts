import {FieldDef} from '../schema/fielddef.schema';

import {COLOR, SIZE, SHAPE, Channel} from '../channel';
import {title as fieldTitle} from '../fielddef';
import {AREA, BAR, TICK, TEXT, LINE, POINT, CIRCLE, SQUARE} from '../mark';
import {extend, keys} from '../util';
import {Model} from './Model';
import {applyMarkConfig, FILL_STROKE_CONFIG, formatMixins as utilFormatMixins} from './util';

export function compileLegends(model: Model) {
  var defs = [];

  if (model.has(COLOR) && model.fieldDef(COLOR).legend) {
    defs.push(compileLegend(model, COLOR, {
      fill: model.scaleName(COLOR)
      // TODO: consider if this should be stroke for line
    }));
  }

  if (model.has(SIZE) && model.fieldDef(SIZE).legend) {
    defs.push(compileLegend(model, SIZE, {
      size: model.scaleName(SIZE)
    }));
  }

  if (model.has(SHAPE) && model.fieldDef(SHAPE).legend) {
    defs.push(compileLegend(model, SHAPE, {
      shape: model.scaleName(SHAPE)
    }));
  }
  return defs;
}

export function compileLegend(model: Model, channel: Channel, def) {
  const fieldDef = model.fieldDef(channel);
  const legend = fieldDef.legend;

  // 1.1 Add properties with special rules
  def.title = title(fieldDef);

  extend(def, formatMixins(model, channel));

  // 1.2 Add properties without rules
  ['orient', 'values'].forEach(function(property) {
    const value = legend[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const props = (typeof legend !== 'boolean' && legend.properties) || {};
  ['title', 'symbols', 'legend'].forEach(function(group) {
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

export function formatMixins(model: Model, channel: Channel) {
  const fieldDef = model.fieldDef(channel);

  // If the channel is binned, we should not set the format because we have a range label
  if (fieldDef.bin) {
    return {};
  }

  const legend = fieldDef.legend;
  return utilFormatMixins(model, channel, typeof legend !== 'boolean' ? legend.format : undefined);
}

namespace properties {
  export function symbols(fieldDef: FieldDef, symbolsSpec, model: Model, channel: Channel) {
    let symbols:any = {};
    const mark = model.mark();

    switch (mark) {
      case BAR:
      case TICK:
      case TEXT:
        symbols.shape = {value: 'square'};

        // set stroke to transparent by default unless there is a config for stroke
        symbols.stroke = {value: 'transparent'};
        applyMarkConfig(symbols, model, FILL_STROKE_CONFIG);

        // no need to apply color to fill as they are set automatically
        break;

      case CIRCLE:
      case SQUARE:
        symbols.shape = {value: mark};
        /* fall through */
      case POINT:
        // fill or stroke
        if (model.config().mark.filled) { // filled
          // set stroke to transparent by default unless there is a config for stroke
          symbols.stroke = {value: 'transparent'};
          applyMarkConfig(symbols, model, FILL_STROKE_CONFIG);

          if (model.has(COLOR) && channel === COLOR) {
            symbols.fill = {scale: model.scaleName(COLOR), field: 'data'};
          } else {
            symbols.fill = {value: model.fieldDef(COLOR).value};
          }
        } else { // stroked
          // set fill to transparent by default unless there is a config for stroke
          symbols.fill = {value: 'transparent'};
          applyMarkConfig(symbols, model, FILL_STROKE_CONFIG);

          if (model.has(COLOR) && channel === COLOR) {
            symbols.stroke = {scale: model.scaleName(COLOR), field: 'data'};
          } else {
            symbols.stroke = {value: model.fieldDef(COLOR).value};
          }
        }

        break;
      case LINE:
      case AREA:
        // set stroke to transparent by default unless there is a config for stroke
        symbols.stroke = {value: 'transparent'};
        applyMarkConfig(symbols, model, FILL_STROKE_CONFIG);

        // TODO use shape here after implementing #508
        break;
    }

    symbols = extend(symbols, symbolsSpec || {});

    return keys(symbols).length > 0 ? symbols : undefined;
  }
}
