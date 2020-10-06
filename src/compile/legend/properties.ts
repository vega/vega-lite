import {LabelOverlap, LegendOrient, LegendType, Orientation, SignalRef, SymbolShape} from 'vega';
import {isArray} from 'vega-util';
import {isColorChannel} from '../../channel';
import {DatumDef, MarkPropFieldOrDatumDef, title as fieldDefTitle, TypedFieldDef, valueArray} from '../../channeldef';
import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {Legend, LegendConfig, LegendInternal} from '../../legend';
import {Mark, MarkDef} from '../../mark';
import {isContinuousToContinuous, ScaleType} from '../../scale';
import {TimeUnit} from '../../timeunit';
import {contains, getFirstDefined} from '../../util';
import {isSignalRef} from '../../vega.schema';
import {guideFormat, guideFormatType} from '../format';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {NonPositionScaleChannel} from './../../channel';
import {LegendComponentProps} from './component';
import {getFirstConditionValue} from './encode';

export interface LegendRuleParams {
  legend: LegendInternal;
  channel: NonPositionScaleChannel;
  model: UnitModel;
  markDef: MarkDef<Mark, SignalRef>;
  encoding: Encoding<string>;
  fieldOrDatumDef: MarkPropFieldOrDatumDef<string>;
  legendConfig: LegendConfig<SignalRef>;
  config: Config<SignalRef>;
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

  labelOverlap: ({legend, legendConfig, scaleType}) =>
    legend.labelOverlap ?? legendConfig.labelOverlap ?? defaultLabelOverlap(scaleType),

  symbolType: ({legend, markDef, channel, encoding}) =>
    legend.symbolType ?? defaultSymbolType(markDef.type, channel, encoding.shape, markDef.shape),

  title: ({fieldOrDatumDef, config}) => fieldDefTitle(fieldOrDatumDef, config, {allowDisabling: true}),

  type: ({legendType, scaleType, channel}) => {
    if (isColorChannel(channel) && isContinuousToContinuous(scaleType)) {
      if (legendType === 'gradient') {
        return undefined;
      }
    } else if (legendType === 'symbol') {
      return undefined;
    }
    return legendType;
  }, // depended by other property, let's define upfront

  values: ({fieldOrDatumDef, legend}) => values(legend, fieldOrDatumDef)
};

export function values(legend: LegendInternal, fieldOrDatumDef: TypedFieldDef<string> | DatumDef) {
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
  channel: NonPositionScaleChannel,
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
  legend: LegendInternal;
  channel: NonPositionScaleChannel;
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
  channel: NonPositionScaleChannel;
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
  legendConfig: LegendConfig<SignalRef>;
  legendType: LegendType;
  legend: Legend<SignalRef>;
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
  legendConfig: LegendConfig<SignalRef>;
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
  if (contains(['quantile', 'threshold', 'log', 'symlog'], scaleType)) {
    return 'greedy';
  }
  return undefined;
}
