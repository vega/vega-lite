"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
function isSortField(sort) {
    return !!sort && (sort['op'] === 'count' || !!sort['field']) && !!sort['op'];
}
exports.isSortField = isSortField;
function isSortArray(sort) {
    return !!sort && vega_util_1.isArray(sort);
}
exports.isSortArray = isSortArray;
//# sourceMappingURL=sort.js.map