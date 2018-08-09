"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function values(legend, fieldDef) {
    var vals = legend.values;
    if (vals) {
        return fielddef_1.valueArray(fieldDef, vals);
    }
    return undefined;
}
exports.values = values;
function clipHeight(scaleType) {
    if (scale_1.hasContinuousDomain(scaleType)) {
        return 20;
    }
    return undefined;
}
exports.clipHeight = clipHeight;
function labelOverlap(scaleType) {
    if (util_1.contains(['quantile', 'threshold', 'log'], scaleType)) {
        return 'greedy';
    }
    return undefined;
}
exports.labelOverlap = labelOverlap;
//# sourceMappingURL=properties.js.map