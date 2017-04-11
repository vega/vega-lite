import * as log from '../../log';

import {Axis} from '../../axis';
import {Channel, COLUMN, ROW, X, Y} from '../../channel';
import {Config} from '../../config';
import {DateTime, isDateTime, timestamp} from '../../datetime';
import {FieldDef, title as fieldDefTitle} from '../../fielddef';
import {truncate} from '../../util';
import {VgAxis} from '../../vega.schema';

import {numberFormat} from '../common';
import {Model} from '../model';

export function format(specifiedAxis: Axis, channel: Channel, fieldDef: FieldDef, config: Config) {
  return numberFormat(fieldDef, specifiedAxis.format, config, channel);
}

// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function gridShow(model: Model, channel: Channel) {
  const grid = model.axis(channel).grid;
  if (grid !== undefined) {
    return grid;
  }

  return !model.hasDiscreteScale(channel) && !model.fieldDef(channel).bin;
}

export function grid(model: Model, channel: Channel, isGridAxis: boolean) {
  if (channel === ROW || channel === COLUMN) {
    // never apply grid for ROW and COLUMN since we manually create rule-group for them
    return false;
  }

  if (!isGridAxis) {
    return undefined;
  }

  return gridShow(model, channel);
}

export function gridScale(model: Model, channel: Channel, isGridAxis: boolean) {
  if (isGridAxis) {
    const gridChannel: Channel = channel === 'x' ? 'y' : 'x';
    if (model.scale(gridChannel)) {
      return model.scaleName(gridChannel);
    }
  }
  return undefined;
}

export function orient(specifiedAxis: Axis, channel: Channel) {
  const orient = specifiedAxis.orient;
  if (orient) {
    return orient;
  }

  switch (channel) {
    case COLUMN:
      // FIXME test and decide
      return 'top';
    case X:
      return 'bottom';
    case ROW:
    case Y:
      return 'left';
  }
  /* istanbul ignore next: This should never happen. */
  throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}

export function tickCount(specifiedAxis: Axis, channel: Channel, fieldDef: FieldDef) {
  const count = specifiedAxis.tickCount;
  if (count !== undefined) {
    return count;
  }

  // FIXME depends on scale type too
  if (channel === X && !fieldDef.bin) {
    // Vega's default tickCount often lead to a lot of label occlusion on X without 90 degree rotation
    return 5;
  }

  return undefined;
}

export function title(specifiedAxis: Axis, fieldDef: FieldDef, config: Config, isGridAxis: boolean) {
  if (isGridAxis) {
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

export function values(specifiedAxis: Axis) {
  const vals = specifiedAxis.values;
  if (specifiedAxis.values && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return timestamp(dt, true);
    });
  }
  return vals;
}

export function zindex(specifiedAxis: Axis, isGridAxis: boolean) {
  const z = specifiedAxis.zindex;
  if (z !== undefined) {
    return z;
  }
  if (isGridAxis) {
    // if grid is true, need to put layer on the back so that grid is behind marks
    return 0;
  }
  return 1; // otherwise return undefined and use Vega's default.
}

export function domainAndTicks(property: keyof VgAxis, specifiedAxis: Axis, isGridAxis: boolean, channel: Channel) {
  if (isGridAxis || channel === ROW || channel === COLUMN) {
    return false;
  }
  return specifiedAxis[property];
}

export const domain = domainAndTicks;
export const ticks = domainAndTicks;
