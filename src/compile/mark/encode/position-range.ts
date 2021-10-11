import {SignalRef} from 'vega';
import {getMainRangeChannel, getSecondaryRangeChannel, getSizeChannel, getVgPositionChannel} from '../../../channel';
import {isFieldOrDatumDef} from '../../../channeldef';
import * as log from '../../../log';
import {isRelativeBandSize, Mark, MarkConfig, MarkDef} from '../../../mark';
import {VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {getMarkStyleConfig} from '../../common';
import {UnitModel} from '../../unit';
import {positionOffset} from './offset';
import {vgAlignedPositionChannel} from './position-align';
import {pointPosition, pointPositionDefaultRef} from './position-point';
import * as ref from './valueref';

/**
 * Utility for area/rule position, which can be either point or range.
 * (One of the axes should be point and the other should be range.)
 */
export function pointOrRangePosition(
  channel: 'x' | 'y',
  model: UnitModel,
  {
    defaultPos,
    defaultPos2,
    range
  }: {
    defaultPos: 'zeroOrMin' | 'zeroOrMax' | 'mid';
    defaultPos2: 'zeroOrMin' | 'zeroOrMax';
    range: boolean;
  }
) {
  if (range) {
    return rangePosition(channel, model, {defaultPos, defaultPos2});
  }
  return pointPosition(channel, model, {defaultPos});
}

export function rangePosition(
  channel: 'x' | 'y' | 'theta' | 'radius',
  model: UnitModel,
  {
    defaultPos,
    defaultPos2
  }: {
    defaultPos: 'zeroOrMin' | 'zeroOrMax' | 'mid';
    defaultPos2: 'zeroOrMin' | 'zeroOrMax';
  }
): VgEncodeEntry {
  const {markDef, config} = model;
  const channel2 = getSecondaryRangeChannel(channel);
  const sizeChannel = getSizeChannel(channel);

  const pos2Mixins = pointPosition2OrSize(model, defaultPos2, channel2);

  const vgChannel = pos2Mixins[sizeChannel]
    ? // If there is width/height, we need to position the marks based on the alignment.
      vgAlignedPositionChannel(channel, markDef, config)
    : // Otherwise, make sure to apply to the right Vg Channel (for arc mark)
      getVgPositionChannel(channel);

  return {
    ...pointPosition(channel, model, {defaultPos, vgChannel}),
    ...pos2Mixins
  };
}

/**
 * Return encode for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
function pointPosition2OrSize(
  model: UnitModel,
  defaultPos: 'zeroOrMin' | 'zeroOrMax',
  channel: 'x2' | 'y2' | 'radius2' | 'theta2'
) {
  const {encoding, mark, markDef, stack, config} = model;

  const baseChannel = getMainRangeChannel(channel);
  const sizeChannel = getSizeChannel(channel);
  const vgChannel = getVgPositionChannel(channel);

  const channelDef = encoding[baseChannel];
  const scaleName = model.scaleName(baseChannel);
  const scale = model.getScaleComponent(baseChannel);

  const {offset} =
    channel in encoding || channel in markDef
      ? positionOffset({channel, markDef, encoding, model})
      : positionOffset({channel: baseChannel, markDef, encoding, model});

  if (!channelDef && (channel === 'x2' || channel === 'y2') && (encoding.latitude || encoding.longitude)) {
    const vgSizeChannel = getSizeChannel(channel);

    const size = model.markDef[vgSizeChannel];
    if (size != null) {
      return {
        [vgSizeChannel]: {value: size}
      };
    } else {
      return {
        [vgChannel]: {field: model.getName(channel)}
      };
    }
  }

  const valueRef = position2Ref({
    channel,
    channelDef,
    channel2Def: encoding[channel],
    markDef,
    config,
    scaleName,
    scale,
    stack,
    offset,
    defaultRef: undefined
  });

  if (valueRef !== undefined) {
    return {[vgChannel]: valueRef};
  }

  // TODO: check width/height encoding here once we add them

  // no x2/y2 encoding, then try to read x2/y2 or width/height based on precedence:
  // markDef > config.style > mark-specific config (config[mark]) > general mark config (config.mark)

  return (
    position2orSize(channel, markDef) ||
    position2orSize(channel, {
      [channel]: getMarkStyleConfig(channel, markDef, config.style),
      [sizeChannel]: getMarkStyleConfig(sizeChannel, markDef, config.style)
    }) ||
    position2orSize(channel, config[mark]) ||
    position2orSize(channel, config.mark) || {
      [vgChannel]: pointPositionDefaultRef({
        model,
        defaultPos,
        channel,
        scaleName,
        scale
      })()
    }
  );
}

export function position2Ref({
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
}: ref.MidPointParams & {
  channel: 'x2' | 'y2' | 'radius2' | 'theta2';
}): VgValueRef | VgValueRef[] {
  if (
    isFieldOrDatumDef(channelDef) &&
    stack &&
    // If fieldChannel is X and channel is X2 (or Y and Y2)
    channel.charAt(0) === stack.fieldChannel.charAt(0)
  ) {
    return ref.valueRefForFieldOrDatumDef(channelDef, scaleName, {suffix: 'start'}, {offset});
  }
  return ref.midPointRefWithPositionInvalidTest({
    channel,
    channelDef: channel2Def,
    scaleName,
    scale,
    stack,
    markDef,
    config,
    offset,
    defaultRef
  });
}

function position2orSize(
  channel: 'x2' | 'y2' | 'radius2' | 'theta2',
  markDef: MarkConfig<SignalRef> | MarkDef<Mark, SignalRef>
) {
  const sizeChannel = getSizeChannel(channel);
  const vgChannel = getVgPositionChannel(channel);
  if (markDef[vgChannel] !== undefined) {
    return {[vgChannel]: ref.widthHeightValueOrSignalRef(channel, markDef[vgChannel])};
  } else if (markDef[channel] !== undefined) {
    return {[vgChannel]: ref.widthHeightValueOrSignalRef(channel, markDef[channel])};
  } else if (markDef[sizeChannel]) {
    const dimensionSize = markDef[sizeChannel];
    if (isRelativeBandSize(dimensionSize)) {
      log.warn(log.message.relativeBandSizeNotSupported(sizeChannel));
    } else {
      return {[sizeChannel]: ref.widthHeightValueOrSignalRef(channel, dimensionSize)};
    }
  }
  return undefined;
}
