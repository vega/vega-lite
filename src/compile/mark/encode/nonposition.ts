import {NonPositionScaleChannel} from '../../../channel';
import {FieldDef, ValueOrGradient} from '../../../channeldef';
import {VgEncodeChannel, VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {UnitModel} from '../../unit';
import {wrapCondition} from './conditional';
import * as ref from './valueref';

/**
 * Return encode for non-positional channels with scales. (Text doesn't have scale.)
 */
export function nonPosition(
  channel: NonPositionScaleChannel | 'angle',
  model: UnitModel,
  opt: {
    defaultValue?: ValueOrGradient;
    vgChannel?: VgEncodeChannel;
    defaultRef?: VgValueRef;
  } = {}
): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {vgChannel} = opt;
  let {defaultRef, defaultValue} = opt;

  if (defaultRef === undefined) {
    // prettier-ignore
    defaultValue = defaultValue ?? ref.getValueFromMarkDefAndConfig({channel, vgChannel, markDef, config});

    defaultRef = defaultValue ? {value: defaultValue} : undefined;
  }

  const channelDef = encoding[channel];

  return wrapCondition<FieldDef<string>, ValueOrGradient>(model, channelDef, vgChannel ?? channel, cDef => {
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
