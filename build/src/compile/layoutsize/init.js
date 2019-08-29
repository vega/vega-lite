import { getSizeType, POSITION_SCALE_CHANNELS } from '../../channel';
import { getFieldDef, isContinuous } from '../../channeldef';
import * as log from '../../log';
import { isStep } from '../../spec/base';
export function initLayoutSize({ encoding, size }) {
    for (const channel of POSITION_SCALE_CHANNELS) {
        const sizeType = getSizeType(channel);
        const fieldDef = getFieldDef(encoding[channel]);
        if (isStep(size[sizeType])) {
            if (fieldDef) {
                if (isContinuous(fieldDef)) {
                    delete size[sizeType];
                    log.warn(log.message.stepDropped(sizeType));
                }
            }
        }
    }
    return size;
}
//# sourceMappingURL=init.js.map