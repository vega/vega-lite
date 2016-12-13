import {COLOR, SIZE, SHAPE, OPACITY, Channel} from '../channel';
import {Config} from '../config';
import {DateTime, isDateTime, timestamp} from '../datetime';
import {FieldDef} from '../fielddef';
import {Legend} from '../legend';
import {title as fieldTitle} from '../fielddef';
import {AREA, BAR, TICK, TEXT, LINE, POINT, CIRCLE, SQUARE} from '../mark';
import {hasContinuousDomain} from '../scale';
import {TEMPORAL, QUANTITATIVE} from '../type';
import {extend, keys, without, Dict, contains} from '../util';

import {applyMarkConfig, FILL_STROKE_CONFIG, numberFormat, timeFormatExpression} from './common';
import {BIN_LEGEND_SUFFIX, BIN_LEGEND_LABEL_SUFFIX} from './scale/scale';
import {UnitModel} from './unit';
import {VgLegend, VgValueRef} from '../vega.schema';

/* tslint:disable:no-unused-variable */
// These imports exist so the TS compiler can name publicly exported members in
// The automatically created .d.ts correctly
import {Bin} from '../bin';
/* tslint:enable:no-unused-variable */

export function parseLegendComponent(model: UnitModel): Dict<VgLegend> {
  return [COLOR, SIZE, SHAPE, OPACITY].reduce(function(legendComponent, channel) {
    if (model.legend(channel)) {
      legendComponent[channel] = parseLegend(model, channel);
    }
    return legendComponent;
  }, {} as Dict<VgLegend>);
}

function getLegendDefWithScale(model: UnitModel, channel: Channel): VgLegend {
  // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
  const suffix = model.fieldDef(channel).bin && hasContinuousDomain(model.scale(channel).type) ? BIN_LEGEND_SUFFIX : '';
  switch (channel) {
    case COLOR:
      const scale = model.scaleName(COLOR) + suffix;
      return model.config().mark.filled ? { fill: scale } : { stroke: scale };
    case SIZE:
      return { size: model.scaleName(SIZE) + suffix };
    case SHAPE:
      return { shape: model.scaleName(SHAPE) + suffix };
    case OPACITY:
      return { opacity: model.scaleName(OPACITY) + suffix };
  }
  return null;
}

export function parseLegend(model: UnitModel, channel: Channel): VgLegend {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);
  const config = model.config();

  let def: VgLegend = getLegendDefWithScale(model, channel);

  // 1.1 Add properties with special rules
  def.title = title(legend, fieldDef, config);
  const format = numberFormat(fieldDef, legend.format, config, channel);
  if (format) {
    def.format = format;
  }
  const vals = values(legend);
  if (vals) {
    def.values = vals;
  }
  const t = type(legend, fieldDef, channel);
  if (t) {
    def.type = t;
  }

  // 1.2 Add properties without rules
  ['offset', 'orient'].forEach(function(property) {
    const value = legend[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const props = (typeof legend !== 'boolean' && legend.properties) || {};
  ['title', 'symbols', 'legend', 'labels'].forEach(function(group) {
    let value = encode[group] ?
      encode[group](fieldDef, props[group], model, channel) : // apply rule
      props[group]; // no rule -- just default values
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[group] = {update: value};
    }
  });

  return def;
}

export function title(legend: Legend, fieldDef: FieldDef, config: Config) {
  if (legend.title !== undefined) {
    return legend.title;
  }

  return fieldTitle(fieldDef, config);
}

export function values(legend: Legend) {
  const vals = legend.values;
  if (vals && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return timestamp(dt, true);
    });
  }
  return vals;
}

export function type(legend: Legend, fieldDef: FieldDef, channel: Channel) {
  if (legend.type) {
    return legend.type;
  }

  if (channel === COLOR && !fieldDef.bin && !fieldDef.timeUnit && contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
    return 'gradient';
  }
  return undefined;
}

