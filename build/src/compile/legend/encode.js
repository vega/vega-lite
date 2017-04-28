"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
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
    var cfg = model.config;
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
        if (colorMixins.fill && fielddef_1.isFieldDef(colorMixins.fill)) {
            delete colorMixins.fill;
        }
        if (colorMixins.stroke && fielddef_1.isFieldDef(colorMixins.stroke)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFvRDtBQUNwRCwyQ0FBZ0U7QUFDaEUsbUNBQWtHO0FBQ2xHLG1DQUFvQztBQUNwQyxtQ0FBaUQ7QUFJakQsb0NBQWdFO0FBQ2hFLHVDQUF5QztBQUd6QyxpQkFBd0IsUUFBMEIsRUFBRSxXQUFnQixFQUFFLEtBQWdCLEVBQUUsT0FBZ0I7SUFDdEcsSUFBSSxPQUFPLEdBQU8sRUFBRSxDQUFDO0lBQ3JCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUxQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxVQUFHLENBQUM7UUFDVCxLQUFLLFdBQUksQ0FBQztRQUNWLEtBQUssV0FBSTtZQUNQLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDO1FBQ1IsS0FBSyxhQUFNLENBQUM7UUFDWixLQUFLLGFBQU07WUFDVCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO1lBQzlCLEtBQUssQ0FBQztRQUNSLEtBQUssWUFBSyxDQUFDO1FBQ1gsS0FBSyxXQUFJLENBQUM7UUFDVixLQUFLLFdBQUk7WUFDUCxxQkFBcUI7WUFDckIsS0FBSyxDQUFDO0lBQ1YsQ0FBQztJQUVELElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDekIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFcEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxLQUFLLGVBQUs7UUFDMUIsMktBQTJLO1FBQzNLLGNBQU8sQ0FBQyx5QkFBa0IsRUFBRSxDQUFFLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVGLHdDQUF3QztRQUN4Qyx5QkFBa0IsQ0FBQztJQUV2QixNQUFNLEdBQUcsY0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFFN0Qsd0JBQWUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxlQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsbUZBQW1GO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUkscUJBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQztRQUMxQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxxQkFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQzVCLENBQUM7UUFDRCxhQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssZUFBSyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sR0FBRyxhQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUU3QyxNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN4RCxDQUFDO0FBekRELDBCQXlEQztBQUVELGdCQUF1QixRQUEwQixFQUFFLFVBQWUsRUFBRSxLQUFnQixFQUFFLE9BQWdCO0lBQ3BHLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUU1QixJQUFJLE1BQU0sR0FBTyxFQUFFLENBQUM7SUFFcEIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxlQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9CLFVBQVUsR0FBRyxhQUFNLENBQUM7WUFDbEIsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSw2QkFBb0IsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDaEk7U0FDRixFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxHQUFHLGFBQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTFDLE1BQU0sQ0FBQyxXQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3RELENBQUM7QUFqQkQsd0JBaUJDIn0=