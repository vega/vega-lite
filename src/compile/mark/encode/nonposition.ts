import type {SignalRef} from 'vega';
import {NonPositionScaleChannel} from '../../../channel.js';
import {Value, isConditionalDef} from '../../../channeldef.js';
import {VgEncodeChannel, VgEncodeEntry, VgValueRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {wrapCondition} from './conditional.js';
import * as ref from './valueref.js';
import {getConditionalValueRefForIncludingInvalidValue} from './invalid.js';

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
  } = {},
): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {vgChannel} = opt;
  let {defaultRef, defaultValue} = opt;

  const channelDef = encoding[channel];

  if (defaultRef === undefined) {
    // prettier-ignore
    defaultValue ??= getMarkPropOrConfig(channel, markDef, config, {
      vgChannel,
      // If there is no conditonal def, we ignore vgConfig so the output spec is concise.
      // However, if there is a conditional def, we must include vgConfig so the default is respected.
      ignoreVgConfig: !isConditionalDef(channelDef)
    });

    if (defaultValue !== undefined) {
      defaultRef = signalOrValueRef(defaultValue);
    }
  }

  const commonProps = {
    markDef,
    config,
    scaleName: model.scaleName(channel),
    scale: model.getScaleComponent(channel),
  };

  const invalidValueRef = getConditionalValueRefForIncludingInvalidValue({
    ...commonProps,
    scaleChannel: channel,
    channelDef,
  });

  const mainRefFn = (cDef: typeof channelDef) => {
    return ref.midPoint({
      ...commonProps,
      channel,
      channelDef: cDef,
      stack: null, // No need to provide stack for non-position as it does not affect mid point
      defaultRef,
    });
  };

  return wrapCondition({
    model,
    channelDef,
    vgChannel: vgChannel ?? channel,
    invalidValueRef,
    mainRefFn,
  });
}
