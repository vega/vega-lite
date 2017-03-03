"use strict";
var datetime_1 = require("./datetime");
var fielddef_1 = require("./fielddef");
var timeunit_1 = require("./timeunit");
var util_1 = require("./util");
function isEqualFilter(filter) {
    return filter && !!filter.field && filter.equal !== undefined;
}
exports.isEqualFilter = isEqualFilter;
function isRangeFilter(filter) {
    if (filter && !!filter.field) {
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
function expression(filter) {
    if (util_1.isString(filter)) {
        return filter;
    }
    else {
        var fieldExpr = filter.timeUnit ?
            // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
            // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
            // TODO: support utc
            ('time(' + timeunit_1.fieldExpr(filter.timeUnit, filter.field) + ')') :
            fielddef_1.field(filter, { datum: true });
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
//# sourceMappingURL=filter.js.map