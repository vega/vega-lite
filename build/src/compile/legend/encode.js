import { array, isArray, stringValue } from 'vega-util';
import { COLOR, OPACITY } from '../../channel';
import { hasConditionalValueDef, isFieldDef, isValueDef } from '../../channeldef';
import { FILL_STROKE_CONFIG } from '../../mark';
import { getFirstDefined, isEmpty, varName } from '../../util';
import { applyMarkConfig, signalOrValueRef } from '../common';
import { formatCustomType, isCustomFormatType } from '../format';
import * as mixins from '../mark/encode';
import { STORE } from '../selection';
export const legendEncodeRules = {
    symbols,
    gradient,
    labels,
    entries
};
export function symbols(symbolsSpec, { fieldOrDatumDef, model, channel, legendCmpt, legendType }) {
    if (legendType !== 'symbol') {
        return undefined;
    }
    const { markDef, encoding, config, mark } = model;
    const filled = markDef.filled && mark !== 'trail';
    let out = {
        ...applyMarkConfig({}, model, FILL_STROKE_CONFIG),
        ...mixins.color(model, { filled })
    }; // FIXME: remove this when VgEncodeEntry is compatible with SymbolEncodeEntry
    const symbolOpacity = legendCmpt.get('symbolOpacity') ?? config.legend.symbolOpacity;
    const symbolFillColor = legendCmpt.get('symbolFillColor') ?? config.legend.symbolFillColor;
    const symbolStrokeColor = legendCmpt.get('symbolStrokeColor') ?? config.legend.symbolStrokeColor;
    const opacity = symbolOpacity === undefined ? getMaxValue(encoding.opacity) ?? markDef.opacity : undefined;
    if (out.fill) {
        // for fill legend, we don't want any fill in symbol
        if (channel === 'fill' || (filled && channel === COLOR)) {
            delete out.fill;
        }
        else {
            if (out.fill['field']) {
                // For others, set fill to some opaque value (or nothing if a color is already set)
                if (symbolFillColor) {
                    delete out.fill;
                }
                else {
                    out.fill = signalOrValueRef(config.legend.symbolBaseFillColor ?? 'black');
                    out.fillOpacity = signalOrValueRef(opacity ?? 1);
                }
            }
            else if (isArray(out.fill)) {
                const fill = getFirstConditionValue(encoding.fill ?? encoding.color) ?? markDef.fill ?? (filled && markDef.color);
                if (fill) {
                    out.fill = signalOrValueRef(fill);
                }
            }
        }
    }
    if (out.stroke) {
        if (channel === 'stroke' || (!filled && channel === COLOR)) {
            delete out.stroke;
        }
        else {
            if (out.stroke['field'] || symbolStrokeColor) {
                // For others, remove stroke field
                delete out.stroke;
            }
            else if (isArray(out.stroke)) {
                const stroke = getFirstDefined(getFirstConditionValue(encoding.stroke || encoding.color), markDef.stroke, filled ? markDef.color : undefined);
                if (stroke) {
                    out.stroke = { value: stroke };
                }
            }
        }
    }
    if (channel !== OPACITY) {
        const condition = isFieldDef(fieldOrDatumDef) && selectedCondition(model, legendCmpt, fieldOrDatumDef);
        if (condition) {
            out.opacity = [
                { test: condition, ...signalOrValueRef(opacity ?? 1) },
                signalOrValueRef(config.legend.unselectedOpacity)
            ];
        }
        else if (opacity) {
            out.opacity = signalOrValueRef(opacity);
        }
    }
    out = { ...out, ...symbolsSpec };
    return isEmpty(out) ? undefined : out;
}
export function gradient(gradientSpec, { model, legendType, legendCmpt }) {
    if (legendType !== 'gradient') {
        return undefined;
    }
    const { config, markDef, encoding } = model;
    let out = {};
    const gradientOpacity = legendCmpt.get('gradientOpacity') ?? config.legend.gradientOpacity;
    const opacity = gradientOpacity === undefined ? getMaxValue(encoding.opacity) || markDef.opacity : undefined;
    if (opacity) {
        // only apply opacity if it is neither zero or undefined
        out.opacity = signalOrValueRef(opacity);
    }
    out = { ...out, ...gradientSpec };
    return isEmpty(out) ? undefined : out;
}
export function labels(specifiedlabelsSpec, { fieldOrDatumDef, model, channel, legendCmpt }) {
    const legend = model.legend(channel) || {};
    const config = model.config;
    const condition = isFieldDef(fieldOrDatumDef) ? selectedCondition(model, legendCmpt, fieldOrDatumDef) : undefined;
    const opacity = condition ? [{ test: condition, value: 1 }, { value: config.legend.unselectedOpacity }] : undefined;
    const { format, formatType } = legend;
    let text = undefined;
    if (isCustomFormatType(formatType)) {
        text = formatCustomType({
            fieldOrDatumDef,
            field: 'datum.value',
            format,
            formatType,
            config
        });
    }
    else if (format === undefined && formatType === undefined && config.customFormatTypes) {
        if (fieldOrDatumDef.type === 'quantitative' && config.numberFormatType) {
            text = formatCustomType({
                fieldOrDatumDef,
                field: 'datum.value',
                format: config.numberFormat,
                formatType: config.numberFormatType,
                config
            });
        }
        else if (fieldOrDatumDef.type === 'temporal' &&
            config.timeFormatType &&
            isFieldDef(fieldOrDatumDef) &&
            fieldOrDatumDef.timeUnit === undefined) {
            text = formatCustomType({
                fieldOrDatumDef,
                field: 'datum.value',
                format: config.timeFormat,
                formatType: config.timeFormatType,
                config
            });
        }
    }
    const labelsSpec = {
        ...(opacity ? { opacity } : {}),
        ...(text ? { text } : {}),
        ...specifiedlabelsSpec
    };
    return isEmpty(labelsSpec) ? undefined : labelsSpec;
}
export function entries(entriesSpec, { legendCmpt }) {
    const selections = legendCmpt.get('selections');
    return selections?.length ? { ...entriesSpec, fill: { value: 'transparent' } } : entriesSpec;
}
function getMaxValue(channelDef) {
    return getConditionValue(channelDef, (v, conditionalDef) => Math.max(v, conditionalDef.value));
}
export function getFirstConditionValue(channelDef) {
    return getConditionValue(channelDef, (v, conditionalDef) => {
        return getFirstDefined(v, conditionalDef.value);
    });
}
function getConditionValue(channelDef, reducer) {
    if (hasConditionalValueDef(channelDef)) {
        return array(channelDef.condition).reduce(reducer, channelDef.value);
    }
    else if (isValueDef(channelDef)) {
        return channelDef.value;
    }
    return undefined;
}
function selectedCondition(model, legendCmpt, fieldDef) {
    const selections = legendCmpt.get('selections');
    if (!selections?.length)
        return undefined;
    const field = stringValue(fieldDef.field);
    return selections
        .map(name => {
        const store = stringValue(varName(name) + STORE);
        return `(!length(data(${store})) || (${name}[${field}] && indexof(${name}[${field}], datum.value) >= 0))`;
    })
        .join(' || ');
}
//# sourceMappingURL=encode.js.map