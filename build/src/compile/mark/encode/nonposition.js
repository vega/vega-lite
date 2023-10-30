import { getMarkPropOrConfig, signalOrValueRef } from '../../common';
import { wrapCondition } from './conditional';
import * as ref from './valueref';
/**
 * Return encode for non-positional channels with scales. (Text doesn't have scale.)
 */
export function nonPosition(channel, model, opt = {}) {
    const { markDef, encoding, config } = model;
    const { vgChannel } = opt;
    let { defaultRef, defaultValue } = opt;
    if (defaultRef === undefined) {
        // prettier-ignore
        defaultValue ?? (defaultValue = getMarkPropOrConfig(channel, markDef, config, { vgChannel, ignoreVgConfig: true }));
        if (defaultValue !== undefined) {
            defaultRef = signalOrValueRef(defaultValue);
        }
    }
    const channelDef = encoding[channel];
    return wrapCondition(model, channelDef, vgChannel ?? channel, cDef => {
        return ref.midPoint({
            channel,
            channelDef: cDef,
            markDef,
            config,
            scaleName: model.scaleName(channel),
            scale: model.getScaleComponent(channel),
            stack: null,
            defaultRef
        });
    });
}
//# sourceMappingURL=nonposition.js.map