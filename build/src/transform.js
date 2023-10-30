import { normalizeLogicalComposition } from './logical';
import { normalizePredicate } from './predicate';
export function isFilter(t) {
    return 'filter' in t;
}
export function isImputeSequence(t) {
    return t?.['stop'] !== undefined;
}
export function isLookup(t) {
    return 'lookup' in t;
}
export function isLookupData(from) {
    return 'data' in from;
}
export function isLookupSelection(from) {
    return 'param' in from;
}
export function isPivot(t) {
    return 'pivot' in t;
}
export function isDensity(t) {
    return 'density' in t;
}
export function isQuantile(t) {
    return 'quantile' in t;
}
export function isRegression(t) {
    return 'regression' in t;
}
export function isLoess(t) {
    return 'loess' in t;
}
export function isSample(t) {
    return 'sample' in t;
}
export function isWindow(t) {
    return 'window' in t;
}
export function isJoinAggregate(t) {
    return 'joinaggregate' in t;
}
export function isFlatten(t) {
    return 'flatten' in t;
}
export function isCalculate(t) {
    return 'calculate' in t;
}
export function isBin(t) {
    return 'bin' in t;
}
export function isImpute(t) {
    return 'impute' in t;
}
export function isTimeUnit(t) {
    return 'timeUnit' in t;
}
export function isAggregate(t) {
    return 'aggregate' in t;
}
export function isStack(t) {
    return 'stack' in t;
}
export function isFold(t) {
    return 'fold' in t;
}
export function isExtent(t) {
    return 'extent' in t && !('density' in t);
}
export function normalizeTransform(transform) {
    return transform.map(t => {
        if (isFilter(t)) {
            return {
                filter: normalizeLogicalComposition(t.filter, normalizePredicate)
            };
        }
        return t;
    });
}
//# sourceMappingURL=transform.js.map