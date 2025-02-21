import type {SignalRef} from 'vega';
import {isArray, isNumber} from 'vega-util';
import {isBinned, isBinning, isBinParams} from '../../../bin.js';
import {
  getOffsetChannel,
  getSecondaryRangeChannel,
  getSizeChannel,
  getVgPositionChannel,
  isPolarPositionChannel,
  isXorY,
  PolarPositionChannel,
  PositionChannel,
} from '../../../channel.js';
import {
  getBandPosition,
  getBandSize,
  isFieldDef,
  isFieldOrDatumDef,
  TypedFieldDef,
  vgField,
} from '../../../channeldef.js';
import {Config, getViewConfigDiscreteStep} from '../../../config.js';
import {Encoding} from '../../../encoding.js';
import * as log from '../../../log/index.js';
import {BandSize, isRelativeBandSize} from '../../../mark.js';
import {hasDiscreteDomain} from '../../../scale.js';
import {isSignalRef, isVgRangeStep, VgEncodeEntry, VgValueRef} from '../../../vega.schema.js';
import {getMarkConfig, getMarkPropOrConfig, signalOrStringValue, signalOrValueRef} from '../../common.js';
import {ScaleComponent} from '../../scale/component.js';
import {UnitModel} from '../../unit.js';
import {nonPosition} from './nonposition.js';
import {positionOffset} from './offset.js';
import {vgAlignedPositionChannel} from './position-align.js';
import {pointPositionDefaultRef} from './position-point.js';
import {rangePosition} from './position-range.js';
import * as ref from './valueref.js';
import {getOffsetScaleChannel} from '../../../channel.js';
import {getFirstDefined} from '../../../util.js';
import {Mark} from '../../../mark.js';
import {OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX} from '../../data/timeunit.js';

export function rectPosition(model: UnitModel, channel: 'x' | 'y' | 'theta' | 'radius'): VgEncodeEntry {
  const {config, encoding, markDef} = model;
  const mark = markDef.type;

  const channel2 = getSecondaryRangeChannel(channel);
  const sizeChannel = getSizeChannel(channel);
  const channelDef = encoding[channel];
  const channelDef2 = encoding[channel2];

  const scale = model.getScaleComponent(channel);
  const scaleType = scale ? scale.get('type') : undefined;

  const orient = markDef.orient;
  const hasSizeDef =
    (encoding as any)[sizeChannel] ??
    encoding.size ??
    getMarkPropOrConfig('size', markDef, config, {vgChannel: sizeChannel});

  const offsetScaleChannel = getOffsetChannel(channel);

  const isBarOrTickBand =
    (mark === 'bar' && (channel === 'x' ? orient === 'vertical' : orient === 'horizontal')) ||
    (mark === 'tick' && (channel === 'y' ? orient === 'vertical' : orient === 'horizontal'));

  // x, x2, and width -- we must specify two of these in all conditions
  if (
    isFieldDef(channelDef) &&
    (isBinning(channelDef.bin) || isBinned(channelDef.bin) || (channelDef.timeUnit && !channelDef2)) &&
    !(hasSizeDef && !isRelativeBandSize(hasSizeDef)) &&
    !(encoding as any)[offsetScaleChannel] &&
    !hasDiscreteDomain(scaleType)
  ) {
    return rectBinPosition({
      fieldDef: channelDef,
      fieldDef2: channelDef2,
      channel,
      model,
    });
  } else if (((isFieldOrDatumDef(channelDef) && hasDiscreteDomain(scaleType)) || isBarOrTickBand) && !channelDef2) {
    return positionAndSize(channelDef, channel, model);
  } else {
    return rangePosition(channel, model, {defaultPos: 'zeroOrMax', defaultPos2: 'zeroOrMin'});
  }
}

