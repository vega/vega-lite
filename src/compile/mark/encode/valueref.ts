/**
 * Utility files for producing Vega ValueRef for marks
 */
import {SignalRef} from 'vega';
import {isFunction, isString} from 'vega-util';
import {isCountingAggregateOp} from '../../../aggregate';
import {isBinned, isBinning} from '../../../bin';
import {Channel, getMainRangeChannel, PolarPositionChannel, PositionChannel, X, X2, Y2} from '../../../channel';
import {
  binRequiresRange,
  ChannelDef,
  DatumDef,
  FieldDef,
  FieldDefBase,
  FieldName,
  FieldRefOption,
  getBand,
  isDatumDef,
  isFieldDef,
  isFieldOrDatumDef,
  isTypedFieldDef,
  isValueDef,
  SecondaryChannelDef,
  SecondaryFieldDef,
  TypedFieldDef,
  Value,
  vgField
} from '../../../channeldef';
import {Config} from '../../../config';
import {dateTimeToExpr, isDateTime} from '../../../datetime';
import * as log from '../../../log';
import {isPathMark, Mark, MarkDef} from '../../../mark';
import {fieldValidPredicate} from '../../../predicate';
import {hasDiscreteDomain, isContinuousToContinuous} from '../../../scale';
import {StackProperties} from '../../../stack';
import {TEMPORAL} from '../../../type';
import {contains} from '../../../util';
import {isSignalRef, VgValueRef} from '../../../vega.schema';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common';
import {ScaleComponent} from '../../scale/component';

export function midPointRefWithPositionInvalidTest(
  params: MidPointParams & {
    channel: PositionChannel | PolarPositionChannel;
  }
) {
  const {channel, channelDef, markDef, scale, config} = params;
  const ref = midPoint(params);

  // Wrap to check if the positional value is invalid, if so, plot the point on the min value
  if (
    // Only this for field def without counting aggregate (as count wouldn't be null)
    isFieldDef(channelDef) &&
    !isCountingAggregateOp(channelDef.aggregate) &&
    // and only for continuous scale without zero (otherwise, null / invalid will be interpreted as zero, which doesn't cause layout problem)
    scale &&
    isContinuousToContinuous(scale.get('type')) &&
    scale.get('zero') === false
  ) {
    return wrapPositionInvalidTest({
      fieldDef: channelDef,
      channel,
      markDef,
      ref,
      config
    });
  }
  return ref;
}

export function wrapPositionInvalidTest({
  fieldDef,
  channel,
  markDef,
  ref,
  config
}: {
  fieldDef: FieldDef<string>;
  channel: PositionChannel | PolarPositionChannel;
  markDef: MarkDef<Mark>;
  ref: VgValueRef;
  config: Config;
}): VgValueRef | VgValueRef[] {
  if (isPathMark(markDef.type)) {
    // path mark already use defined to skip points, no need to do it here.
    return ref;
  }

  const invalid = getMarkPropOrConfig('invalid', markDef, config);
  if (invalid === null) {
    // if there is no invalid filter, don't do the invalid test
    return ref;
  }

  return [fieldInvalidTestValueRef(fieldDef, channel), ref];
}

export function fieldInvalidTestValueRef(fieldDef: FieldDef<string>, channel: PositionChannel | PolarPositionChannel) {
  const test = fieldInvalidPredicate(fieldDef, true);

  const mainChannel = getMainRangeChannel(channel) as PositionChannel | PolarPositionChannel; // we can cast here as the output can't be other things.
  const zeroValueRef =
    mainChannel === 'y'
      ? {field: {group: 'height'}}
      : // x / angle / radius can all use 0
        {value: 0};

  return {test, ...zeroValueRef};
}

export function fieldInvalidPredicate(field: FieldName | FieldDef<string>, invalid = true) {
  return fieldValidPredicate(isString(field) ? field : vgField(field, {expr: 'datum'}), !invalid);
}

export function datumDefToExpr(datumDef: DatumDef<string>) {
  const {datum} = datumDef;
  if (isDateTime(datum)) {
    return dateTimeToExpr(datum);
  }
  return `${JSON.stringify(datum)}`;
}

export function valueRefForFieldOrDatumDef(
  fieldDef: FieldDefBase<string> | DatumDef<string>,
  scaleName: string,
  opt: FieldRefOption,
  encode: {offset?: number | VgValueRef; band?: number | boolean}
): VgValueRef {
  const ref: VgValueRef = {};

  if (scaleName) {
    ref.scale = scaleName;
  }

  if (isDatumDef<string>(fieldDef)) {
    const {datum} = fieldDef;
    if (isDateTime(datum)) {
      ref.signal = dateTimeToExpr(datum);
    } else if (isSignalRef(datum)) {
      ref.signal = datum.signal;
    } else {
      ref.value = datum;
    }
  } else {
    ref.field = vgField(fieldDef, opt);
  }

  if (encode) {
    const {offset, band} = encode;
    if (offset) {
      ref.offset = offset;
    }
    if (band) {
      ref.band = band;
    }
  }
  return ref;
}

/**
 * Signal that returns the middle of a bin from start and end field. Should only be used with x and y.
 */
