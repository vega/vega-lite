"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
var util_1 = require("../../util");
function title(legend, fieldDef, config) {
    if (legend.title !== undefined) {
        return legend.title;
    }
    return fielddef_1.title(fieldDef, config);
}
exports.title = title;
function values(legend) {
    var vals = legend.values;
    if (vals && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return datetime_1.timestamp(dt, true);
        });
    }
    return vals;
}
exports.values = values;
function type(legend, fieldDef, channel) {
    if (legend.type) {
        return legend.type;
    }
    if (channel === channel_1.COLOR && !fieldDef.bin && !fieldDef.timeUnit && util_1.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], fieldDef.type)) {
        return 'gradient';
    }
    return undefined;
}
exports.type = type;
//# sourceMappingURL=rules.js.map