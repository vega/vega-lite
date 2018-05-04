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
    if (!fieldDef.bin && util.contains([X, Y], channel)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF3QixDQUFDLEVBQUUsQ0FBQyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRzFELE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBQyxtQ0FBbUMsRUFBVSxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBZ0MsU0FBUyxFQUFFLHdCQUF3QixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTFMLE9BQU8sRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxXQUFXLEVBQVEsTUFBTSxVQUFVLENBQUM7QUFDNUMsT0FBTyxFQUFXLHVCQUF1QixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBR2hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFeEMsTUFBTSw2QkFBNkIsS0FBWSxFQUFFLFFBQTZDO0lBQzVGLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLHNCQUFzQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN6QztTQUFNO1FBQ0wseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQztBQUVELGdDQUFnQyxLQUFnQixFQUFFLFFBQTZDO0lBQzdGLElBQU0sb0JBQW9CLEdBQXdCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXpFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQXFCO1FBQ3ZELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxD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T0FBTyxDQUFDLEVBQUU7UUFDNUMsSUFBQSx1QkFBTSxFQUFFLG1CQUFJLENBQVk7UUFDL0IsSUFBSSxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNwRCxJQUNFLENBQUMsTUFBTSxLQUFLLFlBQVksSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDO2dCQUM1QyxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksT0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUMxQztnQkFDQSxPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBTY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QmFyQ29uZmlnLCBNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7Y2hhbm5lbFNjYWxlUHJvcGVydHlJbmNvbXBhdGFiaWxpdHksIERvbWFpbiwgaGFzQ29udGludW91c0RvbWFpbiwgaXNDb250aW51b3VzVG9Db250aW51b3VzLCBOaWNlVGltZSwgU2NhbGUsIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGUsIHNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2NvbnRhaW5zLCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2NhbGV9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0V4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdCwgdGllQnJlYWtCeUNvbXBhcmluZ30gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtTY2FsZUNvbXBvbmVudCwgU2NhbGVDb21wb25lbnRJbmRleCwgU2NhbGVDb21wb25lbnRQcm9wc30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVNjYWxlUmFuZ2V9IGZyb20gJy4vcmFuZ2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZVByb3BlcnR5KG1vZGVsOiBNb2RlbCwgcHJvcGVydHk6IGtleW9mIChTY2FsZSB8IFNjYWxlQ29tcG9uZW50UHJvcHMpKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBwYXJzZVVuaXRTY2FsZVByb3BlcnR5KG1vZGVsLCBwcm9wZXJ0eSk7XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VOb25Vbml0U2NhbGVQcm9wZXJ0eShtb2RlbCwgcHJvcGVydHkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdFNjYWxlUHJvcGVydHkobW9kZWw6IFVuaXRNb2RlbCwgcHJvcGVydHk6IGtleW9mIChTY2FsZSB8IFNjYWxlQ29tcG9uZW50UHJvcHMpKSB7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICBrZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBjb25zdCBzcGVjaWZpZWRTY2FsZSA9IG1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXTtcbiAgICBjb25zdCBsb2NhbFNjYWxlQ21wdCA9IGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdO1xuICAgIGNvbnN0IG1lcmdlZFNjYWxlQ21wdCA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICAgIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gICAgY29uc3Qgc29ydCA9IG1vZGVsLnNvcnQoY2hhbm5lbCk7XG4gICAgY29uc3QgY29uZmlnID0gbW9kZWwuY29uZmlnO1xuXG4gICAgY29uc3Qgc3BlY2lmaWVkVmFsdWUgPSBzcGVjaWZpZWRTY2FsZVtwcm9wZXJ0eV07XG4gICAgY29uc3Qgc1R5cGUgPSBtZXJnZWRTY2FsZUNtcHQuZ2V0KCd0eXBlJyk7XG5cbiAgICBjb25zdCBzdXBwb3J0ZWRCeVNjYWxlVHlwZSA9IHNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eShzVHlwZSwgcHJvcGVydHkpO1xuICAgIGNvbnN0IGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkgPSBjaGFubmVsU2NhbGVQcm9wZXJ0eUluY29tcGF0YWJpbGl0eShjaGFubmVsLCBwcm9wZXJ0eSk7XG5cbiAgICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYSBzcGVjaWZpZWQgdmFsdWUsIGNoZWNrIGlmIGl0IGlzIGNvbXBhdGlibGUgd2l0aCBzY2FsZSB0eXBlIGFuZCBjaGFubmVsXG4gICAgICBpZiAoIXN1cHBvcnRlZEJ5U2NhbGVUeXBlKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnNjYWxlUHJvcGVydHlOb3RXb3JrV2l0aFNjYWxlVHlwZShzVHlwZSwgcHJvcGVydHksIGNoYW5uZWwpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbEluY29tcGF0YWJpbGl0eSkgeyAvLyBjaGFubmVsXG4gICAgICAgIGxvZy53YXJuKGNoYW5uZWxJbmNvbXBhdGFiaWxpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3VwcG9ydGVkQnlTY2FsZVR5cGUgJiYgY2hhbm5lbEluY29tcGF0YWJpbGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBjb3B5S2V5RnJvbU9iamVjdCBlbnN1cmUgdHlwZSBzYWZldHlcbiAgICAgICAgbG9jYWxTY2FsZUNtcHQuY29weUtleUZyb21PYmplY3QocHJvcGVydHksIHNwZWNpZmllZFNjYWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0RGVmYXVsdFZhbHVlKFxuICAgICAgICAgIHByb3BlcnR5LCBjaGFubmVsLCBmaWVsZERlZiwgc29ydCxcbiAgICAgICAgICBtZXJnZWRTY2FsZUNtcHQuZ2V0KCd0eXBlJyksXG4gICAgICAgICAgbWVyZ2VkU2NhbGVDbXB0LmdldCgncGFkZGluZycpLFxuICAgICAgICAgIG1lcmdlZFNjYWxlQ21wdC5nZXQoJ3BhZGRpbmdJbm5lcicpLFxuICAgICAgICAgIHNwZWNpZmllZFNjYWxlLmRvbWFpbixcbiAgICAgICAgICBtb2RlbC5tYXJrRGVmLCBjb25maWdcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsb2NhbFNjYWxlQ21wdC5zZXQocHJvcGVydHksIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vLyBOb3RlOiBUaGlzIG1ldGhvZCBpcyB1c2VkIGluIFZveWFnZXIuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFZhbHVlKFxuICBwcm9wZXJ0eToga2V5b2YgU2NhbGUsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzb3J0OiBTb3J0T3JkZXIgfCBTb3J0RmllbGQ8c3RyaW5nPiB8IHN0cmluZ1tdLFxuICBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVQYWRkaW5nOiBudW1iZXIsIHNjYWxlUGFkZGluZ0lubmVyOiBudW1iZXIsXG4gIHNwZWNpZmllZERvbWFpbjogU2NhbGVbJ2RvbWFpbiddLCBtYXJrRGVmOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBzY2FsZUNvbmZpZyA9IGNvbmZpZy5zY2FsZTtcblxuICAvLyBJZiB3ZSBoYXZlIGRlZmF1bHQgcnVsZS1iYXNlLCBkZXRlcm1pbmUgZGVmYXVsdCB2YWx1ZSBmaXJzdFxuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnbmljZSc6XG4gICAgICByZXR1cm4gbmljZShzY2FsZVR5cGUsIGNoYW5uZWwsIGZpZWxkRGVmKTtcbiAgICBjYXNlICdwYWRkaW5nJzpcbiAgICAgIHJldHVybiBwYWRkaW5nKGNoYW5uZWwsIHNjYWxlVHlwZSwgc2NhbGVDb25maWcsIGZpZWxkRGVmLCBtYXJrRGVmLCBjb25maWcuYmFyKTtcbiAgICBjYXNlICdwYWRkaW5nSW5uZXInOlxuICAgICAgcmV0dXJuIHBhZGRpbmdJbm5lcihzY2FsZVBhZGRpbmcsIGNoYW5uZWwsIHNjYWxlQ29uZmlnKTtcbiAgICBjYXNlICdwYWRkaW5nT3V0ZXInOlxuICAgICAgcmV0dXJuIHBhZGRpbmdPdXRlcihzY2FsZVBhZGRpbmcsIGNoYW5uZWwsIHNjYWxlVHlwZSwgc2NhbGVQYWRkaW5nSW5uZXIsIHNjYWxlQ29uZmlnKTtcbiAgICBjYXNlICdyZXZlcnNlJzpcbiAgICAgIHJldHVybiByZXZlcnNlKHNjYWxlVHlwZSwgc29ydCk7XG4gICAgY2FzZSAnemVybyc6XG4gICAgICByZXR1cm4gemVybyhjaGFubmVsLCBmaWVsZERlZiwgc3BlY2lmaWVkRG9tYWluLCBtYXJrRGVmKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHVzZSBzY2FsZSBjb25maWdcbiAgcmV0dXJuIHNjYWxlQ29uZmlnW3Byb3BlcnR5XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlUHJvcGVydHkobW9kZWw6IE1vZGVsLCBwcm9wZXJ0eToga2V5b2YgKFNjYWxlIHwgU2NhbGVDb21wb25lbnRQcm9wcykpIHtcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBpZiAocHJvcGVydHkgPT09ICdyYW5nZScpIHtcbiAgICAgIHBhcnNlU2NhbGVSYW5nZShjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlU2NhbGVQcm9wZXJ0eShjaGlsZCwgcHJvcGVydHkpO1xuICAgIH1cbiAgfVxuXG4gIGtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGxldCB2YWx1ZVdpdGhFeHBsaWNpdDogRXhwbGljaXQ8YW55PjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZENvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBjaGlsZFZhbHVlV2l0aEV4cGxpY2l0ID0gY2hpbGRDb21wb25lbnQuZ2V0V2l0aEV4cGxpY2l0KHByb3BlcnR5KTtcbiAgICAgICAgdmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ1NjYWxlLCBhbnk+KFxuICAgICAgICAgIHZhbHVlV2l0aEV4cGxpY2l0LCBjaGlsZFZhbHVlV2l0aEV4cGxpY2l0LFxuICAgICAgICAgIHByb3BlcnR5LFxuICAgICAgICAgICdzY2FsZScsXG4gICAgICAgICAgdGllQnJlYWtCeUNvbXBhcmluZzxWZ1NjYWxlLCBhbnk+KCh2MSwgdjIpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgICAgICAgIC8vIEZvciByYW5nZSBzdGVwLCBwcmVmZXIgbGFyZ2VyIHN0ZXBcbiAgICAgICAgICAgICAgICBpZiAodjEuc3RlcCAmJiB2Mi5zdGVwKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdjEuc3RlcCAtIHYyLnN0ZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAvLyBUT0RPOiBwcmVjZWRlbmNlIHJ1bGUgZm9yIG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLnNldFdpdGhFeHBsaWNpdChwcm9wZXJ0eSwgdmFsdWVXaXRoRXhwbGljaXQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5pY2Uoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KTogYm9vbGVhbiB8IE5pY2VUaW1lIHtcbiAgaWYgKGZpZWxkRGVmLmJpbiB8fCB1dGlsLmNvbnRhaW5zKFtTY2FsZVR5cGUuVElNRSwgU2NhbGVUeXBlLlVUQ10sIHNjYWxlVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCk7IC8vIHJldHVybiB0cnVlIGZvciBxdWFudGl0YXRpdmUgWC9ZIHVubGVzcyBiaW5uZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmcoY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZywgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIG1hcmtEZWY6IE1hcmtEZWYsIGJhckNvbmZpZzogQmFyQ29uZmlnKSB7XG4gIGlmICh1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICBpZiAoaXNDb250aW51b3VzVG9Db250aW51b3VzKHNjYWxlVHlwZSkpIHtcbiAgICAgIGlmIChzY2FsZUNvbmZpZy5jb250aW51b3VzUGFkZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5jb250aW51b3VzUGFkZGluZztcbiAgICAgIH1cblxuICAgICAgY29uc3Qge3R5cGUsIG9yaWVudH0gPSBtYXJrRGVmO1xuICAgICAgaWYgKHR5cGUgPT09ICdiYXInICYmICFmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcgJiYgY2hhbm5lbCA9PT0gJ3gnKSB8fFxuICAgICAgICAgIChvcmllbnQgPT09ICdob3Jpem9udGFsJyAmJiBjaGFubmVsID09PSAneScpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBiYXJDb25maWcuY29udGludW91c0JhbmRTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gU2NhbGVUeXBlLlBPSU5UKSB7XG4gICAgICByZXR1cm4gc2NhbGVDb25maWcucG9pbnRQYWRkaW5nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZ0lubmVyKHBhZGRpbmdWYWx1ZTogbnVtYmVyLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKHBhZGRpbmdWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gSWYgdXNlciBoYXMgYWxyZWFkeSBtYW51YWxseSBzcGVjaWZpZWQgXCJwYWRkaW5nXCIsIG5vIG5lZWQgdG8gYWRkIGRlZmF1bHQgcGFkZGluZ0lubmVyLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgLy8gUGFkZGluZyBpcyBvbmx5IHNldCBmb3IgWCBhbmQgWSBieSBkZWZhdWx0LlxuICAgIC8vIEJhc2ljYWxseSBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgdG8gYWRkIHBhZGRpbmcgZm9yIGNvbG9yIGFuZCBzaXplLlxuXG4gICAgLy8gcGFkZGluZ091dGVyIHdvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIGl0J3MgYSBiYW5kIHNjYWxlLCBqdXN0IHJldHVybiB0aGUgZGVmYXVsdCBmb3IgYmFuZFNjYWxlLlxuICAgIHJldHVybiBzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ0lubmVyO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nT3V0ZXIocGFkZGluZ1ZhbHVlOiBudW1iZXIsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBwYWRkaW5nSW5uZXJWYWx1ZTogbnVtYmVyLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKHBhZGRpbmdWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gSWYgdXNlciBoYXMgYWxyZWFkeSBtYW51YWxseSBzcGVjaWZpZWQgXCJwYWRkaW5nXCIsIG5vIG5lZWQgdG8gYWRkIGRlZmF1bHQgcGFkZGluZ091dGVyLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodXRpbC5jb250YWlucyhbWCwgWV0sIGNoYW5uZWwpKSB7XG4gICAgLy8gUGFkZGluZyBpcyBvbmx5IHNldCBmb3IgWCBhbmQgWSBieSBkZWZhdWx0LlxuICAgIC8vIEJhc2ljYWxseSBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgdG8gYWRkIHBhZGRpbmcgZm9yIGNvbG9yIGFuZCBzaXplLlxuICAgIGlmIChzY2FsZVR5cGUgPT09IFNjYWxlVHlwZS5CQU5EKSB7XG4gICAgICBpZiAoc2NhbGVDb25maWcuYmFuZFBhZGRpbmdPdXRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZUNvbmZpZy5iYW5kUGFkZGluZ091dGVyO1xuICAgICAgfVxuICAgICAgLyogQnkgZGVmYXVsdCwgcGFkZGluZ091dGVyIGlzIHBhZGRpbmdJbm5lciAvIDIuIFRoZSByZWFzb24gaXMgdGhhdFxuICAgICAgICAgIHNpemUgKHdpZHRoL2hlaWdodCkgPSBzdGVwICogKGNhcmRpbmFsaXR5IC0gcGFkZGluZ0lubmVyICsgMiAqIHBhZGRpbmdPdXRlcikuXG4gICAgICAgICAgYW5kIHdlIHdhbnQgdGhlIHdpZHRoL2hlaWdodCB0byBiZSBpbnRlZ2VyIGJ5IGRlZmF1bHQuXG4gICAgICAgICAgTm90ZSB0aGF0IHN0ZXAgKGJ5IGRlZmF1bHQpIGFuZCBjYXJkaW5hbGl0eSBhcmUgaW50ZWdlcnMuKSAqL1xuICAgICAgcmV0dXJuIHBhZGRpbmdJbm5lclZhbHVlIC8gMjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2Uoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNvcnQ6IFNvcnRPcmRlciB8IFNvcnRGaWVsZDxzdHJpbmc+IHwgc3RyaW5nW10pIHtcbiAgaWYgKGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiBzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICAvLyBGb3IgY29udGludW91cyBkb21haW4gc2NhbGVzLCBWZWdhIGRvZXMgbm90IHN1cHBvcnQgZG9tYWluIHNvcnQuXG4gICAgLy8gVGh1cywgd2UgcmV2ZXJzZSByYW5nZSBpbnN0ZWFkIGlmIHNvcnQgaXMgZGVzY2VuZGluZ1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRTY2FsZTogRG9tYWluLCBtYXJrRGVmOiBNYXJrRGVmKSB7XG5cbiAgLy8gSWYgdXNlcnMgZXhwbGljaXRseSBwcm92aWRlIGEgZG9tYWluIHJhbmdlLCB3ZSBzaG91bGQgbm90IGF1Z21lbnQgemVybyBhcyB0aGF0IHdpbGwgYmUgdW5leHBlY3RlZC5cbiAgY29uc3QgaGFzQ3VzdG9tRG9tYWluID0gISFzcGVjaWZpZWRTY2FsZSAmJiBzcGVjaWZpZWRTY2FsZSAhPT0gJ3VuYWdncmVnYXRlZCc7XG4gIGlmIChoYXNDdXN0b21Eb21haW4pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBpcyBubyBjdXN0b20gZG9tYWluLCByZXR1cm4gdHJ1ZSBvbmx5IGZvciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuXG4gIC8vIDEpIHVzaW5nIHF1YW50aXRhdGl2ZSBmaWVsZCB3aXRoIHNpemVcbiAgLy8gV2hpbGUgdGhpcyBjYW4gYmUgZWl0aGVyIHJhdGlvIG9yIGludGVydmFsIGZpZWxkcywgb3VyIGFzc3VtcHRpb24gaXMgdGhhdFxuICAvLyByYXRpbyBhcmUgbW9yZSBjb21tb24uXG4gIGlmIChjaGFubmVsID09PSAnc2l6ZScgJiYgZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIDIpIG5vbi1iaW5uZWQsIHF1YW50aXRhdGl2ZSB4LXNjYWxlIG9yIHktc2NhbGVcbiAgLy8gKEZvciBiaW5uaW5nLCB3ZSBzaG91bGQgbm90IGluY2x1ZGUgemVybyBieSBkZWZhdWx0IGJlY2F1c2UgYmlubmluZyBhcmUgY2FsY3VsYXRlZCB3aXRob3V0IHplcm8uKVxuICBpZiAoIWZpZWxkRGVmLmJpbiAmJiB1dGlsLmNvbnRhaW5zKFtYLCBZXSwgY2hhbm5lbCkpIHtcbiAgICBjb25zdCB7b3JpZW50LCB0eXBlfSA9IG1hcmtEZWY7XG4gICAgaWYgKGNvbnRhaW5zKFsnYmFyJywgJ2FyZWEnLCAnbGluZScsICd0cmFpbCddLCB0eXBlKSkge1xuICAgICAgaWYgKFxuICAgICAgICAob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgJiYgY2hhbm5lbCA9PT0gJ3knKSB8fFxuICAgICAgICAob3JpZW50ID09PSAndmVydGljYWwnICYmIGNoYW5uZWwgPT09ICd4JylcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIl19