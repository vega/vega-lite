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
function isNamedData(data) {
    return !!data['name'] && !isUrlData(data) && !isInlineData(data);
}
exports.isNamedData = isNamedData;
exports.MAIN = 'main';
exports.RAW = 'raw';
//# sourceMappingURL=data.js.map