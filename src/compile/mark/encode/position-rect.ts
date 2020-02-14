import {SignalRef} from 'vega-typings/types';
import {isNumber} from 'vega-util';
import {isBinned, isBinning} from '../../../bin';
import {PositionChannel, X, X2, Y2} from '../../../channel';
import {
  getBand,
  getTypedFieldDef,
  isFieldDef,
  isPositionFieldDef,
  isValueDef,
  PositionFieldDef,
  SecondaryFieldDef,
  TypedFieldDef,
  ValueDef
} from '../../../channeldef';
import {Config, DEFAULT_STEP, getViewConfigDiscreteStep} from '../../../config';
import * as log from '../../../log';
import {Mark, MarkDef} from '../../../mark';
import {hasDiscreteDomain, ScaleType} from '../../../scale';
import {getFirstDefined} from '../../../util';
import {isSignalRef, isVgRangeStep, VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {getMarkConfig, signalOrValueRef} from '../../common';
import {ScaleComponent} from '../../scale/component';
import {UnitModel} from '../../unit';
import {nonPosition} from './nonposition';
import {getOffset} from './offset';
import {alignedPositionChannel} from './position-align';
import {pointPosition} from './position-point';
import {rangePosition} from './position-range';
import * as ref from './valueref';

export function rectPosition(model: UnitModel, channel: 'x' | 'y', mark: 'bar' | 'rect' | 'image'): VgEncodeEntry {
  const {config, encoding, markDef} = model;

  const channel2 = channel === 'x' ? 'x2' : 'y2';
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  const fieldDef = encoding[channel];
  const fieldDef2 = encoding[channel2];

  const scale = model.getScaleComponent(channel);
  const scaleType = scale ? scale.get('type') : undefined;
  const scaleName = model.scaleName(channel);

  const orient = markDef.orient;
  const hasSizeDef =
    encoding[sizeChannel] ??
    encoding.size ??
    markDef[sizeChannel] ??
    markDef.size ??
    getMarkConfig('size', markDef, config, {vgChannel: sizeChannel});

  const isBarBand = channel === 'x' ? orient === 'vertical' : orient === 'horizontal';

  // x, x2, and width -- we must specify two of these in all conditions
  if (
    isFieldDef(fieldDef) &&
    (isBinning(fieldDef.bin) || isBinned(fieldDef.bin) || (fieldDef.timeUnit && !fieldDef2)) &&
    !hasSizeDef &&
    !hasDiscreteDomain(scaleType)
  ) {
    const band = getBand(channel, fieldDef, undefined, markDef, config);

    return rectBinPosition({
      fieldDef,
      fieldDef2,
      channel,
      markDef,
      scaleName,
      band,
      spacing: getFirstDefined(markDef.binSpacing, config[mark].binSpacing),
      reverse: scale.get('reverse')
    });
  } else if (((isFieldDef(fieldDef) && hasDiscreteDomain(scaleType)) || isBarBand) && !fieldDef2) {
    // vertical
    if (isFieldDef(fieldDef) && scaleType === ScaleType.BAND) {
      const band = isPositionFieldDef(fieldDef) ? fieldDef.band : undefined;
      return rectBandPosition(
        fieldDef,
        channel,
        model,
        defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config, band)
      );
    }

    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
    return centeredPointPositionWithSize(
      channel,
      model,
      defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config)
    );
  } else {
    return rangePosition(channel, model, {defaultPos: 'zeroOrMax', defaultPos2: 'zeroOrMin'});
  }
}

function centeredPointPositionWithSize(channel: 'x' | 'y', model: UnitModel, sizeRef: VgValueRef) {
  const centerChannel: 'xc' | 'yc' = channel === 'x' ? 'xc' : 'yc';
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  return {
    ...pointPosition(channel, model, {defaultPos: 'mid', vgChannel: centerChannel}),
    ...nonPosition('size', model, {defaultRef: sizeRef, vgChannel: sizeChannel})
  };
}

function defaultSizeRef(
  mark: 'bar' | 'rect' | 'image',
  markDef: MarkDef,
  sizeChannel: 'width' | 'height',
  scaleName: string,
  scale: ScaleComponent,
  config: Config,
  band?: number
): VgValueRef {
  const markPropOrConfig = getFirstDefined(
    markDef[sizeChannel],
    markDef.size,
    // TODO: deal with sizeChannel config
    getMarkConfig('size', markDef, config, {vgChannel: sizeChannel})
  );

  if (markPropOrConfig !== undefined) {
    return signalOrValueRef(markPropOrConfig);
  }

  if (scale) {
    const scaleType = scale.get('type');
    if (scaleType === 'point' || scaleType === 'band') {
      if (config[mark].discreteBandSize !== undefined) {
        return {value: config[mark].discreteBandSize};
      }
      if (scaleType === ScaleType.POINT) {
        const scaleRange = scale.get('range');
        if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
          return {value: scaleRange.step - 2};
        }
        return {value: DEFAULT_STEP - 2};
      } else {
        // BAND
        return bandRef(scaleName, band);
      }
    } else {
      // continuous scale
      return {value: config[mark].continuousBandSize};
    }
  }
  // No Scale

  const step = getViewConfigDiscreteStep(config.view, sizeChannel);

  const value = getFirstDefined(
    // No scale is like discrete bar (with one item)
    config[mark].discreteBandSize,
    step - 2
  );
  return {value};
}

