"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGGREGATE_OPS = [
    'values',
    'count',
    'valid',
    'missing',
    'distinct',
    'sum',
    'mean',
    'average',
    'variance',
    'variancep',
    'stdev',
    'stdevp',
    'median',
    'q1',
    'q3',
    'modeskew',
    'min',
    'max',
    'argmin',
    'argmax',
];
/** Additive-based aggregation operations.  These can be applied to stack. */
exports.SUM_OPS = [
    'count',
    'sum',
    'distinct',
    'valid',
    'missing'
];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
exports.SHARED_DOMAIN_OPS = [
    'mean',
    'average',
    'median',
    'q1',
    'q3',
    'min',
    'max',
];
//# sourceMappingURL=aggregate.js.map