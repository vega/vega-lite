"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var scale_2 = require("./scale");
var domain_1 = require("./domain");
var range_1 = require("./range");
/**
 * Parse scales for all channels of a model.
 */
function parseScaleComponent(model) {
    // TODO: should model.channels() inlcude X2/Y2?
    return model.channels().reduce(function (scaleComponentsIndex, channel) {
        var scaleComponents = parseScale(model, channel);
        if (scaleComponents) {
            scaleComponentsIndex[channel] = scaleComponents;
        }
        return scaleComponentsIndex;
    }, {});
}
exports.default = parseScaleComponent;
/**
 * Parse scales for a single channel of a model.
 */
function parseScale(model, channel) {
    if (model.scale(channel)) {
        var fieldDef = model.fieldDef(channel);
        var scales = {
            main: parseMainScale(model, channel)
        };
        // Add additional scale needed for the labels in the binned legend.
        if (model.legend(channel) && fieldDef.bin && scale_1.hasContinuousDomain(model.scale(channel).type)) {
            scales.binLegend = parseBinLegend(channel, model);
            scales.binLegendLabel = parseBinLegendLabel(channel, model, fieldDef);
        }
        return scales;
    }
    return null;
}
exports.parseScale = parseScale;
exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = [
    'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'interpolate', 'zero',
    // ordinal
    'padding', 'paddingInner', 'paddingOuter',
];
// TODO: consider return type of this method
// maybe we should just return domain as we can have the rest of scale (ScaleSignature constant)
/**
 * Return the main scale for each channel.  (Only color can have multiple scales.)
 */
function parseMainScale(model, channel) {
    var scale = model.scale(channel);
    var sort = model.sort(channel);
    var scaleComponent = {
        name: model.scaleName(channel + '', true),
        type: scale.type,
        domain: domain_1.parseDomain(model, channel),
        range: range_1.parseRange(scale)
    };
    exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach(function (property) {
        scaleComponent[property] = scale[property];
    });
    if (sort && (sort_1.isSortField(sort) ? sort.order : sort) === 'descending') {
        scaleComponent.reverse = true;
    }
    return scaleComponent;
}
/**
 * Return additional scale to drive legend when we use a continuous scale and binning.
 */
function parseBinLegend(channel, model) {
    return {
        name: model.scaleName(channel, true) + scale_2.BIN_LEGEND_SUFFIX,
        type: scale_1.ScaleType.POINT,
        domain: {
            data: model.dataTable(),
            field: model.field(channel),
            sort: true
        },
        range: [0, 1] // doesn't matter because we override it
    };
}
/**
 *  Return an additional scale for bin labels because we need to map bin_start to bin_range in legends
 */
function parseBinLegendLabel(channel, model, fieldDef) {
    return {
        name: model.scaleName(channel, true) + scale_2.BIN_LEGEND_LABEL_SUFFIX,
        type: scale_1.ScaleType.ORDINAL,
        domain: {
            data: model.dataTable(),
            field: model.field(channel),
            sort: true
        },
        range: {
            data: model.dataTable(),
            field: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            sort: {
                field: model.field(channel, { binSuffix: 'start' }),
                op: 'min' // min or max doesn't matter since same _range would have the same _start
            }
        }
    };
}
//# sourceMappingURL=parse.js.map