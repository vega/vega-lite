"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
var scale_2 = require("../scale/scale");
function symbols(fieldDef, symbolsSpec, model, channel) {
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
    var cfg = model.config;
    var filled = model.markDef.filled;
    var config = channel === channel_1.COLOR ?
        /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
        util_1.without(mark_1.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
        /* For other legend, no need to omit. */
        mark_1.FILL_STROKE_CONFIG;
    config = util_1.without(config, ['strokeDash', 'strokeDashOffset']);
    common_1.applyMarkConfig(symbols, model, config);
    if (filled) {
        symbols.strokeWidth = { value: 0 };
    }
    // Avoid override default mapping for opacity channel
    if (channel === channel_1.OPACITY) {
        delete symbols.opacity;
    }
    var value;
    var colorDef = model.encoding.color;
    if (fielddef_1.isValueDef(colorDef)) {
        value = { value: colorDef.value };
    }
    if (value !== undefined) {
        // apply the value
        if (filled) {
            symbols.fill = value;
        }
        else {
            symbols.stroke = value;
        }
    }
    else if (channel !== channel_1.COLOR) {
        // For non-color legend, apply color config if there is no fill / stroke config.
        // (For color, do not override scale specified!)
        symbols[filled ? 'fill' : 'stroke'] = symbols[filled ? 'fill' : 'stroke'] ||
            { value: cfg.mark.color };
    }
    if (symbols.fill === undefined) {
        // fall back to mark config colors for legend fill
        if (cfg.mark.fill !== undefined) {
            symbols.fill = { value: cfg.mark.fill };
        }
        else if (cfg.mark.stroke !== undefined) {
            symbols.stroke = { value: cfg.mark.stroke };
        }
    }
    var shapeDef = model.encoding.shape;
    if (channel !== channel_1.SHAPE) {
        if (fielddef_1.isValueDef(shapeDef)) {
            symbols.shape = { value: shapeDef.value };
        }
    }
    if (fieldDef.bin && scale_1.hasContinuousDomain(model.scale(channel).type)) {
        var def = {
            scale: model.scaleName(channel),
            field: 'value'
        };
        switch (channel) {
            case channel_1.OPACITY:
                symbols.opacity = def;
                break;
            case channel_1.SIZE:
                symbols.size = def;
                break;
            case channel_1.COLOR:
                symbols[filled ? 'fill' : 'stroke'] = def;
                break;
            default:
                throw Error("Legend for channel " + channel + " not implemented");
        }
    }
    symbols = util_1.extend(symbols, symbolsSpec || {});
    return util_1.keys(symbols).length > 0 ? symbols : undefined;
}
exports.symbols = symbols;
function labels(fieldDef, labelsSpec, model, channel) {
    var legend = model.legend(channel);
    var config = model.config;
    var labels = {};
    if (fieldDef.bin && scale_1.hasContinuousDomain(model.scale(channel).type)) {
        // Override label's text to map bin's quantitative value to range
        labelsSpec = util_1.extend({
            text: {
                scale: model.scaleName(channel) + scale_2.BIN_LEGEND_LABEL_SUFFIX,
                field: 'value'
            }
        }, labelsSpec || {});
    }
    else if (fieldDef.type === type_1.TEMPORAL) {
        labelsSpec = util_1.extend({
            text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat)
            }
        }, labelsSpec || {});
    }
    labels = util_1.extend(labels, labelsSpec || {});
    return util_1.keys(labels).length > 0 ? labels : undefined;
}
exports.labels = labels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFtRTtBQUNuRSwyQ0FBb0Q7QUFDcEQsbUNBQWtHO0FBQ2xHLHFDQUFnRDtBQUNoRCxtQ0FBb0M7QUFDcEMsbUNBQWlEO0FBSWpELG9DQUFnRTtBQUNoRSx3Q0FBdUQ7QUFHdkQsaUJBQXdCLFFBQWtCLEVBQUUsV0FBZ0IsRUFBRSxLQUFnQixFQUFFLE9BQWdCO0lBQzlGLElBQUksT0FBTyxHQUFPLEVBQUUsQ0FBQztJQUNyQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFMUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNiLEtBQUssVUFBRyxDQUFDO1FBQ1QsS0FBSyxXQUFJLENBQUM7UUFDVixLQUFLLFdBQUk7WUFDUCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQztRQUNSLEtBQUssYUFBTSxDQUFDO1FBQ1osS0FBSyxhQUFNO1lBQ1QsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QixLQUFLLENBQUM7UUFDUixLQUFLLFlBQUssQ0FBQztRQUNYLEtBQUssV0FBSSxDQUFDO1FBQ1YsS0FBSyxXQUFJO1lBQ1AscUJBQXFCO1lBQ3JCLEtBQUssQ0FBQztJQUNWLENBQUM7SUFFRCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3pCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBRXBDLElBQUksTUFBTSxHQUFHLE9BQU8sS0FBSyxlQUFLO1FBQzFCLDJLQUEySztRQUMzSyxjQUFPLENBQUMseUJBQWtCLEVBQUUsQ0FBRSxN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