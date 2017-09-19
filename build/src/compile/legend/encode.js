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
function symbols(fieldDef, symbolsSpec, model, channel, legendCmpt) {
    if (legendCmpt.get('type') === 'gradient') {
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
        var opacityDef = model.encoding.opacity;
        if (fielddef_1.isValueDef(opacityDef)) {
            symbols.opacity = { value: opacityDef.value };
        }
    }
    symbols = tslib_1.__assign({}, symbols, symbolsSpec);
    return util_1.keys(symbols).length > 0 ? symbols : undefined;
}
exports.symbols = symbols;
function gradient(fieldDef, gradientSpec, model, channel, legendCmpt) {
    var gradient = {};
    if (legendCmpt.get('type') === 'gradient') {
        var opacityDef = model.encoding.opacity;
        if (fielddef_1.isValueDef(opacityDef)) {
            gradient.opacity = { value: opacityDef.value };
        }
    }
    gradient = tslib_1.__assign({}, gradient, gradientSpec);
    return util_1.keys(gradient).length > 0 ? gradient : undefined;
}
exports.gradient = gradient;
function labels(fieldDef, labelsSpec, model, channel, legendCmpt) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBc0Y7QUFDdEYsMkNBQW9FO0FBQ3BFLG1DQUFrRztBQUNsRyxxQ0FBc0M7QUFDdEMsbUNBQXlDO0FBQ3pDLG9DQUFnRTtBQUNoRSx1Q0FBeUM7QUFLekMsaUJBQXdCLFFBQTBCLEVBQUUsV0FBZ0IsRUFBRSxLQUFnQixFQUFFLE9BQWdCLEVBQUUsVUFBMkI7SUFDbkksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksT0FBTyxHQUFPLEVBQUUsQ0FBQztJQUNyQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFMUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNiLEtBQUssVUFBRyxDQUFDO1FBQ1QsS0FBSyxXQUFJLENBQUM7UUFDVixLQUFLLFdBQUk7WUFDUCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQztRQUNSLEtBQUssYUFBTSxDQUFDO1FBQ1osS0FBSyxhQUFNO1lBQ1QsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QixLQUFLLENBQUM7UUFDUixLQUFLLFlBQUssQ0FBQztRQUNYLEtBQUssV0FBSSxDQUFDO1FBQ1YsS0FBSyxXQUFJO1lBQ1AscUJBQXFCO1lBQ3JCLEtBQUssQ0FBQztJQUNWLENBQUM7SUFFRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUVwQyxJQUFJLE1B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