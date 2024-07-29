import type {SignalRef} from 'vega';
import {NonPositionScaleChannel} from '../../../channel';
import {Value} from '../../../channeldef';
import {VgEncodeChannel, VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common';
import {UnitModel} from '../../unit';
import {wrapCondition} from './conditional';
import * as ref from './valueref';
import {getConditionalValueRefForIncludingInvalidValue} from './invalid';
import {isRelativePointSize} from '../../../mark';
import {isArray, isObject} from 'vega-util';
import {relativePointSize} from './relativePointSize';

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
    const markPropOrConfig = getMarkPropOrConfig(channel, markDef, config, {vgChannel, ignoreVgConfig: true});

    if (isObject(markPropOrConfig) && !isArray(markPropOrConfig) && isRelativePointSize(markPropOrConfig)) {
      // If the prop is relative point size
      if (channel === 'size' && vgChannel === undefined) {
        // and the channel is size encoding for Vega-Lite's point/circle/square mark (aka symbol in Vega)

        defaultValue = {
          signal: relativePointSize({size: markPropOrConfig, model}).signal
        };
      }
    } else {
      defaultValue ??= markPropOrConfig;
    }

    if (defaultValue !== undefined) {
      defaultRef = signalOrValueRef(defaultValue);
    }
  }

  const channelDef = encoding[channel];
  const commonProps = {
    markDef,
    config,
    scaleName: model.scaleName(channel),
    scale: model.getScaleComponent(channel)
  };

  const invalidValueRef = getConditionalValueRefForIncludingInvalidValue({
    ...commonProps,
    scaleChannel: channel,
    channelDef
  });

  const mainRefFn = (cDef: typeof channelDef) => {
    return ref.midPoint({
      ...commonProps,
      channel,
      channelDef: cDef,
      stack: null, // No need to provide stack for non-position as it does not affect mid point
      defaultRef
    });
  };

  return wrapCondition({
    model,
    channelDef,
    vgChannel: vgChannel ?? channel,
    invalidValueRef,
    mainRefFn
  });
}
