"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
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
function type(t, channel, scaleType) {
    if (channel_1.isColorChannel(channel) && ((t === 'quantitative' && !scale_1.isBinScale(scaleType)) ||
        (t === 'temporal' && util_1.contains(['time', 'utc'], scaleType)))) {
        return 'gradient';
    }
    return undefined;
}
exports.type = type;
//# sourceMappingURL=properties.js.map