import * as log from '../../log';

import {Config} from '../../config';
import {hasScale, supportScaleType, Channel} from '../../channel';
import {FieldDef, ScaleFieldDef} from '../../fielddef';
import {Mark} from '../../mark';
import {Scale, ScaleType, isRangeScheme} from '../../scale';

import * as util from '../../util';

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export default function type(fieldDef: ScaleFieldDef, channel: Channel,
  mark: Mark, topLevelSize: number | undefined, config: Config): ScaleType {

  if (!hasScale(channel)) {
    // There is no scale for these channels
    return null;
  }
  let specifiedScale = fieldDef.scale || {};
  const specifiedType = specifiedScale.type;
  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (supportScaleType(channel, specifiedType)) {
      return specifiedType;
    } else {
      const newScaleType = defaultType(specifiedScale, fieldDef, channel, mark, topLevelSize, config);
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, newScaleType));
      return newScaleType;
    }
  }

  return defaultType(specifiedScale, fieldDef, channel, mark, topLevelSize, config);
}

/**
 * Determine appropriate default scale type.
 */
function defaultType(specifiedScale: Scale, fieldDef: FieldDef, channel: Channel,
    mark: Mark, topLevelSize: number | undefined, config: Config): ScaleType {

  if (util.contains(['row', 'column'], channel)) {
    return ScaleType.BAND;
  }

  switch (fieldDef.type) {
    case 'nominal':
      if (channel === 'color' || channelRangeType(channel) === 'discrete') {
        return ScaleType.ORDINAL_LOOKUP;
      }
      return discreteToContinuousType(channel, mark, specifiedScale, topLevelSize, config);

    case 'ordinal':
      if (channel === 'color') {
        return ScaleType.INDEX;
      } else if (channelRangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
        return ScaleType.ORDINAL_LOOKUP;
      }
      return discreteToContinuousType(channel, mark, specifiedScale, topLevelSize, config);

    case 'temporal':
      if (channel === 'color') {
        return continuousColorScaleType(specifiedScale, ScaleType.TIME);
      } else if (channelRangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return ScaleType.ORDINAL_LOOKUP;
      }
      switch (fieldDef.timeUnit) {
        // These time unit use discrete scale by default
        case 'hours':
        case 'day':
        case 'month':
        case 'quarter':
          return discreteToContinuousType(channel, mark, specifiedScale, topLevelSize, config);
      }
      return ScaleType.TIME;

    case 'quantitative':
      if (channel === 'color') {
        return continuousColorScaleType(specifiedScale, ScaleType.LINEAR);
      } else if (channelRangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return ScaleType.ORDINAL_LOOKUP;
      }
      return ScaleType.LINEAR;
  }

  /* istanbul ignore next: should never reach this */
  throw new Error(log.message.invalidFieldType(fieldDef.type));
}

/**
 * Determine default continuous color scale type based on specified range type:
 * - scheme = sequential
 * - range = linear
 */
function continuousColorScaleType(specifiedScale: Scale, rangeScaleType: 'linear' | 'time'): ScaleType {
  let range = specifiedScale.range;
  if (util.isString(range)) {
    range = {scheme: range};
  }

  if (isRangeScheme(range)) {
    return ScaleType.SEQUENTIAL;
  } else if (range) {
    return rangeScaleType;
  }
  // TODO: make default type also depend on config
  return ScaleType.SEQUENTIAL;
}

/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(channel: Channel, mark: Mark, specifiedScale: Scale, topLevelSize: number | undefined, config: Config): ScaleType {
  if (util.contains(['x', 'y'], channel)) {
    if (mark === 'rect') {
      // The rect mark should fit into a band.
      return ScaleType.BAND;
    }
    if (mark === 'bar') {
      // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
      // However, for non-fit mode, point scale provides better center position.
      if (haveRangeStep(specifiedScale, topLevelSize, config)) {
        return ScaleType.POINT;
      }
      return ScaleType.BAND;
    }
  }
  // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
  return ScaleType.POINT;
}

function haveRangeStep(specifiedScale: Scale, topLevelSize: number | undefined, config: Config) {
  if (topLevelSize !== undefined) {
    // if topLevelSize is provided, rangeStep will be dropped.
    return false;
  }
  if (specifiedScale.rangeStep !== undefined) {
    return specifiedScale.rangeStep !== null;
  }
  return !!config.scale.rangeStep;
}

export function channelRangeType(channel: Channel):
    'continuous' | 'discrete' | 'flexible' | undefined {

  switch (channel) {
    case 'x':
    case 'y':
    case 'row':
    case 'column':
    case 'size':
    case 'opacity':
      return 'continuous';

    case 'shape':
      return 'discrete';

    // Color can be either continuous or discrete, depending on scale type.
    case 'color':
      return 'flexible';

    // No scale, no range type.
    case 'x2':
    case 'y2':
    case 'detail':
    case 'label':
    case 'text':
    case 'order':
      return undefined;
  }
  /* istanbul ignore next: should never reach here. */
  throw new Error('getSupportedRole not implemented for' + channel);
}
