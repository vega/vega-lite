import type {SignalRef} from 'vega';
import {NonPositionScaleChannel} from '../../../channel.js';
import {Value} from '../../../channeldef.js';
import {VgEncodeChannel, VgEncodeEntry, VgValueRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {wrapCondition} from './conditional.js';
import * as ref from './valueref.js';

/**
 * Return encode for non-positional channels with scales. (Text doesn't have scale.)
 */
export function nonPosition(
  channel: NonPositionScaleChannel,
  model: UnitModel,
  opt: {
    defaultValue?: Value | SignalRef;
    vgChannel?: VgEncodeChannel;
    defaultRef?: VgValueRef;
  } = {}
): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {vgChannel} = opt;
  let {defaultRef, defaultValue} = opt;

  if (defaultRef === undefined) {
    // prettier-ignore
    defaultValue ??= getMarkPropOrConfig(channel, markDef, config, {vgChannel, ignoreVgConfig: true});

    if (defaultValue !== undefined) {
      defaultRef = signalOrValueRef(defaultValue);
    }
  }

  const channelDef = encoding[channel];

  return wrapCondition(model, channelDef, vgChannel ?? channel, cDef => {
    return ref.midPoint({
      channel,
      channelDef: cDef,
      markDef,
      config,
      scaleName: model.scaleName(channel),
      scale: model.getScaleComponent(channel),
      stack: null, // No need to provide stack for non-position as it does not affect mid point
      defaultRef
    });
  });
}
