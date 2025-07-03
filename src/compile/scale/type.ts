import {isBinning} from '../../bin.js';
import {
  getSizeChannel,
  isColorChannel,
  isScaleChannel,
  isTime,
  isXorY,
  isXorYOffset,
  rangeType,
  ScaleChannel,
} from '../../channel.js';
import {DatumDef, isFieldDef, isPositionFieldOrDatumDef, ScaleDatumDef, TypedFieldDef} from '../../channeldef.js';
import * as log from '../../log/index.js';
import {isRelativeBandSize, MarkDef} from '../../mark.js';
import {channelSupportScaleType, Scale, ScaleType, scaleTypeSupportDataType} from '../../scale.js';
import {normalizeTimeUnit} from '../../timeunit.js';
import * as util from '../../util.js';
import {POLAR_POSITION_SCALE_CHANNEL_INDEX} from './../../channel.js';

export type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
export function scaleType(
  specifiedScale: Scale,
  channel: ScaleChannel,
  fieldDef: TypedFieldDef<string> | DatumDef,
  mark: MarkDef,
  hasNestedOffsetScale = false,
): ScaleType {
  const defaultScaleType = defaultType(channel, fieldDef, mark, hasNestedOffsetScale);
  const {type} = specifiedScale;

  if (!isScaleChannel(channel)) {
    // There is no scale for these channels
    return null;
  }
  if (type !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (!channelSupportScaleType(channel, type)) {
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, type, defaultScaleType));
      return defaultScaleType;
    }

    // Check if explicitly specified scale type is supported by the data type
    if (isFieldDef(fieldDef) && !scaleTypeSupportDataType(type, fieldDef.type)) {
      log.warn(log.message.scaleTypeNotWorkWithFieldDef(type, defaultScaleType));
      return defaultScaleType;
    }

    return type;
  }

  return defaultScaleType;
}

/**
 * Determine appropriate default scale type.
 */
// NOTE: Voyager uses this method.
function defaultType(
  channel: ScaleChannel,
  fieldDef: TypedFieldDef<string> | ScaleDatumDef,
  mark: MarkDef,
  hasNestedOffsetScale: boolean,
): ScaleType {
  switch (fieldDef.type) {
    case 'nominal':
    case 'ordinal': {
      if (isColorChannel(channel) || rangeType(channel) === 'discrete') {
        if (channel === 'shape' && fieldDef.type === 'ordinal') {
          log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
        }
        return 'ordinal';
      }

      if (isTime(channel)) {
        return 'band';
      }

      if (isXorY(channel) || isXorYOffset(channel)) {
        if (util.contains(['rect', 'bar', 'image', 'rule', 'tick'], mark.type)) {
          // The rect/bar/tick mark should fit into a band.
          // For rule, using band scale to make rule align with axis ticks better https://github.com/vega/vega-lite/issues/3429
          return 'band';
        }
        if (hasNestedOffsetScale) {
          // If there is a nested offset scale, then there is a "band" for the span of the nested scale.
          return 'band';
        }
      } else if (mark.type === 'arc' && channel in POLAR_POSITION_SCALE_CHANNEL_INDEX) {
        return 'band';
      }

      const dimensionSize = mark[getSizeChannel(channel)];
      if (isRelativeBandSize(dimensionSize)) {
        return 'band';
      }

      if (isPositionFieldOrDatumDef(fieldDef) && fieldDef.axis?.tickBand) {
        return 'band';
      }
      // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
      return 'point';
    }

    case 'temporal':
      if (isColorChannel(channel)) {
        return 'time';
      } else if (rangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return 'ordinal';
      } else if (isFieldDef(fieldDef) && fieldDef.timeUnit && normalizeTimeUnit(fieldDef.timeUnit).utc) {
        return 'utc';
      } else if (isTime(channel)) {
        // return 'linear';
        return 'band'; // TODO(jzong): when interpolation is implemented, this should be 'linear'
      }

      return 'time';

    case 'quantitative':
      if (isColorChannel(channel)) {
        if (isFieldDef(fieldDef) && isBinning(fieldDef.bin)) {
          return 'bin-ordinal';
        }

        return 'linear';
      } else if (rangeType(channel) === 'discrete') {
        log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
        // TODO: consider using quantize (equivalent to binning) once we have it
        return 'ordinal';
      } else if (isTime(channel)) {
        // return 'linear';
        return 'band'; // TODO(jzong): when interpolation is implemented, this should be 'linear'
      }

      return 'linear';

    case 'geojson':
      return undefined;
  }

  /* istanbul ignore next: should never reach this */
  throw new Error(log.message.invalidFieldType(fieldDef.type));
}
