import {Align, AxisOrient, SignalRef} from 'vega';
import {isArray} from 'vega-util';
import {Axis} from '../../axis';
import {isBinning} from '../../bin';
import {PositionScaleChannel, X, Y} from '../../channel';
import {DatumDef, isDiscrete, isFieldDef, TypedFieldDef, valueArray} from '../../channeldef';
import {Mark} from '../../mark';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {normalizeTimeUnit} from '../../timeunit';
import {NOMINAL, ORDINAL, Type} from '../../type';
import {contains, normalizeAngle} from '../../util';
import {isSignalRef} from '../../vega.schema';
import {UnitModel} from '../unit';
import {AxisConfigs, getAxisConfig} from './config';

// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */

export function defaultGrid(scaleType: ScaleType, fieldDef: TypedFieldDef<string>) {
  return !hasDiscreteDomain(scaleType) && !isBinning(fieldDef?.bin);
}

export function gridScale(model: UnitModel, channel: PositionScaleChannel) {
  const gridChannel: PositionScaleChannel = channel === 'x' ? 'y' : 'x';
  if (model.getScaleComponent(gridChannel)) {
    return model.scaleName(gridChannel);
  }
  return undefined;
}

export function labelAngle(
  model: UnitModel,
  specifiedAxis: Axis,
  channel: PositionScaleChannel,
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef,
  axisConfigs?: AxisConfigs
) {
  // try axis value
  if (specifiedAxis?.labelAngle !== undefined) {
    return normalizeAngle(specifiedAxis?.labelAngle);
  } else {
    // try axis config value
    const {configValue: angle} = getAxisConfig('labelAngle', model.config, specifiedAxis?.style, axisConfigs);
    if (angle !== undefined) {
      return normalizeAngle(angle);
    } else {
      // get default value
      if (channel === X && contains([NOMINAL, ORDINAL], fieldOrDatumDef.type)) {
        return 270;
      }
      // no default
      return undefined;
    }
  }
}

export function defaultLabelBaseline(angle: number, axisOrient: AxisOrient, channel?: 'x' | 'y') {
  channel = channel || (axisOrient === 'top' || axisOrient === 'bottom' ? 'x' : 'y');

  if (angle !== undefined) {
    if (channel === 'x') {
      return (45 < angle && angle < 135) || (225 < angle && angle < 315)
        ? 'middle'
        : (angle <= 45 || 315 <= angle) === (axisOrient === 'top')
        ? 'bottom'
        : 'top';
    } else {
      return angle <= 45 || 315 <= angle || (135 <= angle && angle <= 225)
        ? 'middle'
        : (45 <= angle && angle <= 135) === (axisOrient === 'left')
        ? 'top'
        : 'bottom';
    }
  }
  return undefined;
}

export function defaultLabelAlign(angle: number, axisOrient: AxisOrient, channel?: 'x' | 'y'): Align {
  channel = channel || (axisOrient === 'top' || axisOrient === 'bottom' ? 'x' : 'y');

  // TODO: generate signal based on a similar formula if orient is a signal

  if (angle !== undefined) {
    if (channel === 'x') {
      return angle % 180 === 0 ? 'center' : angle < 180 === (axisOrient === 'top') ? 'right' : 'left';
    } else {
      return (angle + 90) % 180 === 0
        ? 'center'
        : (90 < angle && angle < 270) === (axisOrient === 'left')
        ? 'left'
        : 'right';
    }
  }
  return undefined;
}

export function defaultLabelFlush(type: Type, channel: PositionScaleChannel) {
  if (channel === 'x' && contains(['quantitative', 'temporal'], type)) {
    return true;
  }
  return undefined;
}

export function defaultLabelOverlap(type: Type, scaleType: ScaleType) {
  // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
  if (type !== 'nominal') {
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
}

export function defaultTickCount({
  fieldOrDatumDef,
  scaleType,
  size,
  values: vals
}: {
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef;
  scaleType: ScaleType;
  size?: SignalRef;
  values?: Axis['values'];
}) {
  if (!vals && !hasDiscreteDomain(scaleType) && scaleType !== 'log') {
    if (isFieldDef(fieldOrDatumDef)) {
      if (isBinning(fieldOrDatumDef.bin)) {
        // for binned data, we don't want more ticks than maxbins
        return {signal: `ceil(${size.signal}/10)`};
      }

      if (
        fieldOrDatumDef.timeUnit &&
        contains(['month', 'hours', 'day', 'quarter'], normalizeTimeUnit(fieldOrDatumDef.timeUnit)?.unit)
      ) {
        return undefined;
      }
    }

    return {signal: `ceil(${size.signal}/40)`};
  }

  return undefined;
}

export function values(specifiedAxis: Axis, fieldOrDatumDef: TypedFieldDef<string> | DatumDef) {
  const vals = specifiedAxis.values;

  if (isArray(vals)) {
    return valueArray(fieldOrDatumDef, vals);
  } else if (isSignalRef(vals)) {
    return vals;
  }

  return undefined;
}

export function defaultZindex(mark: Mark, fieldDef: TypedFieldDef<string> | DatumDef) {
  if (mark === 'rect' && isDiscrete(fieldDef)) {
    return 1;
  }
  return 0;
}
