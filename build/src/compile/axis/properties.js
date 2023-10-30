import { isArray, isObject } from 'vega-util';
import { isBinned, isBinning } from '../../bin';
import { X } from '../../channel';
import { isDiscrete, isFieldDef, toFieldDefBase, valueArray } from '../../channeldef';
import { hasDiscreteDomain } from '../../scale';
import { durationExpr, normalizeTimeUnit } from '../../timeunit';
import { NOMINAL, ORDINAL } from '../../type';
import { contains, normalizeAngle } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { mergeTitle, mergeTitleFieldDefs } from '../common';
import { getAxisConfig } from './config';
export const axisRules = {
    scale: ({ model, channel }) => model.scaleName(channel),
    format: ({ format }) => format,
    formatType: ({ formatType }) => formatType,
    grid: ({ fieldOrDatumDef, axis, scaleType }) => axis.grid ?? defaultGrid(scaleType, fieldOrDatumDef),
    gridScale: ({ model, channel }) => gridScale(model, channel),
    labelAlign: ({ axis, labelAngle, orient, channel }) => axis.labelAlign || defaultLabelAlign(labelAngle, orient, channel),
    labelAngle: ({ labelAngle }) => labelAngle,
    labelBaseline: ({ axis, labelAngle, orient, channel }) => axis.labelBaseline || defaultLabelBaseline(labelAngle, orient, channel),
    labelFlush: ({ axis, fieldOrDatumDef, channel }) => axis.labelFlush ?? defaultLabelFlush(fieldOrDatumDef.type, channel),
    labelOverlap: ({ axis, fieldOrDatumDef, scaleType }) => axis.labelOverlap ??
        defaultLabelOverlap(fieldOrDatumDef.type, scaleType, isFieldDef(fieldOrDatumDef) && !!fieldOrDatumDef.timeUnit, isFieldDef(fieldOrDatumDef) ? fieldOrDatumDef.sort : undefined),
    // we already calculate orient in parse
    orient: ({ orient }) => orient,
    tickCount: ({ channel, model, axis, fieldOrDatumDef, scaleType }) => {
        const sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
        const size = sizeType ? model.getSizeSignalRef(sizeType) : undefined;
        return axis.tickCount ?? defaultTickCount({ fieldOrDatumDef, scaleType, size, values: axis.values });
    },
    tickMinStep: defaultTickMinStep,
    title: ({ axis, model, channel }) => {
        if (axis.title !== undefined) {
            return axis.title;
        }
        const fieldDefTitle = getFieldDefTitle(model, channel);
        if (fieldDefTitle !== undefined) {
            return fieldDefTitle;
        }
        const fieldDef = model.typedFieldDef(channel);
        const channel2 = channel === 'x' ? 'x2' : 'y2';
        const fieldDef2 = model.fieldDef(channel2);
        // If title not specified, store base parts of fieldDef (and fieldDef2 if exists)
        return mergeTitleFieldDefs(fieldDef ? [toFieldDefBase(fieldDef)] : [], isFieldDef(fieldDef2) ? [toFieldDefBase(fieldDef2)] : []);
    },
    values: ({ axis, fieldOrDatumDef }) => values(axis, fieldOrDatumDef),
    zindex: ({ axis, fieldOrDatumDef, mark }) => axis.zindex ?? defaultZindex(mark, fieldOrDatumDef)
};
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function defaultGrid(scaleType, fieldDef) {
    return !hasDiscreteDomain(scaleType) && isFieldDef(fieldDef) && !isBinning(fieldDef?.bin) && !isBinned(fieldDef?.bin);
}
export function gridScale(model, channel) {
    const gridChannel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
        return model.scaleName(gridChannel);
    }
    return undefined;
}
export function getLabelAngle(fieldOrDatumDef, axis, channel, styleConfig, axisConfigs) {
    const labelAngle = axis?.labelAngle;
    // try axis value
    if (labelAngle !== undefined) {
        return isSignalRef(labelAngle) ? labelAngle : normalizeAngle(labelAngle);
    }
    else {
        // try axis config value
        const { configValue: angle } = getAxisConfig('labelAngle', styleConfig, axis?.style, axisConfigs);
        if (angle !== undefined) {
            return normalizeAngle(angle);
        }
        else {
            // get default value
            if (channel === X &&
                contains([NOMINAL, ORDINAL], fieldOrDatumDef.type) &&
                !(isFieldDef(fieldOrDatumDef) && fieldOrDatumDef.timeUnit)) {
                return 270;
            }
            // no default
            return undefined;
        }
    }
}
export function normalizeAngleExpr(angle) {
    return `(((${angle.signal} % 360) + 360) % 360)`;
}
export function defaultLabelBaseline(angle, orient, channel, alwaysIncludeMiddle) {
    if (angle !== undefined) {
        if (channel === 'x') {
            if (isSignalRef(angle)) {
                const a = normalizeAngleExpr(angle);
                const orientIsTop = isSignalRef(orient) ? `(${orient.signal} === "top")` : orient === 'top';
                return {
                    signal: `(45 < ${a} && ${a} < 135) || (225 < ${a} && ${a} < 315) ? "middle" :` +
                        `(${a} <= 45 || 315 <= ${a}) === ${orientIsTop} ? "bottom" : "top"`
                };
            }
            if ((45 < angle && angle < 135) || (225 < angle && angle < 315)) {
                return 'middle';
            }
            if (isSignalRef(orient)) {
                const op = angle <= 45 || 315 <= angle ? '===' : '!==';
                return { signal: `${orient.signal} ${op} "top" ? "bottom" : "top"` };
            }
            return (angle <= 45 || 315 <= angle) === (orient === 'top') ? 'bottom' : 'top';
        }
        else {
            if (isSignalRef(angle)) {
                const a = normalizeAngleExpr(angle);
                const orientIsLeft = isSignalRef(orient) ? `(${orient.signal} === "left")` : orient === 'left';
                const middle = alwaysIncludeMiddle ? '"middle"' : 'null';
                return {
                    signal: `${a} <= 45 || 315 <= ${a} || (135 <= ${a} && ${a} <= 225) ? ${middle} : (45 <= ${a} && ${a} <= 135) === ${orientIsLeft} ? "top" : "bottom"`
                };
            }
            if (angle <= 45 || 315 <= angle || (135 <= angle && angle <= 225)) {
                return alwaysIncludeMiddle ? 'middle' : null;
            }
            if (isSignalRef(orient)) {
                const op = 45 <= angle && angle <= 135 ? '===' : '!==';
                return { signal: `${orient.signal} ${op} "left" ? "top" : "bottom"` };
            }
            return (45 <= angle && angle <= 135) === (orient === 'left') ? 'top' : 'bottom';
        }
    }
    return undefined;
}
export function defaultLabelAlign(angle, orient, channel) {
    if (angle === undefined) {
        return undefined;
    }
    const isX = channel === 'x';
    const startAngle = isX ? 0 : 90;
    const mainOrient = isX ? 'bottom' : 'left';
    if (isSignalRef(angle)) {
        const a = normalizeAngleExpr(angle);
        const orientIsMain = isSignalRef(orient) ? `(${orient.signal} === "${mainOrient}")` : orient === mainOrient;
        return {
            signal: `(${startAngle ? `(${a} + 90)` : a} % 180 === 0) ? ${isX ? null : '"center"'} :` +
                `(${startAngle} < ${a} && ${a} < ${180 + startAngle}) === ${orientIsMain} ? "left" : "right"`
        };
    }
    if ((angle + startAngle) % 180 === 0) {
        // For bottom, use default label align so label flush still works
        return isX ? null : 'center';
    }
    if (isSignalRef(orient)) {
        const op = startAngle < angle && angle < 180 + startAngle ? '===' : '!==';
        const orientIsMain = `${orient.signal} ${op} "${mainOrient}"`;
        return {
            signal: `${orientIsMain} ? "left" : "right"`
        };
    }
    if ((startAngle < angle && angle < 180 + startAngle) === (orient === mainOrient)) {
        return 'left';
    }
    return 'right';
}
export function defaultLabelFlush(type, channel) {
    if (channel === 'x' && contains(['quantitative', 'temporal'], type)) {
        return true;
    }
    return undefined;
}
export function defaultLabelOverlap(type, scaleType, hasTimeUnit, sort) {
    // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
    if ((hasTimeUnit && !isObject(sort)) || (type !== 'nominal' && type !== 'ordinal')) {
        if (scaleType === 'log' || scaleType === 'symlog') {
            return 'greedy';
        }
        return true;
    }
    return undefined;
}
export function defaultOrient(channel) {
    return channel === 'x' ? 'bottom' : 'left';
}
export function defaultTickCount({ fieldOrDatumDef, scaleType, size, values: vals }) {
    if (!vals && !hasDiscreteDomain(scaleType) && scaleType !== 'log') {
        if (isFieldDef(fieldOrDatumDef)) {
            if (isBinning(fieldOrDatumDef.bin)) {
                // for binned data, we don't want more ticks than maxbins
                return { signal: `ceil(${size.signal}/10)` };
            }
            if (fieldOrDatumDef.timeUnit &&
                contains(['month', 'hours', 'day', 'quarter'], normalizeTimeUnit(fieldOrDatumDef.timeUnit)?.unit)) {
                return undefined;
            }
        }
        return { signal: `ceil(${size.signal}/40)` };
    }
    return undefined;
}
export function defaultTickMinStep({ format, fieldOrDatumDef }) {
    if (format === 'd') {
        return 1;
    }
    if (isFieldDef(fieldOrDatumDef)) {
        const { timeUnit } = fieldOrDatumDef;
        if (timeUnit) {
            const signal = durationExpr(timeUnit);
            if (signal) {
                return { signal };
            }
        }
    }
    return undefined;
}
export function getFieldDefTitle(model, channel) {
    const channel2 = channel === 'x' ? 'x2' : 'y2';
    const fieldDef = model.fieldDef(channel);
    const fieldDef2 = model.fieldDef(channel2);
    const title1 = fieldDef ? fieldDef.title : undefined;
    const title2 = fieldDef2 ? fieldDef2.title : undefined;
    if (title1 && title2) {
        return mergeTitle(title1, title2);
    }
    else if (title1) {
        return title1;
    }
    else if (title2) {
        return title2;
    }
    else if (title1 !== undefined) {
        // falsy value to disable config
        return title1;
    }
    else if (title2 !== undefined) {
        // falsy value to disable config
        return title2;
    }
    return undefined;
}
export function values(axis, fieldOrDatumDef) {
    const vals = axis.values;
    if (isArray(vals)) {
        return valueArray(fieldOrDatumDef, vals);
    }
    else if (isSignalRef(vals)) {
        return vals;
    }
    return undefined;
}
export function defaultZindex(mark, fieldDef) {
    if (mark === 'rect' && isDiscrete(fieldDef)) {
        return 1;
    }
    return 0;
}
//# sourceMappingURL=properties.js.map