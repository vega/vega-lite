import * as log from '../../log';

import {AxisOrient} from '../../axis';
import {COLUMN, ROW, X, Y, Channel} from '../../channel';
import {DateTime, isDateTime, timestamp} from '../../datetime';
import {title as fieldDefTitle} from '../../fielddef';
import {truncate} from '../../util';

import {numberFormat} from '../common';
import {Model} from '../model';
import {UnitModel} from '../unit';

export function format(model: Model, channel: Channel) {
  return numberFormat(model.fieldDef(channel), model.axis(channel).format, model.config(), channel);
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

export function grid(model: Model, channel: Channel) {
  if (channel === ROW || channel === COLUMN) {
    // never apply grid for ROW and COLUMN since we manually create rule-group for them
    return undefined;
  }

  return gridShow(model, channel) && (
    // TODO refactor this cleanly -- essentially the condition below is whether
    // the axis is a shared / union axis.
    (channel === Y || channel === X) && !(model.parent() && model.parent().isFacet())
  );
}

export function gridScale(model: Model, channel: Channel) {
  const gridChannel: Channel = channel === 'x' ? 'y' : 'x';
  if (model.scale(gridChannel)) {
    return model.scaleName(gridChannel);
  }
  return undefined;
}

export function zindex(model: Model, channel: Channel, def: {grid?: boolean}) {
  const z = model.axis(channel).zindex;
  if (z !== undefined) {
    return z;
  }
  if (def.grid) {
    // if grid is true, need to put layer on the back so that grid is behind marks
    return 0;
  }
  return 1; // otherwise return undefined and use Vega's default.
};

export function orient(model: Model, channel: Channel) {
  const orient = model.axis(channel).orient;
  if (orient) {
    return orient;
  }

  switch (channel) {
    case COLUMN:
      // FIXME test and decide
      return AxisOrient.TOP;
    case X:
      return AxisOrient.BOTTOM;
    case ROW:
    case Y:
      return AxisOrient.LEFT;
  }
  /* istanbul ignore next: This should never happen. */
  throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}

export function tickCount(model: Model, channel: Channel) {
  const count = model.axis(channel).tickCount;
  if (count !== undefined) {
    return count;
  }

  // FIXME depends on scale type too
  if (channel === X && !model.fieldDef(channel).bin) {
    // Vega's default tickCount often lead to a lot of label occlusion on X without 90 degree rotation
    return 5;
  }

  return undefined;
}

export function title(model: Model, channel: Channel) {
  const axis = model.axis(channel);
  if (axis.title !== undefined) {
    return axis.title;
  }

  // if not defined, automatically determine axis title from field def
  const fieldTitle = fieldDefTitle(model.fieldDef(channel), model.config());

  let maxLength: number;
  if (axis.titleMaxLength) {
    maxLength = axis.titleMaxLength;
  } else if (channel === X && !model.hasDiscreteScale(X)) {
    const unitModel: UnitModel = model as any; // only unit model has channel x
    // For non-ordinal scale, we know cell size at compile time, we can guess max length
    maxLength = unitModel.width / model.axis(X).characterWidth;
  } else if (channel === Y && !model.hasDiscreteScale(Y)) {
    const unitModel: UnitModel = model as any; // only unit model has channel y
    // For non-ordinal scale, we know cell size at compile time, we can guess max length
    maxLength = unitModel.height / model.axis(Y).characterWidth;
  }

  return maxLength ? truncate(fieldTitle, maxLength) : fieldTitle;
}

export function values(model: Model, channel: Channel) {
  const vals = model.axis(channel).values;
  if (vals && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return timestamp(dt, true);
    });
  }
  return vals;
}
