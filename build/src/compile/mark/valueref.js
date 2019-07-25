import { isFunction, isString, stringValue } from 'vega-util';
import { isCountingAggregateOp } from '../../aggregate';
import { isBinned, isBinning } from '../../bin';
import { getMainRangeChannel, X, X2, Y, Y2 } from '../../channel';
import { binRequiresRange, format, getFieldDef, hasConditionalFieldDef, isFieldDef, isTypedFieldDef, isValueDef, title, vgField } from '../../channeldef';
import { forEach } from '../../encoding';
import * as log from '../../log';
import { isPathMark } from '../../mark';
import { hasDiscreteDomain, isContinuousToContinuous, ScaleType } from '../../scale';
import { QUANTITATIVE } from '../../type';
import { contains, getFirstDefined } from '../../util';
import { binFormatExpression, formatSignalRef, getMarkConfig } from '../common';
function midPointWithPositionInvalidTest(params) {
    const { channel, channelDef, mark, scale } = params;
    const ref = midPoint(params);
    // Wrap to check if the positional value is invalid, if so, plot the point on the min value
    if (
    // Only this for field def without counting aggregate (as count wouldn't be null)
    isFieldDef(channelDef) &&
        !isCountingAggregateOp(channelDef.aggregate) &&
        // and only for continuous scale without zero (otherwise, null / invalid will be interpreted as zero, which doesn't cause layout problem)
        scale &&
        isContinuousToContinuous(scale.get('type')) &&
        scale.get('zero') === false) {
        return wrapPositionInvalidTest({
            fieldDef: channelDef,
            channel,
            mark,
            ref
        });
    }
    return ref;
}
function wrapPositionInvalidTest({ fieldDef, channel, mark, ref }) {
    if (!isPathMark(mark)) {
        // Only do this for non-path mark (as path marks will already use "defined" to skip points)
        return [fieldInvalidTestValueRef(fieldDef, channel), ref];
    }
    return ref;
}
export function fieldInvalidTestValueRef(fieldDef, channel) {
    const test = fieldInvalidPredicate(fieldDef, true);
    const mainChannel = getMainRangeChannel(channel);
    const zeroValueRef = mainChannel === 'x' ? { value: 0 } : { field: { group: 'height' } };
    return Object.assign({ test }, zeroValueRef);
}
export function fieldInvalidPredicate(field, invalid = true) {
    field = isString(field) ? field : vgField(field, { expr: 'datum' });
    const op = invalid ? '||' : '&&';
    const eq = invalid ? '===' : '!==';
    return `${field} ${eq} null ${op} ${invalid ? '' : '!'}isNaN(${field})`;
}
// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.
/**
 * @return Vega ValueRef for normal x- or y-position without projection
 */
export function position(params) {
    const { channel, channelDef, scaleName, stack, offset } = params;
    if (isFieldDef(channelDef) && stack && channel === stack.fieldChannel) {
        // x or y use stack_end so that stacked line's point mark use stack_end too.
        return fieldRef(channelDef, scaleName, { suffix: 'end' }, { offset });
    }
    return midPointWithPositionInvalidTest(params);
}
/**
 * @return Vega ValueRef for normal x2- or y2-position without projection
 */
export function position2({ channel, channelDef, channel2Def, scaleName, scale, stack, mark, offset, defaultRef }) {
    if (isFieldDef(channelDef) &&
        stack &&
        // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
        return fieldRef(channelDef, scaleName, { suffix: 'start' }, { offset });
    }
    return midPointWithPositionInvalidTest({
        channel,
        channelDef: channel2Def,
        scaleName,
        scale,
        stack,
        mark,
        offset,
        defaultRef
    });
}
export function getOffset(channel, markDef) {
    const offsetChannel = (channel + 'Offset'); // Need to cast as the type can't be inferred automatically
    // TODO: in the future read from encoding channel too
    const markDefOffsetValue = markDef[offsetChannel];
    if (markDefOffsetValue) {
        return markDefOffsetValue;
    }
    return undefined;
}
/**
 * Value Ref for binned fields
 */
