"use strict";
/**
 * Utility files for producing Vega ValueRef for marks
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var common_1 = require("../common");
// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.
/**
 * @return Vega ValueRef for stackable x or y
 */
function stackable(channel, channelDef, scaleName, scale, stack, defaultRef) {
    if (fielddef_1.isFieldDef(channelDef) && stack && channel === stack.fieldChannel) {
        // x or y use stack_end so that stacked line's point mark use stack_end too.
        return fieldRef(channelDef, scaleName, { suffix: 'end' });
    }
    return midPoint(channel, channelDef, scaleName, scale, stack, defaultRef);
}
exports.stackable = stackable;
/**
 * @return Vega ValueRef for stackable x2 or y2
 */
function stackable2(channel, aFieldDef, a2fieldDef, scaleName, scale, stack, defaultRef) {
    if (fielddef_1.isFieldDef(aFieldDef) && stack &&
        // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
        return fieldRef(aFieldDef, scaleName, { suffix: 'start' });
    }
    return midPoint(channel, a2fieldDef, scaleName, scale, stack, defaultRef);
}
exports.stackable2 = stackable2;
/**
 * Value Ref for binned fields
 */
function bin(fieldDef, scaleName, side, offset) {
    return fieldRef(fieldDef, scaleName, { binSuffix: side }, offset ? { offset: offset } : {});
}
exports.bin = bin;
function fieldRef(fieldDef, scaleName, opt, mixins) {
    var ref = {
        scale: scaleName,
        field: fielddef_1.field(fieldDef, opt),
    };
    if (mixins) {
        return tslib_1.__assign({}, ref, mixins);
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
/**
 * Signal that returns the middle of a bin. Should only be used with x and y.
 */
function binMidSignal(fieldDef, scaleName) {
    return {
        signal: "(" +
            ("scale(\"" + scaleName + "\", " + fielddef_1.field(fieldDef, { binSuffix: 'start', expr: 'datum' }) + ")") +
            " + " +
            ("scale(\"" + scaleName + "\", " + fielddef_1.field(fieldDef, { binSuffix: 'end', expr: 'datum' }) + ")") +
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
                if (util_1.contains(['x', 'y'], channel)) {
                    if (stack && stack.impute) {
                        // For stack, we computed bin_mid so we can impute.
                        return fieldRef(channelDef, scaleName, { binSuffix: 'mid' });
                    }
                    // For non-stack, we can just calculate bin mid on the fly using signal.
                    return binMidSignal(channelDef, scaleName);
                }
                return fieldRef(channelDef, scaleName, { binSuffix: 'start' });
            }
            var scaleType = scale.get('type');
            if (scale_1.hasDiscreteDomain(scaleType)) {
                if (scaleType === 'band') {
                    // For band, to get mid point, need to offset by half of the band
                    return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, { band: 0.5 });
                }
                return fieldRef(channelDef, scaleName, { binSuffix: 'range' });
            }
            else {
                return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
            }
        }
        else if (fielddef_1.isValueDef(channelDef)) {
            return { value: channelDef.value };
        }
        else {
            throw new Error('FieldDef without field or value.'); // FIXME add this to log.message
        }
    }
    if (defaultRef === 'zeroOrMin') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return zeroOrMinX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return zeroOrMinY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    else if (defaultRef === 'zeroOrMax') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return zeroOrMaxX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return zeroOrMaxY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    return defaultRef;
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
function zeroOrMinX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
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
function zeroOrMaxX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    return { field: { group: 'width' } };
}
function zeroOrMinY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
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
function zeroOrMaxY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { value: 0 };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBR0gseUNBQWtFO0FBRWxFLDJDQUF3STtBQUN4SSxxQ0FBeUQ7QUFFekQsbUNBQW9DO0FBRXBDLG9DQUF3RDtBQUl4RCxxRkFBcUY7QUFDckYsd0VBQXdFO0FBRXhFOztHQUVHO0FBQ0gsbUJBQTBCLE9BQWtCLEVBQUUsVUFBOEIsRUFBRSxTQUFpQixFQUFFLEtBQXFCLEVBQ2xILEtBQXNCLEVBQUUsVUFBa0Q7SUFDNUUsRUFBRSxDQUFDLENBQUMscUJBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLDRFQUE0RTtRQUM1RSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFQRCw4QkFPQztBQUVEOztHQUVHO0FBQ0gsb0JBQTJCLE9BQW9CLEVBQUUsU0FBNkIsRUFBRSxVQUE4QixFQUFFLFNBQWlCLEVBQUUsS0FBcUIsRUFDcEosS0FBc0IsRUFBRSxVQUFrRDtJQUM1RSxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUs7UUFDOUIsdURBQXVEO1FBQ3ZELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNMLE1BQU0s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