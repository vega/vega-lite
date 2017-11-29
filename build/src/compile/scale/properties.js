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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEQ7QUFHMUQsK0JBQWlDO0FBRWpDLHFDQUEwTDtBQUUxTCxtQ0FBZ0M7QUFDaEMsaUNBQW1DO0FBRW5DLGtDQUE0QztBQUM1QyxrQ0FBZ0Y7QUFHaEYsaUNBQXdDO0FBRXhDLDRCQUFtQyxLQUFZLEVBQUUsUUFBNkM7SUFDNUYsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsc0JBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHlCQUF5QixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQsZ0NBQWdDLEtBQWdCLEVBQUUsUUFBNkM7SUFDN0YsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsV0FBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDdkQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQU0sTUFBTSxH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LDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQzVELG1FQUFtRTtRQUNuRSx1REFBdUQ7UUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFQRCwwQkFPQztBQUVELGNBQXFCLE9BQWdCLEVBQUUsUUFBMEIsRUFBRSxjQUFzQjtJQUN2Rix3REFBd0Q7SUFFeEQsd0NBQXdDO0lBQ3hDLDRFQUE0RTtJQUM1RSx5QkFBeUI7SUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLE1BQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsbUdBQW1HO0lBQ25HLCtHQUErRztJQUMvRyxJQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsY0FBYyxJQUFJLGNBQWMsS0FBSyxjQUFjLENBQUM7SUFDOUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFDLEVBQUUsV0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFsQkQsb0JBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBTY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QmFyQ29uZmlnLCBNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7Y2hhbm5lbFNjYWxlUHJvcGVydHlJbmNvbXBhdGFiaWxpdHksIERvbWFpbiwgaGFzQ29udGludW91c0RvbWFpbiwgaXNDb250aW51b3VzVG9Db250aW51b3VzLCBOaWNlVGltZSwgU2NhbGUsIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGUsIHNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTY2FsZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0LCB0aWVCcmVha0J5Q29tcGFyaW5nfSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4LCBTY2FsZUNvbXBvbmVudFByb3BzfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlU2NhbGVSYW5nZX0gZnJvbSAnLi9yYW5nZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlUHJvcGVydHkobW9kZWw6IE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIHBhcnNlVW5pdFNjYWxlUHJvcGVydHkobW9kZWwsIHByb3BlcnR5KTtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZU5vblVuaXRTY2FsZVByb3BlcnR5KG1vZGVsLCBwcm9wZXJ0eSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVQcm9wZXJ0eShtb2RlbDogVW5pdE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIGtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IGxvY2FsU2NhbGVDbXB0ID0gbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF07XG4gICAgY29uc3QgbWVyZ2VkU2NhbGVDbXB0ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICBjb25zdCBzb3J0ID0gbW9kZWwuc29ydChjaGFubmVsKTtcbiAgICBjb25zdCBjb25maWcgPSBtb2RlbC5jb25maWc7XG5cbiAgICBjb25zdCBzcGVjaWZpZWRWYWx1ZSA9IHNwZWNpZmllZFNjYWxlW3Byb3BlcnR5XTtcbiAgICBjb25zdCBzVHlwZSA9IG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3R5cGUnKTtcblxuICAgIGNvbnN0IHN1cHBvcnRlZEJ5U2NhbGVUeXBlID0gc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5KHNUeXBlLCBwcm9wZXJ0eSk7XG4gICAgY29uc3QgY2hhbm5lbEluY29tcGF0YWJpbGl0eSA9IGNoYW5uZWxTY2FsZVByb3BlcnR5SW5jb21wYXRhYmlsaXR5KGNoYW5uZWwsIHByb3BlcnR5KTtcblxuICAgIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHNwZWNpZmllZCB2YWx1ZSwgY2hlY2sgaWYgaXQgaXMgY29tcGF0aWJsZSB3aXRoIHNjYWxlIHR5cGUgYW5kIGNoYW5uZWxcbiAgICAgIGlmICghc3VwcG9ydGVkQnlTY2FsZVR5cGUpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNUeXBlLCBwcm9wZXJ0eSwgY2hhbm5lbCkpO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsSW5jb21wYXRhYmlsaXR5KSB7IC8vIGNoYW5uZWxcbiAgICAgICAgbG9nLndhcm4oY2hhbm5lbEluY29tcGF0YWJpbGl0eSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdXBwb3J0ZWRCeVNjYWxlVHlwZSAmJiBjaGFubmVsSW5jb21wYXRhYmlsaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGNvcHlLZXlGcm9tT2JqZWN0IGVuc3VyZSB0eXBlIHNhZmV0eVxuICAgICAgICBsb2NhbFNjYWxlQ21wdC5jb3B5S2V5RnJvbU9iamVjdChwcm9wZXJ0eSwgc3BlY2lmaWVkU2NhbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXREZWZhdWx0VmFsdWUoXG4gICAgICAgICAgcHJvcGVydHksIGNoYW5uZWwsIGZpZWxkRGVmLCBzb3J0LFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3R5cGUnKSxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCdwYWRkaW5nJyksXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgncGFkZGluZ0lubmVyJyksXG4gICAgICAgICAgc3BlY2lmaWVkU2NhbGUuZG9tYWluLFxuICAgICAgICAgIG1vZGVsLm1hcmtEZWYsIGNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxvY2FsU2NhbGVDbXB0LnNldChwcm9wZXJ0eSwgdmFsdWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8vIE5vdGU6IFRoaXMgbWV0aG9kIGlzIHVzZWQgaW4gVm95YWdlci5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUoXG4gIHByb3BlcnR5OiBrZXlvZiBTY2FsZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNvcnQ6IFNvcnRPcmRlciB8IFNvcnRGaWVsZDxzdHJpbmc+LFxuICBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVQYWRkaW5nOiBudW1iZXIsIHNjYWxlUGFkZGluZ0lubmVyOiBudW1iZXIsXG4gIHNwZWNpZmllZERvbWFpbjogU2NhbGVbJ2RvbWFpbiddLCBtYXJrRGVmOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBzY2FsZUNvbmZpZyA9IGNvbmZpZy5zY2FsZTtcblxuICAvLyBJZiB3ZSBoYXZlIGRlZmF1bHQgcnVsZS1iYXNlLCBkZXRlcm1pbmUgZGVmYXVsdCB2YWx1ZSBmaXJzdFxuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnbmljZSc6XG4gICAgICByZXR1cm4gbmljZShzY2FsZVR5cGUsIGNoYW5uZWwsIGZpZWxkRGVmKTtcbiAgICBjYXNlICdwYWRkaW5nJzpcbiAgICAgIHJldHVybiBwYWRkaW5nKGNoYW5uZWwsIHNjYWxlVHlwZSwgc2NhbGVDb25maWcsIGZpZWxkRGVmLCBtYXJrRGVmLCBjb25maWcuYmFyKTtcbiAgICBjYXNlICdwYWRkaW5nSW5uZXInOlxuICAgICAgcmV0dXJuIHBhZGRpbmdJbm5lcihzY2FsZVBhZGRpbmcsIGNoYW5uZWwsIHNjYWxlQ29uZmlnKTtcbiAgICBjYXNlICdwYWRkaW5nT3V0ZXInOlxuICAgICAgcmV0dXJuIHBhZGRpbmdPdXRlcihzY2FsZVBhZGRpbmcsIGNoYW5uZWwsIHNjYWxlVHlwZSwgc2NhbGVQYWRkaW5nSW5uZXIsIHNjYWxlQ29uZmlnKTtcbiAgICBjYXNlICdyZXZlcnNlJzpcbiAgICAgIHJldHVybiByZXZlcnNlKHNjYWxlVHlwZSwgc29ydCk7XG4gICAgY2FzZSAnemVybyc6XG4gICAgICByZXR1cm4gemVybyhjaGFubmVsLCBmaWVsZERlZiwgc3BlY2lmaWVkRG9tYWluKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHVzZSBzY2FsZSBjb25maWdcbiAgcmV0dXJuIHNjYWxlQ29uZmlnW3Byb3BlcnR5XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlUHJvcGVydHkobW9kZWw6IE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBpZiAocHJvcGVydHkgPT09ICdyYW5nZScpIHtcbiAgICAgIHBhcnNlU2NhbGVSYW5nZShjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlU2NhbGVQcm9wZXJ0eShjaGlsZCwgcHJvcGVydHkpO1xuICAgIH1cbiAgfVxuXG4gIGtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGxldCB2YWx1ZVdpdGhFeHBsaWNpdDogRXhwbGljaXQ8YW55PjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZENvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBjaGlsZFZhbHVlV2l0aEV4cGxpY2l0ID0gY2hpbGRDb21wb25lbnQuZ2V0V2l0aEV4cGxpY2l0KHByb3BlcnR5KTtcbiAgICAgICAgdmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ1NjYWxlLCBhbnk+KFxuICAgICAgICAgIHZhbHVlV2l0aEV4cGxpY2l0LCBjaGlsZFZhbHVlV2l0aEV4cGxpY2l0LFxuICAgICAgICAgIHByb3BlcnR5LFxuICAgICAgICAgICdzY2FsZScsXG4gICAgICAgICAgdGllQnJlYWtCeUNvbXBhcmluZzxWZ1NjYWxlLCBhbnk+KCh2MSwgdjIpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgICAgICAgIC8vIEZvciByYW5nZSBzdGVwLCBwcmVmZXIgbGFyZ2VyIHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAodjEuc3RlcCAmJiB2Mi5zdGVwKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdjEuc3RlcCAtIHYyLnN0ZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAvLyBUT0RPOiBwcmVjZWRlbmNlIHJ1bGUgZm9yIG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLnNldFdpdGhFeHBsaWNpdChwcm9wZXJ0eSwgdmFsdWVXaXRoRXhwbGljaXQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5pY2Uoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KTogYm9vbGVhbiB8IE5pY2VUaW1lIHtcbiAgaWYgKGZpZWxkRGVmLmJpbiB8fCB1dGlsLmNvbnRhaW5zKFtTY2FsZVR5cGUuVElNRSwgU2NhbGVUeXBlLlVUQ10sIHNjYWxlVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCk7IC8vIHJldHVybiB0cnVlIGZvciBxdWFudGl0YXRpdmUgWC9ZIHVubGVzcyBiaW5uZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmcoY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZywgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIG1hcmtEZWY6IE1hcmtEZWYsIGJhckNvbmZpZzogQmFyQ29uZmlnKSB7XG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICBpZiAoaXNDb250aW51b3VzVG9Db250aW51b3VzKHNjYWxlVHlwZSkpIHtcbiAgICAgIGlmIChzY2FsZUNvbmZpZy5jb250aW51b3VzUGFkZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5jb250aW51b3VzUGFkZGluZztcbiAgICAgIH1cblxuICAgICAgY29uc3Qge3R5cGUsIG9yaWVudH0gPSBtYXJrRGVmO1xuICAgICAgaWYgKHR5cGUgPT09ICdiYXInICYmICFmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcgJiYgY2hhbm5lbCA9PT0gJ3gnKSB8fFxuICAgICAgICAgIChvcmllbnQgPT09ICdob3Jpem9udGFsJyAmJiBjaGFubmVsID09PSAneScpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBiYXJDb25maWcuY29udGludW91c0JhbmRTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gU2NhbGVUeXBlLlBPSU5UKSB7XG4gICAgICByZXR1cm4gc2NhbGVDb25maWcucG9pbnRQYWRkaW5nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZ0lubmVyKHBhZGRpbmc6IG51bWJlciwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChwYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBhbHJlYWR5IG1hbnVhbGx5IHNwZWNpZmllZCBcInBhZGRpbmdcIiwgbm8gbmVlZCB0byBhZGQgZGVmYXVsdCBwYWRkaW5nSW5uZXIuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICAvLyBQYWRkaW5nIGlzIG9ubHkgc2V0IGZvciBYIGFuZCBZIGJ5IGRlZmF1bHQuXG4gICAgLy8gQmFzaWNhbGx5IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBhZGQgcGFkZGluZyBmb3IgY29sb3IgYW5kIHNpemUuXG5cbiAgICAvLyBwYWRkaW5nT3V0ZXIgd291bGQgb25seSBiZSBjYWxsZWQgaWYgaXQncyBhIGJhbmQgc2NhbGUsIGp1c3QgcmV0dXJuIHRoZSBkZWZhdWx0IGZvciBiYW5kU2NhbGUuXG4gICAgcmV0dXJuIHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nSW5uZXI7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmdPdXRlcihwYWRkaW5nOiBudW1iZXIsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBwYWRkaW5nSW5uZXI6IG51bWJlciwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChwYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBhbHJlYWR5IG1hbnVhbGx5IHNwZWNpZmllZCBcInBhZGRpbmdcIiwgbm8gbmVlZCB0byBhZGQgZGVmYXVsdCBwYWRkaW5nT3V0ZXIuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICAvLyBQYWRkaW5nIGlzIG9ubHkgc2V0IGZvciBYIGFuZCBZIGJ5IGRlZmF1bHQuXG4gICAgLy8gQmFzaWNhbGx5IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBhZGQgcGFkZGluZyBmb3IgY29sb3IgYW5kIHNpemUuXG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gU2NhbGVUeXBlLkJBTkQpIHtcbiAgICAgIGlmIChzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ091dGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nT3V0ZXI7XG4gICAgICB9XG4gICAgICAvKiBCeSBkZWZhdWx0LCBwYWRkaW5nT3V0ZXIgaXMgcGFkZGluZ0lubmVyIC8gMi4gVGhlIHJlYXNvbiBpcyB0aGF0XG4gICAgICAgICAgc2l6ZSAod2lkdGgvaGVpZ2h0KSA9IHN0ZXAgKiAoY2FyZGluYWxpdHkgLSBwYWRkaW5nSW5uZXIgKyAyICogcGFkZGluZ091dGVyKS5cbiAgICAgICAgICBhbmQgd2Ugd2FudCB0aGUgd2lkdGgvaGVpZ2h0IHRvIGJlIGludGVnZXIgYnkgZGVmYXVsdC5cbiAgICAgICAgICBOb3RlIHRoYXQgc3RlcCAoYnkgZGVmYXVsdCkgYW5kIGNhcmRpbmFsaXR5IGFyZSBpbnRlZ2Vycy4pICovXG4gICAgICByZXR1cm4gcGFkZGluZ0lubmVyIC8gMjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2Uoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNvcnQ6IFNvcnRPcmRlciB8IFNvcnRGaWVsZDxzdHJpbmc+KSB7XG4gIGlmIChoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgJiYgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgLy8gRm9yIGNvbnRpbnVvdXMgZG9tYWluIHNjYWxlcywgVmVnYSBkb2VzIG5vdCBzdXBwb3J0IGRvbWFpbiBzb3J0LlxuICAgIC8vIFRodXMsIHdlIHJldmVyc2UgcmFuZ2UgaW5zdGVhZCBpZiBzb3J0IGlzIGRlc2NlbmRpbmdcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkU2NhbGU6IERvbWFpbikge1xuICAvLyBCeSBkZWZhdWx0LCByZXR1cm4gdHJ1ZSBvbmx5IGZvciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuXG4gIC8vIDEpIHVzaW5nIHF1YW50aXRhdGl2ZSBmaWVsZCB3aXRoIHNpemVcbiAgLy8gV2hpbGUgdGhpcyBjYW4gYmUgZWl0aGVyIHJhdGlvIG9yIGludGVydmFsIGZpZWxkcywgb3VyIGFzc3VtcHRpb24gaXMgdGhhdFxuICAvLyByYXRpbyBhcmUgbW9yZSBjb21tb24uXG4gIGlmIChjaGFubmVsID09PSAnc2l6ZScgJiYgZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIDIpIG5vbi1iaW5uZWQsIHF1YW50aXRhdGl2ZSB4LXNjYWxlIG9yIHktc2NhbGUgaWYgbm8gY3VzdG9tIGRvbWFpbiBpcyBwcm92aWRlZC5cbiAgLy8gKEZvciBiaW5uaW5nLCB3ZSBzaG91bGQgbm90IGluY2x1ZGUgemVybyBieSBkZWZhdWx0IGJlY2F1c2UgYmlubmluZyBhcmUgY2FsY3VsYXRlZCB3aXRob3V0IHplcm8uXG4gIC8vIFNpbWlsYXIsIGlmIHVzZXJzIGV4cGxpY2l0bHkgcHJvdmlkZSBhIGRvbWFpbiByYW5nZSwgd2Ugc2hvdWxkIG5vdCBhdWdtZW50IHplcm8gYXMgdGhhdCB3aWxsIGJlIHVuZXhwZWN0ZWQuKVxuICBjb25zdCBoYXNDdXN0b21Eb21haW4gPSAhIXNwZWNpZmllZFNjYWxlICYmIHNwZWNpZmllZFNjYWxlICE9PSAndW5hZ2dyZWdhdGVkJztcbiAgaWYgKCFoYXNDdXN0b21Eb21haW4gJiYgIWZpZWxkRGVmLmJpbiAmJiB1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=