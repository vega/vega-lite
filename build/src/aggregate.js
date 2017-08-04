"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
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
    'ci0',
    'ci1',
    'min',
    'max',
    'argmin',
    'argmax',
];
exports.AGGREGATE_OP_INDEX = util_1.toSet(exports.AGGREGATE_OPS);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FnZ3JlZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUF1QztBQVExQixRQUFBLGFBQWEsR0FBa0I7SUFDeEMsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFDVixLQUFLO0lBQ0wsTUFBTTtJQUNOLFNBQVM7SUFDVCxVQUFVO0lBQ1YsV0FBVztJQUNYLE9BQU87SUFDUCxRQUFRO0lBQ1IsUUFBUTtJQUNSLElBQUk7SUFDSixJQUFJO0lBQ0osS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLFFBQVE7SUFDUixRQUFRO0NBQ1gsQ0FBQztBQUVXLFFBQUEsa0JBQWtCLEdBQUcsWUFBSyxDQUFDLHFCQUFhLENBQUMsQ0FBQztBQUUxQyxRQUFBLFlBQVksR0FBa0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUVyRiwrQkFBc0MsU0FBaUI7SUFDckQsTUFBTSxDQUFDLFNBQVMsSUFBSSxlQUFRLENBQUMsb0JBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRkQsc0RBRUM7QUFFRCw2RUFBNkU7QUFDaEUsUUFBQSxPQUFPLEdBQWtCO0lBQ2xDLE9BQU87SUFDUCxLQUFLO0lBQ0wsVUFBVTtJQUNWLE9BQU87SUFDUCxTQUFTO0NBQ1osQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBa0I7SUFDNUMsTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsSUFBSTtJQUNKLElBQUk7SUFDSixLQUFLO0lBQ0wsS0FBSztDQUNSLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFHLFlBQUssQ0FBQyx5QkFBaUIsQ0FBQyxDQUFDIn0=