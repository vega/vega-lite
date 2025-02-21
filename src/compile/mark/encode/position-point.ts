import {
  getMainRangeChannel,
  getSecondaryRangeChannel,
  getSizeChannel,
  getVgPositionChannel,
  isXorY,
  PolarPositionChannel,
  PolarPositionScaleChannel,
  PositionChannel,
  PositionScaleChannel,
} from '../../../channel.js';
import {isFieldDef, isFieldOrDatumDef, TypedFieldDef} from '../../../channeldef.js';
import {Config} from '../../../config.js';
import {VgValueRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig} from '../../common.js';
import {ScaleComponent} from '../../scale/component.js';
import {UnitModel} from '../../unit.js';
import {positionOffset} from './offset.js';
import * as ref from './valueref.js';
import {scaledZeroOrMinOrMax, ScaledZeroOrMinOrMaxProps} from './scaledZeroOrMinOrMax.js';

/**
 * Return encode for point (non-band) position channels.
 */
export function pointPosition(
  channel: 'x' | 'y' | 'theta' | 'radius',
  model: UnitModel,
  {
    defaultPos,
    vgChannel,
  }: {
    defaultPos: 'mid' | 'zeroOrMin' | 'zeroOrMax' | null;
    vgChannel?: 'x' | 'y' | 'xc' | 'yc';
  },
) {
  const {encoding, markDef, config, stack} = model;

  const channelDef = encoding[channel];
  const channel2Def = encoding[getSecondaryRangeChannel(channel)];
  const scaleName = model.scaleName(channel);
  const scale = model.getScaleComponent(channel);

  const {offset, offsetType} = positionOffset({
    channel,
    markDef,
    encoding,
    model,
    bandPosition: 0.5,
  });

  // Get default position or position from mark def
  const defaultRef = pointPositionDefaultRef({
    model,
    defaultPos,
    channel,
    scaleName,
    scale,
  });

  const valueRef =
    !channelDef && isXorY(channel) && (encoding.latitude || encoding.longitude)
      ? // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        {field: model.getName(channel)}
      : positionRef({
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
          bandPosition: offsetType === 'encoding' ? 0 : undefined,
        });

  return valueRef ? {[vgChannel || channel]: valueRef} : undefined;
}

// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated. For now, this is a huge step moving forward.

/**
 * @return Vega ValueRef for normal x- or y-position without projection
 */
export function positionRef(
  params: ref.MidPointParams & {
    channel: 'x' | 'y' | 'radius' | 'theta';
  },
): VgValueRef | VgValueRef[] {
  const {channel, channelDef, scaleName, stack, offset, markDef} = params;

  // This isn't a part of midPoint because we use midPoint for non-position too
  if (isFieldOrDatumDef(channelDef) && stack && channel === stack.fieldChannel) {
    if (isFieldDef(channelDef)) {
      let bandPosition = channelDef.bandPosition;

      if (bandPosition === undefined && markDef.type === 'text' && (channel === 'radius' || channel === 'theta')) {
        // theta and radius of text mark should use bandPosition = 0.5 by default
        // so that labels for arc marks are centered automatically
        bandPosition = 0.5;
      }

      if (bandPosition !== undefined) {
        return ref.interpolatedSignalRef({
          scaleName,
          fieldOrDatumDef: channelDef as TypedFieldDef<string>, // positionRef always have type
          startSuffix: 'start',
          bandPosition,
          offset,
        });
      }
    }
    // x or y use stack_end so that stacked line's point mark use stack_end too.
    return ref.valueRefForFieldOrDatumDef(channelDef, scaleName, {suffix: 'end'}, {offset});
  }

  return ref.midPointRefWithPositionInvalidTest(params);
}

export function pointPositionDefaultRef({
  model,
  defaultPos,
  channel,
  scaleName,
  scale,
}: {
  model: UnitModel;
  defaultPos: 'mid' | 'zeroOrMin' | 'zeroOrMax' | null;
  channel: PositionChannel | PolarPositionChannel;
  scaleName: string;
  scale: ScaleComponent;
}): () => VgValueRef {
  const {markDef, config} = model;
  return () => {
    const mainChannel = getMainRangeChannel(channel);
    const vgChannel = getVgPositionChannel(channel);

    const definedValueOrConfig = getMarkPropOrConfig(channel, markDef, config, {vgChannel});
    if (definedValueOrConfig !== undefined) {
      return ref.widthHeightValueOrSignalRef(channel, definedValueOrConfig);
    }

    switch (defaultPos) {
      case 'zeroOrMin':
        return zeroOrMinOrMaxPosition({scaleName, scale, mode: 'zeroOrMin', mainChannel, config});
      case 'zeroOrMax':
        return zeroOrMinOrMaxPosition({
          scaleName,
          scale,
          mode: {zeroOrMax: {widthSignal: model.width.signal, heightSignal: model.height.signal}},
          mainChannel,
          config,
        });
      case 'mid': {
        const sizeRef = model[getSizeChannel(channel)];
        return {...sizeRef, mult: 0.5};
      }
    }
    // defaultPos === null
    return undefined;
  };
}

function zeroOrMinOrMaxPosition({
  mainChannel,
  config,
  ...otherProps
}: ScaledZeroOrMinOrMaxProps & {
  mainChannel: PositionScaleChannel | PolarPositionScaleChannel;
  config: Config;
}): VgValueRef {
  const scaledValueRef = scaledZeroOrMinOrMax(otherProps);
  const {mode} = otherProps;

  if (scaledValueRef) {
    return scaledValueRef;
  }

  switch (mainChannel) {
    case 'radius': {
      if (mode === 'zeroOrMin') {
        return {value: 0}; // min value
      }
      const {widthSignal, heightSignal} = mode.zeroOrMax;
      // max of radius is min(width, height) / 2
      return {
        signal: `min(${widthSignal},${heightSignal})/2`,
      };
    }
    case 'theta':
      return mode === 'zeroOrMin' ? {value: 0} : {signal: '2*PI'};
    case 'x':
      return mode === 'zeroOrMin' ? {value: 0} : {field: {group: 'width'}};
    case 'y':
      return mode === 'zeroOrMin' ? {field: {group: 'height'}} : {value: 0};
  }
}
