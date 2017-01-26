"use strict";
var log = require("../log");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var scale_1 = require("../scale");
var type_1 = require("../type");
var util_1 = require("../util");
/**
 * Augment config.mark with rule-based default values.
 */
function initMarkConfig(mark, encoding, scale, stacked, config) {
    // override mark config with mark specific config
    var markConfig = util_1.extend({}, config.mark, config[mark]);
    if (markConfig.filled === undefined) {
        markConfig.filled = mark !== mark_1.POINT && mark !== mark_1.LINE && mark !== mark_1.RULE;
    }
    if (markConfig.opacity === undefined) {
        var o = opacity(mark, encoding, stacked);
        if (o) {
            markConfig.opacity = o;
        }
    }
    // For orient, users can only specify for ambiguous cases.
    markConfig.orient = orient(mark, encoding, scale, config.mark);
    if (config.mark.orient !== undefined && markConfig.orient !== config.mark.orient) {
        log.warn(log.message.orientOverridden(config.mark.orient, markConfig.orient));
    }
    return markConfig;
}
exports.initMarkConfig = initMarkConfig;
function initTextConfig(encoding, config) {
    var textConfig = util_1.extend({}, config.text);
    if (textConfig.align === undefined) {
        textConfig.align = encoding_1.channelHasField(encoding, channel_1.X) ? 'center' : 'right';
    }
    return textConfig;
}
exports.initTextConfig = initTextConfig;
function opacity(mark, encoding, stacked) {
    if (util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], mark)) {
        // point-based marks
        if (!encoding_1.isAggregate(encoding) || encoding_1.channelHasField(encoding, channel_1.DETAIL)) {
            return 0.7;
        }
    }
    if (mark === mark_1.BAR && !stacked) {
        if (encoding_1.channelHasField(encoding, channel_1.COLOR) || encoding_1.channelHasField(encoding, channel_1.DETAIL) || encoding_1.channelHasField(encoding, channel_1.SIZE)) {
            return 0.7;
        }
    }
    if (mark === mark_1.AREA) {
        return 0.7; // inspired by Tableau
    }
    return undefined;
}
exports.opacity = opacity;
function orient(mark, encoding, scale, markConfig) {
    if (markConfig === void 0) { markConfig = {}; }
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
                if (markConfig.orient) {
                    // When ambiguous, use user specified one.
                    return markConfig.orient;
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
exports.orient = orient;
//# sourceMappingURL=config.js.map