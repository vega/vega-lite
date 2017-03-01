/*
 * Constants and utilities for data.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUrlData(data) {
    return !!data['url'];
}
exports.isUrlData = isUrlData;
function isInlineData(data) {
    return !!data['values'];
}
exports.isInlineData = isInlineData;
exports.SUMMARY = 'summary';
exports.SOURCE = 'source';
exports.STACKED = 'stacked';
exports.LAYOUT = 'layout';
//# sourceMappingURL=data.js.map