function defaultSizeRef(
  sizeChannel: 'width' | 'height',
  scaleName: string,
  scale: ScaleComponent,
  config: Config<SignalRef>,
  bandSize: BandSize,
  hasFieldDef: boolean,
  mark: Mark,
): VgValueRef {
  if (isRelativeBandSize(bandSize)) {
    if (scale) {
      const scaleType = scale.get('type');
      if (scaleType === 'band') {
        let bandWidth = `bandwidth('${scaleName}')`;
        if (bandSize.band !== 1) {
          bandWidth = `${bandSize.band} * ${bandWidth}`;
        }
        const minBandSize = getMarkConfig('minBandSize', {type: mark}, config);
        return {signal: minBandSize ? `max(${signalOrStringValue(minBandSize)}, ${bandWidth})` : bandWidth};
      } else if (bandSize.band !== 1) {
        log.warn(log.message.cannotUseRelativeBandSizeWithNonBandScale(scaleType));
        bandSize = undefined;
      }
    } else {
      return {
        mult: bandSize.band,
        field: {group: sizeChannel},
      };
    }
  } else if (isSignalRef(bandSize)) {
    return bandSize;
  } else if (bandSize) {
    return {value: bandSize};
  }

  // no valid band size
  if (scale) {
    const scaleRange = scale.get('range');
    if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
      return {value: scaleRange.step - 2};
    }
  }
  if (!hasFieldDef) {
    const {bandPaddingInner, barBandPaddingInner, rectBandPaddingInner, tickBandPaddingInner} = config.scale;
    const padding = getFirstDefined(
      bandPaddingInner,
      mark === 'tick' ? tickBandPaddingInner : mark === 'bar' ? barBandPaddingInner : rectBandPaddingInner,
    ); // this part is like paddingInner in scale.ts
    if (isSignalRef(padding)) {
      return {signal: `(1 - (${padding.signal})) * ${sizeChannel}`};
    } else if (isNumber(padding)) {
      return {signal: `${1 - padding} * ${sizeChannel}`};
    }
  }
  const defaultStep = getViewConfigDiscreteStep(config.view, sizeChannel);
  return {value: defaultStep - 2};
}

/**
 * Output position encoding and its size encoding for continuous, point, and band scales.
 */
function positionAndSize(
  fieldDef: Encoding<string>['x' | 'y' | 'theta' | 'radius'],
  channel: 'x' | 'y' | 'theta' | 'radius',
  model: UnitModel,
) {
  const {markDef, encoding, config, stack} = model;
  const orient = markDef.orient;

  const scaleName = model.scaleName(channel);
  const scale = model.getScaleComponent(channel);
  const vgSizeChannel = getSizeChannel(channel);
  const channel2 = getSecondaryRangeChannel(channel);

  const offsetScaleChannel = getOffsetChannel(channel);
  const offsetScaleName = model.scaleName(offsetScaleChannel);
  const offsetScale = model.getScaleComponent(getOffsetScaleChannel(channel));

  const useVlSizeChannel =
    // Always uses size channel for ticks, because tick only calls rectPosition() for the size channel
    markDef.type === 'tick' ||
    // use "size" channel for bars, if there is orient and the channel matches the right orientation
    (orient === 'horizontal' && channel === 'y') ||
    (orient === 'vertical' && channel === 'x');

  // Use size encoding / mark property / config if it exists
  let sizeMixins;
  if (encoding.size || markDef.size) {
    if (useVlSizeChannel) {
      sizeMixins = nonPosition('size', model, {
        vgChannel: vgSizeChannel,
        defaultRef: signalOrValueRef(markDef.size),
      });
    } else {
      log.warn(log.message.cannotApplySizeToNonOrientedMark(markDef.type));
    }
  }
  const hasSizeFromMarkOrEncoding = !!sizeMixins;

  // Otherwise, apply default value
  const bandSize = getBandSize({
    channel,
    fieldDef,
    markDef,
    config,
    scaleType: (scale || offsetScale)?.get('type'),
    useVlSizeChannel,
  });

  sizeMixins = sizeMixins || {
    [vgSizeChannel]: defaultSizeRef(
      vgSizeChannel,
      offsetScaleName || scaleName,
      offsetScale || scale,
      config,
      bandSize,
      !!fieldDef,
      markDef.type,
    ),
  };

  /*
    Band scales with size value and all point scales, use xc/yc + band=0.5

    Otherwise (band scales that has size based on a band ref), use x/y with position band = (1 - size_band) / 2.
    In this case, size_band is the band specified in the x/y-encoding.
    By default band is 1, so `(1 - band) / 2` = 0.
    If band is 0.6, the the x/y position in such case should be `(1 - band) / 2` = 0.2
   */

  const defaultBandAlign =
    (scale || offsetScale)?.get('type') === 'band' && isRelativeBandSize(bandSize) && !hasSizeFromMarkOrEncoding
      ? 'top'
      : 'middle';

  const vgChannel = vgAlignedPositionChannel(channel, markDef, config, defaultBandAlign);
  const center = vgChannel === 'xc' || vgChannel === 'yc';
  const {offset, offsetType} = positionOffset({channel, markDef, encoding, model, bandPosition: center ? 0.5 : 0});

  const posRef = ref.midPointRefWithPositionInvalidTest({
    channel,
    channelDef: fieldDef,
    markDef,
    config,
    scaleName,
    scale,
    stack,
    offset,
    defaultRef: pointPositionDefaultRef({model, defaultPos: 'mid', channel, scaleName, scale}),
    bandPosition: center
      ? offsetType === 'encoding'
        ? 0
        : 0.5
      : isSignalRef(bandSize)
        ? {signal: `(1-${bandSize})/2`}
        : isRelativeBandSize(bandSize)
          ? (1 - bandSize.band) / 2
          : 0,
  });

  if (vgSizeChannel) {
    return {[vgChannel]: posRef, ...sizeMixins};
  } else {
    // otherwise, we must simulate size by setting position2 = position + size
    // (for theta/radius since Vega doesn't have thetaWidth/radiusWidth)
    const vgChannel2 = getVgPositionChannel(channel2);
    const sizeRef = sizeMixins[vgSizeChannel];
    const sizeOffset = offset ? {...sizeRef, offset} : sizeRef;
    return {
      [vgChannel]: posRef,

      // posRef might be an array that wraps position invalid test
      [vgChannel2]: isArray(posRef)
        ? [posRef[0], {...posRef[1], offset: sizeOffset}]
        : {
            ...posRef,
            offset: sizeOffset,
          },
    };
  }
}

