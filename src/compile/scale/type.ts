import * as log from '../../log';

import {hasScale, supportScaleType, getRangeType, Channel} from '../../channel';
import {Mark} from '../../mark';
import {ScaleType, ScaleConfig} from '../../scale';
import {TimeUnit} from '../../timeunit';
import {Type} from '../../type';

import * as util from '../../util';

export type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
export default function type(
  specifiedType: ScaleType, type: Type, channel: Channel, timeUnit: TimeUnit, mark: Mark,
  hasTopLevelSize: boolean, specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType {

  if (!hasScale(channel)) {
    // There is no scale for these channels
    return null;
  }
  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (supportScaleType(channel, specifiedType)) {
      return specifiedType;
    } else {
      const newScaleType = defaultType(
        type, channel, timeUnit, mark,
        hasTopLevelSize, specifiedRangeStep,  scaleConfig
      );
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, newScaleType));
      return newScaleType;
    }
  }

  return defaultType(
    type, channel, timeUnit, mark,
    hasTopLevelSize, specifiedRangeStep, scaleConfig
  );
}

/**
 * Determine appropriate default scale type.
 */
function defaultType(type: Type, channel: Channel, timeUnit: TimeUnit, mark: Mark,
  hasTopLevelSize: boolean, specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType {

  if (util.contains(['row', 'column'], channel)) {
    return ScaleType.BAND;
  }

  switch (type) {
    case 'nominal':
      if (channel === 'color' || getRangeType(channel) === 'discrete') {
        return ScaleType.ORDINAL;
      }
      return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);

    case 'ordinal':
      if (channel === 'color') {
        return ScaleType.ORDINAL;
      } else if (getRangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
        return ScaleType.ORDINAL;
      }
      return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);

    case 'temporal':
      if (channel === 'color') {
        // Always use `sequential` as the default color scale for continuous data
        // since it supports both array range and scheme range.
        return 'sequential';
      } else if (getRangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return ScaleType.ORDINAL;
      }
      switch (timeUnit) {
        // These time unit use discrete scale by default
        case 'hours':
        case 'day':
        case 'month':
        case 'quarter':
          return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
      }
      return ScaleType.TIME;

    case 'quantitative':
      if (channel === 'color') {
        // Always use `sequential` as the default color scale for continuous data
        // since it supports both array range and scheme range.
        return 'sequential';
      } else if (getRangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return ScaleType.ORDINAL;
      }
      return ScaleType.LINEAR;
  }

  /* istanbul ignore next: should never reach this */
  throw new Error(log.message.invalidFieldType(type));
}

/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(
    channel: Channel, mark: Mark, hasTopLevelSize: boolean,
    specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType {

  if (util.contains(['x', 'y'], channel)) {
    if (mark === 'rect') {
      // The rect mark should fit into a band.
      return ScaleType.BAND;
    }
    if (mark === 'bar') {
      // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
      // However, for non-fit mode, point scale provides better center position.
      if (haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig)) {
        return ScaleType.POINT;
      }
      return ScaleType.BAND;
    }
  }
  // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
  return ScaleType.POINT;
}

function haveRangeStep(hasTopLevelSize: boolean, specifiedRangeStep: number, scaleConfig: ScaleConfig) {
  if (hasTopLevelSize) {
    // if topLevelSize is provided, rangeStep will be dropped.
    return false;
  }
  if (specifiedRangeStep !== undefined) {
    return specifiedRangeStep !== null;
  }
  return !!scaleConfig.rangeStep;
}
