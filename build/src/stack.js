"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aggregate_1 = require("./aggregate");
var channel_1 = require("./channel");
var encoding_1 = require("./encoding");
var fielddef_1 = require("./fielddef");
var log = require("./log");
var mark_1 = require("./mark");
var scale_1 = require("./scale");
var util_1 = require("./util");
var STACK_OFFSET_INDEX = {
    zero: 1,
    center: 1,
    normalize: 1
};
function isStackOffset(stack) {
    return !!STACK_OFFSET_INDEX[stack];
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
    var stackedField = fielddef_1.isStringFieldDef(stackedFieldDef) ? fielddef_1.field(stackedFieldDef, {}) : undefined;
    var dimensionChannel = fieldChannel === 'x' ? 'y' : 'x';
    var dimensionDef = encoding[dimensionChannel];
    var dimensionField = fielddef_1.isStringFieldDef(dimensionDef) ? fielddef_1.field(dimensionDef, {}) : undefined;
    // Should have grouping level of detail that is different from the dimension field
    var stackBy = channel_1.NONPOSITION_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (cDef) {
                var fieldDef = fielddef_1.getFieldDef(cDef);
                if (fieldDef.aggregate) {
                    return;
                }
                // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
                var f = fielddef_1.isStringFieldDef(fieldDef) ? fielddef_1.field(fieldDef, {}) : undefined;
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
    // If stacked, check scale type if it is linear
    if (stackedFieldDef.scale && stackedFieldDef.scale.type && stackedFieldDef.scale.type !== scale_1.ScaleType.LINEAR) {
        log.warn(log.message.cannotStackNonLinearScale(stackedFieldDef.scale.type));
        return null;
    }
    // Check if it is a ranged mark
    if (encoding_1.channelHasField(encoding, fieldChannel === channel_1.X ? channel_1.X2 : channel_1.Y2)) {
        log.warn(log.message.cannotStackRangedMark(fieldChannel));
        return null;
    }
    // Warn if stacking summative aggregate
    if (stackedFieldDef.aggregate && !util_1.contains(aggregate_1.SUM_OPS, stackedFieldDef.aggregate)) {
        log.warn(log.message.stackNonSummativeAggregate(stackedFieldDef.aggregate));
    }
    return {
        groupbyChannel: dimensionDef ? dimensionChannel : undefined,
        fieldChannel: fieldChannel,
        impute: util_1.contains(['area', 'line'], mark),
        stackBy: stackBy,
        offset: offset
    };
}
exports.stack = stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBb0M7QUFDcEMscUNBQThFO0FBQzlFLHVDQUFxRDtBQUNyRCx1Q0FBK0c7QUFDL0csMkJBQTZCO0FBQzdCLCtCQUEwRztBQUMxRyxpQ0FBa0M7QUFDbEMsK0JBQStDO0FBSy9DLElBQU0sa0JBQWtCLEdBQXNCO0lBQzVDLElBQUksRUFBRSxDQUFDO0lBQ1AsTUFBTSxFQUFFLENBQUM7SUFDVCxTQUFTLEVBQUUsQ0FBQztDQUNiLENBQUM7QUFFRix1QkFBOEIsS0FBYTtJQUN6QyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFGRCxzQ0FFQztBQTBCWSxRQUFBLGVBQWUsR0FBRyxDQUFDLFVBQUcsRUFBRSxXQUFJLEVBQUUsV0FBSSxFQUFFLFlBQUssRUFBRSxhQUFNLEVBQUUsYUFBTSxFQUFFLFdBQUksRUFBRSxXQUFJLEVBQUUsV0FBSSxDQUFDLENBQUM7QUFDN0UsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLFVBQUcsRUFBRSxXQUFJLENBQUMsQ0FBQztBQUdsRCxpQ0FBaUMsUUFBeUI7SUFDeEQsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRXhCLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxjQUFjLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNm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