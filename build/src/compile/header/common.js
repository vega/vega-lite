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
export function getHeaderProperty(prop, facetFieldDef, config, channel) {
    const headerSpecificConfig = channel === 'row' ? config.headerRow : channel === 'column' ? config.headerColumn : config.headerFacet;
    return getFirstDefined(facetFieldDef && facetFieldDef.header ? facetFieldDef.header[prop] : undefined, headerSpecificConfig[prop], config.header[prop]);
}
export function getHeaderProperties(properties, facetFieldDef, config, channel) {
    const props = {};
    for (const prop of properties) {
        const value = getHeaderProperty(prop, facetFieldDef, config, channel);
        if (value !== undefined) {
            props[prop] = value;
        }
    }
    return props;
}
//# sourceMappingURL=common.js.map