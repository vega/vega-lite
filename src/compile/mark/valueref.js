/**
 * Utility files for producing Vega ValueRef for marks
 */
"use strict";
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.
/**
 * @return Vega ValueRef for stackable x or y
 */
function stackable(channel, channelDef, scaleName, scale, stack, defaultRef) {
    if (channelDef && stack && channel === stack.fieldChannel) {
        // x or y use stack_end so that stacked line's point mark use stack_end too.
        return fieldRef(channelDef, scaleName, { suffix: 'end' });
    }
    return midPoint(channel, channelDef, scaleName, scale, defaultRef);
}
exports.stackable = stackable;
/**
 * @return Vega ValueRef for stackable x2 or y2
 */
function stackable2(channel, aFieldDef, a2fieldDef, scaleName, scale, stack, defaultRef) {
    if (aFieldDef && stack &&
        // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
        return fieldRef(aFieldDef, scaleName, { suffix: 'start' });
    }
    return midPoint(channel, a2fieldDef, scaleName, scale, defaultRef);
}
exports.stackable2 = stackable2;
/**
 * Value Ref for binned fields
 */
function bin(fieldDef, scaleName, side, offset) {
    return fieldRef(fieldDef, scaleName, { binSuffix: side }, offset);
}
exports.bin = bin;
function fieldRef(fieldDef, scaleName, opt, offset) {
    var ref = {
        scale: scaleName,
        field: fielddef_1.field(fieldDef, opt),
    };
    if (offset) {
        ref.offset = offset;
    }
    return ref;
}
exports.fieldRef = fieldRef;
function band(scaleName, band) {
    if (band === void 0) { band = true; }
    return {
        scale: scaleName,
        band: band
    };
}
exports.band = band;
function binMidSignal(fieldDef, scaleName) {
    return {
        scale: scaleName,
        signal: '(' + fielddef_1.field(fieldDef, { binSuffix: 'start', datum: true }) + '+' +
            fielddef_1.field(fieldDef, { binSuffix: 'end', datum: true }) + ')/2'
    };
}
exports.binMidSignal = binMidSignal;
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
function midPoint(channel, channelDef, scaleName, scale, defaultRef) {
    // TODO: datum support
    if (channelDef) {
        /* istanbul ignore else */
        if (fielddef_1.isFieldDef(channelDef)) {
            if (scale_1.hasDiscreteDomain(scale.type)) {
                if (scale.type === 'band') {
                    // For band, to get mid point, need to offset by half of the band
                    return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, band(scaleName, 0.5));
                }
                return fieldRef(channelDef, scaleName, { binSuffix: 'range' });
            }
            else {
                if (channelDef.bin) {
                    return binMidSignal(channelDef, scaleName);
                }
                else {
                    return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
                }
            }
        }
        else if (channelDef.value) {
            return {
                value: channelDef.value
            };
        }
        else {
            throw new Error('FieldDef without field or value.'); // FIXME add this to log.message
        }
    }
    if (defaultRef === 'base') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return baseX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return baseY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    else if (defaultRef === 'baseOrMax') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return baseOrMaxX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return baseOrMaxY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    return defaultRef;
}
exports.midPoint = midPoint;
function midX(config) {
    if (typeof config.scale.rangeStep === 'string') {
        // TODO: For fit-mode, use middle of the width
        throw new Error('midX can not handle string rangeSteps');
    }
    return { value: config.scale.rangeStep / 2 };
}
exports.midX = midX;
function midY(config) {
    if (typeof config.scale.rangeStep === 'string') {
        // TODO: For fit-mode, use middle of the width
        throw new Error('midX can not handle string rangeSteps');
    }
    return { value: config.scale.rangeStep / 2 };
}
exports.midY = midY;
function baseX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the x-axis
    return { value: 0 };
}
/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function baseOrMaxX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    return { field: { group: 'width' } };
}
function baseY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { field: { group: 'height' } };
}
/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function baseOrMaxY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { value: 0 };
}
//# sourceMappingURL=valueref.js.map