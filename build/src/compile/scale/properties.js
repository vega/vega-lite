import { X, Y } from '../../channel';
import * as log from '../../log';
import { channelScalePropertyIncompatability, hasContinuousDomain, isContinuousToContinuous, ScaleType, scaleTypeSupportProperty } from '../../scale';
import { contains, keys } from '../../util';
import * as util from '../../util';
import { isUnitModel } from '../model';
import { mergeValuesWithExplicit, tieBreakByComparing } from '../split';
import { parseScaleRange } from './range';
export function parseScaleProperty(model, property) {
    if (isUnitModel(model)) {
        parseUnitScaleProperty(model, property);
    }
    else {
        parseNonUnitScaleProperty(model, property);
    }
}
function parseUnitScaleProperty(model, property) {
    var localScaleComponents = model.component.scales;
    keys(localScaleComponents).forEach(function (channel) {
        var specifiedScale = model.specifiedScales[channel];
        var localScaleCmpt = localScaleComponents[channel];
        var mergedScaleCmpt = model.getScaleComponent(channel);
        var fieldDef = model.fieldDef(channel);
        var sort = model.sort(channel);
        var config = model.config;
        var specifiedValue = specifiedScale[property];
        var sType = mergedScaleCmpt.get('type');
        var supportedByScaleType = scaleTypeSupportProperty(sType, property);
        var channelIncompatability = channelScalePropertyIncompatability(channel, property);
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
export function getDefaultValue(property, channel, fieldDef, sort, scaleType, scalePadding, scalePaddingInner, specifiedDomain, markDef, config) {
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
export function parseNonUnitScaleProperty(model, property) {
    var localScaleComponents = model.component.scales;
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        if (property === 'range') {
            parseScaleRange(child);
        }
        else {
            parseScaleProperty(child, property);
        }
    }
    keys(localScaleComponents).forEach(function (channel) {
        var valueWithExplicit;
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childComponent = child.component.scales[channel];
            if (childComponent) {
                var childValueWithExplicit = childComponent.getWithExplicit(property);
                valueWithExplicit = mergeValuesWithExplicit(valueWithExplicit, childValueWithExplicit, property, 'scale', tieBreakByComparing(function (v1, v2) {
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
export function nice(scaleType, channel, fieldDef) {
    if (fieldDef.bin || util.contains([ScaleType.TIME, ScaleType.UTC], scaleType)) {
        return undefined;
    }
    return util.contains([X, Y], channel); // return true for quantitative X/Y unless binned
}
export function padding(channel, scaleType, scaleConfig, fieldDef, markDef, barConfig) {
    if (util.contains([X, Y], channel)) {
        if (isContinuousToContinuous(scaleType)) {
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
        if (scaleType === ScaleType.POINT) {
            return scaleConfig.pointPadding;
        }
    }
    return undefined;
}
export function paddingInner(paddingValue, channel, scaleConfig) {
    if (paddingValue !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingInner.
        return undefined;
    }
    if (util.contains([X, Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
        return scaleConfig.bandPaddingInner;
    }
    return undefined;
}
export function paddingOuter(paddingValue, channel, scaleType, paddingInnerValue, scaleConfig) {
    if (paddingValue !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingOuter.
        return undefined;
    }
    if (util.contains([X, Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        if (scaleType === ScaleType.BAND) {
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
export function reverse(scaleType, sort) {
    if (hasContinuousDomain(scaleType) && sort === 'descending') {
        // For continuous domain scales, Vega does not support domain sort.
        // Thus, we reverse range instead if sort is descending
        return true;
    }
    return undefined;
}
export function zero(channel, fieldDef, specifiedScale, markDef) {
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
    if (!hasCustomDomain && !fieldDef.bin && util.contains([X, Y], channel)) {
        var orient = markDef.orient, type = markDef.type;
        if (contains(['bar', 'area', 'line', 'trail'], type)) {
            if ((orient === 'horizontal' && channel === 'y') ||
                (orient === 'vertical' && channel === 'x')) {
                return false;
            }
        }
        return true;
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF3QixDQUFDLEVBQUUsQ0FBQyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRzFELE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBQyxtQ0FBbUMsRUFBVSxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBZ0MsU0FBUyxFQUFFLHdCQUF3QixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTFMLE9BQU8sRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxXQUFXLEVBQVEsTUFBTSxVQUFVLENBQUM7QUFDNUMsT0FBTyxFQUFXLHVCQUF1QixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBR2hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFeEMsTUFBTSw2QkFBNkIsS0FBWSxFQUFFLFFBQTZDO0lBQzVGLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLHNCQUFzQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN6QztTQUFNO1FBQ0wseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQztBQUVELGdDQUFnQyxLQUFnQixFQUFFLFFBQTZDO0lBQzdGLElBQU0sb0JBQW9CLEdBQXdCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXpFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQXFCO1FBQ3ZELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxD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LEVBQUUsbUJBQUksQ0FBWTtRQUMvQixJQUFJLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3BELElBQ0UsQ0FBQyxNQUFNLEtBQUssWUFBWSxJQUFJLE9BQU8sS0FBSyxHQUFHLENBQUM7Z0JBQzVDLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDLEVBQzFDO2dCQUNBLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7U0FDRjtRQUVELE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5uZWwsIFNjYWxlQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtCYXJDb25maWcsIE1hcmtEZWZ9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtjaGFubmVsU2NhbGVQcm9wZXJ0eUluY29tcGF0YWJpbGl0eSwgRG9tYWluLCBoYXNDb250aW51b3VzRG9tYWluLCBpc0NvbnRpbnVvdXNUb0NvbnRpbnVvdXMsIE5pY2VUaW1lLCBTY2FsZSwgU2NhbGVDb25maWcsIFNjYWxlVHlwZSwgc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5fSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTY2FsZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0LCB0aWVCcmVha0J5Q29tcGFyaW5nfSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4LCBTY2FsZUNvbXBvbmVudFByb3BzfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlU2NhbGVSYW5nZX0gZnJvbSAnLi9yYW5nZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlUHJvcGVydHkobW9kZWw6IE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIHBhcnNlVW5pdFNjYWxlUHJvcGVydHkobW9kZWwsIHByb3BlcnR5KTtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZU5vblVuaXRTY2FsZVByb3BlcnR5KG1vZGVsLCBwcm9wZXJ0eSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVQcm9wZXJ0eShtb2RlbDogVW5pdE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIGtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IGxvY2FsU2NhbGVDbXB0ID0gbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF07XG4gICAgY29uc3QgbWVyZ2VkU2NhbGVDbXB0ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICBjb25zdCBzb3J0ID0gbW9kZWwuc29ydChjaGFubmVsKTtcbiAgICBjb25zdCBjb25maWcgPSBtb2RlbC5jb25maWc7XG5cbiAgICBjb25zdCBzcGVjaWZpZWRWYWx1ZSA9IHNwZWNpZmllZFNjYWxlW3Byb3BlcnR5XTtcbiAgICBjb25zdCBzVHlwZSA9IG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3R5cGUnKTtcblxuICAgIGNvbnN0IHN1cHBvcnRlZEJ5U2NhbGVUeXBlID0gc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5KHNUeXBlLCBwcm9wZXJ0eSk7XG4gICAgY29uc3QgY2hhbm5lbEluY29tcGF0YWJpbGl0eSA9IGNoYW5uZWxTY2FsZVByb3BlcnR5SW5jb21wYXRhYmlsaXR5KGNoYW5uZWwsIHByb3BlcnR5KTtcblxuICAgIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHNwZWNpZmllZCB2YWx1ZSwgY2hlY2sgaWYgaXQgaXMgY29tcGF0aWJsZSB3aXRoIHNjYWxlIHR5cGUgYW5kIGNoYW5uZWxcbiAgICAgIGlmICghc3VwcG9ydGVkQnlTY2FsZVR5cGUpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNUeXBlLCBwcm9wZXJ0eSwgY2hhbm5lbCkpO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsSW5jb21wYXRhYmlsaXR5KSB7IC8vIGNoYW5uZWxcbiAgICAgICAgbG9nLndhcm4oY2hhbm5lbEluY29tcGF0YWJpbGl0eSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdXBwb3J0ZWRCeVNjYWxlVHlwZSAmJiBjaGFubmVsSW5jb21wYXRhYmlsaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGNvcHlLZXlGcm9tT2JqZWN0IGVuc3VyZSB0eXBlIHNhZmV0eVxuICAgICAgICBsb2NhbFNjYWxlQ21wdC5jb3B5S2V5RnJvbU9iamVjdChwcm9wZXJ0eSwgc3BlY2lmaWVkU2NhbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXREZWZhdWx0VmFsdWUoXG4gICAgICAgICAgcHJvcGVydHksIGNoYW5uZWwsIGZpZWxkRGVmLCBzb3J0LFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3R5cGUnKSxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCdwYWRkaW5nJyksXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgncGFkZGluZ0lubmVyJyksXG4gICAgICAgICAgc3BlY2lmaWVkU2NhbGUuZG9tYWluLFxuICAgICAgICAgIG1vZGVsLm1hcmtEZWYsIGNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxvY2FsU2NhbGVDbXB0LnNldChwcm9wZXJ0eSwgdmFsdWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8vIE5vdGU6IFRoaXMgbWV0aG9kIGlzIHVzZWQgaW4gVm95YWdlci5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUoXG4gIHByb3BlcnR5OiBrZXlvZiBTY2FsZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNvcnQ6IFNvcnRPcmRlciB8IFNvcnRGaWVsZDxzdHJpbmc+IHwgc3RyaW5nW10sXG4gIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZVBhZGRpbmc6IG51bWJlciwgc2NhbGVQYWRkaW5nSW5uZXI6IG51bWJlcixcbiAgc3BlY2lmaWVkRG9tYWluOiBTY2FsZVsnZG9tYWluJ10sIG1hcmtEZWY6IE1hcmtEZWYsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IHNjYWxlQ29uZmlnID0gY29uZmlnLnNjYWxlO1xuXG4gIC8vIElmIHdlIGhhdmUgZGVmYXVsdCBydWxlLWJhc2UsIGRldGVybWluZSBkZWZhdWx0IHZhbHVlIGZpcnN0XG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICduaWNlJzpcbiAgICAgIHJldHVybiBuaWNlKHNjYWxlVHlwZSwgY2hhbm5lbCwgZmllbGREZWYpO1xuICAgIGNhc2UgJ3BhZGRpbmcnOlxuICAgICAgcmV0dXJuIHBhZGRpbmcoY2hhbm5lbCwgc2NhbGVUeXBlLCBzY2FsZUNvbmZpZywgZmllbGREZWYsIG1hcmtEZWYsIGNvbmZpZy5iYXIpO1xuICAgIGNhc2UgJ3BhZGRpbmdJbm5lcic6XG4gICAgICByZXR1cm4gcGFkZGluZ0lubmVyKHNjYWxlUGFkZGluZywgY2hhbm5lbCwgc2NhbGVDb25maWcpO1xuICAgIGNhc2UgJ3BhZGRpbmdPdXRlcic6XG4gICAgICByZXR1cm4gcGFkZGluZ091dGVyKHNjYWxlUGFkZGluZywgY2hhbm5lbCwgc2NhbGVUeXBlLCBzY2FsZVBhZGRpbmdJbm5lciwgc2NhbGVDb25maWcpO1xuICAgIGNhc2UgJ3JldmVyc2UnOlxuICAgICAgcmV0dXJuIHJldmVyc2Uoc2NhbGVUeXBlLCBzb3J0KTtcbiAgICBjYXNlICd6ZXJvJzpcbiAgICAgIHJldHVybiB6ZXJvKGNoYW5uZWwsIGZpZWxkRGVmLCBzcGVjaWZpZWREb21haW4sIG1hcmtEZWYpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgdXNlIHNjYWxlIGNvbmZpZ1xuICByZXR1cm4gc2NhbGVDb25maWdbcHJvcGVydHldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOb25Vbml0U2NhbGVQcm9wZXJ0eShtb2RlbDogTW9kZWwsIHByb3BlcnR5OiBrZXlvZiAoU2NhbGUgfCBTY2FsZUNvbXBvbmVudFByb3BzKSkge1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3JhbmdlJykge1xuICAgICAgcGFyc2VTY2FsZVJhbmdlKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2VTY2FsZVByb3BlcnR5KGNoaWxkLCBwcm9wZXJ0eSk7XG4gICAgfVxuICB9XG5cbiAga2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgbGV0IHZhbHVlV2l0aEV4cGxpY2l0OiBFeHBsaWNpdDxhbnk+O1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGNoaWxkVmFsdWVXaXRoRXhwbGljaXQgPSBjaGlsZENvbXBvbmVudC5nZXRXaXRoRXhwbGljaXQocHJvcGVydHkpO1xuICAgICAgICB2YWx1ZVdpdGhFeHBsaWNpdCA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnU2NhbGUsIGFueT4oXG4gICAgICAgICAgdmFsdWVXaXRoRXhwbGljaXQsIGNoaWxkVmFsdWVXaXRoRXhwbGljaXQsXG4gICAgICAgICAgcHJvcGVydHksXG4gICAgICAgICAgJ3NjYWxlJyxcbiAgICAgICAgICB0aWVCcmVha0J5Q29tcGFyaW5nPFZnU2NhbGUsIGFueT4oKHYxLCB2MikgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgICAgICAgLy8gRm9yIHJhbmdlIHN0ZXAsIHByZWZlciBsYXJnZXIgc3RlcFxuICAgICAgICAgICAgICAgIGlmICh2MS5zdGVwICYmIHYyLnN0ZXApIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB2MS5zdGVwIC0gdjIuc3RlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgIC8vIFRPRE86IHByZWNlZGVuY2UgcnVsZSBmb3Igb3RoZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0uc2V0V2l0aEV4cGxpY2l0KHByb3BlcnR5LCB2YWx1ZVdpdGhFeHBsaWNpdCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmljZShzY2FsZVR5cGU6IFNjYWxlVHlwZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pOiBib29sZWFuIHwgTmljZVRpbWUge1xuICBpZiAoZmllbGREZWYuYmluIHx8IHV0aWwuY29udGFpbnMoW1NjYWxlVHlwZS5USU1FLCBTY2FsZVR5cGUuVVRDXSwgc2NhbGVUeXBlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKTsgLy8gcmV0dXJuIHRydWUgZm9yIHF1YW50aXRhdGl2ZSBYL1kgdW5sZXNzIGJpbm5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZyhjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgbWFya0RlZjogTWFya0RlZiwgYmFyQ29uZmlnOiBCYXJDb25maWcpIHtcbiAgaWYgKHV0aWwuY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSkge1xuICAgIGlmIChpc0NvbnRpbnVvdXNUb0NvbnRpbnVvdXMoc2NhbGVUeXBlKSkge1xuICAgICAgaWYgKHNjYWxlQ29uZmlnLmNvbnRpbnVvdXNQYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLmNvbnRpbnVvdXNQYWRkaW5nO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7dHlwZSwgb3JpZW50fSA9IG1hcmtEZWY7XG4gICAgICBpZiAodHlwZSA9PT0gJ2JhcicgJiYgIWZpZWxkRGVmLmJpbikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKG9yaWVudCA9PT0gJ3ZlcnRpY2FsJyAmJiBjaGFubmVsID09PSAneCcpIHx8XG4gICAgICAgICAgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnICYmIGNoYW5uZWwgPT09ICd5JylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGJhckNvbmZpZy5jb250aW51b3VzQmFuZFNpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2NhbGVUeXBlID09PSBTY2FsZVR5cGUuUE9JTlQpIHtcbiAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5wb2ludFBhZGRpbmc7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nSW5uZXIocGFkZGluZ1ZhbHVlOiBudW1iZXIsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZykge1xuICBpZiAocGFkZGluZ1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBhbHJlYWR5IG1hbnVhbGx5IHNwZWNpZmllZCBcInBhZGRpbmdcIiwgbm8gbmVlZCB0byBhZGQgZGVmYXVsdCBwYWRkaW5nSW5uZXIuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICAvLyBQYWRkaW5nIGlzIG9ubHkgc2V0IGZvciBYIGFuZCBZIGJ5IGRlZmF1bHQuXG4gICAgLy8gQmFzaWNhbGx5IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBhZGQgcGFkZGluZyBmb3IgY29sb3IgYW5kIHNpemUuXG5cbiAgICAvLyBwYWRkaW5nT3V0ZXIgd291bGQgb25seSBiZSBjYWxsZWQgaWYgaXQncyBhIGJhbmQgc2NhbGUsIGp1c3QgcmV0dXJuIHRoZSBkZWZhdWx0IGZvciBiYW5kU2NhbGUuXG4gICAgcmV0dXJuIHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nSW5uZXI7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmdPdXRlcihwYWRkaW5nVmFsdWU6IG51bWJlciwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHBhZGRpbmdJbm5lclZhbHVlOiBudW1iZXIsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZykge1xuICBpZiAocGFkZGluZ1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBhbHJlYWR5IG1hbnVhbGx5IHNwZWNpZmllZCBcInBhZGRpbmdcIiwgbm8gbmVlZCB0byBhZGQgZGVmYXVsdCBwYWRkaW5nT3V0ZXIuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICAvLyBQYWRkaW5nIGlzIG9ubHkgc2V0IGZvciBYIGFuZCBZIGJ5IGRlZmF1bHQuXG4gICAgLy8gQmFzaWNhbGx5IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBhZGQgcGFkZGluZyBmb3IgY29sb3IgYW5kIHNpemUuXG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gU2NhbGVUeXBlLkJBTkQpIHtcbiAgICAgIGlmIChzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ091dGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlQ29uZmlnLmJhbmRQYWRkaW5nT3V0ZXI7XG4gICAgICB9XG4gICAgICAvKiBCeSBkZWZhdWx0LCBwYWRkaW5nT3V0ZXIgaXMgcGFkZGluZ0lubmVyIC8gMi4gVGhlIHJlYXNvbiBpcyB0aGF0XG4gICAgICAgICAgc2l6ZSAod2lkdGgvaGVpZ2h0KSA9IHN0ZXAgKiAoY2FyZGluYWxpdHkgLSBwYWRkaW5nSW5uZXIgKyAyICogcGFkZGluZ091dGVyKS5cbiAgICAgICAgICBhbmQgd2Ugd2FudCB0aGUgd2lkdGgvaGVpZ2h0IHRvIGJlIGludGVnZXIgYnkgZGVmYXVsdC5cbiAgICAgICAgICBOb3RlIHRoYXQgc3RlcCAoYnkgZGVmYXVsdCkgYW5kIGNhcmRpbmFsaXR5IGFyZSBpbnRlZ2Vycy4pICovXG4gICAgICByZXR1cm4gcGFkZGluZ0lubmVyVmFsdWUgLyAyO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZShzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc29ydDogU29ydE9yZGVyIHwgU29ydEZpZWxkPHN0cmluZz4gfCBzdHJpbmdbXSkge1xuICBpZiAoaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpICYmIHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgIC8vIEZvciBjb250aW51b3VzIGRvbWFpbiBzY2FsZXMsIFZlZ2EgZG9lcyBub3Qgc3VwcG9ydCBkb21haW4gc29ydC5cbiAgICAvLyBUaHVzLCB3ZSByZXZlcnNlIHJhbmdlIGluc3RlYWQgaWYgc29ydCBpcyBkZXNjZW5kaW5nXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZFNjYWxlOiBEb21haW4sIG1hcmtEZWY6IE1hcmtEZWYpIHtcbiAgLy8gQnkgZGVmYXVsdCwgcmV0dXJuIHRydWUgb25seSBmb3IgdGhlIGZvbGxvd2luZyBjYXNlczpcblxuICAvLyAxKSB1c2luZyBxdWFudGl0YXRpdmUgZmllbGQgd2l0aCBzaXplXG4gIC8vIFdoaWxlIHRoaXMgY2FuIGJlIGVpdGhlciByYXRpbyBvciBpbnRlcnZhbCBmaWVsZHMsIG91ciBhc3N1bXB0aW9uIGlzIHRoYXRcbiAgLy8gcmF0aW8gYXJlIG1vcmUgY29tbW9uLlxuICBpZiAoY2hhbm5lbCA9PT0gJ3NpemUnICYmIGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyAyKSBub24tYmlubmVkLCBxdWFudGl0YXRpdmUgeC1zY2FsZSBvciB5LXNjYWxlIGlmIG5vIGN1c3RvbSBkb21haW4gaXMgcHJvdmlkZWQuXG4gIC8vIChGb3IgYmlubmluZywgd2Ugc2hvdWxkIG5vdCBpbmNsdWRlIHplcm8gYnkgZGVmYXVsdCBiZWNhdXNlIGJpbm5pbmcgYXJlIGNhbGN1bGF0ZWQgd2l0aG91dCB6ZXJvLlxuICAvLyBTaW1pbGFyLCBpZiB1c2VycyBleHBsaWNpdGx5IHByb3ZpZGUgYSBkb21haW4gcmFuZ2UsIHdlIHNob3VsZCBub3QgYXVnbWVudCB6ZXJvIGFzIHRoYXQgd2lsbCBiZSB1bmV4cGVjdGVkLilcbiAgY29uc3QgaGFzQ3VzdG9tRG9tYWluID0gISFzcGVjaWZpZWRTY2FsZSAmJiBzcGVjaWZpZWRTY2FsZSAhPT0gJ3VuYWdncmVnYXRlZCc7XG4gIGlmICghaGFzQ3VzdG9tRG9tYWluICYmICFmaWVsZERlZi5iaW4gJiYgdXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgY29uc3Qge29yaWVudCwgdHlwZX0gPSBtYXJrRGVmO1xuICAgIGlmIChjb250YWlucyhbJ2JhcicsICdhcmVhJywgJ2xpbmUnLCAndHJhaWwnXSwgdHlwZSkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnICYmIGNoYW5uZWwgPT09ICd5JykgfHxcbiAgICAgICAgKG9yaWVudCA9PT0gJ3ZlcnRpY2FsJyAmJiBjaGFubmVsID09PSAneCcpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==