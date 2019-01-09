import { isBinning } from '../../bin';
import { X, Y } from '../../channel';
import { valueArray, vgField } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain, isSelectionDomain } from '../../scale';
import { NOMINAL, ORDINAL, QUANTITATIVE } from '../../type';
import { contains } from '../../util';
import { getAxisConfig } from './config';
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function defaultGrid(scaleType, fieldDef) {
    return !hasDiscreteDomain(scaleType) && !isBinning(fieldDef.bin);
}
export function gridScale(model, channel) {
    const gridChannel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
        return model.scaleName(gridChannel);
    }
    return undefined;
}
export function labelAngle(model, specifiedAxis, channel, fieldDef) {
    // try axis value
    if (specifiedAxis.labelAngle !== undefined) {
        // Make angle within [0,360)
        return ((specifiedAxis.labelAngle % 360) + 360) % 360;
    }
    else {
        // try axis config value
        const angle = getAxisConfig('labelAngle', model.config, channel, orient(channel), model.getScaleComponent(channel).get('type'));
        if (angle !== undefined) {
            return ((angle % 360) + 360) % 360;
        }
        else {
            // get default value
            if (channel === X && contains([NOMINAL, ORDINAL], fieldDef.type)) {
                return 270;
            }
            // no default
            return undefined;
        }
    }
}
export function defaultLabelBaseline(angle, axisOrient) {
    if (angle !== undefined) {
        if (axisOrient === 'top' || axisOrient === 'bottom') {
            if (angle <= 45 || 315 <= angle) {
                return axisOrient === 'top' ? 'bottom' : 'top';
            }
            else if (135 <= angle && angle <= 225) {
                return axisOrient === 'top' ? 'top' : 'bottom';
            }
            else {
                return 'middle';
            }
        }
        else {
            if (angle <= 45 || 315 <= angle || (135 <= angle && angle <= 225)) {
                return 'middle';
            }
            else if (45 <= angle && angle <= 135) {
                return axisOrient === 'left' ? 'top' : 'bottom';
            }
            else {
                return axisOrient === 'left' ? 'bottom' : 'top';
            }
        }
    }
    return undefined;
}
export function defaultLabelAlign(angle, axisOrient) {
    if (angle !== undefined) {
        angle = ((angle % 360) + 360) % 360;
        if (axisOrient === 'top' || axisOrient === 'bottom') {
            if (angle % 180 === 0) {
                return 'center';
            }
            else if (0 < angle && angle < 180) {
                return axisOrient === 'top' ? 'right' : 'left';
            }
            else {
                return axisOrient === 'top' ? 'left' : 'right';
            }
        }
        else {
            if ((angle + 90) % 180 === 0) {
                return 'center';
            }
            else if (90 <= angle && angle < 270) {
                return axisOrient === 'left' ? 'left' : 'right';
            }
            else {
                return axisOrient === 'left' ? 'right' : 'left';
            }
        }
    }
    return undefined;
}
export function defaultLabelFlush(fieldDef, channel) {
    if (channel === 'x' && contains(['quantitative', 'temporal'], fieldDef.type)) {
        return true;
    }
    return undefined;
}
export function defaultLabelOverlap(fieldDef, scaleType) {
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
export function defaultTickCount({ fieldDef, scaleType, size, scaleName, specifiedAxis = {} }) {
    if (!hasDiscreteDomain(scaleType) &&
        scaleType !== 'log' &&
        !contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {
        if (specifiedAxis.tickStep) {
            return { signal: `(domain('${scaleName}')[1] - domain('${scaleName}')[0]) / ${specifiedAxis.tickStep} + 1` };
        }
        else if (isBinning(fieldDef.bin)) {
            // for binned data, we don't want more ticks than maxbins
            return { signal: `ceil(${size.signal}/10)` };
        }
        return { signal: `ceil(${size.signal}/40)` };
    }
    return undefined;
}
export function values(specifiedAxis, model, fieldDef, channel) {
    const vals = specifiedAxis.values;
    if (vals) {
        return valueArray(fieldDef, vals);
    }
    if (fieldDef.type === QUANTITATIVE) {
        if (isBinning(fieldDef.bin)) {
            const domain = model.scaleDomain(channel);
            if (domain && domain !== 'unaggregated' && !isSelectionDomain(domain)) {
                // explicit value
                return vals;
            }
            const binSignal = model.getName(vgField(fieldDef, { suffix: 'bins' }));
            return { signal: `sequence(${binSignal}.start, ${binSignal}.stop + ${binSignal}.step, ${binSignal}.step)` };
        }
        else if (specifiedAxis.tickStep) {
            const scaleName = model.scaleName(channel);
            const step = specifiedAxis.tickStep;
            return { signal: `sequence(domain('${scaleName}')[0], domain('${scaleName}')[1] + ${step}, ${step})` };
        }
    }
    return undefined;
}
//# sourceMappingURL=properties.js.map