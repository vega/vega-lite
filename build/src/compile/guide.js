import { keys } from '../util';
import { wrapCondition } from './mark/mixins';
export function guideEncodeEntry(encoding, model) {
    return keys(encoding).reduce((encode, channel) => {
        const valueDef = encoding[channel];
        return Object.assign({}, encode, wrapCondition(model, valueDef, channel, (x) => ({ value: x.value })));
    }, {});
}
//# sourceMappingURL=guide.js.map