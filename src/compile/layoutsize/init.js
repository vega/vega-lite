import {getSizeChannel, POSITION_SCALE_CHANNELS} from '../../channel.js';
import {isContinuousFieldOrDatumDef} from '../../channeldef.js';
import * as log from '../../log/index.js';
import {isStep} from '../../spec/base.js';
export function initLayoutSize({encoding, size}) {
  for (const channel of POSITION_SCALE_CHANNELS) {
    const sizeType = getSizeChannel(channel);
    if (isStep(size[sizeType])) {
      if (isContinuousFieldOrDatumDef(encoding[channel])) {
        delete size[sizeType];
        log.warn(log.message.stepDropped(sizeType));
      }
    }
  }
  return size;
}
//# sourceMappingURL=init.js.map
