import {isArray} from 'vega-util';
import {Channel, COLOR, NonPositionScaleChannel, OPACITY, SHAPE} from '../../channel';
import {
  FieldDef,
  FieldDefWithCondition,
  hasConditionalValueDef,
  isTimeFieldDef,
  isValueDef,
  MarkPropFieldDef,
  ValueDefWithCondition,
} from '../../fielddef';
import {AREA, BAR, CIRCLE, FILL_STROKE_CONFIG, GEOSHAPE, LINE, POINT, SQUARE, TEXT, TICK} from '../../mark';
import {ScaleType} from '../../scale';
import {keys} from '../../util';
import {LegendType, VgEncodeEntry} from '../../vega.schema';
import {applyMarkConfig, timeFormatExpression} from '../common';
import * as mixins from '../mark/mixins';
import {UnitModel} from '../unit';

export function symbols(fieldDef: FieldDef<string>, symbolsSpec: any, model: UnitModel, channel: Channel, type: LegendType): VgEncodeEntry {
  if (type === 'gradient') {
    return undefined;
  }

  const mark = model.mark();
  let out = {
    ...applyMarkConfig({}, model, FILL_STROKE_CONFIG),
    ...mixins.color(model)
  };

  switch (mark) {
    case BAR:
    case TICK:
    case TEXT:
      out.shape = {value: 'square'};
      break;
    case CIRCLE:
    case SQUARE:
      out.shape = {value: mark};
      break;
    case POINT:
    case LINE:
    case GEOSHAPE:
    case AREA:
      // use default circle
      break;
  }

  const filled = model.markDef.filled;

  if (out.fill) {
    // for fill legend, we don't want any fill in symbol
    if (channel === 'fill' || (filled && channel === COLOR)) {
      delete out.fill;
    } else if (out.fill['field']) {
      // For others, remove fill field
      delete out.fill;
    }
  }

  if (out.stroke) {
    if (channel === 'stroke' || (!filled && channel === COLOR)) {
      delete out.stroke;
    } else if (out.stroke['field']) {
      // For others, remove stroke field
      delete out.stroke;
    }
  }

  if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke) {
    // for non color channel's legend, we need to override symbol stroke config from Vega config
    out.stroke = {value: 'transparent'};
  }

  if (channel !== SHAPE) {
    const shapeDef = model.encoding.shape;
    if (isValueDef(shapeDef)) {
      out.shape = {value: shapeDef.value};
    }
  }

  if (channel !== OPACITY) {
    const opacity = getOpacityValue(model.encoding.opacity) || model.markDef.opacity;
    if (opacity) { // only apply opacity if it is neither zero or undefined
      out.opacity = {value: opacity};
    }
  }

  out = {...out, ...symbolsSpec};

  return keys(out).length > 0 ? out : undefined;
}

export function gradient(fieldDef: FieldDef<string>, gradientSpec: any, model: UnitModel, channel: Channel, type: LegendType) {
  let out: any = {};

  if (type === 'gradient') {
    const opacity = getOpacityValue(model.encoding.opacity) || model.markDef.opacity;
    if (opacity) { // only apply opacity if it is neither zero or undefined
      out.opacity = {value: opacity};
    }
  }

  out = {...out, ...gradientSpec};
  return keys(out).length > 0 ? out : undefined;
}

export function labels(fieldDef: FieldDef<string>, labelsSpec: any, model: UnitModel, channel: NonPositionScaleChannel, type: LegendType) {
  const legend = model.legend(channel);
  const config = model.config;

  let out: any = {};

  if (isTimeFieldDef(fieldDef)) {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
    labelsSpec = {
      text: {
        signal: timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale)
      },
      ...labelsSpec,
    };
  }

  out = {...out, ...labelsSpec};

  return keys(out).length > 0 ? out : undefined;
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
