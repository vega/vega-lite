export function getAxisConfig(property, config, channel, orient, scaleType) {
    if (orient === void 0) { orient = ''; }
    // configTypes to loop, starting from higher precedence
    var configTypes = (scaleType === 'band' ? ['axisBand'] : []).concat([
        channel === 'x' ? 'axisX' : 'axisY',
        'axis' + orient.substr(0, 1).toUpperCase() + orient.substr(1),
        'axis'
    ]);
    for (var _i = 0, configTypes_1 = configTypes; _i < configTypes_1.length; _i++) {
        var configType = configTypes_1[_i];
        if (config[configType] && config[configType][property] !== undefined) {
            return config[configType][property];
        }
    }
    return undefined;
}
//# sourceMappingURL=config.js.map