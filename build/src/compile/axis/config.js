export function getAxisConfig(property, config, channel, orient = '', scaleType) {
    // configTypes to loop, starting from higher precedence
    const configTypes = (scaleType === 'band' ? ['axisBand'] : []).concat([
        channel === 'x' ? 'axisX' : 'axisY',
        'axis' + orient.substr(0, 1).toUpperCase() + orient.substr(1),
        'axis'
    ]);
    for (const configType of configTypes) {
        if (config[configType] && config[configType][property] !== undefined) {
            return config[configType][property];
        }
    }
    return undefined;
}
//# sourceMappingURL=config.js.map