import {COLOR, SIZE, SHAPE, Channel} from '../channel';
import {Config} from '../config';
import {FieldDef} from '../fielddef';
import {Legend} from '../legend';
import {title as fieldTitle} from '../fielddef';
import {AREA, BAR, TICK, TEXT, LINE, POINT, CIRCLE, SQUARE} from '../mark';
import {ORDINAL, TEMPORAL} from '../type';
import {extend, keys, without, Dict} from '../util';

import {applyMarkConfig, FILL_STROKE_CONFIG, numberFormat, timeTemplate} from './common';
import {COLOR_LEGEND, COLOR_LEGEND_LABEL} from './scale';
import {UnitModel} from './unit';
import {VgLegend} from '../vega.schema';


export function parseLegendComponent(model: UnitModel): Dict<VgLegend> {
  return [COLOR, SIZE, SHAPE].reduce(function(legendComponent, channel) {
    if (model.legend(channel)) {
      legendComponent[channel] = parseLegend(model, channel);
    }
    return legendComponent;
  }, {} as Dict<VgLegend>);
}

function getLegendDefWithScale(model: UnitModel, channel: Channel): VgLegend {
  switch (channel) {
    case COLOR:
      const fieldDef = model.fieldDef(COLOR);
      const scale = model.scaleName(useColorLegendScale(fieldDef) ?
        // To produce ordinal legend (list, rather than linear range) with correct labels:
        // - For an ordinal field, provide an ordinal scale that maps rank values to field values
        // - For a field with bin or timeUnit, provide an identity ordinal scale
        // (mapping the field values to themselves)
        COLOR_LEGEND :
        COLOR
      );

      return model.config().mark.filled ? { fill: scale } : { stroke: scale };
    case SIZE:
      return { size: model.scaleName(SIZE) };
    case SHAPE:
      return { shape: model.scaleName(SHAPE) };
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
  const format = numberFormat(fieldDef, legend.format, config);
  if (format) {
    def.format = format;
  }

  // 1.2 Add properties without rules
  ['offset', 'orient', 'values'].forEach(function(property) {
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
    if (value !== undefined && keys(value).length > 0) {
      def.properties = def.properties || {};
      def.properties[group] = value;
    }
  });

  return def;
}

export function title(legend: Legend, fieldDef: FieldDef, config: Config) {
  if (typeof legend !== 'boolean' && legend.title) {
    return legend.title;
  }

  return fieldTitle(fieldDef, config);
}

// we have to use special scales for ordinal or binned fields for the color channel
export function useColorLegendScale(fieldDef: FieldDef) {
  return fieldDef.type === ORDINAL || fieldDef.bin || fieldDef.timeUnit;
}

export namespace properties {
  export function symbols(fieldDef: FieldDef, symbolsSpec, model: UnitModel, channel: Channel) {
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

    const filled = model.config().mark.filled;


    let config = channel === COLOR ?
        /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the the legend's `fill` or `stroke` scale should have precedence */
        without(FILL_STROKE_CONFIG, [ filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
        /* For other legend, no need to omit. */
         without(FILL_STROKE_CONFIG, ['strokeDash', 'strokeDashOffset']);

    config = without(config, ['strokeDash', 'strokeDashOffset']);

    applyMarkConfig(symbols, model, config);

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

    if (legend.symbolColor !== undefined) {
      symbols.fill = {value: legend.symbolColor};
    }

    if (legend.symbolShape !== undefined) {
      symbols.shape = {value: legend.symbolShape};
    }

    if (legend.symbolSize !== undefined) {
      symbols.size = {value: legend.symbolSize};
    }

    if (legend.symbolStrokeWidth !== undefined) {
      symbols.strokeWidth = {value: legend.symbolStrokeWidth};
    }

    symbols = extend(symbols, symbolsSpec || {});

    return keys(symbols).length > 0 ? symbols : undefined;
  }

  export function labels(fieldDef: FieldDef, labelsSpec, model: UnitModel, channel: Channel) {
    const legend = model.legend(channel);
    const config = model.config();

    let labels:any = {};

    if (channel === COLOR) {
      if (fieldDef.type === ORDINAL) {
        labelsSpec = extend({
          text: {
            scale: model.scaleName(COLOR_LEGEND),
            field: 'data'
          }
        }, labelsSpec || {});
      } else if (fieldDef.bin) {
        labelsSpec = extend({
          text: {
            scale: model.scaleName(COLOR_LEGEND_LABEL),
            field: 'data'
          }
        }, labelsSpec || {});
      } else if (fieldDef.type === TEMPORAL) {
        labelsSpec = extend({
          text: {
            template: timeTemplate('datum.data', fieldDef.timeUnit, legend.format, legend.shortTimeLabels, config)
          }
        }, labelsSpec || {});
      }
    }

    if (legend.labelAlign !== undefined) {
      labels.align = {value: legend.labelAlign};
    }

    if (legend.labelColor !== undefined) {
      labels.stroke = {value: legend.labelColor};
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

  export function title(fieldDef: FieldDef, titleSpec, model: UnitModel, channel: Channel) {
    const legend = model.legend(channel);

    let titles:any = {};

    if (legend.titleColor !== undefined) {
      titles.stroke = {value: legend.titleColor};
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
