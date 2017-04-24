"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("./compile/selection/selection");
var datetime_1 = require("./datetime");
var fielddef_1 = require("./fielddef");
var timeunit_1 = require("./timeunit");
var util_1 = require("./util");
function isSelectionFilter(filter) {
    return filter && filter['selection'];
}
exports.isSelectionFilter = isSelectionFilter;
function isEqualFilter(filter) {
    return filter && !!filter.field && filter.equal !== undefined;
}
exports.isEqualFilter = isEqualFilter;
function isRangeFilter(filter) {
    if (filter && filter.field) {
        if (util_1.isArray(filter.range) && filter.range.length === 2) {
            return true;
        }
    }
    return false;
}
exports.isRangeFilter = isRangeFilter;
function isOneOfFilter(filter) {
    return filter && !!filter.field && (util_1.isArray(filter.oneOf) ||
        util_1.isArray(filter.in) // backward compatibility
    );
}
exports.isOneOfFilter = isOneOfFilter;
/**
 * Converts a filter into an expression.
 */
// model is only used for selection filters.
function expression(model, filter) {
    if (util_1.isString(filter)) {
        return filter;
    }
    else if (isSelectionFilter(filter)) {
        var selection = model.getComponent('selection', filter.selection);
        return selection_1.predicate(filter.selection, selection.type, selection.resolve, null, null);
    }
    else {
        var fieldExpr = filter.timeUnit ?
            // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
            // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
            // TODO: support utc
            ('time(' + timeunit_1.fieldExpr(filter.timeUnit, filter.field) + ')') :
            fielddef_1.field(filter, { expr: 'datum' });
        if (isEqualFilter(filter)) {
            return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
        }
        else if (isOneOfFilter(filter)) {
            // "oneOf" was formerly "in" -- so we need to add backward compatibility
            var oneOf = filter.oneOf || filter['in'];
            return 'indexof([' +
                oneOf.map(function (v) { return valueExpr(v, filter.timeUnit); }).join(',') +
                '], ' + fieldExpr + ') !== -1';
        }
        else if (isRangeFilter(filter)) {
            var lower = filter.range[0];
            var upper = filter.range[1];
            if (lower !== null && upper !== null) {
                return 'inrange(' + fieldExpr + ', ' +
                    valueExpr(lower, filter.timeUnit) + ', ' +
                    valueExpr(upper, filter.timeUnit) + ')';
            }
            else if (lower !== null) {
                return fieldExpr + ' >= ' + lower;
            }
            else if (upper !== null) {
                return fieldExpr + ' <= ' + upper;
            }
        }
    }
    return undefined;
}
exports.expression = expression;
function valueExpr(v, timeUnit) {
    if (datetime_1.isDateTime(v)) {
        var expr = datetime_1.dateTimeExpr(v, true);
        return 'time(' + expr + ')';
    }
    if (timeunit_1.isSingleTimeUnit(timeUnit)) {
        var datetime = {};
        datetime[timeUnit] = v;
        var expr = datetime_1.dateTimeExpr(datetime, true);
        return 'time(' + expr + ')';
    }
    return JSON.stringify(v);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJEQUF3RDtBQUN4RCx1Q0FBOEQ7QUFDOUQsdUNBQWlDO0FBQ2pDLHVDQUFzRjtBQUN0RiwrQkFBeUM7QUFXekMsMkJBQWtDLE1BQWM7SUFDOUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELDhDQUVDO0FBc0JELHVCQUE4QixNQUFXO0lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssS0FBRyxTQUFTLENBQUM7QUFDOUQsQ0FBQztBQUZELHNDQUVDO0FBeUJELHVCQUE4QixNQUFXO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFQRCxzQ0FPQztBQXVCRCx1QkFBOEIsTUFBVztJQUN2QyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQ2pDLGNBQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JCLGNBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMseUJBQXlCO0tBQzdDLENBQUM7QUFDSixDQUFDO0FBTEQsc0NBS0M7QUFFRDs7R0FFRztBQUNILDRDQUE0QztBQUM1QyxvQkFBMkIsS0FBWSxFQUFF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