"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var common_1 = require("../common");
var mixins = tslib_1.__importStar(require("../mark/mixins"));
function symbols(fieldDef, symbolsSpec, model, channel, type) {
    if (type === 'gradient') {
        return undefined;
    }
    var out = tslib_1.__assign({}, common_1.applyMarkConfig({}, model, mark_1.FILL_STROKE_CONFIG), mixins.color(model));
    switch (model.mark) {
        case mark_1.BAR:
        case mark_1.TICK:
        case mark_1.TEXT:
            out.shape = { value: 'square' };
            break;
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
            out.shape = { value: model.mark };
            break;
        case mark_1.POINT:
        case mark_1.LINE:
        case mark_1.GEOSHAPE:
        case mark_1.AREA:
            // use default circle
            break;
    }
    var markDef = model.markDef, encoding = model.encoding;
    var filled = markDef.filled;
    if (out.fill) {
        // for fill legend, we don't want any fill in symbol
        if (channel === 'fill' || (filled && channel === channel_1.COLOR)) {
            delete out.fill;
        }
        else {
            if (out.fill['field']) {
                // For others, remove fill field
                delete out.fill;
            }
            else if (vega_util_1.isArray(out.fill)) {
                var fill = getFirstConditionValue(encoding.fill || encoding.color) || markDef.fill || (filled && markDef.color);
                if (fill) {
                    out.fill = { value: fill };
                }
            }
        }
    }
    if (out.stroke) {
        if (channel === 'stroke' || (!filled && channel === channel_1.COLOR)) {
            delete out.stroke;
        }
        else {
            if (out.stroke['field']) {
                // For others, remove stroke field
                delete out.stroke;
            }
            else if (vega_util_1.isArray(out.stroke)) {
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
    if (channel !== channel_1.SHAPE) {
        var shape = getFirstConditionValue(encoding.shape) || markDef.shape;
        if (shape) {
            out.shape = { value: shape };
        }
    }
    if (channel !== channel_1.OPACITY) {
        var opacity = getMaxValue(encoding.opacity) || markDef.opacity;
        if (opacity) { // only apply opacity if it is neither zero or undefined
            out.opacity = { value: opacity };
        }
    }
    out = tslib_1.__assign({}, out, symbolsSpec);
    return util_1.keys(out).length > 0 ? out : undefined;
}
exports.symbols = symbols;
function gradient(fieldDef, gradientSpec, model, channel, type) {
    var out = {};
    if (type === 'gradient') {
        var opacity = getMaxValue(model.encoding.opacity) || model.markDef.opacity;
        if (opacity) { // only apply opacity if it is neither zero or undefined
            out.opacity = { value: opacity };
        }
    }
    out = tslib_1.__assign({}, out, gradientSpec);
    return util_1.keys(out).length > 0 ? out : undefined;
}
exports.gradient = gradient;
function labels(fieldDef, labelsSpec, model, channel, type) {
    var legend = model.legend(channel);
    var config = model.config;
    var out = {};
    if (fielddef_1.isTimeFieldDef(fieldDef)) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === scale_1.ScaleType.UTC;
        var expr = common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale);
        labelsSpec = tslib_1.__assign({}, (expr ? { text: { signal: expr } } : {}), labelsSpec);
    }
    out = tslib_1.__assign({}, out, labelsSpec);
    return util_1.keys(out).length > 0 ? out : undefined;
}
exports.labels = labels;
function getMaxValue(channelDef) {
    return getConditionValue(channelDef, function (v, conditionalDef) { return Math.max(v, conditionalDef.value); });
}
function getFirstConditionValue(channelDef) {
    return getConditionValue(channelDef, function (v, conditionalDef) { return v !== undefined ? v : conditionalDef.value; });
}
function getConditionValue(channelDef, reducer) {
    if (fielddef_1.hasConditionalValueDef(channelDef)) {
        return (vega_util_1.isArray(channelDef.condition) ? channelDef.condition : [channelDef.condition])
            .reduce(reducer, channelDef.value);
    }
    else if (fielddef_1.isValueDef(channelDef)) {
        return channelDef.value;
    }
    return undefined;
}
//# sourceMappingURL=encode.js.map