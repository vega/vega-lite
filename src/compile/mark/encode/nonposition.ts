import {SignalRef} from 'vega';
import {NonPositionScaleChannel} from '../../../channel';
import {Value} from '../../../channeldef';
import {VgEncodeChannel, VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common';
import {UnitModel} from '../../unit';
import {wrapCondition} from './conditional';
import * as ref from './valueref';

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
