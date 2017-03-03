"use strict";
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
    var legend = model.legend(channel);
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
    var cfg = model.config();
    var filled = cfg.mark.filled;
    var config = channel === channel_1.COLOR ?
        /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
        util_1.without(mark_1.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
        /* For other legend, no need to omit. */
        util_1.without(mark_1.FILL_STROKE_CONFIG, ['strokeDash', 'strokeDashOffset']);
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
    var colorDef = model.encoding().color;
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
    if (legend.symbolColor !== undefined) {
        symbols.fill = { value: legend.symbolColor };
    }
    else if (symbols.fill === undefined) {
        // fall back to mark config colors for legend fill
        if (cfg.mark.fill !== undefined) {
            symbols.fill = { value: cfg.mark.fill };
        }
        else if (cfg.mark.stroke !== undefined) {
            symbols.stroke = { value: cfg.mark.stroke };
        }
    }
    if (channel !== channel_1.SHAPE) {
        if (legend.symbolShape !== undefined) {
            symbols.shape = { value: legend.symbolShape };
        }
        else if (cfg.point.shape !== undefined) {
            symbols.shape = { value: cfg.point.shape };
        }
    }
    if (channel !== channel_1.SIZE) {
        if (legend.symbolSize !== undefined) {
            symbols.size = { value: legend.symbolSize };
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
    if (legend.symbolStrokeWidth !== undefined) {
        symbols.strokeWidth = { value: legend.symbolStrokeWidth };
    }
    symbols = util_1.extend(symbols, symbolsSpec || {});
    return util_1.keys(symbols).length > 0 ? symbols : undefined;
}
exports.symbols = symbols;
function labels(fieldDef, labelsSpec, model, channel) {
    var legend = model.legend(channel);
    var config = model.config();
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
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, legend.shortTimeLabels, config)
            }
        }, labelsSpec || {});
    }
    if (legend.labelAlign !== undefined) {
        labels.align = { value: legend.labelAlign };
    }
    if (legend.labelColor !== undefined) {
        labels.fill = { value: legend.labelColor };
    }
    if (legend.labelFont !== undefined) {
        labels.font = { value: legend.labelFont };
    }
    if (legend.labelFontSize !== undefined) {
        labels.fontSize = { value: legend.labelFontSize };
    }
    if (legend.labelBaseline !== undefined) {
        labels.baseline = { value: legend.labelBaseline };
    }
    labels = util_1.extend(labels, labelsSpec || {});
    return util_1.keys(labels).length > 0 ? labels : undefined;
}
exports.labels = labels;
function title(_, titleSpec, model, channel) {
    var legend = model.legend(channel);
    var titles = {};
    if (legend.titleColor !== undefined) {
        titles.fill = { value: legend.titleColor };
    }
    if (legend.titleFont !== undefined) {
        titles.font = { value: legend.titleFont };
    }
    if (legend.titleFontSize !== undefined) {
        titles.fontSize = { value: legend.titleFontSize };
    }
    if (legend.titleFontWeight !== undefined) {
        titles.fontWeight = { value: legend.titleFontWeight };
    }
    titles = util_1.extend(titles, titleSpec || {});
    return util_1.keys(titles).length > 0 ? titles : undefined;
}
exports.title = title;
//# sourceMappingURL=encode.js.map