function getBinSpacing(
  channel: PositionChannel | PolarPositionChannel,
  spacing: number,
  reverse: boolean | SignalRef,
  axisTranslate: number | SignalRef,
  offset: number | VgValueRef,
  minBandSize: number | SignalRef,
  bandSizeExpr: string,
) {
  if (isPolarPositionChannel(channel)) {
    return 0;
  }

  const isEnd = channel === 'x' || channel === 'y2';

  const spacingOffset = isEnd ? -spacing / 2 : spacing / 2;

  if (isSignalRef(reverse) || isSignalRef(offset) || isSignalRef(axisTranslate) || minBandSize) {
    const reverseExpr = signalOrStringValue(reverse);
    const offsetExpr = signalOrStringValue(offset);
    const axisTranslateExpr = signalOrStringValue(axisTranslate);
    const minBandSizeExpr = signalOrStringValue(minBandSize);

    const sign = isEnd ? '' : '-';

    const spacingAndSizeOffset = minBandSize
      ? `(${bandSizeExpr} < ${minBandSizeExpr} ? ${sign}0.5 * (${minBandSizeExpr} - (${bandSizeExpr})) : ${spacingOffset})`
      : spacingOffset;

    const t = axisTranslateExpr ? `${axisTranslateExpr} + ` : '';
    const r = reverseExpr ? `(${reverseExpr} ? -1 : 1) * ` : '';
    const o = offsetExpr ? `(${offsetExpr} + ${spacingAndSizeOffset})` : spacingAndSizeOffset;

    return {
      signal: t + r + o,
    };
  } else {
    offset = offset || 0;
    // FIXME: remove this override
    // eslint-disable-next-line @typescript-eslint/no-unsafe-unary-minus
    return axisTranslate + (reverse ? -offset - spacingOffset : +offset + spacingOffset);
  }
}

