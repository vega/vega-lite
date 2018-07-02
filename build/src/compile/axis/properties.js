import { truncate } from 'vega-util';
import { binToString } from '../../bin';
import { X, Y } from '../../channel';
import { title as fieldDefTitle, valueArray } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain, isSelectionDomain } from '../../scale';
import { QUANTITATIVE } from '../../type';
import { contains } from '../../util';
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function grid(scaleType, fieldDef) {
    return !hasDiscreteDomain(scaleType) && !fieldDef.bin;
}
export function gridScale(model, channel) {
    var gridChannel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
        return model.scaleName(gridChannel);
    }
    return undefined;
}
export function labelFlush(fieldDef, channel, specifiedAxis) {
    if (specifiedAxis.labelFlush !== undefined) {
        return specifiedAxis.labelFlush;
    }
    if (channel === 'x' && contains(['quantitative', 'temporal'], fieldDef.type)) {
        return true;
    }
    return undefined;
}
export function labelOverlap(fieldDef, specifiedAxis, channel, scaleType) {
    if (specifiedAxis.labelOverlap !== undefined) {
        return specifiedAxis.labelOverlap;
    }
    // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
    if (fieldDef.type !== 'nominal') {
        if (scaleType === 'log') {
            return 'greedy';
        }
        return true;
    }
    return undefined;
}
export function orient(channel) {
    switch (channel) {
        case X:
            return 'bottom';
        case Y:
            return 'left';
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}
export function tickCount(channel, fieldDef, scaleType, size) {
    if (!hasDiscreteDomain(scaleType) && scaleType !== 'log' && !contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {
        if (fieldDef.bin) {
            // for binned data, we don't want more ticks than maxbins
            return { signal: "ceil(" + size.signal + "/20)" };
        }
        return { signal: "ceil(" + size.signal + "/40)" };
    }
    return undefined;
}
export function title(maxLength, fieldDef, config) {
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fieldDefTitle(fieldDef, config);
    return maxLength ? truncate(fieldTitle, maxLength) : fieldTitle;
}
export function values(specifiedAxis, model, fieldDef, channel) {
    var vals = specifiedAxis.values;
    if (vals) {
        return valueArray(fieldDef, vals);
    }
    if (fieldDef.bin && fieldDef.type === QUANTITATIVE) {
        var domain = model.scaleDomain(channel);
        if (domain && domain !== 'unaggregated' && !isSelectionDomain(domain)) { // explicit value
            return undefined;
        }
        var signal = model.getName(binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
        return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
    }
    return undefined;
}
//# sourceMappingURL=properties.js.map