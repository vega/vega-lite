import { normalizeLogicalOperand } from './logical';
import { normalizePredicate } from './predicate';
export function isFilter(t) {
    return t['filter'] !== undefined;
}
export function isLookup(t) {
    return t['lookup'] !== undefined;
}
export function isWindow(t) {
    return t['window'] !== undefined;
}
export function isCalculate(t) {
    return t['calculate'] !== undefined;
}
export function isBin(t) {
    return !!t['bin'];
}
export function isTimeUnit(t) {
    return t['timeUnit'] !== undefined;
}
export function isAggregate(t) {
    return t['aggregate'] !== undefined;
}
export function isStack(t) {
    return t['stack'] !== undefined;
}
export function normalizeTransform(transform) {
    return transform.map(function (t) {
        if (isFilter(t)) {
            return {
                filter: normalizeLogicalOperand(t.filter, normalizePredicate)
            };
        }
        return t;
    });
}
//# sourceMappingURL=transform.js.map