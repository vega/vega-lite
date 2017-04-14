import {Channel, COLOR, SHAPE} from '../../channel';
import {FieldDef, isValueDef} from '../../fielddef';
import {AREA, BAR, CIRCLE, FILL_STROKE_CONFIG, LINE, POINT, SQUARE, TEXT, TICK} from '../../mark';
import {TEMPORAL} from '../../type';
import {extend, keys, without} from '../../util';

import {VgValueRef} from '../../vega.schema';

import {applyMarkConfig, timeFormatExpression} from '../common';
import {UnitModel} from '../unit';

export function symbols(fieldDef: FieldDef, symbolsSpec: any, model: UnitModel, channel: Channel) {
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
      symbols.shape = {value: mark};
      break;
    case POINT:
    case LINE:
    case AREA:
      // use default circle
      break;
  }

  const cfg = model.config;
  const filled = model.markDef.filled;

  let config = channel === COLOR ?
      /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
      without(FILL_STROKE_CONFIG, [ filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
      /* For other legend, no need to omit. */
      FILL_STROKE_CONFIG;

  config = without(config, ['strokeDash', 'strokeDashOffset']);

  applyMarkConfig(symbols, model, config);

  if (filled) {
    symbols.strokeWidth = {value: 0};
  }

  let value: VgValueRef;
  const colorDef = model.encoding.color;
  if (isValueDef(colorDef)) {
    value = {value: colorDef.value};
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

  if (symbols.fill === undefined) {
    // fall back to mark config colors for legend fill
    if (cfg.mark.fill !== undefined) {
      symbols.fill = {value: cfg.mark.fill};
    } else if (cfg.mark.stroke !== undefined) {
      symbols.stroke = {value: cfg.mark.stroke};
    }
  }

  const shapeDef = model.encoding.shape;
  if (channel !== SHAPE) {
    if (isValueDef(shapeDef)) {
      symbols.shape = {value: shapeDef.value};
    }
  }

  symbols = extend(symbols, symbolsSpec || {});

  return keys(symbols).length > 0 ? symbols : undefined;
}

export function labels(fieldDef: FieldDef, labelsSpec: any, model: UnitModel, channel: Channel) {
  const legend = model.legend(channel);
  const config = model.config;

  let labels:any = {};

  if (fieldDef.type === TEMPORAL) {
    labelsSpec = extend({
      text: {
        signal: timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat)
      }
    }, labelsSpec || {});
  }

  labels = extend(labels, labelsSpec || {});

  return keys(labels).length > 0 ? labels : undefined;
}

