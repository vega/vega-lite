import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { vgField } from '../../fielddef';
import { HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP } from '../../header';
import { isSortField } from '../../sort';
import { keys } from '../../util';
import { formatSignalRef } from '../common';
import { sortArrayIndexField } from '../data/calculate';
export var HEADER_CHANNELS = ['row', 'column'];
export var HEADER_TYPES = ['header', 'footer'];
export function getHeaderType(orient) {
    if (orient === 'top' || orient === 'left') {
        return 'header';
    }
    return 'footer';
}
export function getTitleGroup(model, channel) {
    var title = model.component.layoutHeaders[channel].title;
    var config = model.config ? model.config : undefined;
    var facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef
        ? model.component.layoutHeaders[channel].facetFieldDef
        : undefined;
    return {
        name: channel + "-title",
        type: 'group',
        role: channel + "-title",
        title: tslib_1.__assign({ text: title, offset: 10 }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-title' }, getHeaderProperties(config, facetFieldDef, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP))
    };
}
export function getHeaderGroups(model, channel) {
    var layoutHeader = model.component.layoutHeaders[channel];
    var groups = [];
    for (var _i = 0, HEADER_TYPES_1 = HEADER_TYPES; _i < HEADER_TYPES_1.length; _i++) {
        var headerType = HEADER_TYPES_1[_i];
        if (layoutHeader[headerType]) {
            for (var _a = 0, _b = layoutHeader[headerType]; _a < _b.length; _a++) {
                var headerCmpt = _b[_a];
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
    var sort = facetFieldDef.sort;
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
    var _a;
    if (headerCmpt) {
        var title = null;
        var facetFieldDef = layoutHeader.facetFieldDef;
        if (facetFieldDef && headerCmpt.labels) {
            var _b = facetFieldDef.header, header = _b === void 0 ? {} : _b;
            var format = header.format, labelAngle = header.labelAngle;
            var config = model.config ? model.config : undefined;
            var update = tslib_1.__assign({}, labelAlign(labelAngle));
            title = tslib_1.__assign({ text: formatSignalRef(facetFieldDef, format, 'parent', model.config), offset: 10 }, (channel === 'row' ? { orient: 'left' } : {}), { style: 'guide-label' }, (labelAngle !== undefined ? { angle: labelAngle } : {}), labelBaseline(labelAngle), getHeaderProperties(config, facetFieldDef, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP), (keys(update).length > 0 ? { encode: { update: update } } : {}));
        }
        var axes = headerCmpt.axes;
        var hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            var sizeChannel = channel === 'row' ? 'height' : 'width';
            return tslib_1.__assign({ name: model.getName(channel + "_" + headerType), type: 'group', role: channel + "-" + headerType }, (layoutHeader.facetFieldDef
                ? {
                    from: { data: model.getName(channel + '_domain') },
                    sort: getSort(facetFieldDef, channel)
                }
                : {}), (title ? { title: title } : {}), (headerCmpt.sizeSignal
                ? {
                    encode: {
                        update: (_a = {},
                            _a[sizeChannel] = headerCmpt.sizeSignal,
                            _a)
                    }
                }
                : {}), (hasAxes ? { axes: axes } : {}));
        }
    }
    return null;
}
export function getHeaderProperties(config, facetFieldDef, properties, propertiesMap) {
    var props = {};
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var prop = properties_1[_i];
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