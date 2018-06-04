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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsdUNBQTRDO0FBRTVDLHlDQUE0QztBQUU1QywyQ0FTd0I7QUFDeEIscURBQWlDO0FBRWpDLHFDQUF5RDtBQUV6RCxtQ0FBd0M7QUFDeEMsbUNBQTBDO0FBRTFDLG9DQUE0RDtBQUk1RCxxRkFBcUY7QUFDckYsd0VBQXdFO0FBRXhFOztHQUVHO0FBQ0gsbUJBQTBCLE9BQWtCLEVBQUUsVUFBOEIsRUFBRSxTQUFpQixFQUFFLEtBQXFCLEVBQ2xILEtBQXNCLEVBQUUsVUFBc0I7SUFDaEQsSUFBSSxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLFlBQVksRUFBRTtRQUNyRSw0RUFBNEU7UUFDNUUsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBUEQsOEJBT0M7QUFFRDs7R0FFRztBQUNILG9CQUEyQixPQUFvQixFQUFFLFNBQTZCLEVBQUUsVUFBOEIsRUFBRSxTQUFpQixFQUFFLEtBQXFCLEVBQ3BKLEtBQXNCLEVBQUUsVUFBc0I7SUFDaEQsSUFBSSxxQkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUs7UUFDOUIsdURBQXVEO1FBQ3ZELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2hEO1FBQ0osT0FBTyxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0tBQzFEO0lBQ0QsT0FBTyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBVEQsZ0NBU0M7QUFJRCxtQkFBMEIsT0FBZ0MsRUFBRSxPQUFnQjtJQUMxRSxJQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQ3pDLHFEQUFxRDtJQUVyRCxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsRCxJQUFJLGtCQUFrQixFQUFFO1FBQ3RCLE9BQU8sa0JBQWtCLENBQUM7S0FDM0I7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBVkQsOEJBVUM7QUFFRDs7R0FFRztBQUNILGFBQW9CLFFBQTBCLEVBQUUsU0FBaUIsRUFBRSxJQUFxQixFQUFFLE1BQWU7SUFDdkcsSUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDdkQsT0FBTyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFDLFNBQVMsV0FBQSxFQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sUUFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFIRCxrQkFHQztBQUVELGtCQUNJLFFBQTBCLEVBQUUsU0FBaUIsRUFBRSxHQUFtQixFQUNsRSxNQUE4RDtJQUdoRSxJQUFNLEdBQUcsd0JBQ0osQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDeEMsS0FBSyxFQUFFLGtCQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxHQUM5QixDQUFDO0lBRUYsSUFBSSxNQUFNLEVBQUU7UUFDViw0QkFDSyxHQUFHLEVBQ0gsTUFBTSxFQUNUO0tBQ0g7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFqQkQsNEJBaUJDO0FBRUQsaUJBQXdCLFNBQWlCLEVBQUUsSUFBMkI7SUFBM0IscUJBQUEsRUFBQSxXQUEyQjtJQUNwRSxPQUFPO1FBQ0wsS0FBSyxFQUFFLFNBQVM7UUFDaEIsSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDO0FBQ0osQ0FBQztBQUxELDBCQUtDO0FBRUQ7O0dBRUc7QUFDSCxzQkFBc0IsUUFBMEIsRUFBRSxTQUFpQjtJQUNqRSxPQUFPO1FBQ0wsTUFBTSxFQUFFLEdBQUc7YUFDVCxhQUFVLFNBQVMsWUFBTSxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxNQUFHLENBQUE7WUFDOUQsS0FBSzthQUNMLGFBQVUsU0FBUyxZQUFNLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsTUFBRyxDQUFBO1lBQ2xGLEtBQUs7S0FDTixDQUFDO0FBQ0osQ0FBQztBQUVEOztHQUVHO0FBQ0gsa0JBQXlCLE9BQWdCLEVBQUUsVUFBOEIsRUFBRSxTQUFpQixFQUFFLEtBQXFCLEVBQUUsS0FBc0IsRUFBRSxVQUFzQjtJQUNqSyxzQkFBc0I7SUFFdEIsSUFBSSxVQUFVLEVBQUU7UUFDZCwwQkFBMEI7UUFFMUIsSUFBSSxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzFCLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDbEIsa0dBQWtHO2dCQUNsRyw0R0FBNEc7Z0JBQzVHLElBQUksZUFBUSxDQUFDLENBQUMsV0FBQyxFQUFFLFdBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssbUJBQVksRUFBRTtvQkFDakUsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTt3QkFDekIsbURBQW1EO3dCQUNuRCxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7cUJBQzVEO29CQUNELHdFQUF3RTtvQkFDeEUsT0FBTyxZQUFZLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLHlCQUFnQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNHO1lBRUQsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEMsSUFBSSx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDaEMsSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO3dCQUN4QixpRUFBaUU7d0JBQ2pFLE9BQU8sUUFBUSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztxQkFDM0U7b0JBQ0QsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO2lCQUM5RDthQUNGO1lBQ0QsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLHlCQUF5QjtTQUN0RTthQUFNLElBQUkscUJBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqQyxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBRS9CLElBQUksZUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7Z0JBQ3ZELE9BQU8sRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUMsQ0FBQzthQUNsQztpQkFBTSxJQUFJLGVBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUMvRCxPQUFPLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUM7YUFDbkM7WUFFRCxPQUFPLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQztTQUNoQjtRQUVELDhFQUE4RTtRQUM5RSx5Q0FBeUM7S0FDMUM7SUFFRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBakRELDRCQWlEQztBQUVELGNBQXFCLE9BQXNELEVBQUUsTUFBYztJQUN6RixPQUFPO0lBQ1AsSUFBSSxPQUFPLEVBQUU7UUFDWCxJQUFJLHFCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkIsT0FBTyx3QkFBZSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNsRTthQUFNLElBQUkscUJBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM5QixPQUFPLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUMsQ0FBQztTQUMvQjtLQUNGO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVZELG9CQVVDO0FBRUQsYUFBb0IsT0FBb0I7SUFDdEMsNEJBQVcsT0FBTyxJQUFFLElBQUksRUFBRSxHQUFHLElBQUU7QUFDakMsQ0FBQztBQUZELGtCQUVDO0FBRUQ7O0dBRUc7QUFDSCxxQ0FBcUMsS0FBcUI7SUFDeEQsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssRUFBRTtRQUMvQixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUM5QixJQUFJLG1CQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxXQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsbUJBQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQztLQUNwRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELHVCQUNFLFVBQWtELEVBQ2xELE9BQWtCLEVBQUUsU0FBaUIsRUFBRSxLQUFxQixFQUFFLElBQVU7SUFFeEUsSUFBSSxvQkFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3hCLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQyxJQUFJLGVBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsR0FBRyxFQUFFLGlCQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUU7Z0JBQ3ZFLCtCQUErQjtnQkFDL0IsOERBQThEO2dCQUM5RCx5REFBeUQ7Z0JBQ3pELHdFQUF3RTtnQkFDeEUsSUFBSSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7b0JBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUMsU0FBUyxXQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xGO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSwyQkFBMkIsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDdEMsT0FBTzt3QkFDTCxLQUFLLEVBQUUsU0FBUzt3QkFDaEIsS0FBSyxFQUFFLENBQUM7cUJBQ1QsQ0FBQztpQkFDSDtnQkFDRCxJQUFJLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtvQkFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUNqRCxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBQyxDQUMxRCxDQUFDLENBQUM7aUJBQ0o7YUFDRjtTQUNGO1FBRUQsSUFBSSxVQUFVLEtBQUssV0FBVyxFQUFFO1lBQzlCLE9BQU8sT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUM7U0FDbEU7YUFBTSxFQUFFLFlBQVk7WUFDbkIsT0FBTyxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQztTQUNqRTtLQUNGO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQXJDRCxzQ0FxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFV0aWxpdHkgZmlsZXMgZm9yIHByb2R1Y2luZyBWZWdhIFZhbHVlUmVmIGZvciBtYXJrc1xuICovXG5pbXBvcnQge2lzQXJyYXksIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge0NoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDaGFubmVsRGVmLFxuICBDaGFubmVsRGVmV2l0aENvbmRpdGlvbixcbiAgRmllbGREZWYsXG4gIEZpZWxkUmVmT3B0aW9uLFxuICBpc0ZpZWxkRGVmLFxuICBpc1ZhbHVlRGVmLFxuICBUZXh0RmllbGREZWYsXG4gIHZnRmllbGQsXG59IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrLCBNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW4sIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4uLy4uL3N0YWNrJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIHNvbWV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NpZ25hbFJlZiwgVmdWYWx1ZVJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlLCBmb3JtYXRTaWduYWxSZWZ9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50fSBmcm9tICcuLi9zY2FsZS9jb21wb25lbnQnO1xuXG5cbi8vIFRPRE86IHdlIG5lZWQgdG8gZmluZCBhIHdheSB0byByZWZhY3RvciB0aGVzZSBzbyB0aGF0IHNjYWxlTmFtZSBpcyBhIHBhcnQgb2Ygc2NhbGVcbi8vIGJ1dCB0aGF0J3MgY29tcGxpY2F0ZWQuICBGb3Igbm93LCB0aGlzIGlzIGEgaHVnZSBzdGVwIG1vdmluZyBmb3J3YXJkLlxuXG4vKipcbiAqIEByZXR1cm4gVmVnYSBWYWx1ZVJlZiBmb3Igc3RhY2thYmxlIHggb3IgeVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhY2thYmxlKGNoYW5uZWw6ICd4JyB8ICd5JywgY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCBzY2FsZU5hbWU6IHN0cmluZywgc2NhbGU6IFNjYWxlQ29tcG9uZW50LFxuICAgIHN0YWNrOiBTdGFja1Byb3BlcnRpZXMsIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYpOiBWZ1ZhbHVlUmVmIHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikgJiYgc3RhY2sgJiYgY2hhbm5lbCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgLy8geCBvciB5IHVzZSBzdGFja19lbmQgc28gdGhhdCBzdGFja2VkIGxpbmUncyBwb2ludCBtYXJrIHVzZSBzdGFja19lbmQgdG9vLlxuICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHtzdWZmaXg6ICdlbmQnfSk7XG4gIH1cbiAgcmV0dXJuIG1pZFBvaW50KGNoYW5uZWwsIGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwgc2NhbGUsIHN0YWNrLCBkZWZhdWx0UmVmKTtcbn1cblxuLyoqXG4gKiBAcmV0dXJuIFZlZ2EgVmFsdWVSZWYgZm9yIHN0YWNrYWJsZSB4MiBvciB5MlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhY2thYmxlMihjaGFubmVsOiAneDInIHwgJ3kyJywgYUZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIGEyZmllbGREZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCxcbiAgICBzdGFjazogU3RhY2tQcm9wZXJ0aWVzLCBkZWZhdWx0UmVmOiBWZ1ZhbHVlUmVmKTogVmdWYWx1ZVJlZiB7XG4gIGlmIChpc0ZpZWxkRGVmKGFGaWVsZERlZikgJiYgc3RhY2sgJiZcbiAgICAgIC8vIElmIGZpZWxkQ2hhbm5lbCBpcyBYIGFuZCBjaGFubmVsIGlzIFgyIChvciBZIGFuZCBZMilcbiAgICAgIGNoYW5uZWwuY2hhckF0KDApID09PSBzdGFjay5maWVsZENoYW5uZWwuY2hhckF0KDApXG4gICAgICApIHtcbiAgICByZXR1cm4gZmllbGRSZWYoYUZpZWxkRGVmLCBzY2FsZU5hbWUsIHtzdWZmaXg6ICdzdGFydCd9KTtcbiAgfVxuICByZXR1cm4gbWlkUG9pbnQoY2hhbm5lbCwgYTJmaWVsZERlZiwgc2NhbGVOYW1lLCBzY2FsZSwgc3RhY2ssIGRlZmF1bHRSZWYpO1xufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9mZnNldChjaGFubmVsOiAneCcgfCAneScgfCAneDInIHwgJ3kyJywgbWFya0RlZjogTWFya0RlZikge1xuICBjb25zdCBvZmZzZXRDaGFubmVsID0gY2hhbm5lbCArICdPZmZzZXQnO1xuICAvLyBUT0RPOiBpbiB0aGUgZnV0dXJlIHJlYWQgZnJvbSBlbmNvZGluZyBjaGFubmVsIHRvb1xuXG4gIGNvbnN0IG1hcmtEZWZPZmZzZXRWYWx1ZSA9IG1hcmtEZWZbb2Zmc2V0Q2hhbm5lbF07XG4gIGlmIChtYXJrRGVmT2Zmc2V0VmFsdWUpIHtcbiAgICByZXR1cm4gbWFya0RlZk9mZnNldFZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBWYWx1ZSBSZWYgZm9yIGJpbm5lZCBmaWVsZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcsIHNpZGU6ICdzdGFydCcgfCAnZW5kJywgb2Zmc2V0PzogbnVtYmVyKSB7XG4gIGNvbnN0IGJpblN1ZmZpeCA9IHNpZGUgPT09ICdzdGFydCcgPyB1bmRlZmluZWQgOiAnZW5kJztcbiAgcmV0dXJuIGZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXh9LCBvZmZzZXQgPyB7b2Zmc2V0fSA6IHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkUmVmKFxuICAgIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZU5hbWU6IHN0cmluZywgb3B0OiBGaWVsZFJlZk9wdGlvbixcbiAgICBtaXhpbnM/OiB7b2Zmc2V0PzogbnVtYmVyIHwgVmdWYWx1ZVJlZiwgYmFuZD86IG51bWJlcnxib29sZWFufVxuICApOiBWZ1ZhbHVlUmVmIHtcblxuICBjb25zdCByZWY6IFZnVmFsdWVSZWYgPSB7XG4gICAgLi4uKHNjYWxlTmFtZSA/IHtzY2FsZTogc2NhbGVOYW1lfSA6IHt9KSxcbiAgICBmaWVsZDogdmdGaWVsZChmaWVsZERlZiwgb3B0KSxcbiAgfTtcblxuICBpZiAobWl4aW5zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnJlZixcbiAgICAgIC4uLm1peGluc1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHJlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhbmRSZWYoc2NhbGVOYW1lOiBzdHJpbmcsIGJhbmQ6IG51bWJlcnxib29sZWFuID0gdHJ1ZSk6IFZnVmFsdWVSZWYge1xuICByZXR1cm4ge1xuICAgIHNjYWxlOiBzY2FsZU5hbWUsXG4gICAgYmFuZDogYmFuZFxuICB9O1xufVxuXG4vKipcbiAqIFNpZ25hbCB0aGF0IHJldHVybnMgdGhlIG1pZGRsZSBvZiBhIGJpbi4gU2hvdWxkIG9ubHkgYmUgdXNlZCB3aXRoIHggYW5kIHkuXG4gKi9cbmZ1bmN0aW9uIGJpbk1pZFNpZ25hbChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHtcbiAgICBzaWduYWw6IGAoYCArXG4gICAgICBgc2NhbGUoXCIke3NjYWxlTmFtZX1cIiwgJHt2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pfSlgICtcbiAgICAgIGAgKyBgICtcbiAgICAgIGBzY2FsZShcIiR7c2NhbGVOYW1lfVwiLCAke3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnLCBleHByOiAnZGF0dW0nfSl9KWArXG4gICAgYCkvMmBcbiAgfTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7VmdWYWx1ZVJlZn0gVmFsdWUgUmVmIGZvciB4YyAvIHljIG9yIG1pZCBwb2ludCBmb3Igb3RoZXIgY2hhbm5lbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWRQb2ludChjaGFubmVsOiBDaGFubmVsLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHNjYWxlTmFtZTogc3RyaW5nLCBzY2FsZTogU2NhbGVDb21wb25lbnQsIHN0YWNrOiBTdGFja1Byb3BlcnRpZXMsIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYpOiBWZ1ZhbHVlUmVmIHtcbiAgLy8gVE9ETzogZGF0dW0gc3VwcG9ydFxuXG4gIGlmIChjaGFubmVsRGVmKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblxuICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICBpZiAoY2hhbm5lbERlZi5iaW4pIHtcbiAgICAgICAgLy8gVXNlIG1pZGRsZSBvbmx5IGZvciB4IGFuIHkgdG8gcGxhY2UgbWFya3MgaW4gdGhlIGNlbnRlciBiZXR3ZWVuIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJpbiByYW5nZS5cbiAgICAgICAgLy8gV2UgZG8gbm90IHVzZSB0aGUgbWlkIHBvaW50IGZvciBvdGhlciBjaGFubmVscyAoZS5nLiBzaXplKSBzbyB0aGF0IHByb3BlcnRpZXMgb2YgbGVnZW5kcyBhbmQgbWFya3MgbWF0Y2guXG4gICAgICAgIGlmIChjb250YWlucyhbWCwgWV0sIGNoYW5uZWwpICYmIGNoYW5uZWxEZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgICAgICAgaWYgKHN0YWNrICYmIHN0YWNrLmltcHV0ZSkge1xuICAgICAgICAgICAgLy8gRm9yIHN0YWNrLCB3ZSBjb21wdXRlZCBiaW5fbWlkIHNvIHdlIGNhbiBpbXB1dGUuXG4gICAgICAgICAgICByZXR1cm4gZmllbGRSZWYoY2hhbm5lbERlZiwgc2NhbGVOYW1lLCB7YmluU3VmZml4OiAnbWlkJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBGb3Igbm9uLXN0YWNrLCB3ZSBjYW4ganVzdCBjYWxjdWxhdGUgYmluIG1pZCBvbiB0aGUgZmx5IHVzaW5nIHNpZ25hbC5cbiAgICAgICAgICByZXR1cm4gYmluTWlkU2lnbmFsKGNoYW5uZWxEZWYsIHNjYWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkUmVmKGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwgYmluUmVxdWlyZXNSYW5nZShjaGFubmVsRGVmLCBjaGFubmVsKSA/IHtiaW5TdWZmaXg6ICdyYW5nZSd9IDoge30pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NhbGUpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGUuZ2V0KCd0eXBlJyk7XG4gICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgICAgICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2JhbmQnKSB7XG4gICAgICAgICAgICAvLyBGb3IgYmFuZCwgdG8gZ2V0IG1pZCBwb2ludCwgbmVlZCB0byBvZmZzZXQgYnkgaGFsZiBvZiB0aGUgYmFuZFxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkUmVmKGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwge2JpblN1ZmZpeDogJ3JhbmdlJ30sIHtiYW5kOiAwLjV9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZpZWxkUmVmKGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwge2JpblN1ZmZpeDogJ3JhbmdlJ30pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRSZWYoY2hhbm5lbERlZiwgc2NhbGVOYW1lLCB7fSk7IC8vIG5vIG5lZWQgZm9yIGJpbiBzdWZmaXhcbiAgICB9IGVsc2UgaWYgKGlzVmFsdWVEZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY2hhbm5lbERlZi52YWx1ZTtcblxuICAgICAgaWYgKGNvbnRhaW5zKFsneCcsICd4MiddLCBjaGFubmVsKSAmJiB2YWx1ZSA9PT0gJ3dpZHRoJykge1xuICAgICAgICByZXR1cm4ge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fTtcbiAgICAgIH0gZWxzZSBpZiAoY29udGFpbnMoWyd5JywgJ3kyJ10sIGNoYW5uZWwpICYmIHZhbHVlID09PSAnaGVpZ2h0Jykge1xuICAgICAgICByZXR1cm4ge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7dmFsdWV9O1xuICAgIH1cblxuICAgIC8vIElmIGNoYW5uZWxEZWYgaXMgbmVpdGhlciBmaWVsZCBkZWYgb3IgdmFsdWUgZGVmLCBpdCdzIGEgY29uZGl0aW9uLW9ubHkgZGVmLlxuICAgIC8vIEluIHN1Y2ggY2FzZSwgd2Ugd2lsbCB1c2UgZGVmYXVsdCByZWYuXG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFJlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHQodGV4dERlZjogQ2hhbm5lbERlZldpdGhDb25kaXRpb248VGV4dEZpZWxkRGVmPHN0cmluZz4+LCBjb25maWc6IENvbmZpZyk6IFZnVmFsdWVSZWYge1xuICAvLyB0ZXh0XG4gIGlmICh0ZXh0RGVmKSB7XG4gICAgaWYgKGlzRmllbGREZWYodGV4dERlZikpIHtcbiAgICAgIHJldHVybiBmb3JtYXRTaWduYWxSZWYodGV4dERlZiwgdGV4dERlZi5mb3JtYXQsICdkYXR1bScsIGNvbmZpZyk7XG4gICAgfSBlbHNlIGlmIChpc1ZhbHVlRGVmKHRleHREZWYpKSB7XG4gICAgICByZXR1cm4ge3ZhbHVlOiB0ZXh0RGVmLnZhbHVlfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pZChzaXplUmVmOiBWZ1NpZ25hbFJlZik6IFZnVmFsdWVSZWYge1xuICByZXR1cm4gey4uLnNpemVSZWYsIG11bHQ6IDAuNX07XG59XG5cbi8qKlxuICogV2hldGhlciB0aGUgc2NhbGUgZGVmaW5pdGVseSBpbmNsdWRlcyB6ZXJvIGluIHRoZSBkb21haW5cbiAqL1xuZnVuY3Rpb24gZG9tYWluRGVmaW5pdGVseUluY2x1ZGVaZXJvKHNjYWxlOiBTY2FsZUNvbXBvbmVudCkge1xuICBpZiAoc2NhbGUuZ2V0KCd6ZXJvJykgIT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgY29uc3QgZG9tYWlucyA9IHNjYWxlLmRvbWFpbnM7XG4gIGlmIChpc0FycmF5KGRvbWFpbnMpKSB7XG4gICAgcmV0dXJuIHNvbWUoZG9tYWlucywgKGQpID0+IGlzQXJyYXkoZCkgJiYgZC5sZW5ndGggPT09IDIgJiYgZFswXSA8PTAgJiYgZFsxXSA+PSAwKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0UmVmKFxuICBkZWZhdWx0UmVmOiBWZ1ZhbHVlUmVmIHwgJ3plcm9Pck1pbicgfCAnemVyb09yTWF4JyxcbiAgY2hhbm5lbDogJ3gnIHwgJ3knLCBzY2FsZU5hbWU6IHN0cmluZywgc2NhbGU6IFNjYWxlQ29tcG9uZW50LCBtYXJrOiBNYXJrXG4pIHtcbiAgaWYgKGlzU3RyaW5nKGRlZmF1bHRSZWYpKSB7XG4gICAgaWYgKHNjYWxlTmFtZSkge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGUuZ2V0KCd0eXBlJyk7XG4gICAgICBpZiAoY29udGFpbnMoW1NjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5USU1FLCBTY2FsZVR5cGUuVVRDXSwgc2NhbGVUeXBlKSkge1xuICAgICAgICAvLyBMb2cgc2NhbGVzIGNhbm5vdCBoYXZlIHplcm8uXG4gICAgICAgIC8vIFplcm8gaW4gdGltZSBzY2FsZSBpcyBhcmJpdHJhcnksIGFuZCBkb2VzIG5vdCBhZmZlY3QgcmF0aW8uXG4gICAgICAgIC8vIChUaW1lIGlzIGFuIGludGVydmFsIGxldmVsIG9mIG1lYXN1cmVtZW50LCBub3QgcmF0aW8pLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV2ZWxfb2ZfbWVhc3VyZW1lbnQgZm9yIG1vcmUgaW5mby5cbiAgICAgICAgaWYgKG1hcmsgPT09ICdiYXInIHx8IG1hcmsgPT09ICdhcmVhJykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLm5vblplcm9TY2FsZVVzZWRXaXRoTGVuZ3RoTWFyayhtYXJrLCBjaGFubmVsLCB7c2NhbGVUeXBlfSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZG9tYWluRGVmaW5pdGVseUluY2x1ZGVaZXJvKHNjYWxlKSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzY2FsZTogc2NhbGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXJrID09PSAnYmFyJyB8fCBtYXJrID09PSAnYXJlYScpIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5ub25aZXJvU2NhbGVVc2VkV2l0aExlbmd0aE1hcmsoXG4gICAgICAgICAgICBtYXJrLCBjaGFubmVsLCB7emVyb0ZhbHNlOiBzY2FsZS5leHBsaWNpdC56ZXJvID09PSBmYWxzZX1cbiAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkZWZhdWx0UmVmID09PSAnemVyb09yTWluJykge1xuICAgICAgcmV0dXJuIGNoYW5uZWwgPT09ICd4JyA/IHt2YWx1ZTogMH0gOiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fTtcbiAgICB9IGVsc2UgeyAvLyB6ZXJvT3JNYXhcbiAgICAgIHJldHVybiBjaGFubmVsID09PSAneCcgPyB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319IDoge3ZhbHVlOiAwfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRSZWY7XG59XG5cbiJdfQ==