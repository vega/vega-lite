"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Utility files for producing Vega ValueRef for marks
 */
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.
/**
 * @return Vega ValueRef for normal x- or y-position without projection
 */
function position(channel, channelDef, scaleName, scale, stack, defaultRef) {
    if (fielddef_1.isFieldDef(channelDef) && stack && channel === stack.fieldChannel) {
        // x or y use stack_end so that stacked line's point mark use stack_end too.
        return fieldRef(channelDef, scaleName, { suffix: 'end' });
    }
    return midPoint(channel, channelDef, scaleName, scale, stack, defaultRef);
}
exports.position = position;
/**
 * @return Vega ValueRef for normal x2- or y2-position without projection
 */
function position2(channel, aFieldDef, a2fieldDef, scaleName, scale, stack, defaultRef) {
    if (fielddef_1.isFieldDef(aFieldDef) && stack &&
        // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
        return fieldRef(aFieldDef, scaleName, { suffix: 'start' });
    }
    return midPoint(channel, a2fieldDef, scaleName, scale, stack, defaultRef);
}
exports.position2 = position2;
function getOffset(channel, markDef) {
    var offsetChannel = channel + 'Offset';
    // TODO: in the future read from encoding channel too
    var markDefOffsetValue = markDef[offsetChannel];
    if (markDefOffsetValue) {
        return markDefOffsetValue;
    }
    return undefined;
}
exports.getOffset = getOffset;
/**
 * Value Ref for binned fields
 */
function bin(fieldDef, scaleName, side, offset) {
    var binSuffix = side === 'start' ? undefined : 'end';
    return fieldRef(fieldDef, scaleName, { binSuffix: binSuffix }, offset ? { offset: offset } : {});
}
exports.bin = bin;
function fieldRef(fieldDef, scaleName, opt, mixins) {
    var ref = tslib_1.__assign({}, (scaleName ? { scale: scaleName } : {}), { field: fielddef_1.vgField(fieldDef, opt) });
    if (mixins) {
        return tslib_1.__assign({}, ref, mixins);
    }
    return ref;
}
exports.fieldRef = fieldRef;
function bandRef(scaleName, band) {
    if (band === void 0) { band = true; }
    return {
        scale: scaleName,
        band: band
    };
}
exports.bandRef = bandRef;
/**
 * Signal that returns the middle of a bin. Should only be used with x and y.
 */
function binMidSignal(fieldDef, scaleName) {
    return {
        signal: "(" +
            ("scale(\"" + scaleName + "\", " + fielddef_1.vgField(fieldDef, { expr: 'datum' }) + ")") +
            " + " +
            ("scale(\"" + scaleName + "\", " + fielddef_1.vgField(fieldDef, { binSuffix: 'end', expr: 'datum' }) + ")") +
            ")/2"
    };
}
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
function midPoint(channel, channelDef, scaleName, scale, stack, defaultRef) {
    // TODO: datum support
    if (channelDef) {
        /* istanbul ignore else */
        if (fielddef_1.isFieldDef(channelDef)) {
            if (channelDef.bin) {
                // Use middle only for x an y to place marks in the center between start and end of the bin range.
                // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
                if (util_1.contains([channel_1.X, channel_1.Y], channel) && channelDef.type === type_1.QUANTITATIVE) {
                    if (stack && stack.impute) {
                        // For stack, we computed bin_mid so we can impute.
                        return fieldRef(channelDef, scaleName, { binSuffix: 'mid' });
                    }
                    // For non-stack, we can just calculate bin mid on the fly using signal.
                    return binMidSignal(channelDef, scaleName);
                }
                return fieldRef(channelDef, scaleName, common_1.binRequiresRange(channelDef, channel) ? { binSuffix: 'range' } : {});
            }
            if (scale) {
                var scaleType = scale.get('type');
                if (scale_1.hasDiscreteDomain(scaleType)) {
                    if (scaleType === 'band') {
                        // For band, to get mid point, need to offset by half of the band
                        return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, { band: 0.5 });
                    }
                    return fieldRef(channelDef, scaleName, { binSuffix: 'range' });
                }
            }
            return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
        }
        else if (fielddef_1.isValueDef(channelDef)) {
            var value = channelDef.value;
            if (util_1.contains(['x', 'x2'], channel) && value === 'width') {
                return { field: { group: 'width' } };
            }
            else if (util_1.contains(['y', 'y2'], channel) && value === 'height') {
                return { field: { group: 'height' } };
            }
            return { value: value };
        }
        // If channelDef is neither field def or value def, it's a condition-only def.
        // In such case, we will use default ref.
    }
    return vega_util_1.isFunction(defaultRef) ? defaultRef() : defaultRef;
}
exports.midPoint = midPoint;
function text(textDef, config) {
    // text
    if (textDef) {
        if (fielddef_1.isFieldDef(textDef)) {
            return common_1.formatSignalRef(textDef, textDef.format, 'datum', config);
        }
        else if (fielddef_1.isValueDef(textDef)) {
            return { value: textDef.value };
        }
    }
    return undefined;
}
exports.text = text;
function mid(sizeRef) {
    return tslib_1.__assign({}, sizeRef, { mult: 0.5 });
}
exports.mid = mid;
/**
 * Whether the scale definitely includes zero in the domain
 */
function domainDefinitelyIncludeZero(scale) {
    if (scale.get('zero') !== false) {
        return true;
    }
    var domains = scale.domains;
    if (vega_util_1.isArray(domains)) {
        return util_1.some(domains, function (d) { return vega_util_1.isArray(d) && d.length === 2 && d[0] <= 0 && d[1] >= 0; });
    }
    return false;
}
function getDefaultRef(defaultRef, channel, scaleName, scale, mark) {
    return function () {
        if (vega_util_1.isString(defaultRef)) {
            if (scaleName) {
                var scaleType = scale.get('type');
                if (util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scaleType)) {
                    // Log scales cannot have zero.
                    // Zero in time scale is arbitrary, and does not affect ratio.
                    // (Time is an interval level of measurement, not ratio).
                    // See https://en.wikipedia.org/wiki/Level_of_measurement for more info.
                    if (mark === 'bar' || mark === 'area') {
                        log.warn(log.message.nonZeroScaleUsedWithLengthMark(mark, channel, { scaleType: scaleType }));
                    }
                }
                else {
                    if (domainDefinitelyIncludeZero(scale)) {
                        return {
                            scale: scaleName,
                            value: 0
                        };
                    }
                    if (mark === 'bar' || mark === 'area') {
                        log.warn(log.message.nonZeroScaleUsedWithLengthMark(mark, channel, { zeroFalse: scale.explicit.zero === false }));
                    }
                }
            }
            if (defaultRef === 'zeroOrMin') {
                return channel === 'x' ? { value: 0 } : { field: { group: 'height' } };
            }
            else { // zeroOrMax
                return channel === 'x' ? { field: { group: 'width' } } : { value: 0 };
            }
        }
        return defaultRef;
    };
}
exports.getDefaultRef = getDefaultRef;
//# sourceMappingURL=valueref.js.map