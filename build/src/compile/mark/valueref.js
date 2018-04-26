"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Utility files for producing Vega ValueRef for marks
 */
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
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
            return { value: channelDef.value };
        }
        // If channelDef is neither field def or value def, it's a condition-only def.
        // In such case, we will use default ref.
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
}
exports.getDefaultRef = getDefaultRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsdUNBQTRDO0FBRTVDLHlDQUE0QztBQUU1QywyQ0FTd0I7QUFDeEIsK0JBQWlDO0FBRWpDLHFDQUF5RDtBQUV6RCxtQ0FBd0M7QUFDeEMsbUNBQTBDO0FBRTFDLG9DQUE0RDtBQUk1RCxxRkFBcUY7QUFDckYsd0VBQXdFO0FBRXhFOztHQUVHO0FBQ0gsbUJBQTBCLE9BQWtCLEVBQUUsVUFBOEIsRUFBRSxTQUFpQixFQUFFLEtBQXFCLEVBQ2xILEtBQXNCLEVBQUUsVUFBc0I7SUFDaEQsSUFBSSxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLFlBQVksRUFBRTtRQUNyRSw0RUFBNEU7UUFDNUUsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBUEQsOEJBT0M7QUFFRDs7R0FFRztBQUNILG9CQUEyQixPQUFvQixFQUFFLFNBQTZCLEVBQUUsVUFBOEIsRUFBRSxTQUFpQixFQUFFLEtBQXFCLEVBQ3BKLEtBQXNCLEVBQUUsVUFBc0I7SUFDaEQsSUFBSSxxQkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUs7UUFDOUIsdURBQXVEO1FBQ3ZELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2hEO1FBQ0osT0FBTyxRQUFRLENBQUMsU0FBUyxF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QztBQXJDRCxzQ0FxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFV0aWxpdHkgZmlsZXMgZm9yIHByb2R1Y2luZyBWZWdhIFZhbHVlUmVmIGZvciBtYXJrc1xuICovXG5pbXBvcnQge2lzQXJyYXksIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge0NoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDaGFubmVsRGVmLFxuICBDaGFubmVsRGVmV2l0aENvbmRpdGlvbixcbiAgRmllbGREZWYsXG4gIEZpZWxkUmVmT3B0aW9uLFxuICBpc0ZpZWxkRGVmLFxuICBpc1ZhbHVlRGVmLFxuICBUZXh0RmllbGREZWYsXG4gIHZnRmllbGQsXG59IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW4sIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4uLy4uL3N0YWNrJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIHNvbWV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NpZ25hbFJlZiwgVmdWYWx1ZVJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlLCBmb3JtYXRTaWduYWxSZWZ9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50fSBmcm9tICcuLi9zY2FsZS9jb21wb25lbnQnO1xuXG5cbi8vIFRPRE86IHdlIG5lZWQgdG8gZmluZCBhIHdheSB0byByZWZhY3RvciB0aGVzZSBzbyB0aGF0IHNjYWxlTmFtZSBpcyBhIHBhcnQgb2Ygc2NhbGVcbi8vIGJ1dCB0aGF0J3MgY29tcGxpY2F0ZWQuICBGb3Igbm93LCB0aGlzIGlzIGEgaHVnZSBzdGVwIG1vdmluZyBmb3J3YXJkLlxuXG4vKipcbiAqIEByZXR1cm4gVmVnYSBWYWx1ZVJlZiBmb3Igc3RhY2thYmxlIHggb3IgeVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhY2thYmxlKGNoYW5uZWw6ICd4JyB8ICd5JywgY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCBzY2FsZU5hbWU6IHN0cmluZywgc2NhbGU6IFNjYWxlQ29tcG9uZW50LFxuICAgIHN0YWNrOiBTdGFja1Byb3BlcnRpZXMsIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYpOiBWZ1ZhbHVlUmVmIHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikgJiYgc3RhY2sgJiYgY2hhbm5lbCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgLy8geCBvciB5IHVzZSBzdGFja19lbmQgc28gdGhhdCBzdGFja2VkIGxpbmUncyBwb2ludCBtYXJrIHVzZSBzdGFja19lbmQgdG9vLlxuICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHtzdWZmaXg6ICdlbmQnfSk7XG4gIH1cbiAgcmV0dXJuIG1pZFBvaW50KGNoYW5uZWwsIGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwgc2NhbGUsIHN0YWNrLCBkZWZhdWx0UmVmKTtcbn1cblxuLyoqXG4gKiBAcmV0dXJuIFZlZ2EgVmFsdWVSZWYgZm9yIHN0YWNrYWJsZSB4MiBvciB5MlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhY2thYmxlMihjaGFubmVsOiAneDInIHwgJ3kyJywgYUZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIGEyZmllbGREZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCxcbiAgICBzdGFjazogU3RhY2tQcm9wZXJ0aWVzLCBkZWZhdWx0UmVmOiBWZ1ZhbHVlUmVmKTogVmdWYWx1ZVJlZiB7XG4gIGlmIChpc0ZpZWxkRGVmKGFGaWVsZERlZikgJiYgc3RhY2sgJiZcbiAgICAgIC8vIElmIGZpZWxkQ2hhbm5lbCBpcyBYIGFuZCBjaGFubmVsIGlzIFgyIChvciBZIGFuZCBZMilcbiAgICAgIGNoYW5uZWwuY2hhckF0KDApID09PSBzdGFjay5maWVsZENoYW5uZWwuY2hhckF0KDApXG4gICAgICApIHtcbiAgICByZXR1cm4gZmllbGRSZWYoYUZpZWxkRGVmLCBzY2FsZU5hbWUsIHtzdWZmaXg6ICdzdGFydCd9KTtcbiAgfVxuICByZXR1cm4gbWlkUG9pbnQoY2hhbm5lbCwgYTJmaWVsZERlZiwgc2NhbGVOYW1lLCBzY2FsZSwgc3RhY2ssIGRlZmF1bHRSZWYpO1xufVxuXG4vKipcbiAqIFZhbHVlIFJlZiBmb3IgYmlubmVkIGZpZWxkc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmluKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZU5hbWU6IHN0cmluZywgc2lkZTogJ3N0YXJ0JyB8ICdlbmQnLCBvZmZzZXQ/OiBudW1iZXIpIHtcbiAgY29uc3QgYmluU3VmZml4ID0gc2lkZSA9PT0gJ3N0YXJ0JyA/IHVuZGVmaW5lZCA6ICdlbmQnO1xuICByZXR1cm4gZmllbGRSZWYoZmllbGREZWYsIHNjYWxlTmFtZSwge2JpblN1ZmZpeH0sIG9mZnNldCA/IHtvZmZzZXR9IDoge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGRSZWYoXG4gICAgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlTmFtZTogc3RyaW5nLCBvcHQ6IEZpZWxkUmVmT3B0aW9uLFxuICAgIG1peGlucz86IHtvZmZzZXQ/OiBudW1iZXIgfCBWZ1ZhbHVlUmVmLCBiYW5kPzogbnVtYmVyfGJvb2xlYW59XG4gICk6IFZnVmFsdWVSZWYge1xuXG4gIGNvbnN0IHJlZjogVmdWYWx1ZVJlZiA9IHtcbiAgICAuLi4oc2NhbGVOYW1lID8ge3NjYWxlOiBzY2FsZU5hbWV9IDoge30pLFxuICAgIGZpZWxkOiB2Z0ZpZWxkKGZpZWxkRGVmLCBvcHQpLFxuICB9O1xuXG4gIGlmIChtaXhpbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVmLFxuICAgICAgLi4ubWl4aW5zXG4gICAgfTtcbiAgfVxuICByZXR1cm4gcmVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFJlZihzY2FsZU5hbWU6IHN0cmluZywgYmFuZDogbnVtYmVyfGJvb2xlYW4gPSB0cnVlKTogVmdWYWx1ZVJlZiB7XG4gIHJldHVybiB7XG4gICAgc2NhbGU6IHNjYWxlTmFtZSxcbiAgICBiYW5kOiBiYW5kXG4gIH07XG59XG5cbi8qKlxuICogU2lnbmFsIHRoYXQgcmV0dXJucyB0aGUgbWlkZGxlIG9mIGEgYmluLiBTaG91bGQgb25seSBiZSB1c2VkIHdpdGggeCBhbmQgeS5cbiAqL1xuZnVuY3Rpb24gYmluTWlkU2lnbmFsKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZU5hbWU6IHN0cmluZykge1xuICByZXR1cm4ge1xuICAgIHNpZ25hbDogYChgICtcbiAgICAgIGBzY2FsZShcIiR7c2NhbGVOYW1lfVwiLCAke3ZnRmllbGQoZmllbGREZWYsIHtleHByOiAnZGF0dW0nfSl9KWAgK1xuICAgICAgYCArIGAgK1xuICAgICAgYHNjYWxlKFwiJHtzY2FsZU5hbWV9XCIsICR7dmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ2VuZCcsIGV4cHI6ICdkYXR1bSd9KX0pYCtcbiAgICBgKS8yYFxuICB9O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtWZ1ZhbHVlUmVmfSBWYWx1ZSBSZWYgZm9yIHhjIC8geWMgb3IgbWlkIHBvaW50IGZvciBvdGhlciBjaGFubmVscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pZFBvaW50KGNoYW5uZWw6IENoYW5uZWwsIGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCwgc3RhY2s6IFN0YWNrUHJvcGVydGllcywgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZik6IFZnVmFsdWVSZWYge1xuICAvLyBUT0RPOiBkYXR1bSBzdXBwb3J0XG5cbiAgaWYgKGNoYW5uZWxEZWYpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXG4gICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGlmIChjaGFubmVsRGVmLmJpbikge1xuICAgICAgICAvLyBVc2UgbWlkZGxlIG9ubHkgZm9yIHggYW4geSB0byBwbGFjZSBtYXJrcyBpbiB0aGUgY2VudGVyIGJldHdlZW4gc3RhcnQgYW5kIGVuZCBvZiB0aGUgYmluIHJhbmdlLlxuICAgICAgICAvLyBXZSBkbyBub3QgdXNlIHRoZSBtaWQgcG9pbnQgZm9yIG90aGVyIGNoYW5uZWxzIChlLmcuIHNpemUpIHNvIHRoYXQgcHJvcGVydGllcyBvZiBsZWdlbmRzIGFuZCBtYXJrcyBtYXRjaC5cbiAgICAgICAgaWYgKGNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkgJiYgY2hhbm5lbERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgICBpZiAoc3RhY2sgJiYgc3RhY2suaW1wdXRlKSB7XG4gICAgICAgICAgICAvLyBGb3Igc3RhY2ssIHdlIGNvbXB1dGVkIGJpbl9taWQgc28gd2UgY2FuIGltcHV0ZS5cbiAgICAgICAgICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdtaWQnfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEZvciBub24tc3RhY2ssIHdlIGNhbiBqdXN0IGNhbGN1bGF0ZSBiaW4gbWlkIG9uIHRoZSBmbHkgdXNpbmcgc2lnbmFsLlxuICAgICAgICAgIHJldHVybiBiaW5NaWRTaWduYWwoY2hhbm5lbERlZiwgc2NhbGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRSZWYoY2hhbm5lbERlZiwgc2NhbGVOYW1lLCBiaW5SZXF1aXJlc1JhbmdlKGNoYW5uZWxEZWYsIGNoYW5uZWwpID8ge2JpblN1ZmZpeDogJ3JhbmdlJ30gOiB7fSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY2FsZSkge1xuICAgICAgICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZS5nZXQoJ3R5cGUnKTtcbiAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICAgICAgICBpZiAoc2NhbGVUeXBlID09PSAnYmFuZCcpIHtcbiAgICAgICAgICAgIC8vIEZvciBiYW5kLCB0byBnZXQgbWlkIHBvaW50LCBuZWVkIHRvIG9mZnNldCBieSBoYWxmIG9mIHRoZSBiYW5kXG4gICAgICAgICAgICByZXR1cm4gZmllbGRSZWYoY2hhbm5lbERlZiwgc2NhbGVOYW1lLCB7YmluU3VmZml4OiAncmFuZ2UnfSwge2JhbmQ6IDAuNX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmllbGRSZWYoY2hhbm5lbERlZiwgc2NhbGVOYW1lLCB7YmluU3VmZml4OiAncmFuZ2UnfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHt9KTsgLy8gbm8gbmVlZCBmb3IgYmluIHN1ZmZpeFxuICAgIH0gZWxzZSBpZiAoaXNWYWx1ZURlZihjaGFubmVsRGVmKSkge1xuICAgICAgcmV0dXJuIHt2YWx1ZTogY2hhbm5lbERlZi52YWx1ZX07XG4gICAgfVxuXG4gICAgLy8gSWYgY2hhbm5lbERlZiBpcyBuZWl0aGVyIGZpZWxkIGRlZiBvciB2YWx1ZSBkZWYsIGl0J3MgYSBjb25kaXRpb24tb25seSBkZWYuXG4gICAgLy8gSW4gc3VjaCBjYXNlLCB3ZSB3aWxsIHVzZSBkZWZhdWx0IHJlZi5cbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0UmVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dCh0ZXh0RGVmOiBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxUZXh0RmllbGREZWY8c3RyaW5nPj4sIGNvbmZpZzogQ29uZmlnKTogVmdWYWx1ZVJlZiB7XG4gIC8vIHRleHRcbiAgaWYgKHRleHREZWYpIHtcbiAgICBpZiAoaXNGaWVsZERlZih0ZXh0RGVmKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFNpZ25hbFJlZih0ZXh0RGVmLCB0ZXh0RGVmLmZvcm1hdCwgJ2RhdHVtJywgY29uZmlnKTtcbiAgICB9IGVsc2UgaWYgKGlzVmFsdWVEZWYodGV4dERlZikpIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IHRleHREZWYudmFsdWV9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWlkKHNpemVSZWY6IFZnU2lnbmFsUmVmKTogVmdWYWx1ZVJlZiB7XG4gIHJldHVybiB7Li4uc2l6ZVJlZiwgbXVsdDogMC41fTtcbn1cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSBzY2FsZSBkZWZpbml0ZWx5IGluY2x1ZGVzIHplcm8gaW4gdGhlIGRvbWFpblxuICovXG5mdW5jdGlvbiBkb21haW5EZWZpbml0ZWx5SW5jbHVkZVplcm8oc2NhbGU6IFNjYWxlQ29tcG9uZW50KSB7XG4gIGlmIChzY2FsZS5nZXQoJ3plcm8nKSAhPT0gZmFsc2UpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBjb25zdCBkb21haW5zID0gc2NhbGUuZG9tYWlucztcbiAgaWYgKGlzQXJyYXkoZG9tYWlucykpIHtcbiAgICByZXR1cm4gc29tZShkb21haW5zLCAoZCkgPT4gaXNBcnJheShkKSAmJiBkLmxlbmd0aCA9PT0gMiAmJiBkWzBdIDw9MCAmJiBkWzFdID49IDApO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRSZWYoXG4gIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYgfCAnemVyb09yTWluJyB8ICd6ZXJvT3JNYXgnLFxuICBjaGFubmVsOiAneCcgfCAneScsIHNjYWxlTmFtZTogc3RyaW5nLCBzY2FsZTogU2NhbGVDb21wb25lbnQsIG1hcms6IE1hcmtcbikge1xuICBpZiAoaXNTdHJpbmcoZGVmYXVsdFJlZikpIHtcbiAgICBpZiAoc2NhbGVOYW1lKSB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZS5nZXQoJ3R5cGUnKTtcbiAgICAgIGlmIChjb250YWlucyhbU2NhbGVUeXBlLkxPRywgU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdLCBzY2FsZVR5cGUpKSB7XG4gICAgICAgIC8vIExvZyBzY2FsZXMgY2Fubm90IGhhdmUgemVyby5cbiAgICAgICAgLy8gWmVybyBpbiB0aW1lIHNjYWxlIGlzIGFyYml0cmFyeSwgYW5kIGRvZXMgbm90IGFmZmVjdCByYXRpby5cbiAgICAgICAgLy8gKFRpbWUgaXMgYW4gaW50ZXJ2YWwgbGV2ZWwgb2YgbWVhc3VyZW1lbnQsIG5vdCByYXRpbykuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXZlbF9vZl9tZWFzdXJlbWVudCBmb3IgbW9yZSBpbmZvLlxuICAgICAgICBpZiAobWFyayA9PT0gJ2JhcicgfHwgbWFyayA9PT0gJ2FyZWEnKSB7XG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uubm9uWmVyb1NjYWxlVXNlZFdpdGhMZW5ndGhNYXJrKG1hcmssIGNoYW5uZWwsIHtzY2FsZVR5cGV9KSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkb21haW5EZWZpbml0ZWx5SW5jbHVkZVplcm8oc2NhbGUpKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNjYWxlOiBzY2FsZU5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcmsgPT09ICdiYXInIHx8IG1hcmsgPT09ICdhcmVhJykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLm5vblplcm9TY2FsZVVzZWRXaXRoTGVuZ3RoTWFyayhcbiAgICAgICAgICAgIG1hcmssIGNoYW5uZWwsIHt6ZXJvRmFsc2U6IHNjYWxlLmV4cGxpY2l0Lnplcm8gPT09IGZhbHNlfVxuICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRlZmF1bHRSZWYgPT09ICd6ZXJvT3JNaW4nKSB7XG4gICAgICByZXR1cm4gY2hhbm5lbCA9PT0gJ3gnID8ge3ZhbHVlOiAwfSA6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319O1xuICAgIH0gZWxzZSB7IC8vIHplcm9Pck1heFxuICAgICAgcmV0dXJuIGNoYW5uZWwgPT09ICd4JyA/IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0gOiB7dmFsdWU6IDB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmYXVsdFJlZjtcbn1cblxuIl19