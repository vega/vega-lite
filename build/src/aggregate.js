import { isString } from 'vega-util';
import { contains } from './util';
const AGGREGATE_OP_INDEX = {
    argmax: 1,
    argmin: 1,
    average: 1,
    count: 1,
    distinct: 1,
    product: 1,
    max: 1,
    mean: 1,
    median: 1,
    min: 1,
    missing: 1,
    q1: 1,
    q3: 1,
    ci0: 1,
    ci1: 1,
    stderr: 1,
    stdev: 1,
    stdevp: 1,
    sum: 1,
    valid: 1,
    values: 1,
    variance: 1,
    variancep: 1
};
export const MULTIDOMAIN_SORT_OP_INDEX = {
    count: 1,
    min: 1,
    max: 1
};
export function isArgminDef(a) {
    return !!a && !!a['argmin'];
}
export function isArgmaxDef(a) {
    return !!a && !!a['argmax'];
}
export function isAggregateOp(a) {
    return isString(a) && !!AGGREGATE_OP_INDEX[a];
}
export const COUNTING_OPS = new Set([
    'count',
    'valid',
    'missing',
    'distinct'
]);
export function isCountingAggregateOp(aggregate) {
    return isString(aggregate) && COUNTING_OPS.has(aggregate);
}
export function isMinMaxOp(aggregate) {
    return isString(aggregate) && contains(['min', 'max'], aggregate);
}
/** Additive-based aggregation operations. These can be applied to stack. */
export const SUM_OPS = new Set([
    'count',
    'sum',
    'distinct',
    'valid',
    'missing'
]);
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export const SHARED_DOMAIN_OPS = new Set([
    'mean',
    'average',
    'median',
    'q1',
    'q3',
    'min',
    'max'
]);
//# sourceMappingURL=aggregate.js.map