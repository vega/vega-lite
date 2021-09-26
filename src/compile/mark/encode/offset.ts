/**
 * Utility files for producing Vega ValueRef for marks
 */
import {SignalRef} from 'vega';
import {PolarPositionChannel, PositionChannel} from '../../../channel';
import {Encoding} from '../../../encoding';
import {Mark, MarkDef} from '../../../mark';
import {VgValueRef} from '../../../vega.schema';
import {signalOrValueRef} from '../../common';
import {UnitModel} from '../../unit';
import {midPoint} from './valueref';

export interface Offset {
  offsetType?: 'visual' | 'encoding';
  offset?: number | VgValueRef;
}

export function positionOffset({
  channel: baseChannel,
  markDef,
  encoding = {},
  model,
  bandPosition
}: {
  channel: PositionChannel | PolarPositionChannel;
  markDef: MarkDef<Mark, SignalRef>;
  encoding?: Encoding<string>;
  model?: UnitModel;
  bandPosition?: number;
}): Offset {
  const channel = `${baseChannel}Offset` as
    | 'xOffset'
    | 'yOffset'
    | 'x2Offset'
    | 'y2Offset'
    | 'thetaOffset'
    | 'radiusOffset'
    | 'theta2Offset'
    | 'radius2Offset'; // Need to cast as the type can't be inferred automatically

  const defaultValue = markDef[channel];
  const channelDef = encoding[channel];

  if ((channel === 'xOffset' || channel === 'yOffset') && channelDef) {
    const ref = midPoint({
      channel: channel,
      channelDef,
      markDef,
      config: model?.config,
      scaleName: model.scaleName(channel),
      scale: model.getScaleComponent(channel),
      stack: null,
      defaultRef: signalOrValueRef(defaultValue),
      bandPosition
    });
    return {offsetType: 'encoding', offset: ref};
  }

  const markDefOffsetValue = markDef[channel];
  if (markDefOffsetValue) {
    return {offsetType: 'visual', offset: markDefOffsetValue};
  }

  return {};
}
