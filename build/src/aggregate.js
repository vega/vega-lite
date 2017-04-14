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
    'modeskew',
    'min',
    'max',
    'argmin',
    'argmax',
];
exports.AGGREGATE_OP_INDEX = util_1.toSet(exports.AGGREGATE_OPS);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FnZ3JlZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE2QjtBQU1oQixRQUFBLGFBQWEsR0FBa0I7SUFDeEMsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFDVixLQUFLO0lBQ0wsTUFBTTtJQUNOLFNBQVM7SUFDVCxVQUFVO0lBQ1YsV0FBVztJQUNYLE9BQU87SUFDUCxRQUFRO0lBQ1IsUUFBUTtJQUNSLElBQUk7SUFDSixJQUFJO0lBQ0osS0FBSztJQUNMLEtBQUs7SUFDTCxVQUFVO0lBQ1YsS0FBSztJQUNMLEtBQUs7SUFDTCxRQUFRO0lBQ1IsUUFBUTtDQUNYLENBQUM7QUFFVyxRQUFBLGtCQUFrQixHQUFHLFlBQUssQ0FBQyxxQkFBYSxDQUFDLENBQUM7QUFFdkQsNkVBQTZFO0FBQ2hFLFFBQUEsT0FBTyxHQUFrQjtJQUNsQyxPQUFPO0lBQ1AsS0FBSztJQUNMLFVBQVU7SUFDVixPQUFPO0lBQ1AsU0FBUztDQUNaLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsaUJBQWlCLEdBQWtCO0lBQzVDLE1BQU07SUFDTixTQUFTO0lBQ1QsUUFBUTtJQUNSLElBQUk7SUFDSixJQUFJO0lBQ0osS0FBSztJQUNMLEtBQUs7Q0FDUixDQUFDIn0=