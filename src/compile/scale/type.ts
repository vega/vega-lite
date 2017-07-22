import {Channel, hasScale, rangeType, supportScaleType} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import * as log from '../../log';
import {Mark} from '../../mark';
import {ScaleConfig, ScaleType} from '../../scale';
import {hasDiscreteDomain} from '../../scale';
import {isDiscreteByDefault} from '../../timeunit';
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

  if (!hasScale(channel)) {
    // There is no scale for these channels
    return null;
  }
  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (!supportScaleType(channel, specifiedType)) {
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
      if (channel === 'color' || rangeType(channel) === 'discrete') {
        return 'ordinal';
      }
      return discreteToContinuousType(channel, mark, specifiedRangeStep, scaleConfig);

    case 'ordinal':
      if (channel === 'color') {
        return 'ordinal';
      } else if (rangeType(channel) === 'discrete') {
        if (channel !== 'text' && channel !=='tooltip') {
          log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
        }
        return 'ordinal';
      }
      return discreteToContinuousType(channel, mark, specifiedRangeStep, scaleConfig);

    case 'temporal':
      if (channel === 'color') {
        if (isDiscreteByDefault(fieldDef.timeUnit)) {
          // For discrete timeUnit, use ordinal scale so that legend produces correct value.
          // (See https://github.com/vega/vega-lite/issues/2045.)
          return 'ordinal';
        }
        return 'sequential';
      } else if (rangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return 'ordinal';
      }
      if (isDiscreteByDefault(fieldDef.timeUnit)) {
        return discreteToContinuousType(channel, mark, specifiedRangeStep, scaleConfig);
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

    case 'latitude':
    case 'longitude':
    case 'geojson':
      return undefined;
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
    if (!fieldDef.timeUnit) {
      return contains([ScaleType.TIME, ScaleType.UTC, undefined], specifiedType);
    } else {
      return contains([ScaleType.TIME, ScaleType.UTC, undefined], specifiedType) || hasDiscreteDomain(specifiedType);
    }
  } else if (type === Type.QUANTITATIVE) {
    if (fieldDef.bin) {
      return specifiedType === ScaleType.BIN_LINEAR || specifiedType === ScaleType.BIN_ORDINAL;
    }
    return contains([ScaleType.LOG, ScaleType.POW, ScaleType.SQRT, ScaleType.QUANTILE, ScaleType.QUANTIZE, ScaleType.LINEAR, undefined], specifiedType);
  }

  return true;
}
