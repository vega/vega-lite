"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mark_1 = require("../../mark");
var encoding_1 = require("../../encoding");
var log = require("../../log");
var util_1 = require("../../util");
var scale_1 = require("../../scale");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
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
        if (!encoding_1.isAggregate(encoding) || encoding_1.channelHasField(encoding, 'detail')) {
            return 0.7;
        }
    }
    if (mark === mark_1.BAR && !stacked) {
        if (encoding_1.channelHasField(encoding, 'color') || encoding_1.channelHasField(encoding, 'detail') || encoding_1.channelHasField(encoding, 'size')) {
            return 0.7;
        }
    }
    if (mark === mark_1.AREA) {
        return 0.7; // inspired by Tableau
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBNEg7QUFDNUgsMkNBQXNFO0FBQ3RFLCtCQUFpQztBQUNqQyxtQ0FBMEM7QUFDMUMscUNBQXFEO0FBQ3JELDJDQUFrRTtBQUNsRSxtQ0FBb0M7QUFFcEMsb0NBQXdDO0FBR3hDLHFCQUE0QixJQUFvQixFQUFFLFFBQWtCLEVBQUUsS0FBa0IsRUFBRSxNQUFjO0lBQ3RHLElBQU0sT0FBTyxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXRELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksc0JBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4RixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDeEUsRUFBRSxDQUFDLENBQUMsZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsTUFBTSxzQkFDRCxPQUFPO1FBRVYsd0ZBQXdGO1FBQ3hGLGtDQUFrQztRQUNsQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQ3BDO0FBQ0osQ0FBQztBQWhCRCxrQ0FnQkM7QUFFRDs7R0FFRztBQUNILHNCQUE2QixJQUFV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