import { signalRefOrValue } from './compile/common';
import { keys } from './util';
export function isExprRef(o) {
    return !!o?.expr;
}
export function replaceExprRef(index) {
    const props = keys(index || {});
    const newIndex = {};
    for (const prop of props) {
        newIndex[prop] = signalRefOrValue(index[prop]);
    }
    return newIndex;
}
//# sourceMappingURL=expr.js.map