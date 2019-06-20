"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Utility for generating row / column headers
 */
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../../fielddef");
var header_1 = require("../../header");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
var calculate_1 = require("../data/calculate");
exports.HEADER_CHANNELS = ['row', 'column'];
exports.HEADER_TYPES = ['header', 'footer'];
function getHeaderType(orient) {
    if (orient === 'top' || orient === 'left') {
        return 'header';
    }
    return 'footer';
}
exports.getHeaderType = getHeaderType;
function getTitleGroup(model, channel) {
    var title = model.component.layoutHeaders[channel].title;
    var textOrient = channel === 'row' ? 'left' : undefined;
    var config = model.config ? model.config : undefined;
    var facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef ? model.component.layoutHeaders[channel].facetFieldDef : undefined;
    return {
        name: channel + "-title",
        type: 'group',
        role: channel + "-title",
        title: tslib_1.__assign({ text: title, offset: 10, orient: textOrient, style: 'guide-title' }, getHeaderProperties(config, facetFieldDef, header_1.HEADER_TITLE_PROPERTIES, header_1.HEADER_TITLE_PROPERTIES_MAP))
    };
}
exports.getTitleGroup = getTitleGroup;
function getHeaderGroups(model, channel) {
    var layoutHeader = model.component.layoutHeaders[channel];
    var groups = [];
    for (var _i = 0, HEADER_TYPES_1 = exports.HEADER_TYPES; _i < HEADER_TYPES_1.length; _i++) {
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
exports.getHeaderGroups = getHeaderGroups;
// 0, (0,90), 90, (90, 180), 180, (180, 270), 270, (270, 0)
function labelAlign(angle) {
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
exports.labelAlign = labelAlign;
function labelBaseline(angle) {
    // to keep angle in [0, 360)
    angle = ((angle % 360) + 360) % 360;
    if (45 <= angle && angle <= 135) {
        return { baseline: 'top' };
    }
    return { baseline: 'middle' };
}
exports.labelBaseline = labelBaseline;
function getSort(facetFieldDef, channel) {
    var sort = facetFieldDef.sort;
    if (sort_1.isSortField(sort)) {
        return {
            field: fielddef_1.vgField(sort, { expr: 'datum' }),
            order: sort.order || 'ascending'
        };
    }
    else if (vega_util_1.isArray(sort)) {
        return {
            field: calculate_1.sortArrayIndexField(facetFieldDef, channel, 'datum'),
            order: 'ascending'
        };
    }
    else {
        return {
            field: fielddef_1.vgField(facetFieldDef, { expr: 'datum' }),
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
            var config = model.config ? model.config : undefined;
            var update = tslib_1.__assign({}, labelAlign(labelAngle));
            title = tslib_1.__assign({ text: common_1.formatSignalRef(facetFieldDef, format, 'parent', model.config), offset: 10, orient: channel === 'row' ? 'left' : 'top', style: 'guide-label' }, getHeaderProperties(config, facetFieldDef, header_1.HEADER_LABEL_PROPERTIES, header_1.HEADER_LABEL_PROPERTIES_MAP), (util_1.keys(update).length > 0 ? { encode: { update: update } } : {}));
        }
        var axes = headerCmpt.axes;
        var hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            var sizeChannel = channel === 'row' ? 'height' : 'width';
            return tslib_1.__assign({ name: model.getName(channel + "_" + headerType), type: 'group', role: channel + "-" + headerType }, (layoutHeader.facetFieldDef ? {
                from: { data: model.getName(channel + '_domain') },
                sort: getSort(facetFieldDef, channel)
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
exports.getHeaderGroup = getHeaderGroup;
function getHeaderProperties(config, facetFieldDef, properties, propertiesMap) {
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
exports.getHeaderProperties = getHeaderProperties;
//# sourceMappingURL=index.js.map