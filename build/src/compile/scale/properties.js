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
            else if (channelIncompatability) {
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
            return zero(channel, fieldDef, specifiedDomain);
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
function zero(channel, fieldDef, specifiedScale) {
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
    var hasCustomDomain = !!specifiedScale && specifiedScale !== 'unaggregated';
    if (!hasCustomDomain && !fieldDef.bin && util.contains([channel_1.X, channel_1.Y], channel)) {
        return true;
    }
    return false;
}
exports.zero = zero;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEQ7QUFHMUQsK0JBQWlDO0FBRWpDLHFDQUEwTDtBQUUxTCxtQ0FBZ0M7QUFDaEMsaUNBQW1DO0FBRW5DLGtDQUE0QztBQUM1QyxrQ0FBZ0Y7QUFHaEYsaUNBQXdDO0FBRXhDLDRCQUFtQyxLQUFZLEVBQUUsUUFBNkM7SUFDNUYsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsc0JBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHlCQUF5QixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQsZ0NBQWdDLEtBQWdCLEVBQUUsUUFBNkM7SUFDN0YsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsV0FBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDdkQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQU0sTUFBTSxH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LENBQUMsMkJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDNUQsbUVBQW1FO1FBQ25FLHVEQUF1RDtRQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVBELDBCQU9DO0FBRUQsY0FBcUIsT0FBZ0IsRUFBRSxRQUEwQixFQUFFLGNBQXNCO0lBQ3ZGLHdEQUF3RDtJQUV4RCx3Q0FBd0M7SUFDeEMsNEVBQTRFO0lBQzVFLHlCQUF5QjtJQUN6QixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssTUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGtGQUFrRjtJQUNsRixtR0FBbUc7SUFDbkcsK0dBQStHO0lBQy9HLElBQU0sZUFBZSxHQUFHLENBQUMsQ0FBQyxjQUFjLElBQUksY0FBYyxLQUFLLGNBQWMsQ0FBQztJQUM5RSxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQUMsRUFBRSxXQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWxCRCxvQkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5uZWwsIFNjYWxlQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtCYXJDb25maWcsIE1hcmtEZWZ9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtjaGFubmVsU2NhbGVQcm9wZXJ0eUluY29tcGF0YWJpbGl0eSwgRG9tYWluLCBoYXNDb250aW51b3VzRG9tYWluLCBpc0NvbnRpbnVvdXNUb0NvbnRpbnVvdXMsIE5pY2VUaW1lLCBTY2FsZSwgU2NhbGVDb25maWcsIFNjYWxlVHlwZSwgc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5fSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NjYWxlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQsIHRpZUJyZWFrQnlDb21wYXJpbmd9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXgsIFNjYWxlQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VTY2FsZVJhbmdlfSBmcm9tICcuL3JhbmdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVQcm9wZXJ0eShtb2RlbDogTW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVQcm9wZXJ0eShtb2RlbCwgcHJvcGVydHkpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlUHJvcGVydHkobW9kZWwsIHByb3BlcnR5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZVByb3BlcnR5KG1vZGVsOiBVbml0TW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAga2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBtb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3QgbG9jYWxTY2FsZUNtcHQgPSBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXTtcbiAgICBjb25zdCBtZXJnZWRTY2FsZUNtcHQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnQgPSBtb2RlbC5zb3J0KGNoYW5uZWwpO1xuICAgIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZztcblxuICAgIGNvbnN0IHNwZWNpZmllZFZhbHVlID0gc3BlY2lmaWVkU2NhbGVbcHJvcGVydHldO1xuICAgIGNvbnN0IHNUeXBlID0gbWVyZ2VkU2NhbGVDbXB0LmdldCgndHlwZScpO1xuXG4gICAgY29uc3Qgc3VwcG9ydGVkQnlTY2FsZVR5cGUgPSBzY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoc1R5cGUsIHByb3BlcnR5KTtcbiAgICBjb25zdCBjaGFubmVsSW5jb21wYXRhYmlsaXR5ID0gY2hhbm5lbFNjYWxlUHJvcGVydHlJbmNvbXBhdGFiaWxpdHkoY2hhbm5lbCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgc3BlY2lmaWVkIHZhbHVlLCBjaGVjayBpZiBpdCBpcyBjb21wYXRpYmxlIHdpdGggc2NhbGUgdHlwZSBhbmQgY2hhbm5lbFxuICAgICAgaWYgKCFzdXBwb3J0ZWRCeVNjYWxlVHlwZSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVByb3BlcnR5Tm90V29ya1dpdGhTY2FsZVR5cGUoc1R5cGUsIHByb3BlcnR5LCBjaGFubmVsKSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkpIHsgLy8gY2hhbm5lbFxuICAgICAgICBsb2cud2FybihjaGFubmVsSW5jb21wYXRhYmlsaXR5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN1cHBvcnRlZEJ5U2NhbGVUeXBlICYmIGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gY29weUtleUZyb21PYmplY3QgZW5zdXJlIHR5cGUgc2FmZXR5XG4gICAgICAgIGxvY2FsU2NhbGVDbXB0LmNvcHlLZXlGcm9tT2JqZWN0KHByb3BlcnR5LCBzcGVjaWZpZWRTY2FsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldERlZmF1bHRWYWx1ZShcbiAgICAgICAgICBwcm9wZXJ0eSwgY2hhbm5lbCwgZmllbGREZWYsIHNvcnQsXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgndHlwZScpLFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3BhZGRpbmcnKSxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCdwYWRkaW5nSW5uZXInKSxcbiAgICAgICAgICBzcGVjaWZpZWRTY2FsZS5kb21haW4sXG4gICAgICAgICAgbW9kZWwubWFya0RlZiwgY29uZmlnXG4gICAgICAgICk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KHByb3BlcnR5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLy8gTm90ZTogVGhpcyBtZXRob2QgaXMgdXNlZCBpbiBWb3lhZ2VyLlxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYWx1ZShcbiAgcHJvcGVydHk6IGtleW9mIFNjYWxlLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc29ydDogU29ydE9yZGVyIHwgU29ydEZpZWxkPHN0cmluZz4sXG4gIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZVBhZGRpbmc6IG51bWJlciwgc2NhbGVQYWRkaW5nSW5uZXI6IG51bWJlcixcbiAgc3BlY2lmaWVkRG9tYWluOiBTY2FsZVsnZG9tYWluJ10sIG1hcmtEZWY6IE1hcmtEZWYsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IHNjYWxlQ29uZmlnID0gY29uZmlnLnNjYWxlO1xuXG4gIC8vIElmIHdlIGhhdmUgZGVmYXVsdCBydWxlLWJhc2UsIGRldGVybWluZSBkZWZhdWx0IHZhbHVlIGZpcnN0XG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICduaWNlJzpcbiAgICAgIHJldHVybiBuaWNlKHNjYWxlVHlwZSwgY2hhbm5lbCwgZmllbGREZWYpO1xuICAgIGNhc2UgJ3BhZGRpbmcnOlxuICAgICAgcmV0dXJuIHBhZGRpbmcoY2hhbm5lbCwgc2NhbGVUeXBlLCBzY2FsZUNvbmZpZywgZmllbGREZWYsIG1hcmtEZWYsIGNvbmZpZy5iYXIpO1xuICAgIGNhc2UgJ3BhZGRpbmdJbm5lcic6XG4gICAgICByZXR1cm4gcGFkZGluZ0lubmVyKHNjYWxlUGFkZGluZywgY2hhbm5lbCwgc2NhbGVDb25maWcpO1xuICAgIGNhc2UgJ3BhZGRpbmdPdXRlcic6XG4gICAgICByZXR1cm4gcGFkZGluZ091dGVyKHNjYWxlUGFkZGluZywgY2hhbm5lbCwgc2NhbGVUeXBlLCBzY2FsZVBhZGRpbmdJbm5lciwgc2NhbGVDb25maWcpO1xuICAgIGNhc2UgJ3JldmVyc2UnOlxuICAgICAgcmV0dXJuIHJldmVyc2Uoc2NhbGVUeXBlLCBzb3J0KTtcbiAgICBjYXNlICd6ZXJvJzpcbiAgICAgIHJldHVybiB6ZXJvKGNoYW5uZWwsIGZpZWxkRGVmLCBzcGVjaWZpZWREb21haW4pO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgdXNlIHNjYWxlIGNvbmZpZ1xuICByZXR1cm4gc2NhbGVDb25maWdbcHJvcGVydHldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOb25Vbml0U2NhbGVQcm9wZXJ0eShtb2RlbDogTW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3JhbmdlJykge1xuICAgICAgcGFyc2VTY2FsZVJhbmdlKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2VTY2FsZVByb3BlcnR5KGNoaWxkLCBwcm9wZXJ0eSk7XG4gICAgfVxuICB9XG5cbiAga2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgbGV0IHZhbHVlV2l0aEV4cGxpY2l0OiBFeHBsaWNpdDxhbnk+O1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGNoaWxkVmFsdWVXaXRoRXhwbGljaXQgPSBjaGlsZENvbXBvbmVudC5nZXRXaXRoRXhwbGljaXQocHJvcGVydHkpO1xuICAgICAgICB2YWx1ZVdpdGhFeHBsaWNpdCA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnU2NhbGUsIGFueT4oXG4gICAgICAgICAgdmFsdWVXaXRoRXhwbGljaXQsIGNoaWxkVmFsdWVXaXRoRXhwbGljaXQsXG4gICAgICAgICAgcHJvcGVydHksXG4gICAgICAgICAgJ3NjYWxlJyxcbiAgICAgICAgICB0aWVCcmVha0J5Q29tcGFyaW5nPFZnU2NhbGUsIGFueT4oKHYxLCB2MikgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgICAgICAgLy8gRm9yIHJhbmdlIHN0ZXAsIHByZWZlciBsYXJnZXIgc3RlcFxuICAgICAgICAgICAgICAgIGlmICh2MS5zdGVwICYmIHYyLnN0ZXApIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB2MS5zdGVwIC0gdjIuc3RlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgIC8vIFRPRE86IHByZWNlZGVuY2UgcnVsZSBmb3Igb3RoZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0uc2V0V2l0aEV4cGxpY2l0KHByb3BlcnR5LCB2YWx1ZVdpdGhFeHBsaWNpdCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmljZShzY2FsZVR5cGU6IFNjYWxlVHlwZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pOiBib29sZWFuIHwgTmljZVRpbWUge1xuICBpZiAoZmllbGREZWYuYmluIHx8IHV0aWwuY29udGFpbnMoW1NjYWxlVHlwZS5USU1FLCBTY2FsZVR5cGUuVVRDXSwgc2NhbGVUeXBlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKTsgLy8gcmV0dXJuIHRydWUgZm9yIHF1YW50aXRhdGl2ZSBYL1kgdW5sZXNzIGJpbm5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZyhjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgbWFya0RlZjogTWFya0RlZiwgYmFyQ29uZmlnOiBCYXJDb25maWcpIHtcbiAgaWYgKHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIGlmIChpc0NvbnRpbnVvdXNUb0NvbnRpbnVvdXMoc2NhbGVUeXBlKSkge1xuICAgICAgaWYgKHNjYWxlQ29uZmlnLmNvbnRpbnVvdXNQYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLmNvbnRpbnVvdXNQYWRkaW5nO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7dHlwZSwgb3JpZW50fSA9IG1hcmtEZWY7XG4gICAgICBpZiAodHlwZSA9PT0gJ2JhcicgJiYgIWZpZWxkRGVmLmJpbikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKG9yaWVudCA9PT0gJ3ZlcnRpY2FsJyAmJiBjaGFubmVsID09PSAneCcpIHx8XG4gICAgICAgICAgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnICYmIGNoYW5uZWwgPT09ICd5JylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGJhckNvbmZpZy5jb250aW51b3VzQmFuZFNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2NhbGVUeXBlID09PSBTY2FsZVR5cGUuUE9JTlQpIHtcbiAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5wb2ludFBhZGRpbmc7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nSW5uZXIocGFkZGluZ1ZhbHVlOiBudW1iZXIsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZykge1xuICBpZiAocGFkZGluZ1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBhbHJlYWR5IG1hbnVhbGx5IHNwZWNpZmllZCBcInBhZGRpbmdcIiwgbm8gbmVlZCB0byBhZGQgZGVmYXVsdCBwYWRkaW5nSW5uZXIuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICAvLyBQYWRkaW5nIGlzIG9ubHkgc2V0IGZvciBYIGFuZCBZIGJ5IGRlZmF1bHQuXG4gICAgLy8gQmFzaWNhbGx5IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBhZGQgcGFkZGluZyBmb3IgY29sb3IgYW5kIHNpemUuXG5cbiAgICAvLyBwYWRkaW5nT3V0ZXIgd291bGQgb25seSBiZSBjYWxsZWQgaWYgaXQncyBhIGJhbmQgc2NhbGUsIGp1c3QgcmV0dXJuIHRoZSBkZWZhdWx0IGZvciBiYW5kU2NhbGUuXG4gICAgcmV0dXJuIHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nSW5uZXI7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmdPdXRlcihwYWRkaW5nVmFsdWU6IG51bWJlciwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHBhZGRpbmdJbm5lclZhbHVlOiBudW1iZXIsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZykge1xuICBpZiAocGFkZGluZ1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBhbHJlYWR5IG1hbnVhbGx5IHNwZWNpZmllZCBcInBhZGRpbmdcIiwgbm8gbmVlZCB0byBhZGQgZGVmYXVsdCBwYWRkaW5nT3V0ZXIuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICAvLyBQYWRkaW5nIGlzIG9ubHkgc2V0IGZvciBYIGFuZCBZIGJ5IGRlZmF1bHQuXG4gICAgLy8gQmFzaWNhbGx5IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBhZGQgcGFkZGluZyBmb3IgY29sb3IgYW5kIHNpemUuXG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gU2NhbGVUeXBlLkJBTkQpIHtcbiAgICAgIGlmIChzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ091dGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nT3V0ZXI7XG4gICAgICB9XG4gICAgICAvKiBCeSBkZWZhdWx0LCBwYWRkaW5nT3V0ZXIgaXMgcGFkZGluZ0lubmVyIC8gMi4gVGhlIHJlYXNvbiBpcyB0aGF0XG4gICAgICAgICAgc2l6ZSAod2lkdGgvaGVpZ2h0KSA9IHN0ZXAgKiAoY2FyZGluYWxpdHkgLSBwYWRkaW5nSW5uZXIgKyAyICogcGFkZGluZ091dGVyKS5cbiAgICAgICAgICBhbmQgd2Ugd2FudCB0aGUgd2lkdGgvaGVpZ2h0IHRvIGJlIGludGVnZXIgYnkgZGVmYXVsdC5cbiAgICAgICAgICBOb3RlIHRoYXQgc3RlcCAoYnkgZGVmYXVsdCkgYW5kIGNhcmRpbmFsaXR5IGFyZSBpbnRlZ2Vycy4pICovXG4gICAgICByZXR1cm4gcGFkZGluZ0lubmVyVmFsdWUgLyAyO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZShzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc29ydDogU29ydE9yZGVyIHwgU29ydEZpZWxkPHN0cmluZz4pIHtcbiAgaWYgKGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiBzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICAvLyBGb3IgY29udGludW91cyBkb21haW4gc2NhbGVzLCBWZWdhIGRvZXMgbm90IHN1cHBvcnQgZG9tYWluIHNvcnQuXG4gICAgLy8gVGh1cywgd2UgcmV2ZXJzZSByYW5nZSBpbnN0ZWFkIGlmIHNvcnQgaXMgZGVzY2VuZGluZ1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRTY2FsZTogRG9tYWluKSB7XG4gIC8vIEJ5IGRlZmF1bHQsIHJldHVybiB0cnVlIG9ubHkgZm9yIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG5cbiAgLy8gMSkgdXNpbmcgcXVhbnRpdGF0aXZlIGZpZWxkIHdpdGggc2l6ZVxuICAvLyBXaGlsZSB0aGlzIGNhbiBiZSBlaXRoZXIgcmF0aW8gb3IgaW50ZXJ2YWwgZmllbGRzLCBvdXIgYXNzdW1wdGlvbiBpcyB0aGF0XG4gIC8vIHJhdGlvIGFyZSBtb3JlIGNvbW1vbi5cbiAgaWYgKGNoYW5uZWwgPT09ICdzaXplJyAmJiBmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gMikgbm9uLWJpbm5lZCwgcXVhbnRpdGF0aXZlIHgtc2NhbGUgb3IgeS1zY2FsZSBpZiBubyBjdXN0b20gZG9tYWluIGlzIHByb3ZpZGVkLlxuICAvLyAoRm9yIGJpbm5pbmcsIHdlIHNob3VsZCBub3QgaW5jbHVkZSB6ZXJvIGJ5IGRlZmF1bHQgYmVjYXVzZSBiaW5uaW5nIGFyZSBjYWxjdWxhdGVkIHdpdGhvdXQgemVyby5cbiAgLy8gU2ltaWxhciwgaWYgdXNlcnMgZXhwbGljaXRseSBwcm92aWRlIGEgZG9tYWluIHJhbmdlLCB3ZSBzaG91bGQgbm90IGF1Z21lbnQgemVybyBhcyB0aGF0IHdpbGwgYmUgdW5leHBlY3RlZC4pXG4gIGNvbnN0IGhhc0N1c3RvbURvbWFpbiA9ICEhc3BlY2lmaWVkU2NhbGUgJiYgc3BlY2lmaWVkU2NhbGUgIT09ICd1bmFnZ3JlZ2F0ZWQnO1xuICBpZiAoIWhhc0N1c3RvbURvbWFpbiAmJiAhZmllbGREZWYuYmluICYmIHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==