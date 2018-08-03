"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var util = tslib_1.__importStar(require("../../util"));
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
function scaleType(specifiedScale, channel, fieldDef, mark, scaleConfig) {
    var defaultScaleType = defaultType(channel, fieldDef, mark, specifiedScale, scaleConfig);
    var type = specifiedScale.type;
    if (!channel_1.isScaleChannel(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (type !== undefined) {
        // Check if explicitly specified scale type is supported by the channel
        if (!scale_1.channelSupportScaleType(channel, type)) {
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, type, defaultScaleType));
            return defaultScaleType;
        }
        // Check if explicitly specified scale type is supported by the data type
        if (!scale_1.scaleTypeSupportDataType(type, fieldDef.type, fieldDef.bin)) {
            log.warn(log.message.scaleTypeNotWorkWithFieldDef(type, defaultScaleType));
            return defaultScaleType;
        }
        return type;
    }
    return defaultScaleType;
}
exports.scaleType = scaleType;
/**
 * Determine appropriate default scale type.
 */
// NOTE: Voyager uses this method.
function defaultType(channel, fieldDef, mark, specifiedScale, scaleConfig) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
            if (channel_1.isColorChannel(channel) || channel_1.rangeType(channel) === 'discrete') {
                if (channel === 'shape' && fieldDef.type === 'ordinal') {
                    log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                }
                return 'ordinal';
            }
            if (util.contains(['x', 'y'], channel)) {
                if (util.contains(['rect', 'bar', 'rule'], mark)) {
                    // The rect/bar mark should fit into a band.
                    // For rule, using band scale to make rule align with axis ticks better https://github.com/vega/vega-lite/issues/3429
                    return 'band';
                }
                if (mark === 'bar') {
                    return 'band';
                }
            }
            // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
            return 'point';
        case 'temporal':
            if (channel_1.isColorChannel(channel)) {
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            return 'time';
        case 'quantitative':
            if (channel_1.isColorChannel(channel)) {
                if (bin_1.isBinning(fieldDef.bin)) {
                    return 'bin-ordinal';
                }
                var _a = specifiedScale || {}, _b = _a.domain, domain = _b === void 0 ? undefined : _b, _c = _a.range, range = _c === void 0 ? undefined : _c;
                if (domain && vega_util_1.isArray(domain) && domain.length > 2 && (range && vega_util_1.isArray(range) && range.length > 2)) {
                    // If there are piecewise domain and range specified, use lineaer as default color scale as sequential does not support piecewise domain
                    return 'linear';
                }
                // Use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            // x and y use a linear scale because selections don't work with bin scales.
            // Binned scales apply discretization but pan/zoom apply transformations to a [min, max] extent domain.
            if (bin_1.isBinning(fieldDef.bin) && channel !== 'x' && channel !== 'y') {
                return 'bin-linear';
            }
            return 'linear';
        case 'geojson':
            return undefined;
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
//# sourceMappingURL=type.js.map