import * as log from '../../log';

import {Config} from '../../config';
import {hasScale, supportScaleType, Channel} from '../../channel';
import {FieldDef, ChannelDefWithScale} from '../../fielddef';
import {Mark} from '../../mark';
import {Scale, ScaleType} from '../../scale';

import * as util from '../../util';

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export function type(fieldDef: ChannelDefWithScale, channel: Channel,
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
    if (channel === 'shape') {
      return ScaleType.ORDINAL_LOOKUP;
    }

    switch (fieldDef.type) {
      case 'nominal':
        if (channel === 'color') {
          return ScaleType.ORDINAL_LOOKUP;
        }
        return discreteToContinuousType(channel, mark, specifiedScale, topLevelSize, config);
      case 'ordinal':
        if (channel === 'color') {
          return ScaleType.INDEX;
        }
        return discreteToContinuousType(channel, mark, specifiedScale, topLevelSize, config);
      case 'temporal':
        if (channel === 'color') {
          return continuousColorScaleType(specifiedScale, ScaleType.TIME);
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
    if (specifiedScale.scheme) {
      return ScaleType.SEQUENTIAL;
    } else if (specifiedScale.range) {
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
