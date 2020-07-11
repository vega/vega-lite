import {FILL_STROKE_CONFIG} from './../../mark';
import {
  Color,
  ColorValue,
  Gradient,
  LabelOverlap,
  LegendOrient,
  LegendType,
  Orientation,
  SignalRef,
  SymbolShape
} from 'vega';
import {array, isArray} from 'vega-util';
import {Channel, isColorChannel, NonPositionChannel} from '../../channel';
import {
  DatumDef,
  hasConditionalValueDef,
  MarkPropFieldOrDatumDef,
  title as fieldDefTitle,
  TypedFieldDef,
  valueArray
} from '../../channeldef';
import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {Legend, LegendConfig} from '../../legend';
import {Mark, MarkDef} from '../../mark';
import {isContinuousToContinuous, ScaleType} from '../../scale';
import {TimeUnit} from '../../timeunit';
import {contains, getFirstDefined} from '../../util';
import {isSignalRef} from '../../vega.schema';
import {guideFormat, guideFormatType} from '../format';
import * as mixins from '../mark/encode';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {Conditional, isValueDef, Value, ValueDef} from './../../channeldef';
import {LegendComponentProps} from './component';
import {getFirstConditionValue} from './encode';
import {applyMarkConfig} from '../common';

export interface LegendRuleParams {
  legend: Legend;
  channel: NonPositionChannel;
  model: UnitModel;
  markDef: MarkDef;
  encoding: Encoding<string>;

  fieldOrDatumDef: MarkPropFieldOrDatumDef<string>;

  legendConfig: LegendConfig;

  config: Config;

  scaleType: ScaleType;

  orient: LegendOrient;

  legendType: LegendType;

  direction: Orientation;
}

export const legendRules: {
  [k in keyof LegendComponentProps]?: (params: LegendRuleParams) => LegendComponentProps[k];
} = {
  direction: ({direction}) => direction,

  format: ({fieldOrDatumDef, legend, config}) => {
    const {format, formatType} = legend;
    return guideFormat(fieldOrDatumDef, fieldOrDatumDef.type, format, formatType, config, false);
  },

  formatType: ({legend, fieldOrDatumDef, scaleType}) => {
    const {formatType} = legend;
    return guideFormatType(formatType, fieldOrDatumDef, scaleType);
  },

  gradientLength: params => {
    const {legend, legendConfig} = params;
    return legend.gradientLength ?? legendConfig.gradientLength ?? defaultGradientLength(params);
  },

  gradientOpacity: ({legend, legendConfig, model}) => {
    const opacity =
      legend.gradientOpacity ??
      getMaxValue(model.encoding.opacity) ??
      model.markDef.opacity ??
      legendConfig.gradientOpacity;
    return opacity < 1 ? opacity : undefined;
  },

  symbolOpacity: ({legend, legendConfig, model}) => {
    const opacity =
      legend.symbolOpacity ??
      getMaxValue(model.encoding.opacity) ??
      model.markDef.opacity ??
      legendConfig.symbolOpacity;
    return opacity < 1 ? opacity : undefined;
  },

  symbolFillColor: ({legend, legendConfig, encoding, model, channel}) => {
    if (legend.symbolFillColor) {
      return legend.symbolFillColor;
    }

    const {mark, markDef} = model;
    const filled = markDef.filled && mark !== 'trail';
    const defaultMarkFill = mixins.color(model, {filled}).fill;

    console.log({
      ...applyMarkConfig({}, model, FILL_STROKE_CONFIG),
      ...mixins.color(model, {filled})
    });

    if (isArray(defaultMarkFill)) {
      return (
        getFirstConditionValue<ColorValue>(encoding.fill ?? encoding.color) ?? markDef.fill,
        filled ? markDef.color : undefined ?? legendConfig.symbolFillColor
      );
    } else {
      return defaultMarkFill?.field
        ? isColorChannel(channel)
          ? undefined
          : legendConfig.symbolBaseFillColor ?? 'darkgray'
        : (defaultMarkFill?.value as Color) ?? legendConfig.symbolFillColor;
    }
  },

  symbolStrokeColor: ({legend, legendConfig, encoding, model}) => {
    if (legend.symbolStrokeColor) {
      return legend.symbolStrokeColor;
    }

    const {mark, markDef} = model;
    const filled = markDef.filled && mark !== 'trail';
    const defaultMarkStroke = mixins.color(model, {filled}).stroke;

    if (isArray(defaultMarkStroke)) {
      return getFirstConditionValue<ColorValue>(encoding.stroke ?? encoding.color) ?? (markDef.stroke && filled)
        ? markDef.color
        : undefined ?? legendConfig.symbolStrokeColor ?? 'transparent';
    } else {
      return defaultMarkStroke?.field
        ? undefined
        : (defaultMarkStroke?.value as Color) ?? legendConfig.symbolStrokeColor ?? 'transparent';
    }
  },

  labelOverlap: ({legend, legendConfig, scaleType}) =>
    legend.labelOverlap ?? legendConfig.labelOverlap ?? defaultLabelOverlap(scaleType),

  symbolType: ({legend, markDef, channel, encoding}) =>
    legend.symbolType ?? defaultSymbolType(markDef.type, channel, encoding.shape, markDef.shape),

  title: ({fieldOrDatumDef, config}) => fieldDefTitle(fieldOrDatumDef, config, {allowDisabling: true}),

  type: ({legendType, scaleType, channel}) => {
    // We determine the legend type earlier. Here we only determine whether we need to tell vega the type.
    if (isColorChannel(channel) && isContinuousToContinuous(scaleType)) {
      if (legendType === 'gradient') {
        return undefined;
      }
    } else if (legendType === 'symbol') {
      return undefined;
    }
    return legendType;
  },

  values: ({fieldOrDatumDef, legend}) => values(legend, fieldOrDatumDef)
};

