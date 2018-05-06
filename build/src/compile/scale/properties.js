"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var log = require("../../log");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var util = require("../../util");
var model_1 = require("../model");
var split_1 = require("../split");
var range_1 = require("./range");
function parseScaleProperty(model, property) {
    if (model_1.isUnitModel(model)) {
        parseUnitScaleProperty(model, property);
    }
    else {
        parseNonUnitScaleProperty(model, property);
    }
}
exports.parseScaleProperty = parseScaleProperty;
function parseUnitScaleProperty(model, property) {
    var localScaleComponents = model.component.scales;
    util_1.keys(localScaleComponents).forEach(function (channel) {
        var specifiedScale = model.specifiedScales[channel];
        var localScaleCmpt = localScaleComponents[channel];
        var mergedScaleCmpt = model.getScaleComponent(channel);
        var fieldDef = model.fieldDef(channel);
        var sort = model.sort(channel);
        var config = model.config;
        var specifiedValue = specifiedScale[property];
        var sType = mergedScaleCmpt.get('type');
        var supportedByScaleType = scale_1.scaleTypeSupportProperty(sType, property);
        var channelIncompatability = scale_1.channelScalePropertyIncompatability(channel, property);
        if (specifiedValue !== undefined) {
            // If there is a specified value, check if it is compatible with scale type and channel
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(sType, property, channel));
            }
            else if (channelIncompatability) { // channel
                log.warn(channelIncompatability);
            }
        }
        if (supportedByScaleType && channelIncompatability === undefined) {
            if (specifiedValue !== undefined) {
                // copyKeyFromObject ensure type safety
                localScaleCmpt.copyKeyFromObject(property, specifiedScale);
            }
            else {
                var value = getDefaultValue(property, channel, fieldDef, sort, mergedScaleCmpt.get('type'), mergedScaleCmpt.get('padding'), mergedScaleCmpt.get('paddingInner'), specifiedScale.domain, model.markDef, config);
                if (value !== undefined) {
                    localScaleCmpt.set(property, value, false);
                }
            }
        }
    });
}
// Note: This method is used in Voyager.
function getDefaultValue(property, channel, fieldDef, sort, scaleType, scalePadding, scalePaddingInner, specifiedDomain, markDef, config) {
    var scaleConfig = config.scale;
    // If we have default rule-base, determine default value first
    switch (property) {
        case 'nice':
            return nice(scaleType, channel, fieldDef);
        case 'padding':
            return padding(channel, scaleType, scaleConfig, fieldDef, markDef, config.bar);
        case 'paddingInner':
            return paddingInner(scalePadding, channel, scaleConfig);
        case 'paddingOuter':
            return paddingOuter(scalePadding, channel, scaleType, scalePaddingInner, scaleConfig);
        case 'reverse':
            return reverse(scaleType, sort);
        case 'zero':
            return zero(channel, fieldDef, specifiedDomain, markDef);
    }
    // Otherwise, use scale config
    return scaleConfig[property];
}
exports.getDefaultValue = getDefaultValue;
function parseNonUnitScaleProperty(model, property) {
    var localScaleComponents = model.component.scales;
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        if (property === 'range') {
            range_1.parseScaleRange(child);
        }
        else {
            parseScaleProperty(child, property);
        }
    }
    util_1.keys(localScaleComponents).forEach(function (channel) {
        var valueWithExplicit;
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childComponent = child.component.scales[channel];
            if (childComponent) {
                var childValueWithExplicit = childComponent.getWithExplicit(property);
                valueWithExplicit = split_1.mergeValuesWithExplicit(valueWithExplicit, childValueWithExplicit, property, 'scale', split_1.tieBreakByComparing(function (v1, v2) {
                    switch (property) {
                        case 'range':
                            // For range step, prefer larger step
                            if (v1.step && v2.step) {
                                return v1.step - v2.step;
                            }
                            return 0;
                        // TODO: precedence rule for other properties
                    }
                    return 0;
                }));
            }
        }
        localScaleComponents[channel].setWithExplicit(property, valueWithExplicit);
    });
}
exports.parseNonUnitScaleProperty = parseNonUnitScaleProperty;
function nice(scaleType, channel, fieldDef) {
    if (fieldDef.bin || util.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scaleType)) {
        return undefined;
    }
    return util.contains([channel_1.X, channel_1.Y], channel); // return true for quantitative X/Y unless binned
}
exports.nice = nice;
function padding(channel, scaleType, scaleConfig, fieldDef, markDef, barConfig) {
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        if (scale_1.isContinuousToContinuous(scaleType)) {
            if (scaleConfig.continuousPadding !== undefined) {
                return scaleConfig.continuousPadding;
            }
            var type = markDef.type, orient = markDef.orient;
            if (type === 'bar' && !fieldDef.bin) {
                if ((orient === 'vertical' && channel === 'x') ||
                    (orient === 'horizontal' && channel === 'y')) {
                    return barConfig.continuousBandSize;
                }
            }
        }
        if (scaleType === scale_1.ScaleType.POINT) {
            return scaleConfig.pointPadding;
        }
    }
    return undefined;
}
exports.padding = padding;
function paddingInner(paddingValue, channel, scaleConfig) {
    if (paddingValue !== undefined) {
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
function paddingOuter(paddingValue, channel, scaleType, paddingInnerValue, scaleConfig) {
    if (paddingValue !== undefined) {
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
            return paddingInnerValue / 2;
        }
    }
    return undefined;
}
exports.paddingOuter = paddingOuter;
function reverse(scaleType, sort) {
    if (scale_1.hasContinuousDomain(scaleType) && sort === 'descending') {
        // For continuous domain scales, Vega does not support domain sort.
        // Thus, we reverse range instead if sort is descending
        return true;
    }
    return undefined;
}
exports.reverse = reverse;
function zero(channel, fieldDef, specifiedScale, markDef) {
    // If users explicitly provide a domain range, we should not augment zero as that will be unexpected.
    var hasCustomDomain = !!specifiedScale && specifiedScale !== 'unaggregated';
    if (hasCustomDomain) {
        return false;
    }
    // If there is no custom domain, return true only for the following cases:
    // 1) using quantitative field with size
    // While this can be either ratio or interval fields, our assumption is that
    // ratio are more common.
    if (channel === 'size' && fieldDef.type === 'quantitative') {
        return true;
    }
    // 2) non-binned, quantitative x-scale or y-scale
    // (For binning, we should not include zero by default because binning are calculated without zero.)
    if (!fieldDef.bin && util.contains([channel_1.X, channel_1.Y], channel)) {
        var orient = markDef.orient, type = markDef.type;
        if (util_1.contains(['bar', 'area', 'line', 'trail'], type)) {
            if ((orient === 'horizontal' && channel === 'y') ||
                (orient === 'vertical' && channel === 'x')) {
                return false;
            }
        }
        return true;
    }
    return false;
}
exports.zero = zero;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEQ7QUFHMUQsK0JBQWlDO0FBRWpDLHFDQUEwTDtBQUUxTCxtQ0FBMEM7QUFDMUMsaUNBQW1DO0FBRW5DLGtDQUE0QztBQUM1QyxrQ0FBZ0Y7QUFHaEYsaUNBQXdDO0FBRXhDLDRCQUFtQyxLQUFZLEVBQUUsUUFBNkM7SUFDNUYsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLHNCQUFzQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN6QztTQUFNO1FBQ0wseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQsZ0NBQWdDLEtBQWdCLEVBQUUsUUFBNkM7SUFDN0YsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsV0FBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDdkQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFNUIsSUFBTSxjQUFjLEdBQUcs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Q0FBQyxFQUMxQztnQkFDQSxPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBakNELG9CQWlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbm5lbCwgU2NhbGVDaGFubmVsLCBYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0JhckNvbmZpZywgTWFya0RlZn0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2NoYW5uZWxTY2FsZVByb3BlcnR5SW5jb21wYXRhYmlsaXR5LCBEb21haW4sIGhhc0NvbnRpbnVvdXNEb21haW4sIGlzQ29udGludW91c1RvQ29udGludW91cywgTmljZVRpbWUsIFNjYWxlLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlLCBzY2FsZVR5cGVTdXBwb3J0UHJvcGVydHl9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7U29ydEZpZWxkLCBTb3J0T3JkZXJ9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0IHtjb250YWlucywga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NjYWxlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQsIHRpZUJyZWFrQnlDb21wYXJpbmd9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXgsIFNjYWxlQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VTY2FsZVJhbmdlfSBmcm9tICcuL3JhbmdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVQcm9wZXJ0eShtb2RlbDogTW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVQcm9wZXJ0eShtb2RlbCwgcHJvcGVydHkpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlUHJvcGVydHkobW9kZWwsIHByb3BlcnR5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZVByb3BlcnR5KG1vZGVsOiBVbml0TW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAga2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBtb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3QgbG9jYWxTY2FsZUNtcHQgPSBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXTtcbiAgICBjb25zdCBtZXJnZWRTY2FsZUNtcHQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnQgPSBtb2RlbC5zb3J0KGNoYW5uZWwpO1xuICAgIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZztcblxuICAgIGNvbnN0IHNwZWNpZmllZFZhbHVlID0gc3BlY2lmaWVkU2NhbGVbcHJvcGVydHldO1xuICAgIGNvbnN0IHNUeXBlID0gbWVyZ2VkU2NhbGVDbXB0LmdldCgndHlwZScpO1xuXG4gICAgY29uc3Qgc3VwcG9ydGVkQnlTY2FsZVR5cGUgPSBzY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoc1R5cGUsIHByb3BlcnR5KTtcbiAgICBjb25zdCBjaGFubmVsSW5jb21wYXRhYmlsaXR5ID0gY2hhbm5lbFNjYWxlUHJvcGVydHlJbmNvbXBhdGFiaWxpdHkoY2hhbm5lbCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgc3BlY2lmaWVkIHZhbHVlLCBjaGVjayBpZiBpdCBpcyBjb21wYXRpYmxlIHdpdGggc2NhbGUgdHlwZSBhbmQgY2hhbm5lbFxuICAgICAgaWYgKCFzdXBwb3J0ZWRCeVNjYWxlVHlwZSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVByb3BlcnR5Tm90V29ya1dpdGhTY2FsZVR5cGUoc1R5cGUsIHByb3BlcnR5LCBjaGFubmVsKSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkpIHsgLy8gY2hhbm5lbFxuICAgICAgICBsb2cud2FybihjaGFubmVsSW5jb21wYXRhYmlsaXR5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN1cHBvcnRlZEJ5U2NhbGVUeXBlICYmIGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gY29weUtleUZyb21PYmplY3QgZW5zdXJlIHR5cGUgc2FmZXR5XG4gICAgICAgIGxvY2FsU2NhbGVDbXB0LmNvcHlLZXlGcm9tT2JqZWN0KHByb3BlcnR5LCBzcGVjaWZpZWRTY2FsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldERlZmF1bHRWYWx1ZShcbiAgICAgICAgICBwcm9wZXJ0eSwgY2hhbm5lbCwgZmllbGREZWYsIHNvcnQsXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgndHlwZScpLFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3BhZGRpbmcnKSxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCdwYWRkaW5nSW5uZXInKSxcbiAgICAgICAgICBzcGVjaWZpZWRTY2FsZS5kb21haW4sXG4gICAgICAgICAgbW9kZWwubWFya0RlZiwgY29uZmlnXG4gICAgICAgICk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KHByb3BlcnR5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLy8gTm90ZTogVGhpcyBtZXRob2QgaXMgdXNlZCBpbiBWb3lhZ2VyLlxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYWx1ZShcbiAgcHJvcGVydHk6IGtleW9mIFNjYWxlLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc29ydDogU29ydE9yZGVyIHwgU29ydEZpZWxkPHN0cmluZz4gfCBzdHJpbmdbXSxcbiAgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlUGFkZGluZzogbnVtYmVyLCBzY2FsZVBhZGRpbmdJbm5lcjogbnVtYmVyLFxuICBzcGVjaWZpZWREb21haW46IFNjYWxlWydkb21haW4nXSwgbWFya0RlZjogTWFya0RlZiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qgc2NhbGVDb25maWcgPSBjb25maWcuc2NhbGU7XG5cbiAgLy8gSWYgd2UgaGF2ZSBkZWZhdWx0IHJ1bGUtYmFzZSwgZGV0ZXJtaW5lIGRlZmF1bHQgdmFsdWUgZmlyc3RcbiAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgIGNhc2UgJ25pY2UnOlxuICAgICAgcmV0dXJuIG5pY2Uoc2NhbGVUeXBlLCBjaGFubmVsLCBmaWVsZERlZik7XG4gICAgY2FzZSAncGFkZGluZyc6XG4gICAgICByZXR1cm4gcGFkZGluZyhjaGFubmVsLCBzY2FsZVR5cGUsIHNjYWxlQ29uZmlnLCBmaWVsZERlZiwgbWFya0RlZiwgY29uZmlnLmJhcik7XG4gICAgY2FzZSAncGFkZGluZ0lubmVyJzpcbiAgICAgIHJldHVybiBwYWRkaW5nSW5uZXIoc2NhbGVQYWRkaW5nLCBjaGFubmVsLCBzY2FsZUNvbmZpZyk7XG4gICAgY2FzZSAncGFkZGluZ091dGVyJzpcbiAgICAgIHJldHVybiBwYWRkaW5nT3V0ZXIoc2NhbGVQYWRkaW5nLCBjaGFubmVsLCBzY2FsZVR5cGUsIHNjYWxlUGFkZGluZ0lubmVyLCBzY2FsZUNvbmZpZyk7XG4gICAgY2FzZSAncmV2ZXJzZSc6XG4gICAgICByZXR1cm4gcmV2ZXJzZShzY2FsZVR5cGUsIHNvcnQpO1xuICAgIGNhc2UgJ3plcm8nOlxuICAgICAgcmV0dXJuIHplcm8oY2hhbm5lbCwgZmllbGREZWYsIHNwZWNpZmllZERvbWFpbiwgbWFya0RlZik7XG4gIH1cbiAgLy8gT3RoZXJ3aXNlLCB1c2Ugc2NhbGUgY29uZmlnXG4gIHJldHVybiBzY2FsZUNvbmZpZ1twcm9wZXJ0eV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZVByb3BlcnR5KG1vZGVsOiBNb2RlbCwgcHJvcGVydHk6IGtleW9mIChTY2FsZSB8IFNjYWxlQ29tcG9uZW50UHJvcHMpKSB7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgaWYgKHByb3BlcnR5ID09PSAncmFuZ2UnKSB7XG4gICAgICBwYXJzZVNjYWxlUmFuZ2UoY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZVNjYWxlUHJvcGVydHkoY2hpbGQsIHByb3BlcnR5KTtcbiAgICB9XG4gIH1cblxuICBrZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBsZXQgdmFsdWVXaXRoRXhwbGljaXQ6IEV4cGxpY2l0PGFueT47XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjaGlsZENvbXBvbmVudCA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgY2hpbGRWYWx1ZVdpdGhFeHBsaWNpdCA9IGNoaWxkQ29tcG9uZW50LmdldFdpdGhFeHBsaWNpdChwcm9wZXJ0eSk7XG4gICAgICAgIHZhbHVlV2l0aEV4cGxpY2l0ID0gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8VmdTY2FsZSwgYW55PihcbiAgICAgICAgICB2YWx1ZVdpdGhFeHBsaWNpdCwgY2hpbGRWYWx1ZVdpdGhFeHBsaWNpdCxcbiAgICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgICAnc2NhbGUnLFxuICAgICAgICAgIHRpZUJyZWFrQnlDb21wYXJpbmc8VmdTY2FsZSwgYW55PigodjEsIHYyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICAgICAgICAvLyBGb3IgcmFuZ2Ugc3RlcCwgcHJlZmVyIGxhcmdlciBzdGVwXG4gICAgICAgICAgICAgICAgaWYgKHYxLnN0ZXAgJiYgdjIuc3RlcCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHYxLnN0ZXAgLSB2Mi5zdGVwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgLy8gVE9ETzogcHJlY2VkZW5jZSBydWxlIGZvciBvdGhlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5zZXRXaXRoRXhwbGljaXQocHJvcGVydHksIHZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuaWNlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPik6IGJvb2xlYW4gfCBOaWNlVGltZSB7XG4gIGlmIChmaWVsZERlZi5iaW4gfHwgdXRpbC5jb250YWlucyhbU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdLCBzY2FsZVR5cGUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpOyAvLyByZXR1cm4gdHJ1ZSBmb3IgcXVhbnRpdGF0aXZlIFgvWSB1bmxlc3MgYmlubmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nKGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBtYXJrRGVmOiBNYXJrRGVmLCBiYXJDb25maWc6IEJhckNvbmZpZykge1xuICBpZiAodXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgaWYgKGlzQ29udGludW91c1RvQ29udGludW91cyhzY2FsZVR5cGUpKSB7XG4gICAgICBpZiAoc2NhbGVDb25maWcuY29udGludW91c1BhZGRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc2NhbGVDb25maWcuY29udGludW91c1BhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHt0eXBlLCBvcmllbnR9ID0gbWFya0RlZjtcbiAgICAgIGlmICh0eXBlID09PSAnYmFyJyAmJiAhZmllbGREZWYuYmluKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAob3JpZW50ID09PSAndmVydGljYWwnICYmIGNoYW5uZWwgPT09ICd4JykgfHxcbiAgICAgICAgICAob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgJiYgY2hhbm5lbCA9PT0gJ3knKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gYmFyQ29uZmlnLmNvbnRpbnVvdXNCYW5kU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzY2FsZVR5cGUgPT09IFNjYWxlVHlwZS5QT0lOVCkge1xuICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLnBvaW50UGFkZGluZztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmdJbm5lcihwYWRkaW5nVmFsdWU6IG51bWJlciwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChwYWRkaW5nVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIElmIHVzZXIgaGFzIGFscmVhZHkgbWFudWFsbHkgc3BlY2lmaWVkIFwicGFkZGluZ1wiLCBubyBuZWVkIHRvIGFkZCBkZWZhdWx0IHBhZGRpbmdJbm5lci5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIC8vIFBhZGRpbmcgaXMgb25seSBzZXQgZm9yIFggYW5kIFkgYnkgZGVmYXVsdC5cbiAgICAvLyBCYXNpY2FsbHkgaXQgZG9lc24ndCBtYWtlIHNlbnNlIHRvIGFkZCBwYWRkaW5nIGZvciBjb2xvciBhbmQgc2l6ZS5cblxuICAgIC8vIHBhZGRpbmdPdXRlciB3b3VsZCBvbmx5IGJlIGNhbGxlZCBpZiBpdCdzIGEgYmFuZCBzY2FsZSwganVzdCByZXR1cm4gdGhlIGRlZmF1bHQgZm9yIGJhbmRTY2FsZS5cbiAgICByZXR1cm4gc2NhbGVDb25maWcuYmFuZFBhZGRpbmdJbm5lcjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZ091dGVyKHBhZGRpbmdWYWx1ZTogbnVtYmVyLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgcGFkZGluZ0lubmVyVmFsdWU6IG51bWJlciwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChwYWRkaW5nVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIElmIHVzZXIgaGFzIGFscmVhZHkgbWFudWFsbHkgc3BlY2lmaWVkIFwicGFkZGluZ1wiLCBubyBuZWVkIHRvIGFkZCBkZWZhdWx0IHBhZGRpbmdPdXRlci5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIC8vIFBhZGRpbmcgaXMgb25seSBzZXQgZm9yIFggYW5kIFkgYnkgZGVmYXVsdC5cbiAgICAvLyBCYXNpY2FsbHkgaXQgZG9lc24ndCBtYWtlIHNlbnNlIHRvIGFkZCBwYWRkaW5nIGZvciBjb2xvciBhbmQgc2l6ZS5cbiAgICBpZiAoc2NhbGVUeXBlID09PSBTY2FsZVR5cGUuQkFORCkge1xuICAgICAgaWYgKHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nT3V0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc2NhbGVDb25maWcuYmFuZFBhZGRpbmdPdXRlcjtcbiAgICAgIH1cbiAgICAgIC8qIEJ5IGRlZmF1bHQsIHBhZGRpbmdPdXRlciBpcyBwYWRkaW5nSW5uZXIgLyAyLiBUaGUgcmVhc29uIGlzIHRoYXRcbiAgICAgICAgICBzaXplICh3aWR0aC9oZWlnaHQpID0gc3RlcCAqIChjYXJkaW5hbGl0eSAtIHBhZGRpbmdJbm5lciArIDIgKiBwYWRkaW5nT3V0ZXIpLlxuICAgICAgICAgIGFuZCB3ZSB3YW50IHRoZSB3aWR0aC9oZWlnaHQgdG8gYmUgaW50ZWdlciBieSBkZWZhdWx0LlxuICAgICAgICAgIE5vdGUgdGhhdCBzdGVwIChieSBkZWZhdWx0KSBhbmQgY2FyZGluYWxpdHkgYXJlIGludGVnZXJzLikgKi9cbiAgICAgIHJldHVybiBwYWRkaW5nSW5uZXJWYWx1ZSAvIDI7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZlcnNlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzb3J0OiBTb3J0T3JkZXIgfCBTb3J0RmllbGQ8c3RyaW5nPiB8IHN0cmluZ1tdKSB7XG4gIGlmIChoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgJiYgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgLy8gRm9yIGNvbnRpbnVvdXMgZG9tYWluIHNjYWxlcywgVmVnYSBkb2VzIG5vdCBzdXBwb3J0IGRvbWFpbiBzb3J0LlxuICAgIC8vIFRodXMsIHdlIHJldmVyc2UgcmFuZ2UgaW5zdGVhZCBpZiBzb3J0IGlzIGRlc2NlbmRpbmdcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkU2NhbGU6IERvbWFpbiwgbWFya0RlZjogTWFya0RlZikge1xuXG4gIC8vIElmIHVzZXJzIGV4cGxpY2l0bHkgcHJvdmlkZSBhIGRvbWFpbiByYW5nZSwgd2Ugc2hvdWxkIG5vdCBhdWdtZW50IHplcm8gYXMgdGhhdCB3aWxsIGJlIHVuZXhwZWN0ZWQuXG4gIGNvbnN0IGhhc0N1c3RvbURvbWFpbiA9ICEhc3BlY2lmaWVkU2NhbGUgJiYgc3BlY2lmaWVkU2NhbGUgIT09ICd1bmFnZ3JlZ2F0ZWQnO1xuICBpZiAoaGFzQ3VzdG9tRG9tYWluKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gY3VzdG9tIGRvbWFpbiwgcmV0dXJuIHRydWUgb25seSBmb3IgdGhlIGZvbGxvd2luZyBjYXNlczpcblxuICAvLyAxKSB1c2luZyBxdWFudGl0YXRpdmUgZmllbGQgd2l0aCBzaXplXG4gIC8vIFdoaWxlIHRoaXMgY2FuIGJlIGVpdGhlciByYXRpbyBvciBpbnRlcnZhbCBmaWVsZHMsIG91ciBhc3N1bXB0aW9uIGlzIHRoYXRcbiAgLy8gcmF0aW8gYXJlIG1vcmUgY29tbW9uLlxuICBpZiAoY2hhbm5lbCA9PT0gJ3NpemUnICYmIGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyAyKSBub24tYmlubmVkLCBxdWFudGl0YXRpdmUgeC1zY2FsZSBvciB5LXNjYWxlXG4gIC8vIChGb3IgYmlubmluZywgd2Ugc2hvdWxkIG5vdCBpbmNsdWRlIHplcm8gYnkgZGVmYXVsdCBiZWNhdXNlIGJpbm5pbmcgYXJlIGNhbGN1bGF0ZWQgd2l0aG91dCB6ZXJvLilcbiAgaWYgKCFmaWVsZERlZi5iaW4gJiYgdXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgY29uc3Qge29yaWVudCwgdHlwZX0gPSBtYXJrRGVmO1xuICAgIGlmIChjb250YWlucyhbJ2JhcicsICdhcmVhJywgJ2xpbmUnLCAndHJhaWwnXSwgdHlwZSkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnICYmIGNoYW5uZWwgPT09ICd5JykgfHxcbiAgICAgICAgKG9yaWVudCA9PT0gJ3ZlcnRpY2FsJyAmJiBjaGFubmVsID09PSAneCcpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==