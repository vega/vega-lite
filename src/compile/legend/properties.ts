import {LabelOverlap, LegendOrient, LegendType} from 'vega';
import {Channel, isColorChannel} from '../../channel';
import {FieldDef, valueArray} from '../../fielddef';
import {Legend, LegendConfig} from '../../legend';
import {hasContinuousDomain, ScaleType} from '../../scale';
import {contains, getFirstDefined} from '../../util';
import {Model} from '../model';

export function values(legend: Legend, fieldDef: FieldDef<string>) {
  const vals = legend.values;

  if (vals) {
    return valueArray(fieldDef, vals);
  }
  return undefined;
}

export function clipHeight(scaleType: ScaleType) {
  if (hasContinuousDomain(scaleType)) {
    return 20;
  }
  return undefined;
}

function type({legend, channel, scaleType}: {legend: Legend; channel: Channel; scaleType: ScaleType}): LegendType {
  // Following the logic in https://github.com/vega/vega-parser/blob/master/src/parsers/legend.js

  if (isColorChannel(channel)) {
    if (hasContinuousDomain(scaleType)) {
      return 'gradient';
    }
  }
  return 'symbol';
}

export function direction({
  legend,
  legendConfig,
  channel,
  scaleType
}: {
  legend: Legend;
  legendConfig: LegendConfig;
  channel: Channel;
  scaleType: ScaleType;
}) {
  const orient = getFirstDefined(legend.orient, legendConfig.orient, 'right');

  const legendType = type({legend, channel, scaleType});
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

function gradientLengthSignal(model: Model, sizeType: 'width' | 'height', min: number, max: number) {
  const sizeSignal = model.getSizeSignalRef(sizeType).signal;
  return {signal: `clamp(${sizeSignal}, ${min}, ${max})`};
}

export function labelOverlap(scaleType: ScaleType): LabelOverlap {
  if (contains(['quantile', 'threshold', 'log'], scaleType)) {
    return 'greedy';
  }
  return undefined;
}
