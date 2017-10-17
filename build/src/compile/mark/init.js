"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function normalizeMarkDef(markDef, encoding, scales, config) {
    var specifiedOrient = markDef.orient || common_1.getMarkConfig('orient', markDef, config);
    markDef.orient = orient(markDef.type, encoding, scales, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    var specifiedFilled = markDef.filled;
    if (specifiedFilled === undefined) {
        markDef.filled = filled(markDef, config);
    }
}
exports.normalizeMarkDef = normalizeMarkDef;
/**
 * Initialize encoding's value with some special default values
 */
function initEncoding(mark, encoding, stacked, config) {
    var opacityConfig = common_1.getMarkConfig('opacity', mark, config);
    if (!encoding.opacity && opacityConfig === undefined) {
        var opacity = defaultOpacity(mark.type, encoding, stacked);
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
function filled(markDef, config) {
    var filledConfig = common_1.getMarkConfig('filled', markDef, config);
    var mark = markDef.type;
    return filledConfig !== undefined ? filledConfig : mark !== mark_1.POINT && mark !== mark_1.LINE && mark !== mark_1.RULE;
}
function orient(mark, encoding, scales, specifiedOrient) {
    switch (mark) {
        case mark_1.POINT:
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
        case mark_1.TEXT:
        case mark_1.RECT:
            // orient is meaningless for these marks.
            return undefined;
    }
    var yIsRange = encoding.y2;
    var xIsRange = encoding.x2;
    switch (mark) {
        case mark_1.TICK:
            var xScaleType = scales.x ? scales.x.get('type') : null;
            var yScaleType = scales.y ? scales.y.get('type') : null;
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
        case mark_1.LINE:// intentional fall through
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
                if (!xDef.aggregate && yDef.aggregate) {
                    return 'vertical';
                }
                else if (xDef.aggregate && !yDef.aggregate) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDJDQUFxRDtBQUNyRCwyQ0FBa0U7QUFDbEUsK0JBQWlDO0FBQ2pDLG1DQUF5RztBQUN6RyxxQ0FBOEM7QUFFOUMsbUNBQW9DO0FBQ3BDLG1DQUFvQztBQUNwQyxvQ0FBd0M7QUFLeEMsMEJBQWlDLE9BQWdCLEVBQUUsUUFBMEIsRUFBRSxNQUEyQixFQUFFLE1BQWM7SUFDeEgsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxzQkFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkYsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3pFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdkMsRUFBRSxDQUFDLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7QUFDSCxDQUFDO0FBWEQsNENBV0M7QUFFRDs7R0FFRztBQUNILHNCQUE2QixJQUFhLEVBQUUsUUFBMEIsRUFBRSxPQUF3QixFQUFFLE1BQWM7SUFDOUcsSUFBTSxh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