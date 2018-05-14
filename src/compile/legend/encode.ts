import {isArray} from 'vega-util';

import {Channel, COLOR, NonPositionScaleChannel, OPACITY, SHAPE} from '../../channel';
import {
  Conditional,
  FieldDef,
  FieldDefWithCondition,
  hasConditionalValueDef,
  isTimeFieldDef,
  isValueDef,
  MarkPropFieldDef,
  ValueDef,
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

  let out = {
    ...applyMarkConfig({}, model, FILL_STROKE_CONFIG),
    ...mixins.color(model)
  };

  switch (model.mark) {
    case BAR:
    case TICK:
    case TEXT:
      out.shape = {value: 'square'};
      break;
    case CIRCLE:
    case SQUARE:
      out.shape = {value: model.mark};
      break;
    case POINT:
    case LINE:
    case GEOSHAPE:
    case AREA:
      // use default circle
      break;
  }

  const {markDef, encoding} = model;
  const filled = markDef.filled;

  if (out.fill) {
    // for fill legend, we don't want any fill in symbol
    if (channel === 'fill' || (filled && channel === COLOR)) {
      delete out.fill;
    } else {
      if (out.fill['field']) {
        // For others, remove fill field
        delete out.fill;
      } else if (isArray(out.fill)) {
        const fill = getFirstConditionValue(encoding.fill || encoding.color) || markDef.fill || (filled && markDef.color);
        if (fill) {
          out.fill = {value: fill};
        }
      }
    }
  }

  if (out.stroke) {
    if (channel === 'stroke' || (!filled && channel === COLOR)) {
      delete out.stroke;
    } else {
      if (out.stroke['field']) {
        // For others, remove stroke field
        delete out.stroke;
      } else if (isArray(out.stroke)) {
        const stroke = getFirstConditionValue(encoding.stroke || encoding.color) || markDef.stroke || (!filled && markDef.color);
        if (stroke) {
          out.stroke = {value: stroke};
        }
      }
    }
  }

  if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke) {
    // for non color channel's legend, we need to override symbol stroke config from Vega config
    out.stroke = {value: 'transparent'};
  }

  if (channel !== SHAPE) {
    const shape = getFirstConditionValue(encoding.shape) || markDef.shape;
    if (shape) {
      out.shape = {value: shape};
    }
  }

  if (channel !== OPACITY) {
    const opacity = getMaxValue(encoding.opacity) || markDef.opacity;
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
    const opacity = getMaxValue(model.encoding.opacity) || model.markDef.opacity;
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
    const expr = timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale);
    labelsSpec = {
      ...(expr ? {text: {signal: expr}} : {}),
      ...labelsSpec,
    };
  }

  out = {...out, ...labelsSpec};

  return keys(out).length > 0 ? out : undefined;
}

function getMaxValue(channelDef: FieldDefWithCondition<MarkPropFieldDef<string>> | ValueDefWithCondition<MarkPropFieldDef<string>>) {
  return getConditionValue(channelDef,
    (v: number, conditionalDef) => Math.max(v, conditionalDef.value as any)
  );
}

function getFirstConditionValue(channelDef: FieldDefWithCondition<MarkPropFieldDef<string>> | ValueDefWithCondition<MarkPropFieldDef<string>>) {
  return getConditionValue(channelDef,
    (v: number, conditionalDef) => v !== undefined ? v : conditionalDef.value
  );
}

function getConditionValue<T>(
  channelDef: FieldDefWithCondition<MarkPropFieldDef<string>> | ValueDefWithCondition<MarkPropFieldDef<string>>,
  reducer: (val: T, conditionalDef: Conditional<ValueDef>) => T
): T {

  if (hasConditionalValueDef(channelDef)) {
    return (isArray(channelDef.condition) ? channelDef.condition : [channelDef.condition])
      .reduce(reducer, channelDef.value as any);
  } else if (isValueDef(channelDef)) {
    return channelDef.value as any;
  }
  return undefined;
}
