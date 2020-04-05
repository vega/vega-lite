import {getSizeChannel, POSITION_SCALE_CHANNELS} from '../../channel';
import {isContinuousFieldOrDatumDef} from '../../channeldef';
import {Encoding} from '../../encoding';
import * as log from '../../log';
import {isStep, LayoutSizeMixins} from '../../spec/base';

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
