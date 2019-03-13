import { isArray } from 'vega-util';
import { FACET_CHANNELS } from '../../channel';
import { vgField } from '../../fielddef';
import { HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP } from '../../header';
import { isSortField } from '../../sort';
import { isFacetMapping } from '../../spec/facet';
import { keys } from '../../util';
import { defaultLabelAlign, defaultLabelBaseline } from '../axis/properties';
import { formatSignalRef } from '../common';
import { sortArrayIndexField } from '../data/calculate';
import { isFacetModel } from '../model';
import { HEADER_TYPES } from './component';
// TODO: rename to assembleHeaderTitleGroup
export function assembleTitleGroup(model, channel) {
    const title = model.component.layoutHeaders[channel].title;
    const config = model.config ? model.config : undefined;
    const facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef
        ? model.component.layoutHeaders[channel].facetFieldDef
        : undefined;
    const titleAnchor = (facetFieldDef && facetFieldDef.header && facetFieldDef.header.titleAnchor) || undefined;
    return {
        name: `${channel}-title`,
        type: 'group',
        role: `${channel === 'facet' ? 'column' : channel}-title`,
        title: Object.assign({ text: title }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-title' }, titleAlign(titleAnchor), getHeaderProperties(config, facetFieldDef, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP))
    };
}
export function titleAlign(titleAnchor) {
    switch (titleAnchor) {
        case 'start':
            return { align: 'left' };
        case 'end':
            return { align: 'right' };
    }
    // TODO: take TitleAngle into account for the "middle" case
    return {};
}
export function assembleHeaderGroups(model, channel) {
    const layoutHeader = model.component.layoutHeaders[channel];
    const groups = [];
    for (const headerType of HEADER_TYPES) {
        if (layoutHeader[headerType]) {
            for (const headerCmpt of layoutHeader[headerType]) {
                groups.push(assembleHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt));
            }
        }
    }
    return groups;
}
export function labelAlign(angle, channel) {
    const align = defaultLabelAlign(angle, channel === 'row' ? 'left' : 'top');
    return align ? { align } : {};
}
export function labelBaseline(angle, channel) {
    const baseline = defaultLabelBaseline(angle, channel === 'row' ? 'left' : 'top');
    return baseline ? { baseline } : {};
}
function getSort(facetFieldDef, channel) {
    const { sort } = facetFieldDef;
    if (isSortField(sort)) {
        return {
            field: vgField(sort, { expr: 'datum' }),
            order: sort.order || 'ascending'
        };
    }
    else if (isArray(sort)) {
        return {
            field: sortArrayIndexField(facetFieldDef, channel, { expr: 'datum' }),
            order: 'ascending'
        };
    }
    else {
        return {
            field: vgField(facetFieldDef, { expr: 'datum' }),
            order: sort || 'ascending'
        };
    }
}
export function assembleLabelTitle(facetFieldDef, channel, config) {
    const { header = {} } = facetFieldDef;
    const { format, labelAngle } = header;
    return Object.assign({ text: formatSignalRef(facetFieldDef, format, 'parent', config) }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-label', frame: 'group' }, labelBaseline(labelAngle, channel), labelAlign(labelAngle, channel), getHeaderProperties(config, facetFieldDef, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP));
}
export function assembleHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt) {
    if (headerCmpt) {
        let title = null;
        const { facetFieldDef } = layoutHeader;
        const config = model.config ? model.config : undefined;
        if (facetFieldDef && headerCmpt.labels) {
            title = assembleLabelTitle(facetFieldDef, channel, config);
        }
        const isFacetWithoutRowCol = isFacetModel(model) && !isFacetMapping(model.facet);
        const axes = headerCmpt.axes;
        const hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            const sizeChannel = channel === 'row' ? 'height' : 'width';
            return Object.assign({ name: model.getName(`${channel}_${headerType}`), type: 'group', role: `${channel}-${headerType}` }, (layoutHeader.facetFieldDef
                ? {
                    from: { data: model.getName(channel + '_domain') },
                    sort: getSort(facetFieldDef, channel)
                }
                : {}), (hasAxes && isFacetWithoutRowCol
                ? {
                    from: { data: model.getName(`facet_domain_${channel}`) }
                }
                : {}), (title ? { title } : {}), (headerCmpt.sizeSignal
                ? {
                    encode: {
                        update: {
                            [sizeChannel]: headerCmpt.sizeSignal
                        }
                    }
                }
                : {}), (hasAxes ? { axes } : {}));
        }
    }
    return null;
}
export function getLayoutTitleBand(titleAnchor) {
    if (titleAnchor === 'start') {
        return 0;
    }
    else if (titleAnchor === 'end') {
        return 1;
    }
    return undefined;
}
export function assembleLayoutTitleBand(headerComponentIndex) {
    const titleBand = {};
    for (const channel of FACET_CHANNELS) {
        const headerComponent = headerComponentIndex[channel];
        if (headerComponent && headerComponent.facetFieldDef && headerComponent.facetFieldDef.header) {
            const { titleAnchor } = headerComponent.facetFieldDef.header;
            const band = getLayoutTitleBand(titleAnchor);
            if (band !== undefined) {
                titleBand[channel === 'facet' ? 'column' : channel] = band;
            }
        }
    }
    return keys(titleBand).length > 0 ? titleBand : undefined;
}
export function getHeaderProperties(config, facetFieldDef, properties, propertiesMap) {
    const props = {};
    for (const prop of properties) {
        if (!propertiesMap[prop]) {
            continue;
        }
        if (config && config.header) {
            if (config.header[prop] !== undefined) {
                props[propertiesMap[prop]] = config.header[prop];
            }
        }
        if (facetFieldDef && facetFieldDef.header) {
            if (facetFieldDef.header[prop] !== undefined) {
                props[propertiesMap[prop]] = facetFieldDef.header[prop];
            }
        }
    }
    return props;
}
//# sourceMappingURL=assemble.js.map