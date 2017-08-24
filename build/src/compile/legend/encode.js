"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
var mixins = require("../mark/mixins");
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
        util_1.extend(symbols, colorMixins);
    }
    if (channel !== channel_1.SHAPE) {
        var shapeDef = model.encoding.shape;
        if (fielddef_1.isValueDef(shapeDef)) {
            symbols.shape = { value: shapeDef.value };
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
    if (fieldDef.type === type_1.TEMPORAL) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === scale_1.ScaleType.UTC;
        labelsSpec = util_1.extend({
            text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat, isUTCScale)
            }
        }, labelsSpec || {});
    }
    labels = util_1.extend(labels, labelsSpec || {});
    return util_1.keys(labels).length > 0 ? labels : undefined;
}
exports.labels = labels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUE0RTtBQUM1RSwyQ0FBb0Q7QUFDcEQsbUNBQWtHO0FBQ2xHLHFDQUFzQztBQUN0QyxtQ0FBb0M7QUFDcEMsbUNBQWlEO0FBQ2pELG9DQUFnRTtBQUNoRSx1Q0FBeUM7QUFJekMsaUJBQXdCLFFBQTBCLEVBQUUsV0FBZ0IsRUFBRSxLQUFnQixFQUFFLE9BQWdCO0lBQ3RHLElBQUksT0FBTyxHQUFPLEVBQUUsQ0FBQztJQUNyQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFMUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNiLEtBQUssVUFBRyxDQUFDO1FBQ1QsS0FBSyxXQUFJLENBQUM7UUFDVixLQUFLLFdBQUk7WUFDUCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQztRQUNSLEtBQUssYUFBTSxDQUFDO1FBQ1osS0FBSyxhQUFNO1lBQ1QsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QixLQUFLLENBQUM7UUFDUixLQUFLLFlBQUssQ0FBQztRQUNYLEtBQUssV0FBSSxDQUFDO1FBQ1YsS0FBSyxXQUFJO1lBQ1AscUJBQXFCO1lBQ3JCLEtBQUssQ0FBQztJQUNWLENBQUM7SUFFRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUVwQyxJQUFJLE1BQU0sR0FBRyxPQUFPLEtBQUssZUFBSztRQUMxQiwyS0FBMks7UUFDM0ssY0FBTyxDQUFDLHlCQUFrQixFQUFFLENBQUUsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLEVBQUUsWUFBWSxFQUFFLGtC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