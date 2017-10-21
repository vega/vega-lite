import {isArray} from 'vega-util';
import {Channel, COLOR, NonPositionScaleChannel, OPACITY, SHAPE} from '../../channel';
import {FieldDef, FieldDefWithCondition, hasConditionalValueDef, isTimeFieldDef, isValueDef, MarkPropFieldDef, ValueDefWithCondition} from '../../fielddef';
import {AREA, BAR, CIRCLE, FILL_STROKE_CONFIG, LINE, POINT, SQUARE, TEXT, TICK} from '../../mark';
import {ScaleType} from '../../scale';
import {keys, without} from '../../util';
import {LegendType} from '../../vega.schema';
import {applyMarkConfig, timeFormatExpression} from '../common';
import * as mixins from '../mark/mixins';
import {UnitModel} from '../unit';

export function symbols(fieldDef: FieldDef<string>, symbolsSpec: any, model: UnitModel, channel: Channel, type: LegendType) {
  if (type === 'gradient') {
    return undefined;
  }

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

  const filled = model.markDef.filled;

  let config = channel === COLOR ?
      /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
      without(FILL_STROKE_CONFIG, [ filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
      /* For other legend, no need to omit. */
      FILL_STROKE_CONFIG;

  config = without(config, ['strokeDash', 'strokeDashOffset']);

  applyMarkConfig(symbols, model, config);

  if (channel !== COLOR) {
    const colorMixins = mixins.color(model);

    // If there are field for fill or stroke, remove them as we already apply channels.
    if (colorMixins.fill && (colorMixins.fill['field'] || colorMixins.fill['value'] === 'transparent')) {
      delete colorMixins.fill;
    }
    if (colorMixins.stroke && (colorMixins.stroke['field'] || colorMixins.stroke['value'] === 'transparent')) {
      delete colorMixins.stroke;
    }
    symbols = {...symbols, ...colorMixins};
  }

  if (channel !== SHAPE) {
    const shapeDef = model.encoding.shape;
    if (isValueDef(shapeDef)) {
      symbols.shape = {value: shapeDef.value};
    }
  }

  if (channel !== OPACITY) {
    const opacity = getOpacityValue(model.encoding.opacity);
    if (opacity) { // only apply opacity if it is neither zero or undefined
      symbols.opacity = {value: opacity};
    }
  }

  symbols = {...symbols, ...symbolsSpec};

  return keys(symbols).length > 0 ? symbols : undefined;
}

export function gradient(fieldDef: FieldDef<string>, gradientSpec: any, model: UnitModel, channel: Channel, type: LegendType) {
  let gradient:any = {};

  if (type === 'gradient') {
    const opacity = getOpacityValue(model.encoding.opacity);
    if (opacity) { // only apply opacity if it is neither zero or undefined
      gradient.opacity = {value: opacity};
    }
  }

  gradient = {...gradient, ...gradientSpec};
  return keys(gradient).length > 0 ? gradient : undefined;
}

export function labels(fieldDef: FieldDef<string>, labelsSpec: any, model: UnitModel, channel: NonPositionScaleChannel, type: LegendType) {
  const legend = model.legend(channel);
  const config = model.config;

  let labels: any = {};

  if (isTimeFieldDef(fieldDef)) {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
    labelsSpec = {
      text: {
        signal: timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale)
      },
      ...labelsSpec,
    };
  }

  labels = {...labels, ...labelsSpec};

  return keys(labels).length > 0 ? labels : undefined;
}

function getOpacityValue(opacityDef: FieldDefWithCondition<MarkPropFieldDef<string>> | ValueDefWithCondition<MarkPropFieldDef<string>>): number {
  if (isValueDef(opacityDef)) {
    if (hasConditionalValueDef(opacityDef)) {
      const values = isArray(opacityDef.condition) ? opacityDef.condition.map(c => c.value) : [opacityDef.condition.value];
      return Math.max.apply(null, [opacityDef.value].concat(values));
    } else {
      return opacityDef.value as number;
    }
  }
  return undefined;
}
