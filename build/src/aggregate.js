"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var AGGREGATE_OP_INDEX = {
    values: 1,
    count: 1,
    valid: 1,
    missing: 1,
    distinct: 1,
    sum: 1,
    mean: 1,
    average: 1,
    variance: 1,
    variancep: 1,
    stdev: 1,
    stdevp: 1,
    median: 1,
    q1: 1,
    q3: 1,
    ci0: 1,
    ci1: 1,
    min: 1,
    max: 1,
    argmin: 1,
    argmax: 1,
};
exports.AGGREGATE_OPS = util_1.flagKeys(AGGREGATE_OP_INDEX);
function isAggregateOp(a) {
    return !!AGGREGATE_OP_INDEX[a];
}
exports.isAggregateOp = isAggregateOp;
exports.COUNTING_OPS = ['count', 'valid', 'missing', 'distinct'];
function isCountingAggregateOp(aggregate) {
    return aggregate && util_1.contains(exports.COUNTING_OPS, aggregate);
}
exports.isCountingAggregateOp = isCountingAggregateOp;
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
exports.SHARED_DOMAIN_OP_INDEX = util_1.toSet(exports.SHARED_DOMAIN_OPS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FnZ3JlZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUF1RDtBQVN2RCxJQUFNLGtCQUFrQixHQUFzQjtJQUM1QyxNQUFNLEVBQUUsQ0FBQztJQUNULEtBQUssRUFBRSxDQUFDO0lBQ1IsS0FBSyxFQUFFLENBQUM7SUFDUixPQUFPLEVBQUUsQ0FBQztJQUNWLFFBQVEsRUFBRSxDQUFDO0lBQ1gsR0FBRyxFQUFFLENBQUM7SUFDTixJQUFJLEVBQUUsQ0FBQztJQUNQLE9BQU8sRUFBRSxDQUFDO0lBQ1YsUUFBUSxFQUFFLENBQUM7SUFDWCxTQUFTLEVBQUUsQ0FBQztJQUNaLEtBQUssRUFBRSxDQUFDO0lBQ1IsTUFBTSxFQUFFLENBQUM7SUFDVCxNQUFNLEVBQUUsQ0FBQztJQUNULEVBQUUsRUFBRSxDQUFDO0lBQ0wsRUFBRSxFQUFFLENBQUM7SUFDTCxHQUFHLEVBQUUsQ0FBQztJQUNOLEdBQUcsRUFBRSxDQUFDO0lBQ04sR0FBRyxFQUFFLENBQUM7SUFDTixHQUFHLEVBQUUsQ0FBQztJQUNOLE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDO0FBRVcsUUFBQSxhQUFhLEdBQUcsZUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFMUQsdUJBQThCLENBQVM7SUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRkQsc0NBRUM7QUFFWSxRQUFBLFlBQVksR0FBa0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUVyRiwrQkFBc0MsU0FBaUI7SUFDckQsTUFBTSxDQUFDLFNBQVMsSUFBSSxlQUFRLENBQUMsb0JBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRkQsc0RBRUM7QUFFRCw2RUFBNkU7QUFDaEUsUUFBQSxPQUFPLEdBQWtCO0lBQ2xDLE9BQU87SUFDUCxLQUFLO0lBQ0wsVUFBVTtJQUNWLE9BQU87SUFDUCxTQUFTO0NBQ1osQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBa0I7SUFDNUMsTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsSUFBSTtJQUNKLElBQUk7SUFDSixLQUFLO0lBQ0wsS0FBSztDQUNSLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFHLFlBQUssQ0FBQyx5QkFBaUIsQ0FBQyxDQUFDIn0=