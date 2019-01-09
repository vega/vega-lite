import { isArray } from 'vega-util';
import { COLOR, OPACITY, SHAPE } from '../../channel';
import { hasConditionalValueDef, isTimeFieldDef, isValueDef } from '../../fielddef';
import { AREA, BAR, CIRCLE, FILL_STROKE_CONFIG, GEOSHAPE, LINE, POINT, SQUARE, TEXT, TICK } from '../../mark';
import { ScaleType } from '../../scale';
import { getFirstDefined, keys } from '../../util';
import { applyMarkConfig, timeFormatExpression } from '../common';
import * as mixins from '../mark/mixins';
import { defaultType } from './properties';
function type(legendCmp, model, channel) {
    const scaleType = model.getScaleComponent(channel).get('type');
    return getFirstDefined(legendCmp.get('type'), defaultType({ channel, scaleType, alwaysReturn: true }));
}
export function symbols(fieldDef, symbolsSpec, model, channel, legendCmp) {
    if (type(legendCmp, model, channel) !== 'symbol') {
        return undefined;
    }
    let out = Object.assign({}, applyMarkConfig({}, model, FILL_STROKE_CONFIG), mixins.color(model)); // FIXME: remove this when VgEncodeEntry is compatible with SymbolEncodeEntry
    switch (model.mark) {
        case BAR:
        case TICK:
        case TEXT:
            out.shape = { value: 'square' };
            break;
        case CIRCLE:
        case SQUARE:
            out.shape = { value: model.mark };
            break;
        case POINT:
        case LINE:
        case GEOSHAPE:
        case AREA:
            // use default circle
            break;
    }
    const { markDef, encoding } = model;
    const filled = markDef.filled;
    const opacity = getMaxValue(encoding.opacity) || markDef.opacity;
    if (out.fill) {
        // for fill legend, we don't want any fill in symbol
        if (channel === 'fill' || (filled && channel === COLOR)) {
            delete out.fill;
        }
        else {
            if (out.fill['field']) {
                // For others, set fill to some opaque value (or nothing if a color is already set)
                if (legendCmp.get('symbolFillColor')) {
                    delete out.fill;
                }
                else {
                    out.fill = { value: 'black' };
                    out.fillOpacity = { value: opacity || 1 };
                }
            }
            else if (isArray(out.fill)) {
                const fill = getFirstConditionValue(encoding.fill || encoding.color) ||
                    markDef.fill ||
                    (filled && markDef.color);
                if (fill) {
                    out.fill = { value: fill };
                }
            }
        }
    }
    if (out.stroke) {
        if (channel === 'stroke' || (!filled && channel === COLOR)) {
            delete out.stroke;
        }
        else {
            if (out.stroke['field']) {
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
    if (channel !== SHAPE) {
        const shape = getFirstConditionValue(encoding.shape) || markDef.shape;
        if (shape) {
            out.shape = { value: shape };
        }
    }
    if (channel !== OPACITY) {
        if (opacity) {
            // only apply opacity if it is neither zero or undefined
            out.opacity = { value: opacity };
        }
    }
    out = Object.assign({}, out, symbolsSpec);
    return keys(out).length > 0 ? out : undefined;
}
export function gradient(fieldDef, gradientSpec, model, channel, legendCmp) {
    if (type(legendCmp, model, channel) !== 'gradient') {
        return undefined;
    }
    let out = {};
    const opacity = getMaxValue(model.encoding.opacity) || model.markDef.opacity;
    if (opacity) {
        // only apply opacity if it is neither zero or undefined
        out.opacity = { value: opacity };
    }
    out = Object.assign({}, out, gradientSpec);
    return keys(out).length > 0 ? out : undefined;
}
export function labels(fieldDef, labelsSpec, model, channel, legendCmp) {
    const legend = model.legend(channel);
    const config = model.config;
    let out = {};
    if (isTimeFieldDef(fieldDef)) {
        const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
        const expr = timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale);
        labelsSpec = Object.assign({}, (expr ? { text: { signal: expr } } : {}), labelsSpec);
    }
    out = Object.assign({}, out, labelsSpec);
    return keys(out).length > 0 ? out : undefined;
}
function getMaxValue(channelDef) {
    return getConditionValue(channelDef, (v, conditionalDef) => Math.max(v, conditionalDef.value));
}
function getFirstConditionValue(channelDef) {
    return getConditionValue(channelDef, (v, conditionalDef) => {
        return getFirstDefined(v, conditionalDef.value);
    });
}
function getConditionValue(channelDef, reducer) {
    if (hasConditionalValueDef(channelDef)) {
        return (isArray(channelDef.condition) ? channelDef.condition : [channelDef.condition]).reduce(reducer, channelDef.value);
    }
    else if (isValueDef(channelDef)) {
        return channelDef.value;
    }
    return undefined;
}
//# sourceMappingURL=encode.js.map