"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logical_1 = require("./logical");
var predicate_1 = require("./predicate");
function isFilter(t) {
    return t['filter'] !== undefined;
}
exports.isFilter = isFilter;
function isImputeSequence(t) {
    return t && t['start'] !== undefined && t['stop'] !== undefined;
}
exports.isImputeSequence = isImputeSequence;
function isLookup(t) {
    return t['lookup'] !== undefined;
}
exports.isLookup = isLookup;
function isSample(t) {
    return t['sample'] !== undefined;
}
exports.isSample = isSample;
function isWindow(t) {
    return t['window'] !== undefined;
}
exports.isWindow = isWindow;
function isFlatten(t) {
    return t['flatten'] !== undefined;
}
exports.isFlatten = isFlatten;
function isCalculate(t) {
    return t['calculate'] !== undefined;
}
exports.isCalculate = isCalculate;
function isBin(t) {
    return !!t['bin'];
}
exports.isBin = isBin;
function isImpute(t) {
    return t['impute'] !== undefined;
}
exports.isImpute = isImpute;
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
function isFold(t) {
    return t['fold'] !== undefined;
}
exports.isFold = isFold;
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