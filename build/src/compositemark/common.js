"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMarkSpecificConfigMixins(markSpecificConfig, channel) {
    var _a;
    var value = markSpecificConfig[channel];
    return value !== undefined ? (_a = {}, _a[channel] = { value: value }, _a) : {};
}
exports.getMarkSpecificConfigMixins = getMarkSpecificConfigMixins;
//# sourceMappingURL=common.js.map