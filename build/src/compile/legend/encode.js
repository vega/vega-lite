"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var common_1 = require("../common");
var mixins = require("../mark/mixins");
function symbols(fieldDef, symbolsSpec, model, channel, type) {
    if (type === 'gradient') {
        return undefined;
    }
    var symbols = {};
    var mark = model.mark();
    switch (mark) {
        case mark_1.BAR:
        case mark_1.TICK:
        case mark_1.TEXT:
            symbols.shape = { value: 'square' };
            break;
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
            symbols.shape = { value: mark };
            break;
        case mark_1.POINT:
        case mark_1.LINE:
        case mark_1.AREA:
            // use default circle
            break;
    }
    var filled = model.markDef.filled;
    var config = channel === channel_1.COLOR ?
        /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
        util_1.without(mark_1.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
        /* For other legend, no need to omit. */
        mark_1.FILL_STROKE_CONFIG;
    config = util_1.without(config, ['strokeDash', 'strokeDashOffset']);
    common_1.applyMarkConfig(symbols, model, config);
    if (channel !== channel_1.COLOR) {
        var colorMixins = mixins.color(model);
        // If there are field for fill or stroke, remove them as we already apply channels.
        if (colorMixins.fill && (colorMixins.fill['field'] || colorMixins.fill['value'] === 'transparent')) {
            delete colorMixins.fill;
        }
        if (colorMixins.stroke && (colorMixins.stroke['field'] || colorMixins.stroke['value'] === 'transparent')) {
            delete colorMixins.stroke;
        }
        symbols = tslib_1.__assign({}, symbols, colorMixins);
    }
    if (channel !== channel_1.SHAPE) {
        var shapeDef = model.encoding.shape;
        if (fielddef_1.isValueDef(shapeDef)) {
            symbols.shape = { value: shapeDef.value };
        }
    }
    if (channel !== channel_1.OPACITY) {
        var opacity = getOpacityValue(model.encoding.opacity);
        if (opacity) {
            symbols.opacity = { value: opacity };
        }
    }
    symbols = tslib_1.__assign({}, symbols, symbolsSpec);
    return util_1.keys(symbols).length > 0 ? symbols : undefined;
}
exports.symbols = symbols;
function gradient(fieldDef, gradientSpec, model, channel, type) {
    var gradient = {};
    if (type === 'gradient') {
        var opacity = getOpacityValue(model.encoding.opacity);
        if (opacity) {
            gradient.opacity = { value: opacity };
        }
    }
    gradient = tslib_1.__assign({}, gradient, gradientSpec);
    return util_1.keys(gradient).length > 0 ? gradient : undefined;
}
exports.gradient = gradient;
function labels(fieldDef, labelsSpec, model, channel, type) {
    var legend = model.legend(channel);
    var config = model.config;
    var labels = {};
    if (fielddef_1.isTimeFieldDef(fieldDef)) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === scale_1.ScaleType.UTC;
        labelsSpec = tslib_1.__assign({ text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale)
            } }, labelsSpec);
    }
    labels = tslib_1.__assign({}, labels, labelsSpec);
    return util_1.keys(labels).length > 0 ? labels : undefined;
}
exports.labels = labels;
function getOpacityValue(opacityDef) {
    if (fielddef_1.isValueDef(opacityDef)) {
        if (fielddef_1.hasConditionValueDef(opacityDef)) {
            return Math.max(opacityDef.condition.value, opacityDef.value);
        }
        else {
            return opacityDef.value;
        }
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBc0Y7QUFDdEYsMkNBQW9KO0FBQ3BKLG1DQUFrRztBQUNsRyxxQ0FBc0M7QUFDdEMsbUNBQXlDO0FBRXpDLG9DQUFnRTtBQUNoRSx1Q0FBeUM7QUFHekMsaUJBQXdCLFFBQTBCLEVBQUUsV0FBZ0IsRUFBRSxLQUFnQixFQUFFLE9BQWdCLEVBQUUsSUFBZ0I7SUFDeEgsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxPQUFPLEdBQU8sRUFBRSxDQUFDO0lBQ3JCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUxQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxVQUFHLENBQUM7UUFDVCxLQUFLLFdBQUksQ0FBQztRQUNWLEtBQUssV0FBSTtZQUNQLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDO1FBQ1IsS0FBSyxhQUFNLENBQUM7UUFDWixLQUFLLGFBQU07WUFDVCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO1lBQzlCLEtBQUssQ0FBQztRQUNSLEtBQUssWUFBSyxDQUFDO1FBQ1gsS0FBSyxXQUFJLENBQUM7UUFDVixLQUFLLFdBQUk7WUFDUCxxQkFBcUI7WUFDckIsS0FBSyxDQUFDO0lBQ1YsQ0FBQztJQUVELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBRXBDLElBQUksTUFBTSxHQUFHLE9BQU8sS0FBSyxlQUFLLENB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