function rectBinPosition({
  fieldDef,
  fieldDef2,
  channel,
  model,
}: {
  fieldDef: TypedFieldDef<string>;
  fieldDef2?: Encoding<string>['x2' | 'y2'];
  channel: 'x' | 'y' | 'theta' | 'radius';
  model: UnitModel;
}) {
  const {config, markDef, encoding} = model;

  const scale = model.getScaleComponent(channel);
  const scaleName = model.scaleName(channel);
  const scaleType = scale ? scale.get('type') : undefined;
  const reverse = scale.get('reverse');

  const bandSize = getBandSize({channel, fieldDef, markDef, config, scaleType});

  const axis = (model.component.axes as any)[channel]?.[0];
  const axisTranslate = axis?.get('translate') ?? 0.5; // vega default is 0.5

  const spacing = isXorY(channel) ? (getMarkPropOrConfig('binSpacing', markDef, config) ?? 0) : 0;

  const channel2 = getSecondaryRangeChannel(channel);
  const vgChannel = getVgPositionChannel(channel);
  const vgChannel2 = getVgPositionChannel(channel2);
  const minBandSize = getMarkConfig('minBandSize', markDef, config);

  const {offset} = positionOffset({channel, markDef, encoding, model, bandPosition: 0});
  const {offset: offset2} = positionOffset({channel: channel2, markDef, encoding, model, bandPosition: 0});

  const bandSizeExpr = ref.binSizeExpr({fieldDef, scaleName});
  const binSpacingOffset = getBinSpacing(channel, spacing, reverse, axisTranslate, offset, minBandSize, bandSizeExpr);
  const binSpacingOffset2 = getBinSpacing(
    channel2,
    spacing,
    reverse,
    axisTranslate,
    offset2 ?? offset,
    minBandSize,
    bandSizeExpr,
  );

  const bandPositionForBandSize = isSignalRef(bandSize)
    ? {signal: `(1-${bandSize.signal})/2`}
    : isRelativeBandSize(bandSize)
      ? (1 - bandSize.band) / 2
      : 0.5;

  const bandPosition = getBandPosition({fieldDef, fieldDef2, markDef, config});

  if (isBinning(fieldDef.bin) || fieldDef.timeUnit) {
    const useRectOffsetField = fieldDef.timeUnit && bandPosition !== 0.5;

    return {
      [vgChannel2]: rectBinRef({
        fieldDef,
        scaleName,
        bandPosition: bandPositionForBandSize,
        offset: binSpacingOffset2,
        useRectOffsetField,
      }),
      [vgChannel]: rectBinRef({
        fieldDef,
        scaleName,
        bandPosition: isSignalRef(bandPositionForBandSize)
          ? {signal: `1-${bandPositionForBandSize.signal}`}
          : 1 - bandPositionForBandSize,
        offset: binSpacingOffset,
        useRectOffsetField,
      }),
    };
  } else if (isBinned(fieldDef.bin)) {
    const startRef = ref.valueRefForFieldOrDatumDef(fieldDef, scaleName, {}, {offset: binSpacingOffset2});

    if (isFieldDef(fieldDef2)) {
      return {
        [vgChannel2]: startRef,
        [vgChannel]: ref.valueRefForFieldOrDatumDef(fieldDef2, scaleName, {}, {offset: binSpacingOffset}),
      };
    } else if (isBinParams(fieldDef.bin) && fieldDef.bin.step) {
      return {
        [vgChannel2]: startRef,
        [vgChannel]: {
          signal: `scale("${scaleName}", ${vgField(fieldDef, {expr: 'datum'})} + ${fieldDef.bin.step})`,
          offset: binSpacingOffset,
        },
      };
    }
  }
  log.warn(log.message.channelRequiredForBinned(channel2));
  return undefined;
}

/**
 * Value Ref for binned fields
 */
function rectBinRef({
  fieldDef,
  scaleName,
  bandPosition,
  offset,
  useRectOffsetField,
}: {
  fieldDef: TypedFieldDef<string>;
  scaleName: string;
  bandPosition: number | SignalRef;
  offset?: number | SignalRef;
  useRectOffsetField: boolean;
}) {
  return ref.interpolatedSignalRef({
    scaleName,
    fieldOrDatumDef: fieldDef,
    bandPosition,
    offset,
    ...(useRectOffsetField
      ? {
          startSuffix: OFFSETTED_RECT_START_SUFFIX,
          endSuffix: OFFSETTED_RECT_END_SUFFIX,
        }
      : {}),
  });
}
