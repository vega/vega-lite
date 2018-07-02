export function getMarkSpecificConfigMixins(markSpecificConfig, channel) {
    var _a;
    var value = markSpecificConfig[channel];
    return value !== undefined ? (_a = {}, _a[channel] = { value: value }, _a) : {};
}
//# sourceMappingURL=common.js.map