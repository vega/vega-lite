"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL2VuY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFvRDtBQUNwRCwyQ0FBb0Q7QUFDcEQsbUNBQWtHO0FBQ2xHLG1DQUFvQztBQUNwQyxtQ0FBaUQ7QUFJakQsb0NBQWdFO0FBR2hFLGlCQUF3QixRQUFrQixFQUFFLFdBQWdCLEVBQUUsS0FBZ0IsRUFBRSxPQUFnQjtJQUM5RixJQUFJLE9BQU8sR0FBTyxFQUFFLENBQUM7SUFDckIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRTFCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDYixLQUFLLFVBQUcsQ0FBQztRQUNULEtBQUssV0FBSSxDQUFDO1FBQ1YsS0FBSyxXQUFJO1lBQ1AsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUM7UUFDUixLQUFLLGFBQU0sQ0FBQztRQUNaLEtBQUssYUFBTTtZQUNULE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDOUIsS0FBSyxDQUFDO1FBQ1IsS0FBSyxZQUFLLENBQUM7UUFDWCxLQUFLLFdBQUksQ0FBQztRQUNWLEtBQUssV0FBSTtZQUNQLHFCQUFxQjtZQUNyQixLQUFLLENBQUM7SUFDVixDQUFDO0lBRUQsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUN6QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUVwQyxJQUFJLE1BQU0sR0FBRyxPQUFPLEtBQUssZUFBSztRQUMxQiwyS0FBMks7UUFDM0ssY0FBTyxDQUFDLHlCQUFrQixFQUFFLENBQUUsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDNUYsd0NBQXdDO1FBQ3hDLHlCQUFrQixDQUFDO0lBRXZCLE1BQU0sR0FBRyxjQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztJQUU3RCx3QkFBZSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFeEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLE9BQU8sQ0FBQyxXQUFXLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQUksS0FBaUIsQ0FBQztJQUN0QixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUN0QyxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QixrQkFBa0I7UUFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxlQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGdGQUFnRjtRQUNoRixnREFBZ0Q7UUFDaEQsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZFLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMvQixrREFBa0Q7UUFDbEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNoQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3RDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxlQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBQyxDQUFDO1FBQzFDLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxHQUFHLGFBQU0sQ0FBQyxPQUFPLEVBQUUsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3hELENBQUM7QUE3RUQsMEJBNkVDO0FBRUQsZ0JBQXVCLFFBQWtCLEVBQUUsVUFBZSxFQUFFLEtBQWdCLEVBQUUsT0FBZ0I7SUFDNUYsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBRTVCLElBQUksTUFBTSxHQUFPLEVBQUUsQ0FBQztJQUVwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0IsVUFBVSxHQUFHLGFBQU0sQ0FBQztZQUNsQixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLDZCQUFvQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNoSTtTQUNGLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLEdBQUcsYUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLENBQUM7SUFFMUMsTUFBTSxDQUFDLFdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDdEQsQ0FBQztBQWpCRCx3QkFpQkMifQ==