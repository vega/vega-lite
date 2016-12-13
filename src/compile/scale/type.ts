import * as log from '../../log';

import {hasScale, supportScaleType, Channel} from '../../channel';
import {FieldDef} from '../../fielddef';
import {Mark} from '../../mark';
import {ScaleType} from '../../scale';

import * as util from '../../util';

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export function type(specifiedType: ScaleType, fieldDef: FieldDef, channel: Channel, mark: Mark, canHaveRangeStep: boolean): ScaleType {
  if (!hasScale(channel)) {
    // There is no scale for these channels
    return null;
  }

  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (supportScaleType(channel, specifiedType)) {
      return specifiedType;
    } else {
      const newScaleType = defaultType(fieldDef, channel, mark, canHaveRangeStep);
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, newScaleType));
      return newScaleType;
    }
  }

  return defaultType(fieldDef, channel, mark, canHaveRangeStep);
}

/**
 * Determine appropriate default scale type.
 */
function defaultType(fieldDef: FieldDef, channel: Channel, mark: Mark, canHaveRangeStep: boolean): ScaleType {
    if (util.contains(['row', 'column'], channel)) {
      return ScaleType.BAND;
    }
    if (channel === 'shape') {
      return ScaleType.ORDINAL_LOOKUP;
    }

    switch (fieldDef.type) {
      case 'nominal':
        if (channel === 'color') {
          return ScaleType.ORDINAL_LOOKUP;
        }
        return discreteToContinuousType(channel, mark, canHaveRangeStep);
      case 'ordinal':
        if (channel === 'color') {
          return ScaleType.INDEX;
        }
        return discreteToContinuousType(channel, mark, canHaveRangeStep);
      case 'temporal':
        if (channel === 'color') {
          return ScaleType.SEQUENTIAL;
        }

        switch (fieldDef.timeUnit) {
          // These time unit use discrete scale by default
          case 'hours':
          case 'day':
          case 'month':
          case 'quarter':
            return discreteToContinuousType(channel, mark, canHaveRangeStep);
        }
        return ScaleType.TIME;

      case 'quantitative':
        if (channel === 'color') {
          return ScaleType.SEQUENTIAL;
        }
        return ScaleType.LINEAR;
    }

    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
  }

  /**
   * Determines default scale type for nominal/ordinal field.
   * @returns BAND or POINT scale based on channel, mark, and rangeStep
   */
  function discreteToContinuousType(channel: Channel, mark: Mark, canHaveRangeStep: boolean): ScaleType {
    if (util.contains(['x', 'y'], channel)) {
      // Use band ordinal scale for x/y scale in one of the following cases:
      if (
        // 1) the mark is bar and the scale cannot have range step (fit mode).
        (mark === 'bar' && !canHaveRangeStep) ||
        // 2) the mark is rect as the rect mark should fit into a band.
        mark === 'rect'
      ) {
        return ScaleType.BAND;
      }
    }
    // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
    return ScaleType.POINT;
  }
