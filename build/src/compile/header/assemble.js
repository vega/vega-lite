import { isArray } from 'vega-util';
import { FACET_CHANNELS } from '../../channel';
import { vgField } from '../../channeldef';
import { HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP } from '../../header';
import { isSortField } from '../../sort';
import { isFacetMapping } from '../../spec/facet';
import { contains, keys } from '../../util';
import { defaultLabelAlign, defaultLabelBaseline } from '../axis/properties';
import { formatSignalRef } from '../common';
import { sortArrayIndexField } from '../data/calculate';
import { isFacetModel } from '../model';
import { getHeaderChannel, getHeaderProperties, getHeaderProperty } from './common';
import { HEADER_TYPES } from './component';
// TODO: rename to assembleHeaderTitleGroup
export function assembleTitleGroup(model, channel) {
    const title = model.component.layoutHeaders[channel].title;
    const config = model.config ? model.config : undefined;
    const facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef
        ? model.component.layoutHeaders[channel].facetFieldDef
        : undefined;
    const { titleAnchor, titleAngle, titleOrient } = getHeaderProperties(['titleAnchor', 'titleAngle', 'titleOrient'], facetFieldDef, config, channel);
    const headerChannel = getHeaderChannel(channel, titleOrient);
    return {
        name: `${channel}-title`,
        type: 'group',
        role: `${headerChannel}-title`,
        title: Object.assign({ text: title }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-title' }, defaultHeaderGuideBaseline(titleAngle, headerChannel), defaultHeaderGuideAlign(headerChannel, titleAngle, titleAnchor), assembleHeaderProperties(config, facetFieldDef, channel, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP))
    };
}
export function defaultHeaderGuideAlign(headerChannel, angle, anchor = 'middle') {
    switch (anchor) {
        case 'start':
            return { align: 'left' };
        case 'end':
            return { align: 'right' };
    }
    const align = defaultLabelAlign(angle, headerChannel === 'row' ? 'left' : 'top');
    return align ? { align } : {};
}
export function defaultHeaderGuideBaseline(angle, channel) {
    const baseline = defaultLabelBaseline(angle, channel === 'row' ? 'left' : 'top');
    return baseline ? { baseline } : {};
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
    const { format, labelAngle, labelAnchor, labelOrient } = getHeaderProperties(['format', 'labelAngle', 'labelAnchor', 'labelOrient'], facetFieldDef, config, channel);
    const headerChannel = getHeaderChannel(channel, labelOrient);
    return Object.assign({ text: formatSignalRef(facetFieldDef, format, 'parent', config) }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-label', frame: 'group' }, defaultHeaderGuideBaseline(labelAngle, headerChannel), defaultHeaderGuideAlign(headerChannel, labelAngle, labelAnchor), assembleHeaderProperties(config, facetFieldDef, channel, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP));
}
export function assembleHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt) {
    if (headerCmpt) {
        let title = null;
        const { facetFieldDef } = layoutHeader;
        const config = model.config ? model.config : undefined;
        if (facetFieldDef && headerCmpt.labels) {
            const { labelOrient } = getHeaderProperties(['labelOrient'], facetFieldDef, config, channel);
            // Include label title in the header if orient aligns with the channel
            if ((channel === 'row' && !contains(['top', 'bottom'], labelOrient)) ||
                (channel === 'column' && !contains(['left', 'right'], labelOrient))) {
                title = assembleLabelTitle(facetFieldDef, channel, config);
            }
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
const LAYOUT_TITLE_BAND = {
    column: {
        start: 0,
        end: 1
    },
    row: {
        start: 1,
        end: 0
    }
};
export function getLayoutTitleBand(titleAnchor, headerChannel) {
    return LAYOUT_TITLE_BAND[headerChannel][titleAnchor];
}
export function assembleLayoutTitleBand(headerComponentIndex, config) {
    const titleBand = {};
    for (const channel of FACET_CHANNELS) {
        const headerComponent = headerComponentIndex[channel];
        if (headerComponent && headerComponent.facetFieldDef) {
            const { titleAnchor, titleOrient } = getHeaderProperties(['titleAnchor', 'titleOrient'], headerComponent.facetFieldDef, config, channel);
            const headerChannel = getHeaderChannel(channel, titleOrient);
            const band = getLayoutTitleBand(titleAnchor, headerChannel);
            if (band !== undefined) {
                titleBand[headerChannel] = band;
            }
        }
    }
    return keys(titleBand).length > 0 ? titleBand : undefined;
}
export function assembleHeaderProperties(config, facetFieldDef, channel, properties, propertiesMap) {
    const props = {};
    for (const prop of properties) {
        if (!propertiesMap[prop]) {
            continue;
        }
        const value = getHeaderProperty(prop, facetFieldDef, config, channel);
        if (value !== undefined) {
            props[propertiesMap[prop]] = value;
        }
    }
    return props;
}
//# sourceMappingURL=assemble.js.map