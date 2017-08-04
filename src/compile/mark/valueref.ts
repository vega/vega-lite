/**
 * Utility files for producing Vega ValueRef for marks
 */

import {isNumber} from 'vega-util';
import {Channel, ScaleChannel, X, X2, Y, Y2} from '../../channel';
import {Config} from '../../config';
import {ChannelDef, Conditional, field, FieldDef, FieldRefOption, isFieldDef, isValueDef, TextFieldDef, ValueDef} from '../../fielddef';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {contains} from '../../util';
import {isVgSignalRef, VgScale, VgSignalRef, VgValueRef} from '../../vega.schema';
import {formatSignalRef, numberFormat} from '../common';
import {ScaleComponent} from '../scale/component';


// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.

/**
 * @return Vega ValueRef for stackable x or y
 */
export function stackable(channel: 'x' | 'y', channelDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent,
    stack: StackProperties, defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax'): VgValueRef {
  if (isFieldDef(channelDef) && stack && channel === stack.fieldChannel) {
    // x or y use stack_end so that stacked line's point mark use stack_end too.
    return fieldRef(channelDef, scaleName, {suffix: 'end'});
  }
  return midPoint(channel, channelDef, scaleName, scale, stack, defaultRef);
}

/**
 * @return Vega ValueRef for stackable x2 or y2
 */
export function stackable2(channel: 'x2' | 'y2', aFieldDef: ChannelDef<string>, a2fieldDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent,
    stack: StackProperties, defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax'): VgValueRef {
  if (isFieldDef(aFieldDef) && stack &&
      // If fieldChannel is X and channel is X2 (or Y and Y2)
      channel.charAt(0) === stack.fieldChannel.charAt(0)
      ) {
    return fieldRef(aFieldDef, scaleName, {suffix: 'start'});
  }
  return midPoint(channel, a2fieldDef, scaleName, scale, stack, defaultRef);
}

/**
 * Value Ref for binned fields
 */
export function bin(fieldDef: FieldDef<string>, scaleName: string, side: 'start' | 'end',  offset?: number) {
  return fieldRef(fieldDef, scaleName, {binSuffix: side}, offset ? {offset} : {});
}

export function fieldRef(
    fieldDef: FieldDef<string>, scaleName: string, opt: FieldRefOption,
    mixins?: {offset?: number | VgValueRef, band?: number|boolean}
  ): VgValueRef {
  const ref: VgValueRef = {
    scale: scaleName,
    field: field(fieldDef, opt),
  };
  if (mixins) {
    return {
      ...ref,
      ...mixins
    };
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
function binMidSignal(fieldDef: FieldDef<string>, scaleName: string) {
  return {
    signal: `(` +
      `scale("${scaleName}", ${field(fieldDef, {binSuffix: 'start', expr: 'datum'})})` +
      ` + ` +
      `scale("${scaleName}", ${field(fieldDef, {binSuffix: 'end', expr: 'datum'})})`+
    `)/2`
  };
}

/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export function midPoint(channel: Channel, channelDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent, stack: StackProperties,
  defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax',): VgValueRef {
  // TODO: datum support

  if (channelDef) {
    /* istanbul ignore else */

    if (isFieldDef(channelDef)) {
      if (channelDef.bin) {
        // Use middle only for x an y to place marks in the center between start and end of the bin range.
        // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
        if (contains(['x', 'y'], channel)) {
          if (stack && stack.impute) {
            // For stack, we computed bin_mid so we can impute.
            return fieldRef(channelDef, scaleName, {binSuffix: 'mid'});
          }
          // For non-stack, we can just calculate bin mid on the fly using signal.
          return binMidSignal(channelDef, scaleName);
        }
        return fieldRef(channelDef, scaleName, {binSuffix: 'start'});
      }

      const scaleType = scale.get('type');
      if (hasDiscreteDomain(scaleType)) {
        if (scaleType === 'band') {
          // For band, to get mid point, need to offset by half of the band
          return fieldRef(channelDef, scaleName, {binSuffix: 'range'}, {band: 0.5});
        }
        return fieldRef(channelDef, scaleName, {binSuffix: 'range'});
      } else {
        return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
      }
    } else if (isValueDef(channelDef)) {
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

export function text(textDef: Conditional<TextFieldDef<string>, ValueDef<any>>, config: Config): VgValueRef {
  // text
  if (textDef) {
    if (isFieldDef(textDef)) {
      return formatSignalRef(textDef, textDef.format, 'datum', config);
    } else if (isValueDef(textDef)) {
      return {value: textDef.value};
    }
  }
  return undefined;
}

export function mid(sizeRef: VgSignalRef): VgValueRef {
  return {...sizeRef, mult: 0.5};
}

function zeroOrMinX(scaleName: string, scale: ScaleComponent): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.get('type')) &&
      scale.get('zero') !== false) {

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
function zeroOrMaxX(scaleName: string, scale: ScaleComponent): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.get('type')) &&
      scale.get('zero') !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  return {field: {group: 'width'}};
}

function zeroOrMinY(scaleName: string, scale: ScaleComponent): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.get('type')) &&
      scale.get('zero') !== false) {

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
function zeroOrMaxY(scaleName: string, scale: ScaleComponent): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.get('type')) &&
      scale.get('zero') !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the y-axis
  return {value: 0};
}
