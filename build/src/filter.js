"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
function isFieldFilter(filter) {
    return isOneOfFilter(filter) || isEqualFilter(filter) || isRangeFilter(filter);
}
exports.isFieldFilter = isFieldFilter;
/**
 * Converts a filter into an expression.
 */
// model is only used for selection filters.
function expression(model, filterOp, node) {
    return util_1.logicalExpr(filterOp, function (filter) {
        if (util_1.isString(filter)) {
            return filter;
        }
        else if (isSelectionFilter(filter)) {
            return selection_1.predicate(model, filter.selection, node);
        }
        else {
            return fieldFilterExpression(filter);
        }
    });
}
exports.expression = expression;
// This method is used by Voyager.  Do not change its behavior without changing Voyager.
function fieldFilterExpression(filter, useInRange) {
    if (useInRange === void 0) { useInRange = true; }
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
        if (lower !== null && upper !== null && useInRange) {
            return 'inrange(' + fieldExpr + ', [' +
                valueExpr(lower, filter.timeUnit) + ', ' +
                valueExpr(upper, filter.timeUnit) + '])';
        }
        var exprs = [];
        if (lower !== null) {
            exprs.push(fieldExpr + " >= " + valueExpr(lower, filter.timeUnit));
        }
        if (upper !== null) {
            exprs.push(fieldExpr + " <= " + valueExpr(upper, filter.timeUnit));
        }
        return exprs.length > 0 ? exprs.join(' && ') : 'true';
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error("Invalid field filter: " + JSON.stringify(filter));
}
exports.fieldFilterExpression = fieldFilterExpression;
function valueExpr(v, timeUnit) {
    if (datetime_1.isDateTime(v)) {
        var expr = datetime_1.dateTimeExpr(v, true);
        return 'time(' + expr + ')';
    }
    if (timeunit_1.isLocalSingleTimeUnit(timeUnit)) {
        var datetime = {};
        datetime[timeUnit] = v;
        var expr = datetime_1.dateTimeExpr(datetime, true);
        return 'time(' + expr + ')';
    }
    else if (timeunit_1.isUtcSingleTimeUnit(timeUnit)) {
        return valueExpr(v, timeunit_1.getLocalTimeUnit(timeUnit));
    }
    return JSON.stringify(v);
}
function normalizeFilter(f) {
    if (isFieldFilter(f) && f.timeUnit) {
        return tslib_1.__assign({}, f, { timeUnit: timeunit_1.normalizeTimeUnit(f.timeUnit) });
    }
    return f;
}
exports.normalizeFilter = normalizeFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyREFBd0Q7QUFDeEQsdUNBQThEO0FBQzlELHVDQUFpQztBQUVqQyx1Q0FBcUo7QUFDckosK0JBQXNEO0FBa0J0RCwyQkFBa0MsTUFBOEI7SUFDOUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELDhDQUVDO0FBc0JELHVCQUE4QixNQUFXO0lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssS0FBRyxTQUFTLENBQUM7QUFDOUQsQ0FBQztBQUZELHNDQUVDO0FBeUJELHVCQUE4QixNQUFXO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFQRCxzQ0FPQztBQXVCRCx1QkFBOEIsTUFBVztJQUN2QyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQ2pDLGNBQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JCLGNBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMseUJBQXlCO0tBQzdDLENBQUM7QUFDSixDQUFDO0FBTEQsc0NBS0M7QUFFRCx1QkFBOEIsTUFBYztJQUMxQyxNQUFNLENBQUMsYUFBYSxDQUFD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