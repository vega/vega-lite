/**
 * Utility files for producing Vega ValueRef for marks
 */

import {Channel, X, X2, Y, Y2} from '../../channel';
import {Config} from '../../config';
import {ChannelDef, field, FieldDef, FieldRefOption, isFieldDef, TextFieldDef, ValueDef} from '../../fielddef';
import {hasDiscreteDomain, isBinScale, Scale, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {contains} from '../../util';
import {VgValueRef} from '../../vega.schema';
import {numberFormat, timeFormatExpression} from '../common';

// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.

/**
 * @return Vega ValueRef for stackable x or y
 */
export function stackable(channel: 'x' | 'y', channelDef: ChannelDef, scaleName: string, scale: Scale,
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
export function stackable2(channel: 'x2' | 'y2', aFieldDef: FieldDef, a2fieldDef: FieldDef, scaleName: string, scale: Scale,
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
  const ref: VgValueRef = {
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

/**
 * Signal that returns the middle of a bin. Should only be used with x and y.
 */
function binMidSignal(fieldDef: FieldDef, scaleName: string) {
  return {
    signal: `(` +
      `scale("${scaleName}", ${field(fieldDef, {binSuffix: 'start', datum: true})})` +
      ` + ` +
      `scale("${scaleName}", ${field(fieldDef, {binSuffix: 'end', datum: true})})`+
    `)/2`
  };
}

/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export function midPoint(channel: Channel, channelDef: ChannelDef, scaleName: string, scale: Scale,
  defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax'): VgValueRef {
  // TODO: datum support

  if (channelDef) {
    /* istanbul ignore else */
    if (isFieldDef(channelDef)) {
      if (isBinScale(scale.type)) {
        // Use middle only for x an y to place marks in the center between start and end of the bin range.
        // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
        if (contains(['x', 'y'], channel)) {
          return binMidSignal(channelDef, scaleName);
        }
        return fieldRef(channelDef, scaleName, {binSuffix: 'start'});
      }

      if (hasDiscreteDomain(scale.type)) {
        if (scale.type === 'band') {
          // For band, to get mid point, need to offset by half of the band
          return fieldRef(channelDef, scaleName, {binSuffix: 'range'}, band(scaleName, 0.5));
        }
        return fieldRef(channelDef, scaleName, {binSuffix: 'range'});
      } else {
        return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
      }
    } else if (channelDef.value !== undefined) {
      return {value: channelDef.value};
    } else {
      throw new Error('FieldDef without field or value.'); // FIXME add this to log.message
    }
  }

  if (defaultRef === 'zeroOrMin') {
    /* istanbul ignore else */
    if (channel === X || channel === X2) {
      return zeroOrMinX(scaleName, scale);
    } else if (channel === Y || channel === Y2) {
      return zeroOrMinY(scaleName, scale);
    } else {
      throw new Error(`Unsupported channel ${channel} for base function`); // FIXME add this to log.message
    }
  } else if (defaultRef === 'zeroOrMax') {
    /* istanbul ignore else */
    if (channel === X || channel === X2) {
      return zeroOrMaxX(scaleName, scale);
    } else if (channel === Y || channel === Y2) {
      return zeroOrMaxY(scaleName, scale);
    } else {
      throw new Error(`Unsupported channel ${channel} for base function`); // FIXME add this to log.message
    }
  }
  return defaultRef;
}

export function text(textDef: TextFieldDef | ValueDef<any>, config: Config): VgValueRef {
  // text
  if (textDef) {
    if (isFieldDef(textDef)) {
      if (textDef.type === 'quantitative') {
        // FIXME: what happens if we have bin?
        const format = numberFormat(textDef, textDef.format, config, 'text');
        return {
          signal: `format(${field(textDef, {datum: true})}, '${format}')`
        };
      } else if (textDef.type === 'temporal') {
        return {
          signal: timeFormatExpression(field(textDef, {datum: true}), textDef.timeUnit, textDef.format, config.text.shortTimeLabels, config.timeFormat)
        };
      } else {
        return {field: textDef.field};
      }
    } else if (textDef.value) {
      return {value: textDef.value};
    }
  }
  return {value: config.text.text};
}

export function midX(width: number, config: Config): VgValueRef {
  if (width) {
    return {value: width / 2};
  }

  if (typeof config.scale.rangeStep === 'string') {
    // TODO: For fit-mode, use middle of the width
    throw new Error('midX can not handle string rangeSteps');
  }
  return {value: config.scale.rangeStep / 2};
}

export function midY(height: number, config: Config): VgValueRef {
  if (height) {
    return {value: height / 2};
  }

  if (typeof config.scale.rangeStep === 'string') {
    // TODO: For fit-mode, use middle of the width
    throw new Error('midX can not handle string rangeSteps');
  }
  return {value: config.scale.rangeStep / 2};
}

function zeroOrMinX(scaleName: string, scale: Scale): VgValueRef {
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
function zeroOrMaxX(scaleName: string, scale: Scale): VgValueRef {
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

function zeroOrMinY(scaleName: string, scale: Scale): VgValueRef {
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
function zeroOrMaxY(scaleName: string, scale: Scale): VgValueRef {
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
