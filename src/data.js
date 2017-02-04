/*
 * Constants and utilities for data.
 */
"use strict";
function isUrlData(data) {
    return !!data['url'];
}
exports.isUrlData = isUrlData;
function isInlineData(data) {
    return !!data['values'];
}
exports.isInlineData = isInlineData;
function isInternalData(data) {
    return !!data['ref'];
}
exports.isInternalData = isInternalData;
exports.SUMMARY = 'summary';
exports.SOURCE = 'source';
exports.STACKED = 'stacked';
exports.LAYOUT = 'layout';
//# sourceMappingURL=data.js.map