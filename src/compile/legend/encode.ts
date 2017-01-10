import {COLOR, SIZE, SHAPE, OPACITY, Channel} from '../../channel';
import {FieldDef} from '../../fielddef';
import {AREA, BAR, TICK, TEXT, LINE, POINT, CIRCLE, SQUARE} from '../../mark';
import {hasContinuousDomain} from '../../scale';
import {TEMPORAL} from '../../type';
import {extend, keys, without} from '../../util';

import {VgValueRef} from '../../vega.schema';

import {applyMarkConfig, FILL_STROKE_CONFIG, timeFormatExpression} from '../common';
import {BIN_LEGEND_LABEL_SUFFIX} from '../scale/scale';
import {UnitModel} from '../unit';

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
