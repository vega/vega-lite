import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { COLOR, OPACITY, SHAPE } from '../../channel';
import { hasConditionalValueDef, isTimeFieldDef, isValueDef, } from '../../fielddef';
import { AREA, BAR, CIRCLE, FILL_STROKE_CONFIG, GEOSHAPE, LINE, POINT, SQUARE, TEXT, TICK } from '../../mark';
import { ScaleType } from '../../scale';
import { keys } from '../../util';
import { applyMarkConfig, timeFormatExpression } from '../common';
import * as mixins from '../mark/mixins';
export function symbols(fieldDef, symbolsSpec, model, channel, type) {
    if (type === 'gradient') {
        return undefined;
    }
    var out = tslib_1.__assign({}, applyMarkConfig({}, model, FILL_STROKE_CONFIG), mixins.color(model));
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
    var markDef = model.markDef, encoding = model.encoding;
    var filled = markDef.filled;
    if (out.fill) {
        // for fill legend, we don't want any fill in symbol
        if (channel === 'fill' || (filled && channel === COLOR)) {
            delete out.fill;
        }
        else {
            if (out.fill['field']) {
                // For others, remove fill field
                delete out.fill;
            }
            else if (isArray(out.fill)) {
                var fill = getFirstConditionValue(encoding.fill || encoding.color) || markDef.fill || (filled && markDef.color);
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
                var stroke = getFirstConditionValue(encoding.stroke || encoding.color) || markDef.stroke || (!filled && markDef.color);
                if (stroke) {
                    out.stroke = { value: stroke };
                }
            }
        }
    }
    if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke) {
        // for non color channel's legend, we need to override symbol stroke config from Vega config
        out.stroke = { value: 'transparent' };
    }
    if (channel !== SHAPE) {
        var shape = getFirstConditionValue(encoding.shape) || markDef.shape;
        if (shape) {
            out.shape = { value: shape };
        }
    }
    if (channel !== OPACITY) {
        var opacity = getMaxValue(encoding.opacity) || markDef.opacity;
        if (opacity) { // only apply opacity if it is neither zero or undefined
            out.opacity = { value: opacity };
        }
    }
    out = tslib_1.__assign({}, out, symbolsSpec);
    return keys(out).length > 0 ? out : undefined;
}
export function gradient(fieldDef, gradientSpec, model, channel, type) {
    var out = {};
    if (type === 'gradient') {
        var opacity = getMaxValue(model.encoding.opacity) || model.markDef.opacity;
        if (opacity) { // only apply opacity if it is neither zero or undefined
            out.opacity = { value: opacity };
        }
    }
    out = tslib_1.__assign({}, out, gradientSpec);
    return keys(out).length > 0 ? out : undefined;
}
export function labels(fieldDef, labelsSpec, model, channel, type) {
    var legend = model.legend(channel);
    var config = model.config;
    var out = {};
    if (isTimeFieldDef(fieldDef)) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
        var expr = timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale);
        labelsSpec = tslib_1.__assign({}, (expr ? { text: { signal: expr } } : {}), labelsSpec);
    }
    out = tslib_1.__assign({}, out, labelsSpec);
    return keys(out).length > 0 ? out : undefined;
}
function getMaxValue(channelDef) {
    return getConditionValue(channelDef, function (v, conditionalDef) { return Math.max(v, conditionalDef.value); });
}
function getFirstConditionValue(channelDef) {
    return getConditionValue(channelDef, function (v, conditionalDef) { return v !== undefined ? v : conditionalDef.value; });
}
function getConditionValue(channelDef, reducer) {
    if (hasConditionalValueDef(channelDef)) {
        return (isArray(channelDef.condition) ? channelDef.condition : [channelDef.condition])
            .reduce(reducer, channelDef.value);
    }
    else if (isValueDef(channelDef)) {
        return channelDef.value;
    }
    return undefined;
}
//# sourceMappingURL=encode.js.map