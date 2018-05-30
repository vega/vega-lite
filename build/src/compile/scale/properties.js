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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEQ7QUFHMUQsK0JBQWlDO0FBRWpDLHFDQUEwTDtBQUUxTCxtQ0FBMEM7QUFDMUMsaUNBQW1DO0FBRW5DLGtDQUE0QztBQUM1QyxrQ0FBZ0Y7QUFHaEYsaUNBQXdDO0FBRXhDLDRCQUFtQyxLQUFZLEVBQUUsUUFBNkM7SUFDNUYsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLHNCQUFzQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN6QztTQUFNO1FBQ0wseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQztBQU5ELGdEQU1DO0FBRUQsZ0NBQWdDLEtBQWdCLEVBQUUsUUFBNkM7SUFDN0YsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsV0FBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDdkQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRTVCLElBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxJQUFNLEtBQUssR0FBRyxlQUFlLENBQUMs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SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFqQ0Qsb0JBaUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBTY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBTY2FsZUZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QmFyQ29uZmlnLCBNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7Y2hhbm5lbFNjYWxlUHJvcGVydHlJbmNvbXBhdGFiaWxpdHksIERvbWFpbiwgaGFzQ29udGludW91c0RvbWFpbiwgaXNDb250aW51b3VzVG9Db250aW51b3VzLCBOaWNlVGltZSwgU2NhbGUsIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGUsIHNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtFbmNvZGluZ1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTY2FsZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0LCB0aWVCcmVha0J5Q29tcGFyaW5nfSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4LCBTY2FsZUNvbXBvbmVudFByb3BzfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlU2NhbGVSYW5nZX0gZnJvbSAnLi9yYW5nZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlUHJvcGVydHkobW9kZWw6IE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIHBhcnNlVW5pdFNjYWxlUHJvcGVydHkobW9kZWwsIHByb3BlcnR5KTtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZU5vblVuaXRTY2FsZVByb3BlcnR5KG1vZGVsLCBwcm9wZXJ0eSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVQcm9wZXJ0eShtb2RlbDogVW5pdE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIGtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IGxvY2FsU2NhbGVDbXB0ID0gbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF07XG4gICAgY29uc3QgbWVyZ2VkU2NhbGVDbXB0ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICBjb25zdCBjb25maWcgPSBtb2RlbC5jb25maWc7XG5cbiAgICBjb25zdCBzcGVjaWZpZWRWYWx1ZSA9IHNwZWNpZmllZFNjYWxlW3Byb3BlcnR5XTtcbiAgICBjb25zdCBzVHlwZSA9IG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3R5cGUnKTtcblxuICAgIGNvbnN0IHN1cHBvcnRlZEJ5U2NhbGVUeXBlID0gc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5KHNUeXBlLCBwcm9wZXJ0eSk7XG4gICAgY29uc3QgY2hhbm5lbEluY29tcGF0YWJpbGl0eSA9IGNoYW5uZWxTY2FsZVByb3BlcnR5SW5jb21wYXRhYmlsaXR5KGNoYW5uZWwsIHByb3BlcnR5KTtcblxuICAgIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHNwZWNpZmllZCB2YWx1ZSwgY2hlY2sgaWYgaXQgaXMgY29tcGF0aWJsZSB3aXRoIHNjYWxlIHR5cGUgYW5kIGNoYW5uZWxcbiAgICAgIGlmICghc3VwcG9ydGVkQnlTY2FsZVR5cGUpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNUeXBlLCBwcm9wZXJ0eSwgY2hhbm5lbCkpO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsSW5jb21wYXRhYmlsaXR5KSB7IC8vIGNoYW5uZWxcbiAgICAgICAgbG9nLndhcm4oY2hhbm5lbEluY29tcGF0YWJpbGl0eSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdXBwb3J0ZWRCeVNjYWxlVHlwZSAmJiBjaGFubmVsSW5jb21wYXRhYmlsaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGNvcHlLZXlGcm9tT2JqZWN0IGVuc3VyZSB0eXBlIHNhZmV0eVxuICAgICAgICBsb2NhbFNjYWxlQ21wdC5jb3B5S2V5RnJvbU9iamVjdChwcm9wZXJ0eSwgc3BlY2lmaWVkU2NhbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXREZWZhdWx0VmFsdWUoXG4gICAgICAgICAgcHJvcGVydHksIGNoYW5uZWwsIGZpZWxkRGVmLFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3R5cGUnKSxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCdwYWRkaW5nJyksXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgncGFkZGluZ0lubmVyJyksXG4gICAgICAgICAgc3BlY2lmaWVkU2NhbGUuZG9tYWluLFxuICAgICAgICAgIG1vZGVsLm1hcmtEZWYsIGNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxvY2FsU2NhbGVDbXB0LnNldChwcm9wZXJ0eSwgdmFsdWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8vIE5vdGU6IFRoaXMgbWV0aG9kIGlzIHVzZWQgaW4gVm95YWdlci5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUoXG4gIHByb3BlcnR5OiBrZXlvZiBTY2FsZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IFNjYWxlRmllbGREZWY8c3RyaW5nPixcbiAgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlUGFkZGluZzogbnVtYmVyLCBzY2FsZVBhZGRpbmdJbm5lcjogbnVtYmVyLFxuICBzcGVjaWZpZWREb21haW46IFNjYWxlWydkb21haW4nXSwgbWFya0RlZjogTWFya0RlZiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qgc2NhbGVDb25maWcgPSBjb25maWcuc2NhbGU7XG5cbiAgLy8gSWYgd2UgaGF2ZSBkZWZhdWx0IHJ1bGUtYmFzZSwgZGV0ZXJtaW5lIGRlZmF1bHQgdmFsdWUgZmlyc3RcbiAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgIGNhc2UgJ25pY2UnOlxuICAgICAgcmV0dXJuIG5pY2Uoc2NhbGVUeXBlLCBjaGFubmVsLCBmaWVsZERlZik7XG4gICAgY2FzZSAncGFkZGluZyc6XG4gICAgICByZXR1cm4gcGFkZGluZyhjaGFubmVsLCBzY2FsZVR5cGUsIHNjYWxlQ29uZmlnLCBmaWVsZERlZiwgbWFya0RlZiwgY29uZmlnLmJhcik7XG4gICAgY2FzZSAncGFkZGluZ0lubmVyJzpcbiAgICAgIHJldHVybiBwYWRkaW5nSW5uZXIoc2NhbGVQYWRkaW5nLCBjaGFubmVsLCBzY2FsZUNvbmZpZyk7XG4gICAgY2FzZSAncGFkZGluZ091dGVyJzpcbiAgICAgIHJldHVybiBwYWRkaW5nT3V0ZXIoc2NhbGVQYWRkaW5nLCBjaGFubmVsLCBzY2FsZVR5cGUsIHNjYWxlUGFkZGluZ0lubmVyLCBzY2FsZUNvbmZpZyk7XG4gICAgY2FzZSAncmV2ZXJzZSc6XG4gICAgICByZXR1cm4gcmV2ZXJzZShzY2FsZVR5cGUsIGZpZWxkRGVmLnNvcnQpO1xuICAgIGNhc2UgJ3plcm8nOlxuICAgICAgcmV0dXJuIHplcm8oY2hhbm5lbCwgZmllbGREZWYsIHNwZWNpZmllZERvbWFpbiwgbWFya0RlZik7XG4gIH1cbiAgLy8gT3RoZXJ3aXNlLCB1c2Ugc2NhbGUgY29uZmlnXG4gIHJldHVybiBzY2FsZUNvbmZpZ1twcm9wZXJ0eV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZVByb3BlcnR5KG1vZGVsOiBNb2RlbCwgcHJvcGVydHk6IGtleW9mIChTY2FsZSB8IFNjYWxlQ29tcG9uZW50UHJvcHMpKSB7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgaWYgKHByb3BlcnR5ID09PSAncmFuZ2UnKSB7XG4gICAgICBwYXJzZVNjYWxlUmFuZ2UoY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZVNjYWxlUHJvcGVydHkoY2hpbGQsIHByb3BlcnR5KTtcbiAgICB9XG4gIH1cblxuICBrZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBsZXQgdmFsdWVXaXRoRXhwbGljaXQ6IEV4cGxpY2l0PGFueT47XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjaGlsZENvbXBvbmVudCA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgY2hpbGRWYWx1ZVdpdGhFeHBsaWNpdCA9IGNoaWxkQ29tcG9uZW50LmdldFdpdGhFeHBsaWNpdChwcm9wZXJ0eSk7XG4gICAgICAgIHZhbHVlV2l0aEV4cGxpY2l0ID0gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8VmdTY2FsZSwgYW55PihcbiAgICAgICAgICB2YWx1ZVdpdGhFeHBsaWNpdCwgY2hpbGRWYWx1ZVdpdGhFeHBsaWNpdCxcbiAgICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgICAnc2NhbGUnLFxuICAgICAgICAgIHRpZUJyZWFrQnlDb21wYXJpbmc8VmdTY2FsZSwgYW55PigodjEsIHYyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICAgICAgICAvLyBGb3IgcmFuZ2Ugc3RlcCwgcHJlZmVyIGxhcmdlciBzdGVwXG4gICAgICAgICAgICAgICAgaWYgKHYxLnN0ZXAgJiYgdjIuc3RlcCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHYxLnN0ZXAgLSB2Mi5zdGVwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgLy8gVE9ETzogcHJlY2VkZW5jZSBydWxlIGZvciBvdGhlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5zZXRXaXRoRXhwbGljaXQocHJvcGVydHksIHZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuaWNlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPik6IGJvb2xlYW4gfCBOaWNlVGltZSB7XG4gIGlmIChmaWVsZERlZi5iaW4gfHwgdXRpbC5jb250YWlucyhbU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdLCBzY2FsZVR5cGUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpOyAvLyByZXR1cm4gdHJ1ZSBmb3IgcXVhbnRpdGF0aXZlIFgvWSB1bmxlc3MgYmlubmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nKGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBtYXJrRGVmOiBNYXJrRGVmLCBiYXJDb25maWc6IEJhckNvbmZpZykge1xuICBpZiAodXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgaWYgKGlzQ29udGludW91c1RvQ29udGludW91cyhzY2FsZVR5cGUpKSB7XG4gICAgICBpZiAoc2NhbGVDb25maWcuY29udGludW91c1BhZGRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc2NhbGVDb25maWcuY29udGludW91c1BhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHt0eXBlLCBvcmllbnR9ID0gbWFya0RlZjtcbiAgICAgIGlmICh0eXBlID09PSAnYmFyJyAmJiAhZmllbGREZWYuYmluKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAob3JpZW50ID09PSAndmVydGljYWwnICYmIGNoYW5uZWwgPT09ICd4JykgfHxcbiAgICAgICAgICAob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgJiYgY2hhbm5lbCA9PT0gJ3knKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gYmFyQ29uZmlnLmNvbnRpbnVvdXNCYW5kU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzY2FsZVR5cGUgPT09IFNjYWxlVHlwZS5QT0lOVCkge1xuICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLnBvaW50UGFkZGluZztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmdJbm5lcihwYWRkaW5nVmFsdWU6IG51bWJlciwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChwYWRkaW5nVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIElmIHVzZXIgaGFzIGFscmVhZHkgbWFudWFsbHkgc3BlY2lmaWVkIFwicGFkZGluZ1wiLCBubyBuZWVkIHRvIGFkZCBkZWZhdWx0IHBhZGRpbmdJbm5lci5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIC8vIFBhZGRpbmcgaXMgb25seSBzZXQgZm9yIFggYW5kIFkgYnkgZGVmYXVsdC5cbiAgICAvLyBCYXNpY2FsbHkgaXQgZG9lc24ndCBtYWtlIHNlbnNlIHRvIGFkZCBwYWRkaW5nIGZvciBjb2xvciBhbmQgc2l6ZS5cblxuICAgIC8vIHBhZGRpbmdPdXRlciB3b3VsZCBvbmx5IGJlIGNhbGxlZCBpZiBpdCdzIGEgYmFuZCBzY2FsZSwganVzdCByZXR1cm4gdGhlIGRlZmF1bHQgZm9yIGJhbmRTY2FsZS5cbiAgICByZXR1cm4gc2NhbGVDb25maWcuYmFuZFBhZGRpbmdJbm5lcjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZ091dGVyKHBhZGRpbmdWYWx1ZTogbnVtYmVyLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgcGFkZGluZ0lubmVyVmFsdWU6IG51bWJlciwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChwYWRkaW5nVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIElmIHVzZXIgaGFzIGFscmVhZHkgbWFudWFsbHkgc3BlY2lmaWVkIFwicGFkZGluZ1wiLCBubyBuZWVkIHRvIGFkZCBkZWZhdWx0IHBhZGRpbmdPdXRlci5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIC8vIFBhZGRpbmcgaXMgb25seSBzZXQgZm9yIFggYW5kIFkgYnkgZGVmYXVsdC5cbiAgICAvLyBCYXNpY2FsbHkgaXQgZG9lc24ndCBtYWtlIHNlbnNlIHRvIGFkZCBwYWRkaW5nIGZvciBjb2xvciBhbmQgc2l6ZS5cbiAgICBpZiAoc2NhbGVUeXBlID09PSBTY2FsZVR5cGUuQkFORCkge1xuICAgICAgaWYgKHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nT3V0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc2NhbGVDb25maWcuYmFuZFBhZGRpbmdPdXRlcjtcbiAgICAgIH1cbiAgICAgIC8qIEJ5IGRlZmF1bHQsIHBhZGRpbmdPdXRlciBpcyBwYWRkaW5nSW5uZXIgLyAyLiBUaGUgcmVhc29uIGlzIHRoYXRcbiAgICAgICAgICBzaXplICh3aWR0aC9oZWlnaHQpID0gc3RlcCAqIChjYXJkaW5hbGl0eSAtIHBhZGRpbmdJbm5lciArIDIgKiBwYWRkaW5nT3V0ZXIpLlxuICAgICAgICAgIGFuZCB3ZSB3YW50IHRoZSB3aWR0aC9oZWlnaHQgdG8gYmUgaW50ZWdlciBieSBkZWZhdWx0LlxuICAgICAgICAgIE5vdGUgdGhhdCBzdGVwIChieSBkZWZhdWx0KSBhbmQgY2FyZGluYWxpdHkgYXJlIGludGVnZXJzLikgKi9cbiAgICAgIHJldHVybiBwYWRkaW5nSW5uZXJWYWx1ZSAvIDI7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZlcnNlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzb3J0OiBTb3J0T3JkZXIgfCBFbmNvZGluZ1NvcnRGaWVsZDxzdHJpbmc+IHwgc3RyaW5nW10pIHtcbiAgaWYgKGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiBzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICAvLyBGb3IgY29udGludW91cyBkb21haW4gc2NhbGVzLCBWZWdhIGRvZXMgbm90IHN1cHBvcnQgZG9tYWluIHNvcnQuXG4gICAgLy8gVGh1cywgd2UgcmV2ZXJzZSByYW5nZSBpbnN0ZWFkIGlmIHNvcnQgaXMgZGVzY2VuZGluZ1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRTY2FsZTogRG9tYWluLCBtYXJrRGVmOiBNYXJrRGVmKSB7XG5cbiAgLy8gSWYgdXNlcnMgZXhwbGljaXRseSBwcm92aWRlIGEgZG9tYWluIHJhbmdlLCB3ZSBzaG91bGQgbm90IGF1Z21lbnQgemVybyBhcyB0aGF0IHdpbGwgYmUgdW5leHBlY3RlZC5cbiAgY29uc3QgaGFzQ3VzdG9tRG9tYWluID0gISFzcGVjaWZpZWRTY2FsZSAmJiBzcGVjaWZpZWRTY2FsZSAhPT0gJ3VuYWdncmVnYXRlZCc7XG4gIGlmIChoYXNDdXN0b21Eb21haW4pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBpcyBubyBjdXN0b20gZG9tYWluLCByZXR1cm4gdHJ1ZSBvbmx5IGZvciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuXG4gIC8vIDEpIHVzaW5nIHF1YW50aXRhdGl2ZSBmaWVsZCB3aXRoIHNpemVcbiAgLy8gV2hpbGUgdGhpcyBjYW4gYmUgZWl0aGVyIHJhdGlvIG9yIGludGVydmFsIGZpZWxkcywgb3VyIGFzc3VtcHRpb24gaXMgdGhhdFxuICAvLyByYXRpbyBhcmUgbW9yZSBjb21tb24uXG4gIGlmIChjaGFubmVsID09PSAnc2l6ZScgJiYgZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIDIpIG5vbi1iaW5uZWQsIHF1YW50aXRhdGl2ZSB4LXNjYWxlIG9yIHktc2NhbGVcbiAgLy8gKEZvciBiaW5uaW5nLCB3ZSBzaG91bGQgbm90IGluY2x1ZGUgemVybyBieSBkZWZhdWx0IGJlY2F1c2UgYmlubmluZyBhcmUgY2FsY3VsYXRlZCB3aXRob3V0IHplcm8uKVxuICBpZiAoIWZpZWxkRGVmLmJpbiAmJiB1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICBjb25zdCB7b3JpZW50LCB0eXBlfSA9IG1hcmtEZWY7XG4gICAgaWYgKGNvbnRhaW5zKFsnYmFyJywgJ2FyZWEnLCAnbGluZScsICd0cmFpbCddLCB0eXBlKSkge1xuICAgICAgaWYgKFxuICAgICAgICAob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgJiYgY2hhbm5lbCA9PT0gJ3knKSB8fFxuICAgICAgICAob3JpZW50ID09PSAndmVydGljYWwnICYmIGNoYW5uZWwgPT09ICd4JylcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIl19