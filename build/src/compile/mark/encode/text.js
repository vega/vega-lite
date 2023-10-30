import { getFormatMixins, isFieldOrDatumDef, isValueDef } from '../../../channeldef';
import { signalOrValueRef } from '../../common';
import { formatSignalRef } from '../../format';
import { wrapCondition } from './conditional';
export function text(model, channel = 'text') {
    const channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, channel, cDef => textRef(cDef, model.config));
}
export function textRef(channelDef, config, expr = 'datum') {
    // text
    if (channelDef) {
        if (isValueDef(channelDef)) {
            return signalOrValueRef(channelDef.value);
        }
        if (isFieldOrDatumDef(channelDef)) {
            const { format, formatType } = getFormatMixins(channelDef);
            return formatSignalRef({ fieldOrDatumDef: channelDef, format, formatType, expr, config });
        }
    }
    return undefined;
}
//# sourceMappingURL=text.js.map