function bandRef(scaleName: string, band: number | boolean = true): VgValueRef {
  return {
    scale: scaleName,
    band: band
  };
}

function rectBandPosition(
  fieldDef: PositionFieldDef<string>,
  channel: 'x' | 'y',
  model: UnitModel,
  sizeRef?: VgValueRef
) {
  const scaleName = model.scaleName(channel);
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  const {markDef, encoding, config} = model;

  const vgChannel = alignedPositionChannel(channel, markDef, config);
  const offset = getOffset(channel, markDef);

  const centeredBandPositionMixins = {
    [vgChannel]: ref.fieldRef(fieldDef, scaleName, {}, {band: 0.5, offset})
  };

  if (encoding.size || (markDef.size !== null && markDef.size !== undefined)) {
    const orient = markDef.orient;
    if (orient) {
      if (getTypedFieldDef(encoding.size) || isValueDef(encoding.size)) {
        return {
          ...centeredBandPositionMixins,
          ...nonPosition('size', model, {vgChannel: sizeChannel})
        };
      } else if (markDef.size !== undefined) {
        return {
          ...centeredBandPositionMixins,
          [sizeChannel]: {value: markDef.size}
        };
      }
    } else {
      log.warn(log.message.cannotApplySizeToNonOrientedMark(markDef.type));
    }
  }

  if (sizeRef?.value !== undefined) {
    return {
      ...centeredBandPositionMixins,
      [sizeChannel]: sizeRef
    };
  }
  const {band = 1} = fieldDef;

  return {
    [channel]: ref.fieldRef(fieldDef, scaleName, {binSuffix: 'range'}, {band: (1 - band) / 2, offset}),
    [sizeChannel]: sizeRef ?? bandRef(scaleName, band)
  };
}

function getBinSpacing(channel: PositionChannel, spacing: number, reverse: boolean | SignalRef) {
  if (isSignalRef(reverse)) {
    if (channel === 'x' || channel === 'y2') {
      return {signal: `${reverse.signal} ? ${spacing} : 0`};
    } else {
      return {signal: `${reverse.signal} ? 0 : ${spacing}`};
    }
  } else {
    const spacingIndex = {
      x: reverse ? spacing : 0,
      x2: reverse ? 0 : spacing,
      y: reverse ? 0 : spacing,
      y2: reverse ? spacing : 0
    };
    return spacingIndex[channel];
  }
}

export function rectBinPosition({
  fieldDef,
  fieldDef2,
  channel,
  band,
  scaleName,
  markDef,
  spacing = 0,
  reverse
}: {
  fieldDef: TypedFieldDef<string>;
  fieldDef2?: ValueDef | SecondaryFieldDef<string> | SignalRef;
  channel: 'x' | 'y';
  band: number;
  scaleName: string;
  markDef: MarkDef<Mark>;
  spacing?: number;
  reverse: boolean | SignalRef;
}) {
  const channel2 = channel === X ? X2 : Y2;
  if (isBinning(fieldDef.bin) || fieldDef.timeUnit) {
    return {
      [channel2]: rectBinRef({
        channel,
        fieldDef,
        scaleName,
        markDef,
        band: (1 - band) / 2,
        offset: getBinSpacing(channel2, spacing, reverse)
      }),
      [channel]: rectBinRef({
        channel,
        fieldDef,
        scaleName,
        markDef,
        band: 1 - (1 - band) / 2,
        offset: getBinSpacing(channel, spacing, reverse)
      })
    };
  } else if (isBinned(fieldDef.bin) && isFieldDef(fieldDef2)) {
    return {
      [channel2]: ref.fieldRef(fieldDef, scaleName, {}, {offset: getBinSpacing(channel2, spacing, reverse)}),
      [channel]: ref.fieldRef(fieldDef2, scaleName, {}, {offset: getBinSpacing(channel, spacing, reverse)})
    };
  } else {
    log.warn(log.message.channelRequiredForBinned(channel2));
    return undefined;
  }
}

/**
 * Value Ref for binned fields
 */
export function rectBinRef({
  channel,
  fieldDef,
  scaleName,
  markDef,
  band,
  offset
}: {
  channel: PositionChannel;
  fieldDef: TypedFieldDef<string>;
  scaleName: string;
  markDef: MarkDef<Mark>;
  band: number;
  offset?: number | SignalRef;
}) {
  const r = ref.interpolatedSignalRef({
    scaleName,
    fieldDef,
    band,
    offset
  });

  return ref.wrapPositionInvalidTest({
    fieldDef,
    channel,
    markDef,
    ref: r
  });
}
