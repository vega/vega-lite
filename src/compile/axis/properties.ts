import {truncate} from 'vega-util';
import {Axis} from '../../axis';
import {binToString} from '../../bin';
import {PositionScaleChannel, X, Y} from '../../channel';
import {Config} from '../../config';
import {FieldDef, title as fieldDefTitle, valueArray} from '../../fielddef';
import * as log from '../../log';
import {hasDiscreteDomain, isSelectionDomain, ScaleType} from '../../scale';
import {NOMINAL, ORDINAL, QUANTITATIVE} from '../../type';
import {contains} from '../../util';
import {AxisOrient, HorizontalAlign, VgSignalRef} from '../../vega.schema';
import {UnitModel} from '../unit';
import {getAxisConfig} from './config';


// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function grid(scaleType: ScaleType, fieldDef: FieldDef<string>) {
  return !hasDiscreteDomain(scaleType) && !fieldDef.bin;
}

export function gridScale(model: UnitModel, channel: PositionScaleChannel) {
  const gridChannel: PositionScaleChannel = channel === 'x' ? 'y' : 'x';
  if (model.getScaleComponent(gridChannel)) {
    return model.scaleName(gridChannel);
  }
  return undefined;
}

export function labelAngle(model: UnitModel, specifiedAxis: Axis, channel: PositionScaleChannel, fieldDef: FieldDef<string>) {
  // try axis value
  if (specifiedAxis.labelAngle !== undefined) {
    // Make angle within [0,360)
    return ((specifiedAxis.labelAngle % 360) + 360) % 360;
  } else {
    // try axis config value
    const angle = getAxisConfig('labelAngle', model.config, channel, orient(channel), model.getScaleComponent(channel).get('type'));
    if (angle !== undefined) {
      return ((angle % 360) + 360) % 360;
    } else {
      // get default value
      if (channel === X && contains([NOMINAL, ORDINAL], fieldDef.type)) {
        return 270;
      }
      // no default
      return undefined;
    }
  }
}

export function labelBaseline(angle: number, axisOrient: AxisOrient) {
  if (angle !== undefined) {
    if (axisOrient === 'top' || axisOrient === 'bottom') {
      if (angle <= 45 || 315 <= angle) {
        return axisOrient === 'top' ? 'bottom' : 'top';
      } else if (135 <= angle && angle <= 225) {
        return axisOrient === 'top' ? 'top' : 'bottom';
      } else {
        return 'middle';
      }
    } else {
      if ((angle <= 45 || 315 <= angle) || (135 <= angle && angle <= 225)) {
        return 'middle';
      } else if (45 <= angle && angle <= 135) {
        return axisOrient === 'left' ? 'top' : 'bottom';
      } else {
        return axisOrient === 'left' ? 'bottom' : 'top';
      }
    }
  }
  return undefined;
}

export function labelAlign(angle: number, axisOrient: AxisOrient): HorizontalAlign {
  if (angle !== undefined) {
    angle = ((angle % 360) + 360) % 360;
    if (axisOrient === 'top' || axisOrient === 'bottom') {
      if (angle % 180 === 0) {
        return 'center';
      } else if (0 < angle && angle < 180) {
        return axisOrient === 'top' ? 'right' : 'left';
      } else {
        return axisOrient === 'top' ? 'left' : 'right';
      }
    } else {
      if ((angle + 90) % 180 === 0) {
        return 'center';
      } else if (90 <= angle && angle < 270) {
        return axisOrient === 'left' ? 'left' : 'right';
      } else {
        return axisOrient === 'left' ? 'right' : 'left';
      }
    }
  }
  return undefined;
}

export function labelFlush(fieldDef: FieldDef<string>, channel: PositionScaleChannel, specifiedAxis: Axis) {
  if (specifiedAxis.labelFlush !== undefined) {
    return specifiedAxis.labelFlush;
  }
  if (channel === 'x' && contains(['quantitative', 'temporal'], fieldDef.type)) {
    return true;
  }
  return undefined;
}

export function labelOverlap(fieldDef: FieldDef<string>, specifiedAxis: Axis, channel: PositionScaleChannel, scaleType: ScaleType) {
  if (specifiedAxis.labelOverlap !== undefined) {
    return specifiedAxis.labelOverlap;
  }

  // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
  if (fieldDef.type !== 'nominal') {
    if (scaleType === 'log') {
      return 'greedy';
    }
    return true;
  }

  return undefined;
}

export function orient(channel: PositionScaleChannel) {
  switch (channel) {
    case X:
      return 'bottom';
    case Y:
      return 'left';
  }
  /* istanbul ignore next: This should never happen. */
  throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}

export function tickCount(channel: PositionScaleChannel, fieldDef: FieldDef<string>, scaleType: ScaleType, size: VgSignalRef) {
  if (!hasDiscreteDomain(scaleType) && scaleType !== 'log' && !contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {

    if (fieldDef.bin) {
      // for binned data, we don't want more ticks than maxbins
      return {signal: `ceil(${size.signal}/20)`};
    }
    return {signal: `ceil(${size.signal}/40)`};
  }

  return undefined;
}

export function title(maxLength: number, fieldDef: FieldDef<string>, config: Config) {
  // if not defined, automatically determine axis title from field def
  const fieldTitle = fieldDefTitle(fieldDef, config);
  return maxLength ? truncate(fieldTitle, maxLength) : fieldTitle;
}

export function values(specifiedAxis: Axis, model: UnitModel, fieldDef: FieldDef<string>, channel: PositionScaleChannel) {
  const vals = specifiedAxis.values;

  if (vals) {
    return valueArray(fieldDef, vals);
  }

  if (fieldDef.bin && fieldDef.type === QUANTITATIVE) {
    const domain = model.scaleDomain(channel);
    if (domain && domain !== 'unaggregated' && !isSelectionDomain(domain)) { // explicit value
      return undefined;
    }

    const signal = model.getName(`${binToString(fieldDef.bin)}_${fieldDef.field}_bins`);
    return {signal: `sequence(${signal}.start, ${signal}.stop + ${signal}.step, ${signal}.step)`};
  }

  return undefined;
}
