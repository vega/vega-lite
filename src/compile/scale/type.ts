import {Channel, isScaleChannel, rangeType} from '../../channel';
import {FieldDef} from '../../fielddef';
import * as log from '../../log';
import {Mark} from '../../mark';
import {channelSupportScaleType, ScaleConfig, ScaleType} from '../../scale';
import {hasDiscreteDomain} from '../../scale';
import {Type} from '../../type';
import * as util from '../../util';
import {contains} from '../../util';


export type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
export function scaleType(
  specifiedType: ScaleType, channel: Channel, fieldDef: FieldDef<string>, mark: Mark,
  specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType {

  const defaultScaleType = defaultType(channel, fieldDef, mark, specifiedRangeStep, scaleConfig);

  if (!isScaleChannel(channel)) {
    // There is no scale for these channels
    return null;
  }
  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (!channelSupportScaleType(channel, specifiedType)) {
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));
      return defaultScaleType;
    }

    // Check if explicitly specified scale type is supported by the data type
    if (!fieldDefMatchScaleType(specifiedType, fieldDef)) {
      log.warn(log.message.scaleTypeNotWorkWithFieldDef(specifiedType, defaultScaleType));
      return defaultScaleType;
    }

    return specifiedType;
  }

  return defaultScaleType;
}

/**
 * Determine appropriate default scale type.
 */
function defaultType(channel: Channel, fieldDef: FieldDef<string>, mark: Mark,
  specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType {
  switch (fieldDef.type) {
    case 'nominal':
    case 'ordinal':
      if (channel === 'color' || rangeType(channel) === 'discrete') {
        if (channel === 'shape' && fieldDef.type === 'ordinal') {
          log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
        }
        return 'ordinal';
      }
      return discreteToContinuousType(channel, mark, specifiedRangeStep, scaleConfig);

    case 'temporal':
      if (channel === 'color') {
        return 'sequential';
      } else if (rangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return 'ordinal';
      }
      return 'time';

    case 'quantitative':
      if (channel === 'color') {
        if (fieldDef.bin) {
          return 'bin-ordinal';
        }
        // Use `sequential` as the default color scale for continuous data
        // since it supports both array range and scheme range.
        return 'sequential';
      } else if (rangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return 'ordinal';
      }

      // x and y use a linear scale because selections don't work with bin scales
      if (fieldDef.bin && channel !== 'x' && channel !== 'y') {
        return 'bin-linear';
      }
      return 'linear';
  }

  /* istanbul ignore next: should never reach this */
  throw new Error(log.message.invalidFieldType(fieldDef.type));
}

/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(
    channel: Channel, mark: Mark,
    specifiedRangeStep: number,
    scaleConfig: ScaleConfig
  ): ScaleType {

  if (util.contains(['x', 'y'], channel)) {
    if (mark === 'rect') {
      // The rect mark should fit into a band.
      return 'band';
    }
    if (mark === 'bar') {
      return 'band';
    }
  }
  // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
  return 'point';
}

export function fieldDefMatchScaleType(specifiedType: ScaleType, fieldDef: FieldDef<string>):boolean {
  const type: Type = fieldDef.type;
  if (contains([Type.ORDINAL, Type.NOMINAL], type)) {
    return specifiedType === undefined || hasDiscreteDomain(specifiedType);
  } else if (type === Type.TEMPORAL) {
    return contains([ScaleType.TIME, ScaleType.UTC, ScaleType.SEQUENTIAL, undefined], specifiedType);
  } else if (type === Type.QUANTITATIVE) {
    if (fieldDef.bin) {
      return contains([ScaleType.BIN_LINEAR, ScaleType.BIN_ORDINAL, ScaleType.LINEAR], specifiedType);
    }
    return contains([ScaleType.LOG, ScaleType.POW, ScaleType.SQRT, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.LINEAR, ScaleType.SEQUENTIAL, undefined], specifiedType);
  }

  return true;
}
