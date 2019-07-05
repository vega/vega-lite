import {getSizeType, POSITION_SCALE_CHANNELS} from '../../channel';
import {getFieldDef, isContinuous, isDiscrete, PositionFieldDef} from '../../channeldef';
import {Encoding} from '../../encoding';
import * as log from '../../log';
import {isStep, LayoutSizeMixins} from '../../spec/base';

export function initLayoutSize({
  encoding,
  fit,
  size
}: {
  encoding: Encoding<string>;
  fit: boolean;
  size: LayoutSizeMixins;
}) {
  for (const channel of POSITION_SCALE_CHANNELS) {
    const sizeType = getSizeType(channel);
    const fieldDef = getFieldDef(encoding[channel]) as PositionFieldDef<string>;
    if (isStep(size[sizeType])) {
      if (isContinuous(fieldDef)) {
        delete size[sizeType];
        log.warn(log.message.cannotUseStepWithContinuous(sizeType));
      } else if (isDiscrete(fieldDef) && fit) {
        delete size[sizeType];
        log.warn(log.message.cannotUseStepWithFit(sizeType));
      }
    }
  }

  return size;
}
