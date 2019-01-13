import { isArray } from 'vega-util';
import { vgField } from '../../fielddef';
import { HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP } from '../../header';
import { isSortField } from '../../sort';
import { keys } from '../../util';
import { formatSignalRef } from '../common';
import { sortArrayIndexField } from '../data/calculate';
export const HEADER_CHANNELS = ['row', 'column'];
export const HEADER_TYPES = ['header', 'footer'];
export function getHeaderType(orient) {
    if (orient === 'top' || orient === 'left') {
        return 'header';
    }
    return 'footer';
}
export function getTitleGroup(model, channel) {
    const title = model.component.layoutHeaders[channel].title;
    const config = model.config ? model.config : undefined;
    const facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef
        ? model.component.layoutHeaders[channel].facetFieldDef
        : undefined;
    return {
        name: `${channel}-title`,
        type: 'group',
        role: `${channel}-title`,
        title: Object.assign({ text: title, offset: 10 }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-title' }, getHeaderProperties(config, facetFieldDef, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP))
    };
}
export function getHeaderGroups(model, channel) {
    const layoutHeader = model.component.layoutHeaders[channel];
    const groups = [];
    for (const headerType of HEADER_TYPES) {
        if (layoutHeader[headerType]) {
            for (const headerCmpt of layoutHeader[headerType]) {
                groups.push(getHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt));
            }
        }
    }
    return groups;
}
// 0, (0,90), 90, (90, 180), 180, (180, 270), 270, (270, 0)
export function labelAlign(angle) {
    // to keep angle in [0, 360)
    angle = ((angle % 360) + 360) % 360;
    if ((angle + 90) % 180 === 0) {
        // for 90 and 270
        return {}; // default center
    }
    else if (angle < 90 || 270 < angle) {
        return { align: { value: 'right' } };
    }
    else if (135 <= angle && angle < 225) {
        return { align: { value: 'left' } };
    }
    return {};
}
export function labelBaseline(angle) {
    // to keep angle in [0, 360)
    angle = ((angle % 360) + 360) % 360;
    if (45 <= angle && angle <= 135) {
        return { baseline: 'top' };
    }
    return { baseline: 'middle' };
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
export function getHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt) {
    if (headerCmpt) {
        let title = null;
        const { facetFieldDef } = layoutHeader;
        if (facetFieldDef && headerCmpt.labels) {
            const { header = {} } = facetFieldDef;
            const { format, labelAngle } = header;
            const config = model.config ? model.config : undefined;
            const update = Object.assign({}, labelAlign(labelAngle));
            title = Object.assign({ text: formatSignalRef(facetFieldDef, format, 'parent', model.config), offset: 10 }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-label' }, (labelAngle !== undefined ? { angle: labelAngle } : {}), labelBaseline(labelAngle), getHeaderProperties(config, facetFieldDef, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP), (keys(update).length > 0 ? { encode: { update } } : {}));
        }
        const axes = headerCmpt.axes;
        const hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            const sizeChannel = channel === 'row' ? 'height' : 'width';
            return Object.assign({ name: model.getName(`${channel}_${headerType}`), type: 'group', role: `${channel}-${headerType}` }, (layoutHeader.facetFieldDef
                ? {
                    from: { data: model.getName(channel + '_domain') },
                    sort: getSort(facetFieldDef, channel)
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
export function getHeaderProperties(config, facetFieldDef, properties, propertiesMap) {
    const props = {};
    for (const prop of properties) {
        if (config && config.header) {
            if (config.header[prop]) {
                props[propertiesMap[prop]] = config.header[prop];
            }
        }
        if (facetFieldDef && facetFieldDef.header) {
            if (facetFieldDef.header[prop]) {
                props[propertiesMap[prop]] = facetFieldDef.header[prop];
            }
        }
    }
    return props;
}
//# sourceMappingURL=index.js.map