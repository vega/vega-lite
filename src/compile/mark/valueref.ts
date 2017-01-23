/**
 * Utility files for producing Vega ValueRef for marks
 */

import {Channel, X, X2, Y, Y2} from '../../channel';
import {Config} from '../../config';
import {ChannelDef, FieldDef, FieldRefOption, field, isFieldDef} from '../../fielddef';
import {Scale, ScaleType, hasDiscreteDomain} from '../../scale';
import {StackProperties} from '../../stack';
import {contains} from '../../util';
import {VgValueRef} from '../../vega.schema';

// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.

/**
 * @return Vega ValueRef for stackable x or y
 */
export function stackable(channel: Channel, channelDef: ChannelDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (channelDef && stack && channel === stack.fieldChannel) {
    // x or y use stack_end so that stacked line's point mark use stack_end too.
    return fieldRef(channelDef, scaleName, {suffix: 'end'});
  }
  return midPoint(channel, channelDef, scaleName, scale, defaultRef);
}

/**
 * @return Vega ValueRef for stackable x2 or y2
 */
export function stackable2(channel: Channel, aFieldDef: FieldDef, a2fieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (aFieldDef && stack &&
      // If fieldChannel is X and channel is X2 (or Y and Y2)
      channel.charAt(0) === stack.fieldChannel.charAt(0)
      ) {
    return fieldRef(aFieldDef, scaleName, {suffix: 'start'});
  }
  return midPoint(channel, a2fieldDef, scaleName, scale, defaultRef);
}

/**
 * Value Ref for binned fields
 */
export function bin(fieldDef: FieldDef, scaleName: string, side: 'start' | 'end',  offset?: number) {
  return fieldRef(fieldDef, scaleName, {binSuffix: side}, offset);
}

export function fieldRef(fieldDef: FieldDef, scaleName: string, opt: FieldRefOption, offset?: number | VgValueRef): VgValueRef {
  let ref: VgValueRef = {
    scale: scaleName,
    field: field(fieldDef, opt),
  };
  if (offset) {
    ref.offset = offset;
  }
  return ref;
}

export function band(scaleName: string, band: number|boolean = true): VgValueRef {
  return {
    scale: scaleName,
    band: band
  };
}

export function binMidSignal(fieldDef: FieldDef, scaleName: string) {
  return {
    scale: scaleName,
    signal: '(' + field(fieldDef, {binSuffix: 'start', datum: true}) + '+' +
      field(fieldDef, {binSuffix: 'end', datum: true}) + ')/2'
  };
}

/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export function midPoint(channel: Channel, channelDef: ChannelDef, scaleName: string, scale: Scale,
  defaultRef: VgValueRef | 'base' | 'baseOrMax'): VgValueRef {
  // TODO: datum support

  if (channelDef) {
    /* istanbul ignore else */
    if (isFieldDef(channelDef)) {
      if (hasDiscreteDomain(scale.type)) {
        if (scale.type === 'band') {
          // For band, to get mid point, need to offset by half of the band
          return fieldRef(channelDef, scaleName, {binSuffix: 'range'}, band(scaleName, 0.5));
        }
        return fieldRef(channelDef, scaleName, {binSuffix: 'range'});
      } else {
        if (channelDef.bin) {
          return binMidSignal(channelDef, scaleName);
        } else {
          return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
        }
      }
    } else if (channelDef.value) {
      return {
        value: channelDef.value
      };
    } else {
      throw new Error('FieldDef without field or value.'); // FIXME add this to log.message
    }
  }

  if (defaultRef === 'base') {
    /* istanbul ignore else */
    if (channel === X || channel === X2) {
      return baseX(scaleName, scale);
    } else if (channel === Y || channel === Y2) {
      return baseY(scaleName, scale);
    } else {
      throw new Error(`Unsupported channel ${channel} for base function`); // FIXME add this to log.message
    }
  } else if (defaultRef === 'baseOrMax') {
    /* istanbul ignore else */
    if (channel === X || channel === X2) {
      return baseOrMaxX(scaleName, scale);
    } else if (channel === Y || channel === Y2) {
      return baseOrMaxY(scaleName, scale);
    } else {
      throw new Error(`Unsupported channel ${channel} for base function`); // FIXME add this to log.message
    }
  }
  return defaultRef;
}

export function midX(config: Config): VgValueRef {

  if (typeof config.scale.rangeStep === 'string') {
    // TODO: For fit-mode, use middle of the width
    throw new Error('midX can not handle string rangeSteps');
  }
  return {value: config.scale.rangeStep / 2};
}

export function midY(config: Config): VgValueRef {
  if (typeof config.scale.rangeStep === 'string') {
    // TODO: For fit-mode, use middle of the width
    throw new Error('midX can not handle string rangeSteps');
  }
  return {value: config.scale.rangeStep / 2};
}

function baseX(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the x-axis
  return {value: 0};
}

/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function baseOrMaxX(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  return {field: {group: 'width'}};
}

function baseY(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the y-axis
  return {field: {group: 'height'}};
}

/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function baseOrMaxY(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the y-axis
  return {value: 0};
}
