"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var aggregate_1 = require("./aggregate");
var channel_1 = require("./channel");
var encoding_1 = require("./encoding");
var fielddef_1 = require("./fielddef");
var log = tslib_1.__importStar(require("./log"));
var mark_1 = require("./mark");
var scale_1 = require("./scale");
var util_1 = require("./util");
var STACK_OFFSET_INDEX = {
    zero: 1,
    center: 1,
    normalize: 1
};
function isStackOffset(s) {
    return !!STACK_OFFSET_INDEX[s];
}
exports.isStackOffset = isStackOffset;
exports.STACKABLE_MARKS = [mark_1.BAR, mark_1.AREA, mark_1.RULE, mark_1.POINT, mark_1.CIRCLE, mark_1.SQUARE, mark_1.LINE, mark_1.TEXT, mark_1.TICK];
exports.STACK_BY_DEFAULT_MARKS = [mark_1.BAR, mark_1.AREA];
function potentialStackedChannel(encoding) {
    var xDef = encoding.x;
    var yDef = encoding.y;
    if (fielddef_1.isFieldDef(xDef) && fielddef_1.isFieldDef(yDef)) {
        if (xDef.type === 'quantitative' && yDef.type === 'quantitative') {
            if (xDef.stack) {
                return 'x';
            }
            else if (yDef.stack) {
                return 'y';
            }
            // if there is no explicit stacking, only apply stack if there is only one aggregate for x or y
            if ((!!xDef.aggregate) !== (!!yDef.aggregate)) {
                return xDef.aggregate ? 'x' : 'y';
            }
        }
        else if (xDef.type === 'quantitative') {
            return 'x';
        }
        else if (yDef.type === 'quantitative') {
            return 'y';
        }
    }
    else if (fielddef_1.isFieldDef(xDef) && xDef.type === 'quantitative') {
        return 'x';
    }
    else if (fielddef_1.isFieldDef(yDef) && yDef.type === 'quantitative') {
        return 'y';
    }
    return undefined;
}
// Note: CompassQL uses this method and only pass in required properties of each argument object.
// If required properties change, make sure to update CompassQL.
function stack(m, encoding, stackConfig) {
    var mark = mark_1.isMarkDef(m) ? m.type : m;
    // Should have stackable mark
    if (!util_1.contains(exports.STACKABLE_MARKS, mark)) {
        return null;
    }
    var fieldChannel = potentialStackedChannel(encoding);
    if (!fieldChannel) {
        return null;
    }
    var stackedFieldDef = encoding[fieldChannel];
    var stackedField = fielddef_1.isStringFieldDef(stackedFieldDef) ? fielddef_1.vgField(stackedFieldDef, {}) : undefined;
    var dimensionChannel = fieldChannel === 'x' ? 'y' : 'x';
    var dimensionDef = encoding[dimensionChannel];
    var dimensionField = fielddef_1.isStringFieldDef(dimensionDef) ? fielddef_1.vgField(dimensionDef, {}) : undefined;
    // Should have grouping level of detail that is different from the dimension field
    var stackBy = channel_1.NONPOSITION_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (cDef) {
                var fieldDef = fielddef_1.getFieldDef(cDef);
                if (fieldDef.aggregate) {
                    return;
                }
                // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
                var f = fielddef_1.isStringFieldDef(fieldDef) ? fielddef_1.vgField(fieldDef, {}) : undefined;
                if (
                // if fielddef is a repeat, just include it in the stack by
                !f ||
                    // otherwise, the field must be different from x and y fields.
                    (f !== dimensionField && f !== stackedField)) {
                    sc.push({ channel: channel, fieldDef: fieldDef });
                }
            });
        }
        return sc;
    }, []);
    if (stackBy.length === 0) {
        return null;
    }
    // Automatically determine offset
    var offset = undefined;
    if (stackedFieldDef.stack !== undefined) {
        offset = stackedFieldDef.stack;
    }
    else if (util_1.contains(exports.STACK_BY_DEFAULT_MARKS, mark)) {
        // Bar and Area with sum ops are automatically stacked by default
        offset = stackConfig === undefined ? 'zero' : stackConfig;
    }
    else {
        offset = stackConfig;
    }
    if (!offset || !isStackOffset(offset)) {
        return null;
    }
    // warn when stacking non-linear
    if (stackedFieldDef.scale && stackedFieldDef.scale.type && stackedFieldDef.scale.type !== scale_1.ScaleType.LINEAR) {
        log.warn(log.message.cannotStackNonLinearScale(stackedFieldDef.scale.type));
    }
    // Check if it is a ranged mark
    if (encoding_1.channelHasField(encoding, fieldChannel === channel_1.X ? channel_1.X2 : channel_1.Y2)) {
        if (stackedFieldDef.stack !== undefined) {
            log.warn(log.message.cannotStackRangedMark(fieldChannel));
        }
        return null;
    }
    // Warn if stacking summative aggregate
    if (stackedFieldDef.aggregate && !util_1.contains(aggregate_1.SUM_OPS, stackedFieldDef.aggregate)) {
        log.warn(log.message.stackNonSummativeAggregate(stackedFieldDef.aggregate));
    }
    return {
        groupbyChannel: dimensionDef ? dimensionChannel : undefined,
        fieldChannel: fieldChannel,
        impute: mark_1.isPathMark(mark),
        stackBy: stackBy,
        offset: offset
    };
}
exports.stack = stack;
//# sourceMappingURL=stack.js.map