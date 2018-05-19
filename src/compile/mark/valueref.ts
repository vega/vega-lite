/**
 * Utility files for producing Vega ValueRef for marks
 */
import {isArray, isString} from 'vega-util';

import {Channel, X, Y} from '../../channel';
import {Config} from '../../config';
import {
  ChannelDef,
  ChannelDefWithCondition,
  FieldDef,
  FieldRefOption,
  isFieldDef,
  isValueDef,
  TextFieldDef,
  vgField,
} from '../../fielddef';
import * as log from '../../log';
import {Mark, MarkDef} from '../../mark';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {QUANTITATIVE} from '../../type';
import {contains, some} from '../../util';
import {VgSignalRef, VgValueRef} from '../../vega.schema';
import {binRequiresRange, formatSignalRef} from '../common';
import {ScaleComponent} from '../scale/component';


// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.

/**
 * @return Vega ValueRef for stackable x or y
 */
export function stackable(channel: 'x' | 'y', channelDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
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
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (isFieldDef(aFieldDef) && stack &&
      // If fieldChannel is X and channel is X2 (or Y and Y2)
      channel.charAt(0) === stack.fieldChannel.charAt(0)
      ) {
    return fieldRef(aFieldDef, scaleName, {suffix: 'start'});
  }
  return midPoint(channel, a2fieldDef, scaleName, scale, stack, defaultRef);
}



export function getOffset(channel: 'x' | 'y' | 'x2' | 'y2', markDef: MarkDef) {
  const offsetChannel = channel + 'Offset';
  // TODO: in the future read from encoding channel too

  const markDefOffsetValue = markDef[offsetChannel];
  if (markDefOffsetValue) {
    return markDefOffsetValue;
  }

  return undefined;
}

/**
 * Value Ref for binned fields
 */
export function bin(fieldDef: FieldDef<string>, scaleName: string, side: 'start' | 'end', offset?: number) {
  const binSuffix = side === 'start' ? undefined : 'end';
  return fieldRef(fieldDef, scaleName, {binSuffix}, offset ? {offset} : {});
}

export function fieldRef(
    fieldDef: FieldDef<string>, scaleName: string, opt: FieldRefOption,
    mixins?: {offset?: number | VgValueRef, band?: number|boolean}
  ): VgValueRef {

  const ref: VgValueRef = {
    ...(scaleName ? {scale: scaleName} : {}),
    field: vgField(fieldDef, opt),
  };

  if (mixins) {
    return {
      ...ref,
      ...mixins
    };
  }
  return ref;
}

export function bandRef(scaleName: string, band: number|boolean = true): VgValueRef {
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
      `scale("${scaleName}", ${vgField(fieldDef, {expr: 'datum'})})` +
      ` + ` +
      `scale("${scaleName}", ${vgField(fieldDef, {binSuffix: 'end', expr: 'datum'})})`+
    `)/2`
  };
}

/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export function midPoint(channel: Channel, channelDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  // TODO: datum support

  if (channelDef) {
    /* istanbul ignore else */

    if (isFieldDef(channelDef)) {
      if (channelDef.bin) {
        // Use middle only for x an y to place marks in the center between start and end of the bin range.
        // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
        if (contains([X, Y], channel) && channelDef.type === QUANTITATIVE) {
          if (stack && stack.impute) {
            // For stack, we computed bin_mid so we can impute.
            return fieldRef(channelDef, scaleName, {binSuffix: 'mid'});
          }
          // For non-stack, we can just calculate bin mid on the fly using signal.
          return binMidSignal(channelDef, scaleName);
        }
        return fieldRef(channelDef, scaleName, binRequiresRange(channelDef, channel) ? {binSuffix: 'range'} : {});
      }

      if (scale) {
        const scaleType = scale.get('type');
        if (hasDiscreteDomain(scaleType)) {
          if (scaleType === 'band') {
            // For band, to get mid point, need to offset by half of the band
            return fieldRef(channelDef, scaleName, {binSuffix: 'range'}, {band: 0.5});
          }
          return fieldRef(channelDef, scaleName, {binSuffix: 'range'});
        }
      }
      return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
    } else if (isValueDef(channelDef)) {
      const value = channelDef.value;

      if (contains(['x', 'x2'], channel) && value === 'width') {
        return {field: {group: 'width'}};
      } else if (contains(['y', 'y2'], channel) && value === 'height') {
        return {field: {group: 'height'}};
      }

      return {value};
    }

    // If channelDef is neither field def or value def, it's a condition-only def.
    // In such case, we will use default ref.
  }

  return defaultRef;
}

export function text(textDef: ChannelDefWithCondition<TextFieldDef<string>>, config: Config): VgValueRef {
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

/**
 * Whether the scale definitely includes zero in the domain
 */
function domainDefinitelyIncludeZero(scale: ScaleComponent) {
  if (scale.get('zero') !== false) {
    return true;
  }
  const domains = scale.domains;
  if (isArray(domains)) {
    return some(domains, (d) => isArray(d) && d.length === 2 && d[0] <=0 && d[1] >= 0);
  }
  return false;
}

export function getDefaultRef(
  defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax',
  channel: 'x' | 'y', scaleName: string, scale: ScaleComponent, mark: Mark
) {
  if (isString(defaultRef)) {
    if (scaleName) {
      const scaleType = scale.get('type');
      if (contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scaleType)) {
        // Log scales cannot have zero.
        // Zero in time scale is arbitrary, and does not affect ratio.
        // (Time is an interval level of measurement, not ratio).
        // See https://en.wikipedia.org/wiki/Level_of_measurement for more info.
        if (mark === 'bar' || mark === 'area') {
          log.warn(log.message.nonZeroScaleUsedWithLengthMark(mark, channel, {scaleType}));
        }
      } else {
        if (domainDefinitelyIncludeZero(scale)) {
          return {
            scale: scaleName,
            value: 0
          };
        }
        if (mark === 'bar' || mark === 'area') {
          log.warn(log.message.nonZeroScaleUsedWithLengthMark(
            mark, channel, {zeroFalse: scale.explicit.zero === false}
          ));
        }
      }
    }

    if (defaultRef === 'zeroOrMin') {
      return channel === 'x' ? {value: 0} : {field: {group: 'height'}};
    } else { // zeroOrMax
      return channel === 'x' ? {field: {group: 'width'}} : {value: 0};
    }
  }
  return defaultRef;
}

