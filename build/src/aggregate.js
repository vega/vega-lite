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
    'ci0',
    'ci1',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FnZ3JlZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1hLFFBQUEsYUFBYSxHQUFrQjtJQUN4QyxRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxTQUFTO0lBQ1QsVUFBVTtJQUNWLEtBQUs7SUFDTCxNQUFNO0lBQ04sU0FBUztJQUNULFVBQVU7SUFDVixXQUFXO0lBQ1gsT0FBTztJQUNQLFFBQVE7SUFDUixRQUFRO0lBQ1IsSUFBSTtJQUNKLElBQUk7SUFDSixLQUFLO0lBQ0wsS0FBSztJQUNMLFVBQVU7SUFDVixLQUFLO0lBQ0wsS0FBSztJQUNMLFFBQVE7SUFDUixRQUFRO0NBQ1gsQ0FBQztBQUVGLDZFQUE2RTtBQUNoRSxRQUFBLE9BQU8sR0FBa0I7SUFDbEMsT0FBTztJQUNQLEtBQUs7SUFDTCxVQUFVO0lBQ1YsT0FBTztJQUNQLFNBQVM7Q0FDWixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLGlCQUFpQixHQUFrQjtJQUM1QyxNQUFNO0lBQ04sU0FBUztJQUNULFFBQVE7SUFDUixJQUFJO0lBQ0osSUFBSTtJQUNKLEtBQUs7SUFDTCxLQUFLO0NBQ1IsQ0FBQyJ9