"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var selection_1 = require("./compile/selection/selection");
var fielddef_1 = require("./fielddef");
var timeunit_1 = require("./timeunit");
var util_1 = require("./util");
function isSelectionPredicate(predicate) {
    return predicate && predicate['selection'];
}
exports.isSelectionPredicate = isSelectionPredicate;
function isFieldEqualPredicate(predicate) {
    return predicate && !!predicate.field && predicate.equal !== undefined;
}
exports.isFieldEqualPredicate = isFieldEqualPredicate;
function isFieldLTPredicate(predicate) {
    return predicate && !!predicate.field && predicate.lt !== undefined;
}
exports.isFieldLTPredicate = isFieldLTPredicate;
function isFieldLTEPredicate(predicate) {
    return predicate && !!predicate.field && predicate.lte !== undefined;
}
exports.isFieldLTEPredicate = isFieldLTEPredicate;
function isFieldGTPredicate(predicate) {
    return predicate && !!predicate.field && predicate.gt !== undefined;
}
exports.isFieldGTPredicate = isFieldGTPredicate;
function isFieldGTEPredicate(predicate) {
    return predicate && !!predicate.field && predicate.gte !== undefined;
}
exports.isFieldGTEPredicate = isFieldGTEPredicate;
function isFieldRangePredicate(predicate) {
    if (predicate && predicate.field) {
        if (vega_util_1.isArray(predicate.range) && predicate.range.length === 2) {
            return true;
        }
    }
    return false;
}
exports.isFieldRangePredicate = isFieldRangePredicate;
function isFieldOneOfPredicate(predicate) {
    return predicate && !!predicate.field && (vega_util_1.isArray(predicate.oneOf) ||
        vega_util_1.isArray(predicate.in) // backward compatibility
    );
}
exports.isFieldOneOfPredicate = isFieldOneOfPredicate;
function isFieldPredicate(predicate) {
    return isFieldOneOfPredicate(predicate) || isFieldEqualPredicate(predicate) || isFieldRangePredicate(predicate) || isFieldLTPredicate(predicate) || isFieldGTPredicate(predicate) || isFieldLTEPredicate(predicate) || isFieldGTEPredicate(predicate);
}
exports.isFieldPredicate = isFieldPredicate;
/**
 * Converts a predicate into an expression.
 */
// model is only used for selection filters.
function expression(model, filterOp, node) {
    return util_1.logicalExpr(filterOp, function (predicate) {
        if (vega_util_1.isString(predicate)) {
            return predicate;
        }
        else if (isSelectionPredicate(predicate)) {
            return selection_1.selectionPredicate(model, predicate.selection, node);
        }
        else { // Filter Object
            return fieldFilterExpression(predicate);
        }
    });
}
exports.expression = expression;
function predicateValueExpr(v, timeUnit) {
    return fielddef_1.valueExpr(v, { timeUnit: timeUnit, time: true });
}
function predicateValuesExpr(vals, timeUnit) {
    return vals.map(function (v) { return predicateValueExpr(v, timeUnit); });
}
// This method is used by Voyager.  Do not change its behavior without changing Voyager.
function fieldFilterExpression(predicate, useInRange) {
    if (useInRange === void 0) { useInRange = true; }
    var field = predicate.field, timeUnit = predicate.timeUnit;
    var fieldExpr = timeUnit ?
        // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
        // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
        // TODO: support utc
        ('time(' + timeunit_1.fieldExpr(timeUnit, field) + ')') :
        fielddef_1.vgField(predicate, { expr: 'datum' });
    if (isFieldEqualPredicate(predicate)) {
        return fieldExpr + '===' + predicateValueExpr(predicate.equal, timeUnit);
    }
    else if (isFieldLTPredicate(predicate)) {
        var upper = predicate.lt;
        return fieldExpr + "<" + predicateValueExpr(upper, timeUnit);
    }
    else if (isFieldGTPredicate(predicate)) {
        var lower = predicate.gt;
        return fieldExpr + ">" + predicateValueExpr(lower, timeUnit);
    }
    else if (isFieldLTEPredicate(predicate)) {
        var upper = predicate.lte;
        return fieldExpr + "<=" + predicateValueExpr(upper, timeUnit);
    }
    else if (isFieldGTEPredicate(predicate)) {
        var lower = predicate.gte;
        return fieldExpr + ">=" + predicateValueExpr(lower, timeUnit);
    }
    else if (isFieldOneOfPredicate(predicate)) {
        // "oneOf" was formerly "in" -- so we need to add backward compatibility
        var oneOf = predicate.oneOf;
        oneOf = oneOf || predicate['in'];
        return 'indexof([' +
            predicateValuesExpr(oneOf, timeUnit).join(',') +
            '], ' + fieldExpr + ') !== -1';
    }
    else if (isFieldRangePredicate(predicate)) {
        var lower = predicate.range[0];
        var upper = predicate.range[1];
        if (lower !== null && upper !== null && useInRange) {
            return 'inrange(' + fieldExpr + ', [' +
                predicateValueExpr(lower, timeUnit) + ', ' +
                predicateValueExpr(upper, timeUnit) + '])';
        }
        var exprs = [];
        if (lower !== null) {
            exprs.push(fieldExpr + " >= " + predicateValueExpr(lower, timeUnit));
        }
        if (upper !== null) {
            exprs.push(fieldExpr + " <= " + predicateValueExpr(upper, timeUnit));
        }
        return exprs.length > 0 ? exprs.join(' && ') : 'true';
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error("Invalid field predicate: " + JSON.stringify(predicate));
}
exports.fieldFilterExpression = fieldFilterExpression;
function normalizePredicate(f) {
    if (isFieldPredicate(f) && f.timeUnit) {
        return tslib_1.__assign({}, f, { timeUnit: timeunit_1.normalizeTimeUnit(f.timeUnit) });
    }
    return f;
}
exports.normalizePredicate = normalizePredicate;
//# sourceMappingURL=predicate.js.map