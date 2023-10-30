import { array, isBoolean } from 'vega-util';
import { SUM_OPS } from './aggregate';
import { getSecondaryRangeChannel, NONPOSITION_CHANNELS } from './channel';
import { channelDefType, getFieldDef, isFieldDef, isFieldOrDatumDef, vgField } from './channeldef';
import { channelHasField, isAggregate } from './encoding';
import * as log from './log';
import { ARC, AREA, BAR, CIRCLE, isMarkDef, isPathMark, LINE, POINT, RULE, SQUARE, TEXT, TICK } from './mark';
import { ScaleType } from './scale';
const STACK_OFFSET_INDEX = {
    zero: 1,
    center: 1,
    normalize: 1
};
export function isStackOffset(s) {
    return s in STACK_OFFSET_INDEX;
}
export const STACKABLE_MARKS = new Set([ARC, BAR, AREA, RULE, POINT, CIRCLE, SQUARE, LINE, TEXT, TICK]);
export const STACK_BY_DEFAULT_MARKS = new Set([BAR, AREA, ARC]);
function isUnbinnedQuantitative(channelDef) {
    return isFieldDef(channelDef) && channelDefType(channelDef) === 'quantitative' && !channelDef.bin;
}
function potentialStackedChannel(encoding, x, { orient, type: mark }) {
    const y = x === 'x' ? 'y' : 'radius';
    const isCartesian = x === 'x';
    const xDef = encoding[x];
    const yDef = encoding[y];
    if (isFieldDef(xDef) && isFieldDef(yDef)) {
        if (isUnbinnedQuantitative(xDef) && isUnbinnedQuantitative(yDef)) {
            if (xDef.stack) {
                return x;
            }
            else if (yDef.stack) {
                return y;
            }
            const xAggregate = isFieldDef(xDef) && !!xDef.aggregate;
            const yAggregate = isFieldDef(yDef) && !!yDef.aggregate;
            // if there is no explicit stacking, only apply stack if there is only one aggregate for x or y
            if (xAggregate !== yAggregate) {
                return xAggregate ? x : y;
            }
            if (isCartesian && ['bar', 'area'].includes(mark)) {
                if (orient === 'vertical') {
                    return y;
                }
                else if (orient === 'horizontal') {
                    return x;
                }
            }
        }
        else if (isUnbinnedQuantitative(xDef)) {
            return x;
        }
        else if (isUnbinnedQuantitative(yDef)) {
            return y;
        }
    }
    else if (isUnbinnedQuantitative(xDef)) {
        return x;
    }
    else if (isUnbinnedQuantitative(yDef)) {
        return y;
    }
    return undefined;
}
function getDimensionChannel(channel) {
    switch (channel) {
        case 'x':
            return 'y';
        case 'y':
            return 'x';
        case 'theta':
            return 'radius';
        case 'radius':
            return 'theta';
    }
}
export function stack(m, encoding) {
    const markDef = isMarkDef(m) ? m : { type: m };
    const mark = markDef.type;
    // Should have stackable mark
    if (!STACKABLE_MARKS.has(mark)) {
        return null;
    }
    // Run potential stacked twice, one for Cartesian and another for Polar,
    // so text marks can be stacked in any of the coordinates.
    // Note: The logic here is not perfectly correct.  If we want to support stacked dot plots where each dot is a pie chart with label, we have to change the stack logic here to separate Cartesian stacking for polar stacking.
    // However, since we probably never want to do that, let's just note the limitation here.
    const fieldChannel = potentialStackedChannel(encoding, 'x', markDef) || potentialStackedChannel(encoding, 'theta', markDef);
    if (!fieldChannel) {
        return null;
    }
    const stackedFieldDef = encoding[fieldChannel];
    const stackedField = isFieldDef(stackedFieldDef) ? vgField(stackedFieldDef, {}) : undefined;
    const dimensionChannel = getDimensionChannel(fieldChannel);
    const groupbyChannels = [];
    const groupbyFields = new Set();
    if (encoding[dimensionChannel]) {
        const dimensionDef = encoding[dimensionChannel];
        const dimensionField = isFieldDef(dimensionDef) ? vgField(dimensionDef, {}) : undefined;
        if (dimensionField && dimensionField !== stackedField) {
            // avoid grouping by the stacked field
            groupbyChannels.push(dimensionChannel);
            groupbyFields.add(dimensionField);
        }
    }
    const dimensionOffsetChannel = dimensionChannel === 'x' ? 'xOffset' : 'yOffset';
    const dimensionOffsetDef = encoding[dimensionOffsetChannel];
    const dimensionOffsetField = isFieldDef(dimensionOffsetDef) ? vgField(dimensionOffsetDef, {}) : undefined;
    if (dimensionOffsetField && dimensionOffsetField !== stackedField) {
        // avoid grouping by the stacked field
        groupbyChannels.push(dimensionOffsetChannel);
        groupbyFields.add(dimensionOffsetField);
    }
    // If the dimension has offset, don't stack anymore
    // Should have grouping level of detail that is different from the dimension field
    const stackBy = NONPOSITION_CHANNELS.reduce((sc, channel) => {
        // Ignore tooltip in stackBy (https://github.com/vega/vega-lite/issues/4001)
        if (channel !== 'tooltip' && channelHasField(encoding, channel)) {
            const channelDef = encoding[channel];
            for (const cDef of array(channelDef)) {
                const fieldDef = getFieldDef(cDef);
                if (fieldDef.aggregate) {
                    continue;
                }
                // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
                const f = vgField(fieldDef, {});
                if (
                // if fielddef is a repeat, just include it in the stack by
                !f ||
                    // otherwise, the field must be different from the groupBy fields.
                    !groupbyFields.has(f)) {
                    sc.push({ channel, fieldDef });
                }
            }
        }
        return sc;
    }, []);
    // Automatically determine offset
    let offset;
    if (stackedFieldDef.stack !== undefined) {
        if (isBoolean(stackedFieldDef.stack)) {
            offset = stackedFieldDef.stack ? 'zero' : null;
        }
        else {
            offset = stackedFieldDef.stack;
        }
    }
    else if (STACK_BY_DEFAULT_MARKS.has(mark)) {
        offset = 'zero';
    }
    if (!offset || !isStackOffset(offset)) {
        return null;
    }
    if (isAggregate(encoding) && stackBy.length === 0) {
        return null;
    }
    // warn when stacking non-linear
    if (stackedFieldDef?.scale?.type && stackedFieldDef?.scale?.type !== ScaleType.LINEAR) {
        if (stackedFieldDef?.stack) {
            log.warn(log.message.cannotStackNonLinearScale(stackedFieldDef.scale.type));
        }
        return null;
    }
    // Check if it is a ranged mark
    if (isFieldOrDatumDef(encoding[getSecondaryRangeChannel(fieldChannel)])) {
        if (stackedFieldDef.stack !== undefined) {
            log.warn(log.message.cannotStackRangedMark(fieldChannel));
        }
        return null;
    }
    // Warn if stacking non-summative aggregate
    if (isFieldDef(stackedFieldDef) &&
        stackedFieldDef.aggregate &&
        !SUM_OPS.has(stackedFieldDef.aggregate)) {
        log.warn(log.message.stackNonSummativeAggregate(stackedFieldDef.aggregate));
    }
    return {
        groupbyChannels,
        groupbyFields,
        fieldChannel,
        impute: stackedFieldDef.impute === null ? false : isPathMark(mark),
        stackBy,
        offset
    };
}
//# sourceMappingURL=stack.js.map