export function bin({ channel, fieldDef, scaleName, mark, side, offset }) {
    const binSuffix = side === 'start' ? undefined : 'end';
    const ref = fieldRef(fieldDef, scaleName, { binSuffix }, offset ? { offset } : {});
    return wrapPositionInvalidTest({
        fieldDef,
        channel,
        mark,
        ref
    });
}
export function fieldRef(fieldDef, scaleName, opt, mixins) {
    const ref = Object.assign({}, (scaleName ? { scale: scaleName } : {}), { field: vgField(fieldDef, opt) });
    if (mixins) {
        const { offset, band } = mixins;
        return Object.assign({}, ref, (offset ? { offset } : {}), (band ? { band } : {}));
    }
    return ref;
}
export function bandRef(scaleName, band = true) {
    return {
        scale: scaleName,
        band: band
    };
}
/**
 * Signal that returns the middle of a bin from start and end field. Should only be used with x and y.
 */
function binMidSignal({ scaleName, fieldDef, fieldDef2, offset, band }) {
    band = getFirstDefined(band, 0.5);
    const start = vgField(fieldDef, { expr: 'datum' });
    const end = fieldDef2 !== undefined
        ? vgField(fieldDef2, { expr: 'datum' })
        : vgField(fieldDef, { binSuffix: 'end', expr: 'datum' });
    return Object.assign({ signal: `scale("${scaleName}", ${band} * ${start} + ${1 - band} * ${end})` }, (offset ? { offset } : {}));
}
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export function midPoint({ channel, channelDef, channel2Def, scaleName, scale, stack, offset, defaultRef }) {
    // TODO: datum support
    if (channelDef) {
        /* istanbul ignore else */
        if (isFieldDef(channelDef)) {
            if (isTypedFieldDef(channelDef)) {
                if (isBinning(channelDef.bin)) {
                    // Use middle only for x an y to place marks in the center between start and end of the bin range.
                    // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
                    if (contains([X, Y], channel) && channelDef.type === QUANTITATIVE) {
                        if (stack && stack.impute) {
                            // For stack, we computed bin_mid so we can impute.
                            return fieldRef(channelDef, scaleName, { binSuffix: 'mid' }, { offset });
                        }
                        // For non-stack, we can just calculate bin mid on the fly using signal.
                        return binMidSignal({ scaleName, fieldDef: channelDef, offset });
                    }
                    return fieldRef(channelDef, scaleName, binRequiresRange(channelDef, channel) ? { binSuffix: 'range' } : {}, {
                        offset
                    });
                }
                else if (isBinned(channelDef.bin)) {
                    if (isFieldDef(channel2Def)) {
                        return binMidSignal({ scaleName, fieldDef: channelDef, fieldDef2: channel2Def, offset });
                    }
                    else {
                        const channel2 = channel === X ? X2 : Y2;
                        log.warn(log.message.channelRequiredForBinned(channel2));
                    }
                }
            }
            if (scale) {
                const scaleType = scale.get('type');
                if (hasDiscreteDomain(scaleType)) {
                    if (scaleType === 'band') {
                        // For band, to get mid point, need to offset by half of the band
                        return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, { band: 0.5, offset });
                    }
                    return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, { offset });
                }
            }
            return fieldRef(channelDef, scaleName, {}, { offset }); // no need for bin suffix
        }
        else if (isValueDef(channelDef)) {
            const value = channelDef.value;
            const offsetMixins = offset ? { offset } : {};
            return Object.assign({}, vgValueRef(channel, value), offsetMixins);
        }
        // If channelDef is neither field def or value def, it's a condition-only def.
        // In such case, we will use default ref.
    }
    return isFunction(defaultRef) ? defaultRef() : defaultRef;
}
/**
 * Convert special "width" and "height" values in Vega-Lite into Vega value ref.
 */
