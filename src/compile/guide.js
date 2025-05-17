import {keys} from '../util.js';
import {signalOrValueRef} from './common.js';
import {wrapCondition} from './mark/encode/conditional.js';
export function guideEncodeEntry(encoding, model) {
  return keys(encoding).reduce((encode, channel) => {
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
//# sourceMappingURL=guide.js.map
