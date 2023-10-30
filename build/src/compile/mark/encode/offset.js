import { signalOrValueRef } from '../../common';
import { midPoint } from './valueref';
export function positionOffset({ channel: baseChannel, markDef, encoding = {}, model, bandPosition }) {
    const channel = `${baseChannel}Offset`; // Need to cast as the type can't be inferred automatically
    const defaultValue = markDef[channel];
    const channelDef = encoding[channel];
    if ((channel === 'xOffset' || channel === 'yOffset') && channelDef) {
        const ref = midPoint({
            channel: channel,
            channelDef,
            markDef,
            config: model?.config,
            scaleName: model.scaleName(channel),
            scale: model.getScaleComponent(channel),
            stack: null,
            defaultRef: signalOrValueRef(defaultValue),
            bandPosition
        });
        return { offsetType: 'encoding', offset: ref };
    }
    const markDefOffsetValue = markDef[channel];
    if (markDefOffsetValue) {
        return { offsetType: 'visual', offset: markDefOffsetValue };
    }
    return {};
}
//# sourceMappingURL=offset.js.map