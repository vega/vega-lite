/**
 * Utility files for producing Vega ValueRef for marks
 */
import type {SignalRef} from 'vega';
import {isFunction} from 'vega-util';
import {isBinned, isBinning} from '../../../bin.js';
import {Channel, PolarPositionChannel, PositionChannel, X, X2, Y2, getMainRangeChannel} from '../../../channel.js';
import {
  ChannelDef,
  DatumDef,
  FieldDefBase,
  FieldRefOption,
  SecondaryChannelDef,
  SecondaryFieldDef,
  TypedFieldDef,
  Value,
  binRequiresRange,
  getBandPosition,
  isDatumDef,
  isFieldDef,
  isFieldOrDatumDef,
  isTypedFieldDef,
  isValueDef,
  vgField,
} from '../../../channeldef.js';
import {Config} from '../../../config.js';
import {dateTimeToExpr, isDateTime} from '../../../datetime.js';
import {isExprRef} from '../../../expr.js';
import * as log from '../../../log/index.js';
import {Mark, MarkDef} from '../../../mark.js';
import {hasDiscreteDomain} from '../../../scale.js';
import {StackProperties} from '../../../stack.js';
import {TEMPORAL} from '../../../type.js';
import {contains, stringify} from '../../../util.js';
import {VgValueRef, isSignalRef} from '../../../vega.schema.js';
import {signalOrValueRef} from '../../common.js';
import {ScaleComponent} from '../../scale/component.js';
import {getConditionalValueRefForIncludingInvalidValue} from './invalid.js';

export function midPointRefWithPositionInvalidTest(
  params: MidPointParams & {
    channel: PositionChannel | PolarPositionChannel;
  },
): VgValueRef | VgValueRef[] {
  const {channel, channelDef, markDef, scale, scaleName, config} = params;
  const scaleChannel = getMainRangeChannel(channel);
  const mainRef = midPoint(params);

  const valueRefForIncludingInvalid = getConditionalValueRefForIncludingInvalidValue({
    scaleChannel,
    channelDef,
    scale,
    scaleName,
    markDef,
    config,
  });

  return valueRefForIncludingInvalid !== undefined ? [valueRefForIncludingInvalid, mainRef] : mainRef;
}

export function datumDefToExpr(datumDef: DatumDef<string>) {
  const {datum} = datumDef;
  if (isDateTime(datum)) {
    return dateTimeToExpr(datum);
  }
  return `${stringify(datum)}`;
}

export function valueRefForFieldOrDatumDef(
  fieldDef: FieldDefBase<string> | DatumDef<string>,
  scaleName: string,
  opt: FieldRefOption,
  encode: {offset?: number | VgValueRef; band?: number | boolean | SignalRef},
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
    } else if (isExprRef(datum)) {
      ref.signal = datum.expr;
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
  endSuffix = 'end',
  bandPosition = 0.5,
}: {
  scaleName: string;
  fieldOrDatumDef: TypedFieldDef<string>;
  fieldOrDatumDef2?: SecondaryFieldDef<string>;
  startSuffix?: string;
  endSuffix?: string;
  offset: number | SignalRef | VgValueRef;
  bandPosition: number | SignalRef;
}): VgValueRef {
  const expr = !isSignalRef(bandPosition) && 0 < bandPosition && bandPosition < 1 ? 'datum' : undefined;
  const start = vgField(fieldOrDatumDef, {expr, suffix: startSuffix});
  const end =
    fieldOrDatumDef2 !== undefined
      ? vgField(fieldOrDatumDef2, {expr})
      : vgField(fieldOrDatumDef, {suffix: endSuffix, expr});

  const ref: VgValueRef = {};

  if (bandPosition === 0 || bandPosition === 1) {
    ref.scale = scaleName;
    const field = bandPosition === 0 ? start : end;
    ref.field = field;
  } else {
    const datum = isSignalRef(bandPosition)
      ? `(1-${bandPosition.signal}) * ${start} + ${bandPosition.signal} * ${end}`
      : `${1 - bandPosition} * ${start} + ${bandPosition} * ${end}`;
    ref.signal = `scale("${scaleName}", ${datum})`;
  }

  if (offset) {
    ref.offset = offset;
  }
  return ref;
}

export function binSizeExpr({scaleName, fieldDef}: {scaleName: string; fieldDef: TypedFieldDef<string>}) {
  const start = vgField(fieldDef, {expr: 'datum'});
  const end = vgField(fieldDef, {expr: 'datum', suffix: 'end'});
  return `abs(scale("${scaleName}", ${end}) - scale("${scaleName}", ${start}))`;
}

export interface MidPointParams {
  channel: Channel;
  channelDef: ChannelDef;
  channel2Def?: SecondaryChannelDef<string>;

  markDef: MarkDef<Mark, SignalRef>;
  config: Config<SignalRef>;

  scaleName: string;
  scale: ScaleComponent;
  stack?: StackProperties;
  offset?: number | SignalRef | VgValueRef;
  defaultRef: VgValueRef | (() => VgValueRef);

  bandPosition?: number | SignalRef;
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
  bandPosition,
}: MidPointParams): VgValueRef {
  // TODO: datum support
  if (channelDef) {
    /* istanbul ignore else */

    if (isFieldOrDatumDef(channelDef)) {
      const scaleType = scale?.get('type');
      if (isTypedFieldDef(channelDef)) {
        bandPosition ??= getBandPosition({
          fieldDef: channelDef,
          fieldDef2: channel2Def,
          markDef,
          config,
        });
        const {bin, timeUnit, type} = channelDef;

        if (isBinning(bin) || (bandPosition && timeUnit && type === TEMPORAL)) {
          // Use middle only for x an y to place marks in the center between start and end of the bin range.
          // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
          if (stack?.impute) {
            // For stack, we computed bin_mid so we can impute.
            return valueRefForFieldOrDatumDef(channelDef, scaleName, {binSuffix: 'mid'}, {offset});
          }

          if (bandPosition && !hasDiscreteDomain(scaleType)) {
            // if band = 0, no need to call interpolation
            // For non-stack, we can just calculate bin mid on the fly using signal.
            return interpolatedSignalRef({scaleName, fieldOrDatumDef: channelDef, bandPosition, offset});
          }
          return valueRefForFieldOrDatumDef(
            channelDef,
            scaleName,
            binRequiresRange(channelDef, channel) ? {binSuffix: 'range'} : {},
            {
              offset,
            },
          );
        } else if (isBinned(bin)) {
          if (isFieldDef(channel2Def)) {
            return interpolatedSignalRef({
              scaleName,
              fieldOrDatumDef: channelDef,
              fieldOrDatumDef2: channel2Def,
              bandPosition,
              offset,
            });
          } else {
            const channel2 = channel === X ? X2 : Y2;
            log.warn(log.message.channelRequiredForBinned(channel2));
          }
        }
      }

      return valueRefForFieldOrDatumDef(
        channelDef,
        scaleName,
        hasDiscreteDomain(scaleType) ? {binSuffix: 'range'} : {}, // no need for bin suffix if there is no scale
        {
          offset,
          // For band, to get mid point, need to offset by half of the band
          band: scaleType === 'band' ? (bandPosition ?? channelDef.bandPosition ?? 0.5) : undefined,
        },
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
      ...(offset ? {offset} : {}),
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
