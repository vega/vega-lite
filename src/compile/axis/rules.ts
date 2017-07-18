import {Axis} from '../../axis';
import {binToString} from '../../bin';
import {Channel, SpatialScaleChannel, X, Y} from '../../channel';
import {Config} from '../../config';
import {DateTime, dateTimeExpr, isDateTime} from '../../datetime';
import {FieldDef, title as fieldDefTitle} from '../../fielddef';
import * as log from '../../log';
import {ScaleType} from '../../scale';
import {truncate} from '../../util';
import {VgAxis} from '../../vega.schema';
import {numberFormat} from '../common';
import {UnitModel} from '../unit';
import {labelAngle} from './encode';


export function domainAndTicks(property: 'domain' | 'ticks', specifiedAxis: Axis, isGridAxis: boolean, channel: Channel) {
  if (isGridAxis) {
    return false;
  }
  return specifiedAxis[property];
}

export const domain = domainAndTicks;
export const ticks = domainAndTicks;

// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function gridShow(model: UnitModel, channel: SpatialScaleChannel) {
  const grid = model.axis(channel).grid;
  if (grid !== undefined) {
    return grid;
  }

  return !model.hasDiscreteDomain(channel) && !model.fieldDef(channel).bin;
}

export function grid(model: UnitModel, channel: SpatialScaleChannel, isGridAxis: boolean) {
  if (!isGridAxis) {
    return undefined;
  }

  return gridShow(model, channel);
}

export function gridScale(model: UnitModel, channel: Channel, isGridAxis: boolean) {
  if (isGridAxis) {
    const gridChannel: Channel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
      return model.scaleName(gridChannel);
    }
  }
  return undefined;
}


export function labelOverlap(fieldDef: FieldDef<string>, specifiedAxis: Axis, channel: Channel, isGridAxis: boolean, scaleType: ScaleType) {
  if (!isGridAxis && channel === 'x' && !labelAngle(specifiedAxis, channel, fieldDef)) {
    if (scaleType === 'log') {
      return 'greedy';
    }
    return true;
  }
  return undefined;
}

export function orient(channel: Channel) {
  switch (channel) {
    case X:
      return 'bottom';
    case Y:
      return 'left';
  }
  /* istanbul ignore next: This should never happen. */
  throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}

export function tickCount(channel: Channel, fieldDef: FieldDef<string>) {
  // FIXME depends on scale type too
  if (channel === X && !fieldDef.bin) {
    // Vega's default tickCount often lead to a lot of label occlusion on X without 90 degree rotation
    return 5;
  }

  return undefined;
}

export function title(specifiedAxis: Axis, fieldDef: FieldDef<string>, config: Config, isGridAxis: boolean) {
  if (isGridAxis) {
    return undefined;
  }

  if (specifiedAxis.title === '') {
    return undefined;
  }

  if (specifiedAxis.title !== undefined) {
    return specifiedAxis.title;
  }

  // if not defined, automatically determine axis title from field def
  const fieldTitle = fieldDefTitle(fieldDef, config);

  const maxLength: number = specifiedAxis.titleMaxLength;
  return maxLength ? truncate(fieldTitle, maxLength) : fieldTitle;
}

export function values(specifiedAxis: Axis, model: UnitModel, fieldDef: FieldDef<string>) {
  const vals = specifiedAxis.values;
  if (specifiedAxis.values && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return {signal: dateTimeExpr(dt, true)};
    });
  }
  if (!vals && fieldDef.bin) {
    const signal = model.getName(`${binToString(fieldDef.bin)}_${fieldDef.field}_bins`);
    return {signal: `sequence(${signal}.start, ${signal}.stop + ${signal}.step, ${signal}.step)`};
  }
  return vals;
}

export function zindex(isGridAxis: boolean) {
  if (isGridAxis) {
    // if grid is true, need to put layer on the back so that grid is behind marks
    return 0;
  }
  return 1; // otherwise return undefined and use Vega's default.
}
