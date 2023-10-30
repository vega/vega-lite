import { array, isArray, isObject, isString } from 'vega-util';
import { isBinned } from '../../../bin';
import { getMainRangeChannel, isXorY, THETA, RADIUS } from '../../../channel';
import { defaultTitle, getFieldDef, getFormatMixins, hasConditionalFieldDef, isFieldDef, isTypedFieldDef, vgField } from '../../../channeldef';
import { forEach } from '../../../encoding';
import { entries } from '../../../util';
import { isSignalRef } from '../../../vega.schema';
import { getMarkPropOrConfig } from '../../common';
import { binFormatExpression, formatSignalRef } from '../../format';
import { wrapCondition } from './conditional';
import { textRef } from './text';
export function tooltip(model, opt = {}) {
    const { encoding, markDef, config, stack } = model;
    const channelDef = encoding.tooltip;
    if (isArray(channelDef)) {
        return { tooltip: tooltipRefForEncoding({ tooltip: channelDef }, stack, config, opt) };
    }
    else {
        const datum = opt.reactiveGeom ? 'datum.datum' : 'datum';
        return wrapCondition(model, channelDef, 'tooltip', cDef => {
            // use valueRef based on channelDef first
            const tooltipRefFromChannelDef = textRef(cDef, config, datum);
            if (tooltipRefFromChannelDef) {
                return tooltipRefFromChannelDef;
            }
            if (cDef === null) {
                // Allow using encoding.tooltip = null to disable tooltip
                return undefined;
            }
            let markTooltip = getMarkPropOrConfig('tooltip', markDef, config);
            if (markTooltip === true) {
                markTooltip = { content: 'encoding' };
            }
            if (isString(markTooltip)) {
                return { value: markTooltip };
            }
            else if (isObject(markTooltip)) {
                // `tooltip` is `{fields: 'encodings' | 'fields'}`
                if (isSignalRef(markTooltip)) {
                    return markTooltip;
                }
                else if (markTooltip.content === 'encoding') {
                    return tooltipRefForEncoding(encoding, stack, config, opt);
                }
                else {
                    return { signal: datum };
                }
            }
            return undefined;
        });
    }
}
export function tooltipData(encoding, stack, config, { reactiveGeom } = {}) {
    const formatConfig = { ...config, ...config.tooltipFormat };
    const toSkip = {};
    const expr = reactiveGeom ? 'datum.datum' : 'datum';
    const tuples = [];
    function add(fDef, channel) {
        const mainChannel = getMainRangeChannel(channel);
        const fieldDef = isTypedFieldDef(fDef)
            ? fDef
            : {
                ...fDef,
                type: encoding[mainChannel].type // for secondary field def, copy type from main channel
            };
        const title = fieldDef.title || defaultTitle(fieldDef, formatConfig);
        const key = array(title).join(', ').replaceAll(/"/g, '\\"');
        let value;
        if (isXorY(channel)) {
            const channel2 = channel === 'x' ? 'x2' : 'y2';
            const fieldDef2 = getFieldDef(encoding[channel2]);
            if (isBinned(fieldDef.bin) && fieldDef2) {
                const startField = vgField(fieldDef, { expr });
                const endField = vgField(fieldDef2, { expr });
                const { format, formatType } = getFormatMixins(fieldDef);
                value = binFormatExpression(startField, endField, format, formatType, formatConfig);
                toSkip[channel2] = true;
            }
        }
        if ((isXorY(channel) || channel === THETA || channel === RADIUS) &&
            stack &&
            stack.fieldChannel === channel &&
            stack.offset === 'normalize') {
            const { format, formatType } = getFormatMixins(fieldDef);
            value = formatSignalRef({
                fieldOrDatumDef: fieldDef,
                format,
                formatType,
                expr,
                config: formatConfig,
                normalizeStack: true
            }).signal;
        }
        value ?? (value = textRef(fieldDef, formatConfig, expr).signal);
        tuples.push({ channel, key, value });
    }
    forEach(encoding, (channelDef, channel) => {
        if (isFieldDef(channelDef)) {
            add(channelDef, channel);
        }
        else if (hasConditionalFieldDef(channelDef)) {
            add(channelDef.condition, channel);
        }
    });
    const out = {};
    for (const { channel, key, value } of tuples) {
        if (!toSkip[channel] && !out[key]) {
            out[key] = value;
        }
    }
    return out;
}
export function tooltipRefForEncoding(encoding, stack, config, { reactiveGeom } = {}) {
    const data = tooltipData(encoding, stack, config, { reactiveGeom });
    const keyValues = entries(data).map(([key, value]) => `"${key}": ${value}`);
    return keyValues.length > 0 ? { signal: `{${keyValues.join(', ')}}` } : undefined;
}
//# sourceMappingURL=tooltip.js.map