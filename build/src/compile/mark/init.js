"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function initMarkDef(mark, encoding, scale, config) {
    var markDef = mark_1.isMarkDef(mark) ? mark : { type: mark };
    var specifiedOrient = markDef.orient || common_1.getMarkConfig('orient', markDef.type, config);
    markDef.orient = orient(markDef.type, encoding, scale, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    return tslib_1.__assign({}, markDef, { 
        // TODO: filled could be injected to encoding too, but we don't have filled channel yet.
        // Thus we inject it here for now.
        filled: filled(markDef.type, config) });
}
exports.initMarkDef = initMarkDef;
/**
 * Initialize encoding's value with some special default values
 */
function initEncoding(mark, encoding, stacked, config) {
    var opacityConfig = common_1.getMarkConfig('opacity', mark, config);
    if (!encoding.opacity && opacityConfig === undefined) {
        var opacity = defaultOpacity(mark, encoding, stacked);
        if (opacity !== undefined) {
            encoding.opacity = { value: opacity };
        }
    }
    return encoding;
}
exports.initEncoding = initEncoding;
function defaultOpacity(mark, encoding, stacked) {
    if (util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], mark)) {
        // point-based marks
        if (!encoding_1.isAggregate(encoding)) {
            return 0.7;
        }
    }
    return undefined;
}
function filled(mark, config) {
    var filledConfig = common_1.getMarkConfig('filled', mark, config);
    return filledConfig !== undefined ? filledConfig : mark !== mark_1.POINT && mark !== mark_1.LINE && mark !== mark_1.RULE;
}
function orient(mark, encoding, scale, specifiedOrient) {
    switch (mark) {
        case mark_1.POINT:
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
        case mark_1.TEXT:
        case mark_1.RECT:
            // orient is meaningless for these marks.
            return undefined;
    }
    var yIsRange = encoding.y && encoding.y2;
    var xIsRange = encoding.x && encoding.x2;
    switch (mark) {
        case mark_1.TICK:
            var xScaleType = scale['x'] ? scale['x'].type : null;
            var yScaleType = scale['y'] ? scale['y'].type : null;
            // Tick is opposite to bar, line, area and never have ranged mark.
            if (!scale_1.hasDiscreteDomain(xScaleType) && (!encoding.y ||
                scale_1.hasDiscreteDomain(yScaleType) ||
                (fielddef_1.isFieldDef(encoding.y) && encoding.y.bin))) {
                return 'vertical';
            }
            // y:Q or Ambiguous case, return horizontal
            return 'horizontal';
        case mark_1.RULE:
        case mark_1.BAR:
        case mark_1.AREA:
            // If there are range for both x and y, y (vertical) has higher precedence.
            if (yIsRange) {
                return 'vertical';
            }
            else if (xIsRange) {
                return 'horizontal';
            }
            else if (mark === mark_1.RULE) {
                if (encoding.x && !encoding.y) {
                    return 'vertical';
                }
                else if (encoding.y && !encoding.x) {
                    return 'horizontal';
                }
            }
        /* tslint:disable */
        case mark_1.LINE:
            /* tslint:enable */
            var xIsContinuous = fielddef_1.isFieldDef(encoding.x) && fielddef_1.isContinuous(encoding.x);
            var yIsContinuous = fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y);
            if (xIsContinuous && !yIsContinuous) {
                return 'horizontal';
            }
            else if (!xIsContinuous && yIsContinuous) {
                return 'vertical';
            }
            else if (xIsContinuous && yIsContinuous) {
                var xDef = encoding.x; // we can cast here since they are surely fieldDef
                var yDef = encoding.y;
                var xIsTemporal = xDef.type === type_1.TEMPORAL;
                var yIsTemporal = yDef.type === type_1.TEMPORAL;
                // temporal without timeUnit is considered continuous, but better serves as dimension
                if (xIsTemporal && !yIsTemporal) {
                    return 'vertical';
                }
                else if (!xIsTemporal && yIsTemporal) {
                    return 'horizontal';
                }
                if (!xDef.aggregate && !!yDef.aggregate) {
                    return 'vertical';
                }
                else if (!!xDef.aggregate && !yDef.aggregate) {
                    return 'horizontal';
                }
                if (specifiedOrient) {
                    // When ambiguous, use user specified one.
                    return specifiedOrient;
                }
                if (!(mark === mark_1.LINE && encoding.order)) {
                    // Except for connected scatterplot, we should log warning for unclear orientation of QxQ plots.
                    log.warn(log.message.unclearOrientContinuous(mark));
                }
                return 'vertical';
            }
            else {
                // For Discrete x Discrete case, return undefined.
                log.warn(log.message.unclearOrientDiscreteOrEmpty(mark));
                return undefined;
            }
    }
    return 'vertical';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBcUQ7QUFDckQsMkNBQWtFO0FBQ2xFLCtCQUFpQztBQUNqQyxtQ0FBNEg7QUFDNUgscUNBQXFEO0FBRXJELG1DQUFvQztBQUNwQyxtQ0FBMEM7QUFDMUMsb0NBQXdDO0FBRXhDLHFCQUE0QixJQUFvQixFQUFFLFFBQWtCLEVBQUUsS0FBa0IsRUFBRSxNQUFjO0lBQ3RHLElBQU0sT0FBTyxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXRELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksc0JBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4RixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDeEUsRUFBRSxDQUFDLENBQUMsZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsTUFBTSxzQkFDRCxPQUFPO1FBRVYsd0ZBQXdGO1FBQ3hGLGtDQUFrQztRQUNsQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQ3BDO0FBQ0osQ0FBQztBQWhCRCxrQ0FnQkM7QUFFRDs7R0FFRztBQUNILHNCQUE2QixJQUFV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