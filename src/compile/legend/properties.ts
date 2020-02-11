import {LabelOverlap, LegendOrient, LegendType, SignalRef, SymbolShape} from 'vega-typings';
import {isArray} from 'vega-util';
import {Channel, isColorChannel} from '../../channel';
import {
  FieldDefWithCondition,
  MarkPropFieldDef,
  TypedFieldDef,
  valueArray,
  ValueDefWithCondition
} from '../../channeldef';
import {Legend, LegendConfig} from '../../legend';
import {Mark} from '../../mark';
import {isContinuousToContinuous, ScaleType} from '../../scale';
import {TimeUnit} from '../../timeunit';
import {contains, getFirstDefined} from '../../util';
import {isSignalRef} from '../../vega.schema';
import {Model} from '../model';
import {getFirstConditionValue} from './encode';

export function values(legend: Legend, fieldDef: TypedFieldDef<string>) {
  const vals = legend.values;

  if (isArray(vals)) {
    return valueArray(fieldDef, vals);
  } else if (isSignalRef(vals)) {
    return vals;
  }
  return undefined;
}

export function defaultSymbolType(
  mark: Mark,
  channel: Channel,
  shapeChannelDef:
    | FieldDefWithCondition<MarkPropFieldDef<string>, SymbolShape>
    | ValueDefWithCondition<MarkPropFieldDef<string>, SymbolShape>,
  markShape: SymbolShape | SignalRef
): SymbolShape | SignalRef {
  if (channel !== 'shape') {
    // use the value from the shape encoding or the mark config if they exist
    const shape = getFirstConditionValue(shapeChannelDef) ?? markShape;
    if (shape) {
      return shape;
    }
  }

  switch (mark) {
    case 'bar':
    case 'rect':
    case 'image':
    case 'square':
      return 'square';
    case 'line':
    case 'trail':
    case 'rule':
      return 'stroke';
    case 'point':
    case 'circle':
    case 'tick':
    case 'geoshape':
    case 'area':
    case 'text':
      return 'circle';
  }
}

export function clipHeight(legendType: LegendType) {
  if (legendType === 'gradient') {
    return 20;
  }
  return undefined;
}

export function type(params: {
  legend: Legend;
  channel: Channel;
  timeUnit?: TimeUnit;
  scaleType: ScaleType;
  alwaysReturn: boolean;
}): LegendType {
  const {legend} = params;

  return getFirstDefined(legend.type, defaultType(params));
}

export function defaultType({
  channel,
  timeUnit,
  scaleType,
  alwaysReturn
}: {
  channel: Channel;
  timeUnit?: TimeUnit;
  scaleType: ScaleType;
  alwaysReturn: boolean;
}): LegendType {
  // Following the logic in https://github.com/vega/vega-parser/blob/master/src/parsers/legend.js

  if (isColorChannel(channel)) {
    if (contains(['quarter', 'month', 'day'], timeUnit)) {
      return 'symbol';
    }

    if (isContinuousToContinuous(scaleType)) {
      return alwaysReturn ? 'gradient' : undefined;
    }
  }
  return alwaysReturn ? 'symbol' : undefined;
}

export function direction({
  legend,
  legendConfig,
  timeUnit,
  channel,
  scaleType
}: {
  legend: Legend;
  legendConfig: LegendConfig;
  timeUnit?: TimeUnit;
  channel: Channel;
  scaleType: ScaleType;
}) {
  const orient = getFirstDefined(legend.orient, legendConfig.orient, 'right');

  const legendType = type({legend, channel, timeUnit, scaleType, alwaysReturn: true});
  return getFirstDefined(
    legend.direction,
    legendConfig[legendType ? 'gradientDirection' : 'symbolDirection'],
    defaultDirection(orient, legendType)
  );
}

function defaultDirection(orient: LegendOrient, legendType: LegendType) {
  switch (orient) {
    case 'top':
    case 'bottom':
      return 'horizontal';

    case 'left':
    case 'right':
    case 'none':
    case undefined: // undefined = "right" in Vega
      return undefined; // vertical is Vega's default
    default:
      // top-left / ...
      // For inner legend, uses compact layout like Tableau
      return legendType === 'gradient' ? 'horizontal' : undefined;
  }
}

export function defaultGradientLength({
  legend,
  legendConfig,
  model,
  channel,
  scaleType
}: {
  legend: Legend;
  legendConfig: LegendConfig;
  model: Model;
  channel: Channel;
  scaleType: ScaleType;
}) {
  const {
    gradientHorizontalMaxLength,
    gradientHorizontalMinLength,
    gradientVerticalMaxLength,
    gradientVerticalMinLength
  } = legendConfig;

  if (isContinuousToContinuous(scaleType)) {
    const dir = direction({legend, legendConfig, channel, scaleType});
    if (dir === 'horizontal') {
      const orient = getFirstDefined(legend.orient, legendConfig.orient);
      if (orient === 'top' || orient === 'bottom') {
        return gradientLengthSignal(model, 'width', gradientHorizontalMinLength, gradientHorizontalMaxLength);
      } else {
        return gradientHorizontalMinLength;
      }
    } else {
      // vertical / undefined (Vega uses vertical by default)
      return gradientLengthSignal(model, 'height', gradientVerticalMinLength, gradientVerticalMaxLength);
    }
  }
  return undefined;
}

function gradientLengthSignal(model: Model, sizeType: 'width' | 'height', min: number, max: number) {
  const sizeSignal = model.getSizeSignalRef(sizeType).signal;
  return {signal: `clamp(${sizeSignal}, ${min}, ${max})`};
}

export function defaultLabelOverlap(scaleType: ScaleType): LabelOverlap {
  if (contains(['quantile', 'threshold', 'log'], scaleType)) {
    return 'greedy';
  }
  return undefined;
}
