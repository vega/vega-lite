import { contains, getFirstDefined } from '../../util';
/**
 * Get header channel, which can be different from facet channel when orient is specified or when the facet channel is facet.
 */
export function getHeaderChannel(channel, orient) {
    if (contains(['top', 'bottom'], orient)) {
        return 'column';
    }
    else if (contains(['left', 'right'], orient)) {
        return 'row';
    }
    return channel === 'row' ? 'row' : 'column';
}
export function getHeaderProperty(prop, header, config, channel) {
    const headerSpecificConfig = channel === 'row' ? config.headerRow : channel === 'column' ? config.headerColumn : config.headerFacet;
    return getFirstDefined((header || {})[prop], headerSpecificConfig[prop], config.header[prop]);
}
export function getHeaderProperties(properties, header, config, channel) {
    const props = {};
    for (const prop of properties) {
        const value = getHeaderProperty(prop, header || {}, config, channel);
        if (value !== undefined) {
            props[prop] = value;
        }
    }
    return props;
}
//# sourceMappingURL=common.js.map