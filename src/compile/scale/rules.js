"use strict";
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var timeunit_1 = require("../../timeunit");
var util = require("../../util");
function nice(scaleType, channel, fieldDef) {
    if (util.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scaleType)) {
        return timeunit_1.smallestUnit(fieldDef.timeUnit);
    }
    return util.contains([channel_1.X, channel_1.Y], channel); // return true for quantitative X/Y
}
exports.nice = nice;
function padding(channel, scaleType, scaleConfig) {
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        if (scaleType === scale_1.ScaleType.POINT) {
            return scaleConfig.pointPadding;
        }
    }
    return undefined;
}
exports.padding = padding;
function paddingInner(padding, channel, scaleConfig) {
    if (padding !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingInner.
        return undefined;
    }
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
        return scaleConfig.bandPaddingInner;
    }
    return undefined;
}
exports.paddingInner = paddingInner;
function paddingOuter(padding, channel, scaleType, paddingInner, scaleConfig) {
    if (padding !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingOuter.
        return undefined;
    }
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        if (scaleType === scale_1.ScaleType.BAND) {
            if (scaleConfig.bandPaddingOuter !== undefined) {
                return scaleConfig.bandPaddingOuter;
            }
            /* By default, paddingOuter is paddingInner / 2. The reason is that
                size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
                and we want the width/height to be integer by default.
                Note that step (by default) and cardinality are integers.) */
            return paddingInner / 2;
        }
    }
    return undefined;
}
exports.paddingOuter = paddingOuter;
function round(channel, scaleConfig) {
    if (util.contains(['x', 'y', 'row', 'column'], channel)) {
        return scaleConfig.round;
    }
    return undefined;
}
exports.round = round;
function zero(specifiedScale, channel, fieldDef) {
    // By default, return true only for the following cases:
    // 1) using quantitative field with size
    // While this can be either ratio or interval fields, our assumption is that
    // ratio are more common.
    if (channel === 'size' && fieldDef.type === 'quantitative') {
        return true;
    }
    // 2) non-binned, quantitative x-scale or y-scale if no custom domain is provided.
    // (For binning, we should not include zero by default because binning are calculated without zero.
    // Similar, if users explicitly provide a domain range, we should not augment zero as that will be unexpected.)
    if (!specifiedScale.domain && !fieldDef.bin && util.contains([channel_1.X, channel_1.Y], channel)) {
        return true;
    }
    return false;
}
exports.zero = zero;
//# sourceMappingURL=rules.js.map