import { toSet } from 'vega-util';
import { contains, flagKeys } from './util';
const AGGREGATE_OP_INDEX = {
    argmax: 1,
    argmin: 1,
    average: 1,
    count: 1,
    distinct: 1,
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
export const AGGREGATE_OPS = flagKeys(AGGREGATE_OP_INDEX);
export function isAggregateOp(a) {
    return !!AGGREGATE_OP_INDEX[a];
}
export const COUNTING_OPS = ['count', 'valid', 'missing', 'distinct'];
export function isCountingAggregateOp(aggregate) {
    return aggregate && contains(COUNTING_OPS, aggregate);
}
export function isMinMaxOp(aggregate) {
    return aggregate && contains(['min', 'max'], aggregate);
}
/** Additive-based aggregation operations.  These can be applied to stack. */
export const SUM_OPS = ['count', 'sum', 'distinct', 'valid', 'missing'];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export const SHARED_DOMAIN_OPS = ['mean', 'average', 'median', 'q1', 'q3', 'min', 'max'];
export const SHARED_DOMAIN_OP_INDEX = toSet(SHARED_DOMAIN_OPS);
//# sourceMappingURL=aggregate.js.map