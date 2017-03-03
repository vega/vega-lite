"use strict";
var axis_1 = require("../../axis");
var encode = require("./encode");
var rules = require("./rules");
var util_1 = require("../../util");
var AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
function parseAxisComponent(model, axisChannels) {
    return axisChannels.reduce(function (axis, channel) {
        var vgAxes = [];
        if (model.axis(channel)) {
            var main = parseMainAxis(channel, model);
            if (main && isVisibleAxis(main)) {
                vgAxes.push(main);
            }
            var grid = parseGridAxis(channel, model);
            if (grid && isVisibleAxis(grid)) {
                vgAxes.push(grid);
            }
            if (vgAxes.length > 0) {
                axis[channel] = vgAxes;
            }
        }
        return axis;
    }, {});
}
exports.parseAxisComponent = parseAxisComponent;
function isFalseOrNull(v) {
    return v === false || v === null;
}
/**
 * Return if an axis is visible (shows at least one part of the axis).
 */
function isVisibleAxis(axis) {
    return util_1.some(AXIS_PARTS, function (part) { return hasAxisPart(axis, part); });
}
function hasAxisPart(axis, part) {
    // FIXME this method can be wrong if users use a Vega theme.
    // (Not sure how to correctly handle that yet.).
    if (part === 'grid' || part === 'title') {
        return !!axis[part];
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(axis[part]);
}
/**
 * Make an inner axis for showing grid for shared axis.
 */
function parseGridAxis(channel, model) {
    // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
    return parseAxis(channel, model, true);
}
exports.parseGridAxis = parseGridAxis;
function parseMainAxis(channel, model) {
    return parseAxis(channel, model, false);
}
exports.parseMainAxis = parseMainAxis;
function parseAxis(channel, model, isGridAxis) {
    var axis = model.axis(channel);
    var vgAxis = {
        scale: model.scaleName(channel)
    };
    // 1.2. Add properties
    axis_1.AXIS_PROPERTIES.forEach(function (property) {
        var value = getSpecifiedOrDefaultValue(property, axis, channel, model, isGridAxis);
        if (value !== undefined) {
            vgAxis[property] = value;
        }
    });
    // Special case for gridScale since gridScale is not a Vega-Lite Axis property.
    var gridScale = getSpecifiedOrDefaultValue('gridScale', axis, channel, model, isGridAxis);
    if (gridScale !== undefined) {
        vgAxis.gridScale = gridScale;
    }
    // 2) Add guide encode definition groups
    var encodeSpec = axis.encode || {};
    AXIS_PARTS.forEach(function (part) {
        if (!hasAxisPart(vgAxis, part)) {
            // No need to create encode for a disabled part.
            return;
        }
        // TODO(@yuhanlu): instead of calling encode[part], break this line based on part type
        // as different require different parameters.
        var value = encode[part](model, channel, encodeSpec.labels || {}, vgAxis);
        if (value !== undefined && util_1.keys(value).length > 0) {
            vgAxis.encode = vgAxis.encode || {};
            vgAxis.encode[part] = { update: value };
        }
    });
    return vgAxis;
}
function getSpecifiedOrDefaultValue(property, specifiedAxis, channel, model, isGridAxis) {
    var fieldDef = model.fieldDef(channel);
    var config = model.config();
    switch (property) {
        case 'domain':
        case 'labels':
        case 'ticks':
            return isGridAxis ? false : specifiedAxis[property];
        case 'format':
            return rules.format(specifiedAxis, channel, fieldDef, config);
        case 'grid':
            return rules.grid(model, channel, isGridAxis); // FIXME: refactor this
        case 'gridScale':
            return rules.gridScale(model, channel, isGridAxis);
        case 'orient':
            return rules.orient(specifiedAxis, channel);
        case 'tickCount':
            return rules.tickCount(specifiedAxis, channel, fieldDef); // TODO: scaleType
        case 'title':
            return rules.title(specifiedAxis, fieldDef, config, isGridAxis);
        case 'values':
            return rules.values(specifiedAxis);
        case 'zindex':
            return rules.zindex(specifiedAxis, isGridAxis);
    }
    // Otherwise, return specified property.
    return specifiedAxis[property];
}
//# sourceMappingURL=parse.js.map