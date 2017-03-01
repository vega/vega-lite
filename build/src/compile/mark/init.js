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
            var xIsMeasure = fielddef_1.isMeasure(encoding.x) || fielddef_1.isMeasure(encoding.x2);
            var yIsMeasure = fielddef_1.isMeasure(encoding.y) || fielddef_1.isMeasure(encoding.y2);
            if (xIsMeasure && !yIsMeasure) {
                return 'horizontal';
            }
            else if (!xIsMeasure && yIsMeasure) {
                return 'vertical';
            }
            else if (xIsMeasure && yIsMeasure) {
                var xDef = encoding.x;
                var yDef = encoding.y;
                // temporal without timeUnit is considered continuous, but better serves as dimension
                if (xDef.type === type_1.TEMPORAL) {
                    return 'vertical';
                }
                else if (yDef.type === type_1.TEMPORAL) {
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
//# sourceMappingURL=init.js.map