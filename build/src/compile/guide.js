import { keys } from '../util';
import { signalOrValueRef } from './common';
import { wrapCondition } from './mark/encode';
export function guideEncodeEntry(encoding, model) {
    return keys(encoding).reduce((encode, channel) => {
        const valueDef = encoding[channel];
        return {
            ...encode,
            ...wrapCondition(model, valueDef, channel, def => signalOrValueRef(def.value))
        };
    }, {});
}
//# sourceMappingURL=guide.js.map