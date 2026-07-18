import {GuideEncodingEntry} from '../guide.js';
import {keys} from '../util.js';
import {VgEncodeChannel} from '../vega.schema.js';
import {signalOrValueRef} from './common.js';
import {wrapCondition} from './mark/encode/conditional.js';
import {UnitModel} from './unit.js';

export function guideEncodeEntry(encoding: GuideEncodingEntry, model: UnitModel) {
  return keys(encoding).reduce((encode, channel: VgEncodeChannel) => {
    return {
      ...encode,
      ...wrapCondition({
        model,
        channelDef: encoding[channel],
        vgChannel: channel,
        mainRefFn: (def) => signalOrValueRef(def.value),
        invalidValueRef: undefined, // guide encoding won't show invalid values for the scale
      }),
    };
  }, {});
}
