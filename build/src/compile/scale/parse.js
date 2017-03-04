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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJDQUErQztBQUMvQyxxQ0FBa0U7QUFDbEUsbUNBQXVDO0FBS3ZDLGlDQUFvRztBQUNwRyxtQ0FBcUM7QUFDckMsaUNBQW1DO0FBR25DOztHQUVHO0FBQ0gsNkJBQTRDLEtBQVk7SUFDdEQsK0NBQStDO0lBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVMsb0JBQTJDLEVBQUUsT0FBZ0I7UUFDbkcsSUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxHQUFHLGVBQWUsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzlCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFURCxzQ0FTQztBQUVEOztHQUVHO0FBQ0gsb0JBQTJCLEtBQVksRUFBRSxPQUFnQjtJQUN0RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLElBQU0sTUFBTSxHQUFvQjtZQUM5QixJQUFJLEVBQUUsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7U0FDckMsQ0FBQztRQUVGLG1FQUFtRTtRQUNuRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLElBQUksMkJBQW1CLENBQUMsS0FBSyxDQUFDLEtB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