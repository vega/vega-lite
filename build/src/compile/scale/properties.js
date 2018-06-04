"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var util = tslib_1.__importStar(require("../../util"));
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
                var value = getDefaultValue(property, channel, fieldDef, mergedScaleCmpt.get('type'), mergedScaleCmpt.get('padding'), mergedScaleCmpt.get('paddingInner'), specifiedScale.domain, model.markDef, config);
                if (value !== undefined) {
                    localScaleCmpt.set(property, value, false);
                }
            }
        }
    });
}
// Note: This method is used in Voyager.
function getDefaultValue(property, channel, fieldDef, scaleType, scalePadding, scalePaddingInner, specifiedDomain, markDef, config) {
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
            return reverse(scaleType, fieldDef.sort);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTBEO0FBRzFELHFEQUFpQztBQUVqQyxxQ0FBMEw7QUFFMUwsbUNBQTBDO0FBQzFDLHVEQUFtQztBQUVuQyxrQ0FBNEM7QUFDNUMsa0NBQWdGO0FBR2hGLGlDQUF3QztBQUV4Qyw0QkFBbUMsS0FBWSxFQUFFLFFBQTZDO0lBQzVGLElBQUksbUJBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDekM7U0FBTTtRQUNMLHlCQUF5QixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM1QztBQUNILENBQUM7QUFORCxnREFNQztBQUVELGdDQUFnQyxLQUFnQixFQUFFLFFBQTZDO0lBQzdGLElBQU0sb0JBQW9CLEdBQXdCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXpFLFdBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQXFCO1FBQ3ZELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUU1QixJQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFD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LENBQUM7S0FDYjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWpDRCxvQkFpQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5uZWwsIFNjYWxlQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWYsIFNjYWxlRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtCYXJDb25maWcsIE1hcmtEZWZ9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtjaGFubmVsU2NhbGVQcm9wZXJ0eUluY29tcGF0YWJpbGl0eSwgRG9tYWluLCBoYXNDb250aW51b3VzRG9tYWluLCBpc0NvbnRpbnVvdXNUb0NvbnRpbnVvdXMsIE5pY2VUaW1lLCBTY2FsZSwgU2NhbGVDb25maWcsIFNjYWxlVHlwZSwgc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5fSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge0VuY29kaW5nU29ydEZpZWxkLCBTb3J0T3JkZXJ9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0IHtjb250YWlucywga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NjYWxlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQsIHRpZUJyZWFrQnlDb21wYXJpbmd9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXgsIFNjYWxlQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VTY2FsZVJhbmdlfSBmcm9tICcuL3JhbmdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVQcm9wZXJ0eShtb2RlbDogTW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVQcm9wZXJ0eShtb2RlbCwgcHJvcGVydHkpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlUHJvcGVydHkobW9kZWwsIHByb3BlcnR5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZVByb3BlcnR5KG1vZGVsOiBVbml0TW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAga2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBtb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3QgbG9jYWxTY2FsZUNtcHQgPSBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXTtcbiAgICBjb25zdCBtZXJnZWRTY2FsZUNtcHQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZztcblxuICAgIGNvbnN0IHNwZWNpZmllZFZhbHVlID0gc3BlY2lmaWVkU2NhbGVbcHJvcGVydHldO1xuICAgIGNvbnN0IHNUeXBlID0gbWVyZ2VkU2NhbGVDbXB0LmdldCgndHlwZScpO1xuXG4gICAgY29uc3Qgc3VwcG9ydGVkQnlTY2FsZVR5cGUgPSBzY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoc1R5cGUsIHByb3BlcnR5KTtcbiAgICBjb25zdCBjaGFubmVsSW5jb21wYXRhYmlsaXR5ID0gY2hhbm5lbFNjYWxlUHJvcGVydHlJbmNvbXBhdGFiaWxpdHkoY2hhbm5lbCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgc3BlY2lmaWVkIHZhbHVlLCBjaGVjayBpZiBpdCBpcyBjb21wYXRpYmxlIHdpdGggc2NhbGUgdHlwZSBhbmQgY2hhbm5lbFxuICAgICAgaWYgKCFzdXBwb3J0ZWRCeVNjYWxlVHlwZSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVByb3BlcnR5Tm90V29ya1dpdGhTY2FsZVR5cGUoc1R5cGUsIHByb3BlcnR5LCBjaGFubmVsKSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkpIHsgLy8gY2hhbm5lbFxuICAgICAgICBsb2cud2FybihjaGFubmVsSW5jb21wYXRhYmlsaXR5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN1cHBvcnRlZEJ5U2NhbGVUeXBlICYmIGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gY29weUtleUZyb21PYmplY3QgZW5zdXJlIHR5cGUgc2FmZXR5XG4gICAgICAgIGxvY2FsU2NhbGVDbXB0LmNvcHlLZXlGcm9tT2JqZWN0KHByb3BlcnR5LCBzcGVjaWZpZWRTY2FsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldERlZmF1bHRWYWx1ZShcbiAgICAgICAgICBwcm9wZXJ0eSwgY2hhbm5lbCwgZmllbGREZWYsXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgndHlwZScpLFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3BhZGRpbmcnKSxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCdwYWRkaW5nSW5uZXInKSxcbiAgICAgICAgICBzcGVjaWZpZWRTY2FsZS5kb21haW4sXG4gICAgICAgICAgbW9kZWwubWFya0RlZiwgY29uZmlnXG4gICAgICAgICk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KHByb3BlcnR5LCB2YWx1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLy8gTm90ZTogVGhpcyBtZXRob2QgaXMgdXNlZCBpbiBWb3lhZ2VyLlxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYWx1ZShcbiAgcHJvcGVydHk6IGtleW9mIFNjYWxlLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogU2NhbGVGaWVsZERlZjxzdHJpbmc+LFxuICBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVQYWRkaW5nOiBudW1iZXIsIHNjYWxlUGFkZGluZ0lubmVyOiBudW1iZXIsXG4gIHNwZWNpZmllZERvbWFpbjogU2NhbGVbJ2RvbWFpbiddLCBtYXJrRGVmOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBzY2FsZUNvbmZpZyA9IGNvbmZpZy5zY2FsZTtcblxuICAvLyBJZiB3ZSBoYXZlIGRlZmF1bHQgcnVsZS1iYXNlLCBkZXRlcm1pbmUgZGVmYXVsdCB2YWx1ZSBmaXJzdFxuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnbmljZSc6XG4gICAgICByZXR1cm4gbmljZShzY2FsZVR5cGUsIGNoYW5uZWwsIGZpZWxkRGVmKTtcbiAgICBjYXNlICdwYWRkaW5nJzpcbiAgICAgIHJldHVybiBwYWRkaW5nKGNoYW5uZWwsIHNjYWxlVHlwZSwgc2NhbGVDb25maWcsIGZpZWxkRGVmLCBtYXJrRGVmLCBjb25maWcuYmFyKTtcbiAgICBjYXNlICdwYWRkaW5nSW5uZXInOlxuICAgICAgcmV0dXJuIHBhZGRpbmdJbm5lcihzY2FsZVBhZGRpbmcsIGNoYW5uZWwsIHNjYWxlQ29uZmlnKTtcbiAgICBjYXNlICdwYWRkaW5nT3V0ZXInOlxuICAgICAgcmV0dXJuIHBhZGRpbmdPdXRlcihzY2FsZVBhZGRpbmcsIGNoYW5uZWwsIHNjYWxlVHlwZSwgc2NhbGVQYWRkaW5nSW5uZXIsIHNjYWxlQ29uZmlnKTtcbiAgICBjYXNlICdyZXZlcnNlJzpcbiAgICAgIHJldHVybiByZXZlcnNlKHNjYWxlVHlwZSwgZmllbGREZWYuc29ydCk7XG4gICAgY2FzZSAnemVybyc6XG4gICAgICByZXR1cm4gemVybyhjaGFubmVsLCBmaWVsZERlZiwgc3BlY2lmaWVkRG9tYWluLCBtYXJrRGVmKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHVzZSBzY2FsZSBjb25maWdcbiAgcmV0dXJuIHNjYWxlQ29uZmlnW3Byb3BlcnR5XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlUHJvcGVydHkobW9kZWw6IE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBpZiAocHJvcGVydHkgPT09ICdyYW5nZScpIHtcbiAgICAgIHBhcnNlU2NhbGVSYW5nZShjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlU2NhbGVQcm9wZXJ0eShjaGlsZCwgcHJvcGVydHkpO1xuICAgIH1cbiAgfVxuXG4gIGtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGxldCB2YWx1ZVdpdGhFeHBsaWNpdDogRXhwbGljaXQ8YW55PjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZENvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBjaGlsZFZhbHVlV2l0aEV4cGxpY2l0ID0gY2hpbGRDb21wb25lbnQuZ2V0V2l0aEV4cGxpY2l0KHByb3BlcnR5KTtcbiAgICAgICAgdmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ1NjYWxlLCBhbnk+KFxuICAgICAgICAgIHZhbHVlV2l0aEV4cGxpY2l0LCBjaGlsZFZhbHVlV2l0aEV4cGxpY2l0LFxuICAgICAgICAgIHByb3BlcnR5LFxuICAgICAgICAgICdzY2FsZScsXG4gICAgICAgICAgdGllQnJlYWtCeUNvbXBhcmluZzxWZ1NjYWxlLCBhbnk+KCh2MSwgdjIpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgICAgICAgIC8vIEZvciByYW5nZSBzdGVwLCBwcmVmZXIgbGFyZ2VyIHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAodjEuc3RlcCAmJiB2Mi5zdGVwKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdjEuc3RlcCAtIHYyLnN0ZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAvLyBUT0RPOiBwcmVjZWRlbmNlIHJ1bGUgZm9yIG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLnNldFdpdGhFeHBsaWNpdChwcm9wZXJ0eSwgdmFsdWVXaXRoRXhwbGljaXQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5pY2Uoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KTogYm9vbGVhbiB8IE5pY2VUaW1lIHtcbiAgaWYgKGZpZWxkRGVmLmJpbiB8fCB1dGlsLmNvbnRhaW5zKFtTY2FsZVR5cGUuVElNRSwgU2NhbGVUeXBlLlVUQ10sIHNjYWxlVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCk7IC8vIHJldHVybiB0cnVlIGZvciBxdWFudGl0YXRpdmUgWC9ZIHVubGVzcyBiaW5uZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmcoY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZywgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIG1hcmtEZWY6IE1hcmtEZWYsIGJhckNvbmZpZzogQmFyQ29uZmlnKSB7XG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICBpZiAoaXNDb250aW51b3VzVG9Db250aW51b3VzKHNjYWxlVHlwZSkpIHtcbiAgICAgIGlmIChzY2FsZUNvbmZpZy5jb250aW51b3VzUGFkZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5jb250aW51b3VzUGFkZGluZztcbiAgICAgIH1cblxuICAgICAgY29uc3Qge3R5cGUsIG9yaWVudH0gPSBtYXJrRGVmO1xuICAgICAgaWYgKHR5cGUgPT09ICdiYXInICYmICFmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcgJiYgY2hhbm5lbCA9PT0gJ3gnKSB8fFxuICAgICAgICAgIChvcmllbnQgPT09ICdob3Jpem9udGFsJyAmJiBjaGFubmVsID09PSAneScpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBiYXJDb25maWcuY29udGludW91c0JhbmRTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gU2NhbGVUeXBlLlBPSU5UKSB7XG4gICAgICByZXR1cm4gc2NhbGVDb25maWcucG9pbnRQYWRkaW5nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZ0lubmVyKHBhZGRpbmdWYWx1ZTogbnVtYmVyLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKHBhZGRpbmdWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gSWYgdXNlciBoYXMgYWxyZWFkeSBtYW51YWxseSBzcGVjaWZpZWQgXCJwYWRkaW5nXCIsIG5vIG5lZWQgdG8gYWRkIGRlZmF1bHQgcGFkZGluZ0lubmVyLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgLy8gUGFkZGluZyBpcyBvbmx5IHNldCBmb3IgWCBhbmQgWSBieSBkZWZhdWx0LlxuICAgIC8vIEJhc2ljYWxseSBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgdG8gYWRkIHBhZGRpbmcgZm9yIGNvbG9yIGFuZCBzaXplLlxuXG4gICAgLy8gcGFkZGluZ091dGVyIHdvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIGl0J3MgYSBiYW5kIHNjYWxlLCBqdXN0IHJldHVybiB0aGUgZGVmYXVsdCBmb3IgYmFuZFNjYWxlLlxuICAgIHJldHVybiBzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ0lubmVyO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nT3V0ZXIocGFkZGluZ1ZhbHVlOiBudW1iZXIsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBwYWRkaW5nSW5uZXJWYWx1ZTogbnVtYmVyLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKHBhZGRpbmdWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gSWYgdXNlciBoYXMgYWxyZWFkeSBtYW51YWxseSBzcGVjaWZpZWQgXCJwYWRkaW5nXCIsIG5vIG5lZWQgdG8gYWRkIGRlZmF1bHQgcGFkZGluZ091dGVyLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgLy8gUGFkZGluZyBpcyBvbmx5IHNldCBmb3IgWCBhbmQgWSBieSBkZWZhdWx0LlxuICAgIC8vIEJhc2ljYWxseSBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgdG8gYWRkIHBhZGRpbmcgZm9yIGNvbG9yIGFuZCBzaXplLlxuICAgIGlmIChzY2FsZVR5cGUgPT09IFNjYWxlVHlwZS5CQU5EKSB7XG4gICAgICBpZiAoc2NhbGVDb25maWcuYmFuZFBhZGRpbmdPdXRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ091dGVyO1xuICAgICAgfVxuICAgICAgLyogQnkgZGVmYXVsdCwgcGFkZGluZ091dGVyIGlzIHBhZGRpbmdJbm5lciAvIDIuIFRoZSByZWFzb24gaXMgdGhhdFxuICAgICAgICAgIHNpemUgKHdpZHRoL2hlaWdodCkgPSBzdGVwICogKGNhcmRpbmFsaXR5IC0gcGFkZGluZ0lubmVyICsgMiAqIHBhZGRpbmdPdXRlcikuXG4gICAgICAgICAgYW5kIHdlIHdhbnQgdGhlIHdpZHRoL2hlaWdodCB0byBiZSBpbnRlZ2VyIGJ5IGRlZmF1bHQuXG4gICAgICAgICAgTm90ZSB0aGF0IHN0ZXAgKGJ5IGRlZmF1bHQpIGFuZCBjYXJkaW5hbGl0eSBhcmUgaW50ZWdlcnMuKSAqL1xuICAgICAgcmV0dXJuIHBhZGRpbmdJbm5lclZhbHVlIC8gMjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2Uoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNvcnQ6IFNvcnRPcmRlciB8IEVuY29kaW5nU29ydEZpZWxkPHN0cmluZz4gfCBzdHJpbmdbXSkge1xuICBpZiAoaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpICYmIHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgIC8vIEZvciBjb250aW51b3VzIGRvbWFpbiBzY2FsZXMsIFZlZ2EgZG9lcyBub3Qgc3VwcG9ydCBkb21haW4gc29ydC5cbiAgICAvLyBUaHVzLCB3ZSByZXZlcnNlIHJhbmdlIGluc3RlYWQgaWYgc29ydCBpcyBkZXNjZW5kaW5nXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZFNjYWxlOiBEb21haW4sIG1hcmtEZWY6IE1hcmtEZWYpIHtcblxuICAvLyBJZiB1c2VycyBleHBsaWNpdGx5IHByb3ZpZGUgYSBkb21haW4gcmFuZ2UsIHdlIHNob3VsZCBub3QgYXVnbWVudCB6ZXJvIGFzIHRoYXQgd2lsbCBiZSB1bmV4cGVjdGVkLlxuICBjb25zdCBoYXNDdXN0b21Eb21haW4gPSAhIXNwZWNpZmllZFNjYWxlICYmIHNwZWNpZmllZFNjYWxlICE9PSAndW5hZ2dyZWdhdGVkJztcbiAgaWYgKGhhc0N1c3RvbURvbWFpbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIElmIHRoZXJlIGlzIG5vIGN1c3RvbSBkb21haW4sIHJldHVybiB0cnVlIG9ubHkgZm9yIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG5cbiAgLy8gMSkgdXNpbmcgcXVhbnRpdGF0aXZlIGZpZWxkIHdpdGggc2l6ZVxuICAvLyBXaGlsZSB0aGlzIGNhbiBiZSBlaXRoZXIgcmF0aW8gb3IgaW50ZXJ2YWwgZmllbGRzLCBvdXIgYXNzdW1wdGlvbiBpcyB0aGF0XG4gIC8vIHJhdGlvIGFyZSBtb3JlIGNvbW1vbi5cbiAgaWYgKGNoYW5uZWwgPT09ICdzaXplJyAmJiBmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gMikgbm9uLWJpbm5lZCwgcXVhbnRpdGF0aXZlIHgtc2NhbGUgb3IgeS1zY2FsZVxuICAvLyAoRm9yIGJpbm5pbmcsIHdlIHNob3VsZCBub3QgaW5jbHVkZSB6ZXJvIGJ5IGRlZmF1bHQgYmVjYXVzZSBiaW5uaW5nIGFyZSBjYWxjdWxhdGVkIHdpdGhvdXQgemVyby4pXG4gIGlmICghZmllbGREZWYuYmluICYmIHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIGNvbnN0IHtvcmllbnQsIHR5cGV9ID0gbWFya0RlZjtcbiAgICBpZiAoY29udGFpbnMoWydiYXInLCAnYXJlYScsICdsaW5lJywgJ3RyYWlsJ10sIHR5cGUpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIChvcmllbnQgPT09ICdob3Jpem9udGFsJyAmJiBjaGFubmVsID09PSAneScpIHx8XG4gICAgICAgIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcgJiYgY2hhbm5lbCA9PT0gJ3gnKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=