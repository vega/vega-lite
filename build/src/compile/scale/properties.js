import { COLOR, FILL, STROKE, X, Y } from '../../channel';
import * as log from '../../log';
import { channelScalePropertyIncompatability, hasContinuousDomain, isContinuousToContinuous, isContinuousToDiscrete, ScaleType, scaleTypeSupportProperty } from '../../scale';
import * as util from '../../util';
import { contains, getFirstDefined, keys } from '../../util';
import { isUnitModel } from '../model';
import { mergeValuesWithExplicit, tieBreakByComparing } from '../split';
import { parseUnitScaleRange } from './range';
export function parseScaleProperty(model, property) {
    if (isUnitModel(model)) {
        parseUnitScaleProperty(model, property);
    }
    else {
        parseNonUnitScaleProperty(model, property);
    }
}
function parseUnitScaleProperty(model, property) {
    const localScaleComponents = model.component.scales;
    keys(localScaleComponents).forEach((channel) => {
        const specifiedScale = model.specifiedScales[channel];
        const localScaleCmpt = localScaleComponents[channel];
        const mergedScaleCmpt = model.getScaleComponent(channel);
        const fieldDef = model.fieldDef(channel);
        const config = model.config;
        const specifiedValue = specifiedScale[property];
        const sType = mergedScaleCmpt.get('type');
        const supportedByScaleType = scaleTypeSupportProperty(sType, property);
        const channelIncompatability = channelScalePropertyIncompatability(channel, property);
        if (specifiedValue !== undefined) {
            // If there is a specified value, check if it is compatible with scale type and channel
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(sType, property, channel));
            }
            else if (channelIncompatability) {
                // channel
                log.warn(channelIncompatability);
            }
        }
        if (supportedByScaleType && channelIncompatability === undefined) {
            if (specifiedValue !== undefined) {
                // copyKeyFromObject ensure type safety
                localScaleCmpt.copyKeyFromObject(property, specifiedScale);
            }
            else {
                const value = getDefaultValue(property, channel, fieldDef, mergedScaleCmpt.get('type'), mergedScaleCmpt.get('padding'), mergedScaleCmpt.get('paddingInner'), specifiedScale.domain, model.markDef, config);
                if (value !== undefined) {
                    localScaleCmpt.set(property, value, false);
                }
            }
        }
    });
}
// Note: This method is used in Voyager.
export function getDefaultValue(property, channel, fieldDef, scaleType, scalePadding, scalePaddingInner, specifiedDomain, markDef, config) {
    const scaleConfig = config.scale;
    // If we have default rule-base, determine default value first
    switch (property) {
        case 'interpolate':
            return interpolate(channel, scaleType);
        case 'nice':
            return nice(scaleType, channel, fieldDef);
        case 'padding':
            return padding(channel, scaleType, scaleConfig, fieldDef, markDef, config.bar);
        case 'paddingInner':
            return paddingInner(scalePadding, channel, markDef.type, scaleConfig);
        case 'paddingOuter':
            return paddingOuter(scalePadding, channel, scaleType, markDef.type, scalePaddingInner, scaleConfig);
        case 'reverse':
            return reverse(scaleType, fieldDef.sort);
        case 'zero':
            return zero(channel, fieldDef, specifiedDomain, markDef, scaleType);
    }
    // Otherwise, use scale config
    return scaleConfig[property];
}
// This method is here rather than in range.ts to avoid circular dependency.
export function parseScaleRange(model) {
    if (isUnitModel(model)) {
        parseUnitScaleRange(model);
    }
    else {
        parseNonUnitScaleProperty(model, 'range');
    }
}
export function parseNonUnitScaleProperty(model, property) {
    const localScaleComponents = model.component.scales;
    for (const child of model.children) {
        if (property === 'range') {
            parseScaleRange(child);
        }
        else {
            parseScaleProperty(child, property);
        }
    }
    keys(localScaleComponents).forEach((channel) => {
        let valueWithExplicit;
        for (const child of model.children) {
            const childComponent = child.component.scales[channel];
            if (childComponent) {
                const childValueWithExplicit = childComponent.getWithExplicit(property);
                valueWithExplicit = mergeValuesWithExplicit(valueWithExplicit, childValueWithExplicit, property, 'scale', tieBreakByComparing((v1, v2) => {
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
export function interpolate(channel, scaleType) {
    if (contains([COLOR, FILL, STROKE], channel) && isContinuousToContinuous(scaleType)) {
        return 'hcl';
    }
    return undefined;
}
export function nice(scaleType, channel, fieldDef) {
    if (fieldDef.bin || util.contains([ScaleType.TIME, ScaleType.UTC], scaleType)) {
        return undefined;
    }
    return util.contains([X, Y], channel) ? true : undefined;
}
export function padding(channel, scaleType, scaleConfig, fieldDef, markDef, barConfig) {
    if (util.contains([X, Y], channel)) {
        if (isContinuousToContinuous(scaleType)) {
            if (scaleConfig.continuousPadding !== undefined) {
                return scaleConfig.continuousPadding;
            }
            const { type, orient } = markDef;
            if (type === 'bar' && !fieldDef.bin) {
                if ((orient === 'vertical' && channel === 'x') || (orient === 'horizontal' && channel === 'y')) {
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
export function paddingInner(paddingValue, channel, mark, scaleConfig) {
    if (paddingValue !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingInner.
        return undefined;
    }
    if (util.contains([X, Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
        const { bandPaddingInner, barBandPaddingInner, rectBandPaddingInner } = scaleConfig;
        return getFirstDefined(bandPaddingInner, mark === 'bar' ? barBandPaddingInner : rectBandPaddingInner);
    }
    return undefined;
}
export function paddingOuter(paddingValue, channel, scaleType, mark, paddingInnerValue, scaleConfig) {
    if (paddingValue !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingOuter.
        return undefined;
    }
    if (util.contains([X, Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        if (scaleType === ScaleType.BAND) {
            const { bandPaddingOuter, barBandPaddingOuter, rectBandPaddingOuter } = scaleConfig;
            return getFirstDefined(bandPaddingOuter, mark === 'bar' ? barBandPaddingOuter : rectBandPaddingOuter, 
            /* By default, paddingOuter is paddingInner / 2. The reason is that
              size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
              and we want the width/height to be integer by default.
              Note that step (by default) and cardinality are integers.) */
            paddingInnerValue / 2);
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
export function zero(channel, fieldDef, specifiedScale, markDef, scaleType) {
    // If users explicitly provide a domain range, we should not augment zero as that will be unexpected.
    const hasCustomDomain = !!specifiedScale && specifiedScale !== 'unaggregated';
    if (hasCustomDomain) {
        return false;
    }
    // If there is no custom domain, return true only for the following cases:
    // 1) using quantitative field with size
    // While this can be either ratio or interval fields, our assumption is that
    // ratio are more common. However, if the scaleType is discretizing scale, we want to return
    // false so that range doesn't start at zero
    if (channel === 'size' && fieldDef.type === 'quantitative' && !isContinuousToDiscrete(scaleType)) {
        return true;
    }
    // 2) non-binned, quantitative x-scale or y-scale
    // (For binning, we should not include zero by default because binning are calculated without zero.)
    if (!fieldDef.bin && util.contains([X, Y], channel)) {
        const { orient, type } = markDef;
        if (contains(['bar', 'area', 'line', 'trail'], type)) {
            if ((orient === 'horizontal' && channel === 'y') || (orient === 'vertical' && channel === 'x')) {
                return false;
            }
        }
        return true;
    }
    return false;
}
//# sourceMappingURL=properties.js.map