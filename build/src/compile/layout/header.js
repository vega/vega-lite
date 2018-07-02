import * as tslib_1 from "tslib";
import { vgField } from '../../fielddef';
import { isSortField } from '../../sort';
import { keys } from '../../util';
import { formatSignalRef } from '../common';
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
    var textOrient = channel === 'row' ? 'vertical' : undefined;
    var update = tslib_1.__assign({ align: { value: 'center' }, text: { value: title } }, (textOrient === 'vertical' ? { angle: { value: 270 } } : {}));
    return {
        name: model.getName(channel + "_title"),
        role: channel + "-title",
        type: 'group',
        marks: [tslib_1.__assign({ type: 'text', role: channel + "-title-text", style: 'guide-title' }, (keys(update).length > 0 ? { encode: { update: update } } : {}))]
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
    if ((angle + 90) % 180 === 0) { // for 90 and 270
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
        return { baseline: { value: 'top' } };
    }
    return { baseline: { value: 'middle' } };
}
function getSort(facetFieldDef) {
    var sort = facetFieldDef.sort;
    if (isSortField(sort)) {
        return {
            field: vgField(sort, { expr: 'datum' }),
            order: sort.order || 'ascending'
        };
    }
    else {
        return {
            field: vgField(facetFieldDef, { expr: 'datum' }),
            order: sort || 'ascending'
        };
    }
}
function getHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt) {
    var _a;
    if (headerCmpt) {
        var title = null;
        var facetFieldDef = layoutHeader.facetFieldDef;
        if (facetFieldDef && headerCmpt.labels) {
            var _b = facetFieldDef.header, header = _b === void 0 ? {} : _b;
            var format = header.format, labelAngle = header.labelAngle;
            var update = tslib_1.__assign({}, (labelAngle !== undefined ? { angle: { value: labelAngle } } : {}), labelAlign(labelAngle), labelBaseline(labelAngle));
            title = tslib_1.__assign({ text: formatSignalRef(facetFieldDef, format, 'parent', model.config), offset: 10, orient: channel === 'row' ? 'left' : 'top', style: 'guide-label' }, (keys(update).length > 0 ? { encode: { update: update } } : {}));
        }
        var axes = headerCmpt.axes;
        var hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            var sizeChannel = channel === 'row' ? 'height' : 'width';
            return tslib_1.__assign({ name: model.getName(channel + "_" + headerType), type: 'group', role: channel + "-" + headerType }, (layoutHeader.facetFieldDef ? {
                from: { data: model.getName(channel + '_domain') },
                sort: getSort(facetFieldDef)
            } : {}), (title ? { title: title } : {}), (headerCmpt.sizeSignal ? {
                encode: {
                    update: (_a = {},
                        _a[sizeChannel] = headerCmpt.sizeSignal,
                        _a)
                }
            } : {}), (hasAxes ? { axes: axes } : {}));
        }
    }
    return null;
}
//# sourceMappingURL=header.js.map