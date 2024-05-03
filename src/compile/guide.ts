import {GuideEncodingEntry} from '../guide';
import {keys} from '../util';
import {VgEncodeChannel} from '../vega.schema';
import {signalOrValueRef} from './common';
import {wrapCondition} from './mark/encode/conditional';
import {UnitModel} from './unit';

export function guideEncodeEntry(encoding: GuideEncodingEntry, model: UnitModel) {
  return keys(encoding).reduce((encode, channel: VgEncodeChannel) => {
    return {
      ...encode,
      ...wrapCondition({
        model,
        channelDef: encoding[channel],
        vgChannel: channel,
        mainRefFn: def => signalOrValueRef(def.value),
        invalidValueRef: undefined // guide encoding won't show invalid values for the scale
      })
    };
  }, {});
}
