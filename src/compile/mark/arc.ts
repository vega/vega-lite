import {VgEncodeChannel, VgValueRef} from '../../vega.schema';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as encode from './encode';
import {positionRef} from './encode/position-point';
import {position2Ref} from './encode/position-range';
import {getValueFromMarkDefAndConfig, MidPointParams} from './encode/valueref';

export const arc: MarkCompiler = {
  vgMark: 'arc',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore'
      }),

      // TODO: add arc / radius
      ...encode.pointPosition('x', model, {defaultPos: 'mid'}),
      ...encode.pointPosition('y', model, {defaultPos: 'mid'}),
      ...radius(model),
      ...angle(model)
    };
  }
};

function radius(model: UnitModel) {
  return arcPosition(model, {
    channel: 'radius',
    vgChannel: 'outerRadius',
    vgChannel2: 'innerRadius',
    defaultRef: defaultOuterRadius(model)
  });
}

function angle(model: UnitModel) {
  return arcPosition(model, {
    channel: 'angle',
    vgChannel: 'startAngle',
    vgChannel2: 'endAngle',
    defaultRef: {signal: 'PI * 2'}
  });
}

// This method is a simpler version of position-range, as we don't have to deal with lat/long and the fight between x2 and width (or y2 and height) here.
function arcPosition(
  model: UnitModel,
  {
    channel,
    vgChannel,
    vgChannel2,
    defaultRef
  }: {
    channel: 'radius' | 'angle';
    vgChannel: VgEncodeChannel;
    vgChannel2: VgEncodeChannel;
    defaultRef: VgValueRef;
  }
) {
  const {encoding, markDef, stack, config} = model;

  const channel2 = channel === 'radius' ? 'radius2' : 'angle2';

  const sharedParams: MidPointParams & {channel: 'radius' | 'angle'} = {
    channel,
    channelDef: encoding[channel],
    channel2Def: encoding[channel2],
    markDef,
    config,
    scaleName: model.scaleName(channel),
    scale: model.getScaleComponent(channel),
    stack,
    offset: 0,
    defaultRef: undefined // defining below
  };

  const defaultValue = getValueFromMarkDefAndConfig({channel, vgChannel, markDef, config});

  const defaultValue2 = getValueFromMarkDefAndConfig({
    channel: channel2,
    vgChannel: vgChannel2,
    markDef,
    config
  });

  return {
    [vgChannel]: positionRef({
      ...sharedParams,
      defaultRef: defaultValue ? {value: defaultValue} : defaultRef
    }),
    [vgChannel2]: position2Ref({
      ...sharedParams,
      channel: channel2,
      defaultRef: {value: defaultValue2 ?? 0}
    })
  };
}

function defaultOuterRadius(model: UnitModel): VgValueRef {
  // radius = min(width,height)/2
  return {
    signal: `min(${model.width.signal},${model.height.signal})/2`
  };
}