// TODO: should we rename this?
export namespace encode {
  export function symbols(fieldDef: FieldDef, symbolsSpec: any, model: UnitModel, channel: Channel) {
    let symbols:any = {};
    const mark = model.mark();
    const legend = model.legend(channel);

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

    const cfg = model.config();
    const filled = cfg.mark.filled;

    let config = channel === COLOR ?
        /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
        without(FILL_STROKE_CONFIG, [ filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
        /* For other legend, no need to omit. */
        without(FILL_STROKE_CONFIG, ['strokeDash', 'strokeDashOffset']);

    config = without(config, ['strokeDash', 'strokeDashOffset']);

    applyMarkConfig(symbols, model, config);

    if (filled) {
      symbols.strokeWidth = { value: 0 };
    }

    // Avoid override default mapping for opacity channel
    if (channel === OPACITY) {
      delete symbols.opacity;
    }

    let value: VgValueRef;
    if (model.encoding().color && model.encoding().color.value) {
      value = { value: model.encoding().color.value };
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
        {value: cfg.mark.color};
    }

    if (legend.symbolColor !== undefined) {
      symbols.fill = {value: legend.symbolColor};
    } else if (symbols.fill === undefined) {
      // fall back to mark config colors for legend fill
      if (cfg.mark.fill !== undefined) {
        symbols.fill = {value: cfg.mark.fill};
      } else if (cfg.mark.stroke !== undefined) {
        symbols.stroke = {value: cfg.mark.stroke};
      }
    }

    if (channel !== SHAPE) {
      if (legend.symbolShape !== undefined) {
        symbols.shape = {value: legend.symbolShape};
      } else if (cfg.point.shape !== undefined) {
        symbols.shape = {value: cfg.point.shape};
      }
    }

    if (channel !== SIZE) {
      if (legend.symbolSize !== undefined) {
        symbols.size = {value: legend.symbolSize};
      }
    }

    if (fieldDef.bin && hasContinuousDomain(model.scale(channel).type)) {
      const def = {
        scale: model.scaleName(channel),
        field: 'value'
      };
      switch (channel) {
        case OPACITY:
          symbols.opacity = def;
          break;
        case SIZE:
          symbols.size = def;
          break;
        case COLOR:
          symbols[filled ? 'fill' : 'stroke'] = def;
          break;
        default:
          throw Error(`Legend for channel ${channel} not implemented`);
      }
    }

    if (legend.symbolStrokeWidth !== undefined) {
      symbols.strokeWidth = {value: legend.symbolStrokeWidth};
    }

    symbols = extend(symbols, symbolsSpec || {});

    return keys(symbols).length > 0 ? symbols : undefined;
  }

  export function labels(fieldDef: FieldDef, labelsSpec: any, model: UnitModel, channel: Channel) {
    const legend = model.legend(channel);
    const config = model.config();

    let labels:any = {};

    if (fieldDef.bin && hasContinuousDomain(model.scale(channel).type)) {
      // Override label's text to map bin's quantitative value to range
      labelsSpec = extend({
        text: {
          scale: model.scaleName(channel) + BIN_LEGEND_LABEL_SUFFIX,
          field: 'value'
        }
      }, labelsSpec || {});
    } else if (fieldDef.type === TEMPORAL) {
      labelsSpec = extend({
        text: {
          signal: timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, legend.shortTimeLabels, config)
        }
      }, labelsSpec || {});
    }

    if (legend.labelAlign !== undefined) {
      labels.align = {value: legend.labelAlign};
    }

    if (legend.labelColor !== undefined) {
      labels.fill = {value: legend.labelColor};
    }

    if (legend.labelFont !== undefined) {
      labels.font = {value: legend.labelFont};
    }

    if (legend.labelFontSize !== undefined) {
      labels.fontSize = {value: legend.labelFontSize};
    }

    if (legend.labelBaseline !== undefined) {
      labels.baseline = {value: legend.labelBaseline};
    }

    labels = extend(labels, labelsSpec || {});

    return keys(labels).length > 0 ? labels : undefined;
  }

  export function title(fieldDef: FieldDef, titleSpec: any, model: UnitModel, channel: Channel) {
    const legend = model.legend(channel);

    let titles:any = {};

    if (legend.titleColor !== undefined) {
      titles.fill = {value: legend.titleColor};
    }

    if (legend.titleFont !== undefined) {
      titles.font = {value: legend.titleFont};
    }

    if (legend.titleFontSize !== undefined) {
      titles.fontSize = {value: legend.titleFontSize};
    }

    if (legend.titleFontWeight !== undefined) {
      titles.fontWeight = {value: legend.titleFontWeight};
    }

    titles = extend(titles, titleSpec || {});

    return keys(titles).length > 0 ? titles : undefined;
  }
}
