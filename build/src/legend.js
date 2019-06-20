"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("./util");
exports.defaultLegendConfig = {};
var COMMON_LEGEND_PROPERTY_INDEX = {
    entryPadding: 1,
    format: 1,
    offset: 1,
    orient: 1,
    padding: 1,
    tickCount: 1,
    title: 1,
    type: 1,
    values: 1,
    zindex: 1
};
var VG_LEGEND_PROPERTY_INDEX = tslib_1.__assign({}, COMMON_LEGEND_PROPERTY_INDEX, { 
    // channel scales
    opacity: 1, shape: 1, stroke: 1, fill: 1, size: 1, 
    // encode
    encode: 1 });
exports.LEGEND_PROPERTIES = util_1.flagKeys(COMMON_LEGEND_PROPERTY_INDEX);
exports.VG_LEGEND_PROPERTIES = util_1.flagKeys(VG_LEGEND_PROPERTY_INDEX);
//# sourceMappingURL=legend.js.map