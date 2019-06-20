"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logical_1 = require("./logical");
var predicate_1 = require("./predicate");
function isFilter(t) {
    return t['filter'] !== undefined;
}
exports.isFilter = isFilter;
function isLookup(t) {
    return t['lookup'] !== undefined;
}
exports.isLookup = isLookup;
function isWindow(t) {
    return t['window'] !== undefined;
}
exports.isWindow = isWindow;
function isCalculate(t) {
    return t['calculate'] !== undefined;
}
exports.isCalculate = isCalculate;
function isBin(t) {
    return !!t['bin'];
}
exports.isBin = isBin;
function isTimeUnit(t) {
    return t['timeUnit'] !== undefined;
}
exports.isTimeUnit = isTimeUnit;
function isAggregate(t) {
    return t['aggregate'] !== undefined;
}
exports.isAggregate = isAggregate;
function isStack(t) {
    return t['stack'] !== undefined;
}
exports.isStack = isStack;
function normalizeTransform(transform) {
    return transform.map(function (t) {
        if (isFilter(t)) {
            return {
                filter: logical_1.normalizeLogicalOperand(t.filter, predicate_1.normalizePredicate)
            };
        }
        return t;
    });
}
exports.normalizeTransform = normalizeTransform;
//# sourceMappingURL=transform.js.map