export function values(legend: Legend, fieldOrDatumDef: TypedFieldDef<string> | DatumDef) {
  const vals = legend.values;

  if (isArray(vals)) {
    return valueArray(fieldOrDatumDef, vals);
  } else if (isSignalRef(vals)) {
    return vals;
  }
  return undefined;
}

export function defaultSymbolType(
  mark: Mark,
  channel: Channel,
  shapeChannelDef: Encoding<string>['shape'],
  markShape: SymbolShape | SignalRef
): SymbolShape | SignalRef {
  if (channel !== 'shape') {
    // use the value from the shape encoding or the mark config if they exist
    const shape = getFirstConditionValue<string>(shapeChannelDef) ?? markShape;
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
    case 'arc':
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

export function getLegendType(params: {
  legend: Legend;
  channel: Channel;
  timeUnit?: TimeUnit;
  scaleType: ScaleType;
}): LegendType {
  const {legend} = params;

  return getFirstDefined(legend.type, defaultType(params));
}

export function defaultType({
  channel,
  timeUnit,
  scaleType
}: {
  channel: Channel;
  timeUnit?: TimeUnit;
  scaleType: ScaleType;
}): LegendType {
  // Following the logic in https://github.com/vega/vega-parser/blob/master/src/parsers/legend.js

  if (isColorChannel(channel)) {
    if (contains(['quarter', 'month', 'day'], timeUnit)) {
      return 'symbol';
    }

    if (isContinuousToContinuous(scaleType)) {
      return 'gradient';
    }
  }
  return 'symbol';
}

export function getDirection({
  legendConfig,
  legendType,
  orient,
  legend
}: {
  orient: LegendOrient;
  legendConfig: LegendConfig;
  legendType: LegendType;
  legend: Legend;
}): Orientation {
  return (
    legend.direction ??
    legendConfig[legendType ? 'gradientDirection' : 'symbolDirection'] ??
    defaultDirection(orient, legendType)
  );
}

export function defaultDirection(orient: LegendOrient, legendType: LegendType): 'horizontal' | undefined {
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
  legendConfig,
  model,
  direction,
  orient,
  scaleType
}: {
  scaleType: ScaleType;
  direction: Orientation;
  orient: LegendOrient;
  model: Model;
  legendConfig: LegendConfig;
}) {
  const {
    gradientHorizontalMaxLength,
    gradientHorizontalMinLength,
    gradientVerticalMaxLength,
    gradientVerticalMinLength
  } = legendConfig;
  if (isContinuousToContinuous(scaleType)) {
    if (direction === 'horizontal') {
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

function getMaxValue(channelDef: Encoding<string>['opacity']) {
  return getConditionValue<number>(channelDef, (v: number, conditionalDef) => Math.max(v, conditionalDef.value as any));
}

function getConditionValue<V extends Value | Gradient>(
  channelDef: Encoding<string>['fill' | 'stroke' | 'shape' | 'opacity'],
  reducer: (val: V, conditionalDef: Conditional<ValueDef<V>>) => V
): V {
  if (hasConditionalValueDef(channelDef)) {
    return array(channelDef.condition).reduce(reducer, channelDef.value as any);
  } else if (isValueDef(channelDef)) {
    return channelDef.value as any;
  }
  return undefined;
}