export function vgValueRef(channel, value) {
    if (contains(['x', 'x2'], channel) && value === 'width') {
        return { field: { group: 'width' } };
    }
    else if (contains(['y', 'y2'], channel) && value === 'height') {
        return { field: { group: 'height' } };
    }
    return { value };
}
export function tooltipForEncoding(encoding, config, { reactiveGeom } = {}) {
    const keyValues = [];
    const usedKey = {};
    const toSkip = {};
    const expr = reactiveGeom ? 'datum.datum' : 'datum';
    const tooltipTuples = [];
    function add(fDef, channel) {
        const mainChannel = getMainRangeChannel(channel);
        const fieldDef = isTypedFieldDef(fDef)
            ? fDef
            : Object.assign({}, fDef, { type: encoding[mainChannel].type // for secondary field def, copy type from main channel
             });
        const key = title(fieldDef, config, { allowDisabling: false });
        let value = text(fieldDef, config, expr).signal;
        if (channel === 'x' || channel === 'y') {
            const channel2 = channel === 'x' ? 'x2' : 'y2';
            const fieldDef2 = getFieldDef(encoding[channel2]);
            if (isBinned(fieldDef.bin) && fieldDef2) {
                const startField = vgField(fieldDef, { expr });
                const endField = vgField(fieldDef2, { expr });
                value = binFormatExpression(startField, endField, format(fieldDef), config);
                toSkip[channel2] = true;
            }
        }
        tooltipTuples.push({ channel, key, value });
    }
    forEach(encoding, (channelDef, channel) => {
        if (isFieldDef(channelDef)) {
            add(channelDef, channel);
        }
        else if (hasConditionalFieldDef(channelDef)) {
            add(channelDef.condition, channel);
        }
    });
    for (const { channel, key, value } of tooltipTuples) {
        if (!toSkip[channel] && !usedKey[key]) {
            keyValues.push(`${stringValue(key)}: ${value}`);
            usedKey[key] = true;
        }
    }
    return keyValues.length ? { signal: `{${keyValues.join(', ')}}` } : undefined;
}
export function text(channelDef, config, expr = 'datum') {
    // text
    if (channelDef) {
        if (isValueDef(channelDef)) {
            return { value: channelDef.value };
        }
        if (isTypedFieldDef(channelDef)) {
            return formatSignalRef(channelDef, format(channelDef), expr, config);
        }
    }
    return undefined;
}
export function mid(sizeRef) {
    return Object.assign({}, sizeRef, { mult: 0.5 });
}
export function positionDefault({ markDef, config, defaultRef, channel, scaleName, scale, mark, checkBarAreaWithoutZero: checkBarAreaWithZero }) {
    return () => {
        const mainChannel = getMainRangeChannel(channel);
        const definedValueOrConfig = getFirstDefined(markDef[channel], getMarkConfig(channel, markDef, config));
        if (definedValueOrConfig !== undefined) {
            return vgValueRef(channel, definedValueOrConfig);
        }
        if (isString(defaultRef)) {
            if (scaleName) {
                const scaleType = scale.get('type');
                if (contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scaleType)) {
                    // Log scales cannot have zero.
                    // Zero in time scale is arbitrary, and does not affect ratio.
                    // (Time is an interval level of measurement, not ratio).
                    // See https://en.wikipedia.org/wiki/Level_of_measurement for more info.
                    if (checkBarAreaWithZero && (mark === 'bar' || mark === 'area')) {
                        log.warn(log.message.nonZeroScaleUsedWithLengthMark(mark, mainChannel, { scaleType }));
                    }
                }
                else {
                    if (scale.domainDefinitelyIncludesZero()) {
                        return {
                            scale: scaleName,
                            value: 0
                        };
                    }
                    if (checkBarAreaWithZero && (mark === 'bar' || mark === 'area')) {
                        log.warn(log.message.nonZeroScaleUsedWithLengthMark(mark, mainChannel, { zeroFalse: scale.explicit.zero === false }));
                    }
                }
            }
            if (defaultRef === 'zeroOrMin') {
                return mainChannel === 'x' ? { value: 0 } : { field: { group: 'height' } };
            }
            else {
                // zeroOrMax
                return mainChannel === 'x' ? { field: { group: 'width' } } : { value: 0 };
            }
        }
        return defaultRef;
    };
}
//# sourceMappingURL=valueref.js.map