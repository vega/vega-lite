/**
 * Utility files for producing Vega ValueRef for marks
 */
import {SignalRef} from 'vega';
import {isFunction, isString} from 'vega-util';
import {isCountingAggregateOp} from '../../../aggregate';
import {isBinned, isBinning} from '../../../bin';
import {
  Channel,
  getMainRangeChannel,
  NonPositionScaleChannel,
  PolarPositionChannel,
  PositionChannel,
  RADIUS,
  THETA,
  X,
  X2,
  Y,
  Y2
} from '../../../channel';
import {
  binRequiresRange,
  ChannelDef,
  DatumDef,
  FieldDef,
  FieldDefBase,
  FieldName,
  FieldRefOption,
  getBand,
  isAnyPositionFieldOrDatumDef,
  isDatumDef,
  isFieldDef,
  isFieldOrDatumDef,
  isTypedFieldDef,
  isValueDef,
  SecondaryChannelDef,
  SecondaryFieldDef,
  TypedFieldDef,
  ValueOrGradientOrText,
  vgField
} from '../../../channeldef';
import {Config} from '../../../config';
import {dateTimeToExpr, isDateTime} from '../../../datetime';
import * as log from '../../../log';
import {isPathMark, Mark, MarkDef} from '../../../mark';
import {fieldValidPredicate} from '../../../predicate';
import {hasDiscreteDomain, isContinuousToContinuous} from '../../../scale';
import {StackProperties} from '../../../stack';
import {QUANTITATIVE, TEMPORAL} from '../../../type';
import {contains, getFirstDefined} from '../../../util';
import {isSignalRef, VgEncodeChannel, VgValueRef} from '../../../vega.schema';
import {getMarkConfig, signalOrValueRef} from '../../common';
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

  const invalid = getFirstDefined(markDef.invalid, getMarkConfig('invalid', markDef, config));
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
  offset?: number;
  defaultRef: VgValueRef | (() => VgValueRef);
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
  defaultRef
}: MidPointParams): VgValueRef {
  // TODO: datum support
  if (channelDef) {
    /* istanbul ignore else */

    if (isFieldOrDatumDef(channelDef)) {
      if (isTypedFieldDef(channelDef)) {
        const band = getBand({
          channel,
          fieldDef: channelDef,
          fieldDef2: channel2Def,
          markDef,
          stack,
          config,
          isMidPoint: true
        });
        const {bin, timeUnit, type} = channelDef;

        if (isBinning(channelDef.bin) || (band && timeUnit && type === TEMPORAL)) {
          // Use middle only for x an y to place marks in the center between start and end of the bin range.
          // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
          if (contains([X, Y, RADIUS, THETA], channel) && contains([QUANTITATIVE, TEMPORAL], type)) {
            if (stack && stack.impute) {
              // For stack, we computed bin_mid so we can impute.
              return valueRefForFieldOrDatumDef(channelDef, scaleName, {binSuffix: 'mid'}, {offset});
            }
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

      if (scale) {
        const scaleType = scale.get('type');
        if (hasDiscreteDomain(scaleType)) {
          if (scaleType === 'band') {
            // For band, to get mid point, need to offset by half of the band
            const band = getFirstDefined(isAnyPositionFieldOrDatumDef(channelDef) ? channelDef.band : undefined, 0.5);
            return valueRefForFieldOrDatumDef(channelDef, scaleName, {binSuffix: 'range'}, {band, offset});
          }
          return valueRefForFieldOrDatumDef(channelDef, scaleName, {binSuffix: 'range'}, {offset});
        }
      }
      return valueRefForFieldOrDatumDef(channelDef, scaleName, {}, {offset}); // no need for bin suffix
    } else if (isValueDef(channelDef)) {
      const value = channelDef.value;
      const offsetMixins = offset ? {offset} : {};

      return {...widthHeightValueRef(channel, value), ...offsetMixins};
    } else if (isSignalRef(channelDef)) {
      return channelDef;
    }

    // If channelDef is neither field def or value def, it's a condition-only def.
    // In such case, we will use default ref.
  }

  const ref = isFunction(defaultRef) ? {...defaultRef(), ...(offset ? {offset} : {})} : defaultRef;

  if (ref) {
    // for non-position, ref could be undefined.
    return {
      ...ref,
      // only include offset when it is non-zero (zero = no offset)
      ...(offset ? {offset} : {})
    };
  }
  return ref;
}

/**
 * Convert special "width" and "height" values in Vega-Lite into Vega value ref.
 */
export function widthHeightValueRef(channel: Channel, value: ValueOrGradientOrText | SignalRef) {
  if (contains(['x', 'x2'], channel) && value === 'width') {
    return {field: {group: 'width'}};
  } else if (contains(['y', 'y2'], channel) && value === 'height') {
    return {field: {group: 'height'}};
  }
  return signalOrValueRef(value);
}

export function getValueFromMarkDefAndConfig({
  channel,
  vgChannel,
  markDef,
  config
}: {
  channel: NonPositionScaleChannel | PolarPositionChannel;
  vgChannel?: VgEncodeChannel;
  markDef: MarkDef;
  config: Config;
}) {
  if (!vgChannel || vgChannel === channel) {
    // When vl channel is the same as Vega's, no need to read from config as Vega will apply them correctly

    return markDef[channel];
  }

  // However, when they are different (e.g, vl's text size is vg fontSize), need to read vl channel from configs
  return getFirstDefined(
    // prioritize vl-specific names
    markDef[channel],
    markDef[vgChannel],
    getMarkConfig(channel, markDef, config, {vgChannel})
  );
}
