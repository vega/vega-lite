"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9ydWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlDQUE0QztBQUU1QyxxQ0FBb0U7QUFDcEUsMkNBQTRDO0FBQzVDLGlDQUFtQztBQUVuQyxjQUFxQixTQUFvQixFQUFFLE9BQWdCLEVBQUUsUUFBa0I7SUFDN0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQVEsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFDLEVBQUUsV0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDNUUsQ0FBQztBQUxELG9CQUtDO0FBRUQsaUJBQXdCLE9BQWdCLEVBQUUsU0FBb0IsRUFBRSxXQUF3QjtJQUN0RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBQyxFQUFFLFdBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssaUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBUEQsMEJBT0M7QUFFRCxzQkFBNkIsT0FBZSxFQUFFLE9BQWdCLEVBQUcsV0FBd0I7SUFDdkYsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENB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