export function interpolatedSignalRef({
  scaleName,
  fieldOrDatumDef,
  fieldOrDatumDef2,
  offset,
  startSuffix,
  band = 0.5
}: {
  scaleName: string;
  fieldOrDatumDef: TypedFieldDef<string>;
  fieldOrDatumDef2?: SecondaryFieldDef<string>;
  startSuffix?: string;
  offset: number | SignalRef;
  band: number;
}): VgValueRef {
  const expr = 0 < band && band < 1 ? 'datum' : undefined;
  const start = vgField(fieldOrDatumDef, {expr, suffix: startSuffix});
  const end =
    fieldOrDatumDef2 !== undefined
      ? vgField(fieldOrDatumDef2, {expr})
      : vgField(fieldOrDatumDef, {suffix: 'end', expr});

  const ref: VgValueRef = {};

  if (band === 0 || band === 1) {
    ref.scale = scaleName;
    const val = band === 0 ? start : end;
    ref.field = val;
  } else {
    const datum = `${band} * ${start} + ${1 - band} * ${end}`;
    ref.signal = `scale("${scaleName}", ${datum})`;
  }

  if (offset) {
    ref.offset = offset;
  }
  return ref;
}

export interface MidPointParams {
  channel: Channel;
  channelDef: ChannelDef;
  channel2Def?: SecondaryChannelDef<string>;

  markDef: MarkDef<Mark>;
  config: Config;

  scaleName: string;
  scale: ScaleComponent;
  stack?: StackProperties;
  offset?: number | SignalRef;
  defaultRef: VgValueRef | (() => VgValueRef);

  /**
   * Allow overriding band instead of reading to field def since band is applied to size (width/height) instead of the position for x/y-position with band scales.
   */
  band?: number;
}

/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export function midPoint({
  channel,
  channelDef,
  channel2Def,
  markDef,
  config,
  scaleName,
  scale,
  stack,
  offset,
  defaultRef,
  band
}: MidPointParams): VgValueRef {
  // TODO: datum support
  if (channelDef) {
    /* istanbul ignore else */

    if (isFieldOrDatumDef(channelDef)) {
      if (isTypedFieldDef(channelDef)) {
        band =
          band ??
          getBand({
            channel,
            fieldDef: channelDef,
            fieldDef2: channel2Def,
            markDef,
            stack,
            config,
            isMidPoint: true
          });
        const {bin, timeUnit, type} = channelDef;

        if (isBinning(bin) || (band && timeUnit && type === TEMPORAL)) {
          // Use middle only for x an y to place marks in the center between start and end of the bin range.
          // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
          if (stack && stack.impute) {
            // For stack, we computed bin_mid so we can impute.
            return valueRefForFieldOrDatumDef(channelDef, scaleName, {binSuffix: 'mid'}, {offset});
          }
          if (band) {
            // if band = 0, no need to call interpolation
            // For non-stack, we can just calculate bin mid on the fly using signal.
            return interpolatedSignalRef({scaleName, fieldOrDatumDef: channelDef, band, offset});
          }
          return valueRefForFieldOrDatumDef(
            channelDef,
            scaleName,
            binRequiresRange(channelDef, channel) ? {binSuffix: 'range'} : {},
            {
              offset
            }
          );
        } else if (isBinned(bin)) {
          if (isFieldDef(channel2Def)) {
            return interpolatedSignalRef({
              scaleName,
              fieldOrDatumDef: channelDef,
              fieldOrDatumDef2: channel2Def,
              band,
              offset
            });
          } else {
            const channel2 = channel === X ? X2 : Y2;
            log.warn(log.message.channelRequiredForBinned(channel2));
          }
        }
      }

      const scaleType = scale?.get('type');
      return valueRefForFieldOrDatumDef(
        channelDef,
        scaleName,
        hasDiscreteDomain(scaleType) ? {binSuffix: 'range'} : {}, // no need for bin suffix if there is no scale
        {
          offset,
          // For band, to get mid point, need to offset by half of the band
          band: scaleType === 'band' ? band ?? channelDef.band ?? 0.5 : undefined
        }
      );
    } else if (isValueDef(channelDef)) {
      const value = channelDef.value;
      const offsetMixins = offset ? {offset} : {};

      return {...widthHeightValueOrSignalRef(channel, value), ...offsetMixins};
    }

    // If channelDef is neither field def or value def, it's a condition-only def.
    // In such case, we will use default ref.
  }

  if (isFunction(defaultRef)) {
    defaultRef = defaultRef();
  }

  if (defaultRef) {
    // for non-position, ref could be undefined.
    return {
      ...defaultRef,
      // only include offset when it is non-zero (zero = no offset)
      ...(offset ? {offset} : {})
    };
  }
  return defaultRef;
}

/**
 * Convert special "width" and "height" values in Vega-Lite into Vega value ref.
 */
export function widthHeightValueOrSignalRef(channel: Channel, value: Value | SignalRef) {
  if (contains(['x', 'x2'], channel) && value === 'width') {
    return {field: {group: 'width'}};
  } else if (contains(['y', 'y2'], channel) && value === 'height') {
    return {field: {group: 'height'}};
  }
  return signalOrValueRef(value);
}
