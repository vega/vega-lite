import {FieldDef} from '../fielddef';
import {LegendProperties} from '../legend';

import {COLOR, SIZE, SHAPE, Channel} from '../channel';
import {title as fieldTitle} from '../fielddef';
import {AREA, BAR, TICK, TEXT, LINE, POINT, CIRCLE, SQUARE} from '../mark';
import {extend, keys, without} from '../util';
import {Model} from './Model';
import {applyMarkConfig, FILL_STROKE_CONFIG, formatMixins as utilFormatMixins, timeFormat} from './common';
import {ORDINAL} from '../type';
import {COLOR_LEGEND, COLOR_LEGEND_LABEL} from './scale';

export function compileLegends(model: Model) {
  let defs = [];

  if (model.has(COLOR) && model.legend(COLOR)) {
    const fieldDef = model.fieldDef(COLOR);
    const scale = model.scaleName(useColorLegendScale(fieldDef) ?
      // To produce ordinal legend (list, rather than linear range) with correct labels:
      // - For an ordinal field, provide an ordinal scale that maps rank values to field values
      // - For a field with bin or timeUnit, provide an identity ordinal scale
      // (mapping the field values to themselves)
      COLOR_LEGEND :
      COLOR
    );

    const def = model.config().mark.filled ? { fill: scale } : { stroke: scale };
    defs.push(compileLegend(model, COLOR, def));
  }

  if (model.has(SIZE) && model.legend(SIZE)) {
    defs.push(compileLegend(model, SIZE, {
      size: model.scaleName(SIZE)
    }));
  }

  if (model.has(SHAPE) && model.legend(SHAPE)) {
    defs.push(compileLegend(model, SHAPE, {
      shape: model.scaleName(SHAPE)
    }));
  }
  return defs;
}

export function compileLegend(model: Model, channel: Channel, def) {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);

  // 1.1 Add properties with special rules
  def.title = title(legend, fieldDef);

  extend(def, formatMixins(legend, model, channel));

  // 1.2 Add properties without rules
  ['orient', 'values'].forEach(function(property) {
    const value = legend[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const props = (typeof legend !== 'boolean' && legend.properties) || {};
  ['title', 'symbols', 'legend', 'labels'].forEach(function(group) {
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

export function title(legend: LegendProperties, fieldDef: FieldDef) {
  if (typeof legend !== 'boolean' && legend.title) {
    return legend.title;
  }

  return fieldTitle(fieldDef);
}

export function formatMixins(legend: LegendProperties, model: Model, channel: Channel) {
  const fieldDef = model.fieldDef(channel);

  // If the channel is binned, we should not set the format because we have a range label
  if (fieldDef.bin) {
    return {};
  }

  return utilFormatMixins(model, channel, typeof legend !== 'boolean' ? legend.format : undefined);
}

// we have to use special scales for ordinal or binned fields for the color channel
export function useColorLegendScale(fieldDef: FieldDef) {
  return fieldDef.type === ORDINAL || fieldDef.bin || fieldDef.timeUnit;
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
        break;
      case CIRCLE:
      case SQUARE:
        symbols.shape = { value: mark };
        break;
      case POINT:
      case LINE:
      case AREA:
        // use default circle
        break;
    }

    const filled = model.config().mark.filled;

    applyMarkConfig(symbols, model,
      // Do not set fill (when filled) or stroke (when unfilled) property from config
      // because the value from the scale should have precedence
      without(FILL_STROKE_CONFIG, [ filled ? 'fill' : 'stroke'])
    );

    if (filled) {
      symbols.strokeWidth = { value: 0 };
    }

    let value;
    if (model.has(COLOR) && channel === COLOR) {
      if (useColorLegendScale(fieldDef)) {
        // for color legend scale, we need to override
        value = { scale: model.scaleName(COLOR), field: 'data' };
      }
    } else if (model.fieldDef(COLOR).value) {
      value = { value: model.fieldDef(COLOR).value };
    }

    if (value !== undefined) {
      // apply the value
      if (filled) {
        symbols.fill = value;
      } else {
        symbols.stroke = value;
      }
    } else if (channel !== COLOR) {
      // For non-color legend, apply color config if there is no fill / stroke config.
      // (For color, do not override scale specified!)
      symbols[filled ? 'fill' : 'stroke'] = symbols[filled ? 'fill' : 'stroke'] ||
        {value: model.config().mark.color};
    }

    symbols = extend(symbols, symbolsSpec || {});

    return keys(symbols).length > 0 ? symbols : undefined;
  }

  export function labels(fieldDef: FieldDef, symbolsSpec, model: Model, channel: Channel): any {
    if (channel === COLOR) {
      if (fieldDef.type === ORDINAL) {
        return {
          text: {
            scale: model.scaleName(COLOR_LEGEND),
            field: 'data'
          }
        };
      } else if (fieldDef.bin) {
        return {
          text: {
            scale: model.scaleName(COLOR_LEGEND_LABEL),
            field: 'data'
          }
        };
      } else if (fieldDef.timeUnit) {
        return {
          text: {
            template: '{{ datum.data | time:\'' + timeFormat(model, channel) + '\'}}'
          }
        };
      }
    }
    return undefined;
  }
}
