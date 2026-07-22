/**
 * Utility files for producing Vega ValueRef for marks
 */
import type {SignalRef} from 'vega';
import {PolarPositionChannel, PositionChannel} from '../../../channel.js';
import {Encoding} from '../../../encoding.js';
import {isFieldOrDatumDef} from '../../../channeldef.js';
import {Mark, MarkDef} from '../../../mark.js';
import {VgValueRef} from '../../../vega.schema.js';
import {signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {midPoint, valueRefForFieldOrDatumDef} from './valueref.js';

export interface Offset {
  offsetType?: 'visual' | 'encoding';
  offset?: number | VgValueRef;
}

export function positionOffset({
  channel: baseChannel,
  markDef,
  encoding = {},
  model,
  bandPosition,
  stackSuffix = 'end',
}: {
  channel: PositionChannel | PolarPositionChannel;
  markDef: MarkDef<Mark, SignalRef>;
  encoding?: Encoding<string>;
  model?: UnitModel;
  bandPosition?: number;
  stackSuffix?: 'start' | 'end';
}): Offset {
  const channel = `${baseChannel}Offset` as
    'xOffset' | 'yOffset' | 'x2Offset' | 'y2Offset' | 'thetaOffset' | 'radiusOffset' | 'theta2Offset' | 'radius2Offset'; // Need to cast as the type can't be inferred automatically

  const defaultValue = markDef[channel];
  // FIXME: remove as any
  const channelDef = (encoding as any)[channel];

  if ((channel === 'xOffset' || channel === 'yOffset') && channelDef) {
    const ref =
      model?.stack?.fieldChannel === channel && isFieldOrDatumDef(channelDef)
        ? valueRefForFieldOrDatumDef(channelDef, model.scaleName(channel), {suffix: stackSuffix}, {})
        : midPoint({
            channel: channel,
            channelDef,
            markDef,
            config: model?.config,
            scaleName: model.scaleName(channel),
            scale: model.getScaleComponent(channel),
            stack: null,
            defaultRef: signalOrValueRef(defaultValue),
            bandPosition,
          });
    return {offsetType: 'encoding', offset: ref};
  }

  const markDefOffsetValue = markDef[channel];
  if (markDefOffsetValue) {
    return {offsetType: 'visual', offset: markDefOffsetValue};
  }

  return {};
}
