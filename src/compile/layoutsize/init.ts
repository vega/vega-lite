import {getSizeChannel, POSITION_SCALE_CHANNELS} from '../../channel.js';
import {isContinuousFieldOrDatumDef} from '../../channeldef.js';
import {Encoding} from '../../encoding.js';
import * as log from '../../log/index.js';
import {isStep, LayoutSizeMixins} from '../../spec/base.js';

export function initLayoutSize({encoding, size}: {encoding: Encoding<string>; size: LayoutSizeMixins}) {
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
