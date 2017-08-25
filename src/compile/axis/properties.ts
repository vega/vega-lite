import {Axis} from '../../axis';
import {BinParams} from '../../bin';
import {Channel, X, Y} from '../../channel';
import {Config} from '../../config';
import {DateTime, dateTimeExpr, isDateTime} from '../../datetime';
import {FieldDef, title as fieldDefTitle} from '../../fielddef';
import * as log from '../../log';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {contains, truncate} from '../../util';
import {VgSignalRef} from '../../vega.schema';
import {UnitModel} from '../unit';


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
export function grid(scaleType: ScaleType, fieldDef: FieldDef<string>) {
  return !hasDiscreteDomain(scaleType) && !fieldDef.bin;
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


export function labelOverlap(fieldDef: FieldDef<string>, specifiedAxis: Axis, channel: Channel, scaleType: ScaleType) {
  // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
  if ((channel === 'x' || channel === 'y') && fieldDef.type !== 'nominal') {
    if (scaleType === 'log') {
      return 'greedy';
    }
    return true;
  }

  return undefined;
}

export function minMaxExtent(specifiedExtent: number, isGridAxis: boolean) {
  if (isGridAxis) {
    // Always return 0 to make sure that `config.axis*.minExtent` and `config.axis*.maxExtent`
    // would not affect gridAxis
    return 0;
  } else {
    return specifiedExtent;
  }
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

export function tickCount(channel: Channel, fieldDef: FieldDef<string>, scaleType: ScaleType, size: VgSignalRef) {
  if (!hasDiscreteDomain(scaleType) && scaleType !== 'log' && !contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {

    if (fieldDef.bin) {
      // for binned data, we don't want more ticks than maxbins
      return {signal: `min(ceil(${size.signal}/40), ${(fieldDef.bin as BinParams).maxbins})`};
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

export function values(specifiedAxis: Axis, model: UnitModel, fieldDef: FieldDef<string>) {
  const vals = specifiedAxis.values;
  if (specifiedAxis.values && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return {signal: dateTimeExpr(dt, true)};
    });
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
