"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var aggregate_1 = require("./aggregate");
var channel_1 = require("./channel");
var encoding_1 = require("./encoding");
var fielddef_1 = require("./fielddef");
var mark_1 = require("./mark");
var scale_1 = require("./scale");
var util_1 = require("./util");
exports.STACKABLE_MARKS = [mark_1.BAR, mark_1.AREA, mark_1.RULE, mark_1.POINT, mark_1.CIRCLE, mark_1.SQUARE, mark_1.LINE, mark_1.TEXT, mark_1.TICK];
exports.STACK_BY_DEFAULT_MARKS = [mark_1.BAR, mark_1.AREA];
// Note: CompassQL uses this method and only pass in required properties of each argument object.
// If required properties change, make sure to update CompassQL.
function stack(m, encoding, stackConfig) {
    var mark = mark_1.isMarkDef(m) ? m.type : m;
    // Should have stackable mark
    if (!util_1.contains(exports.STACKABLE_MARKS, mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!encoding_1.isAggregate(encoding)) {
        return null;
    }
    // Should have grouping level of detail
    var stackBy = channel_1.STACK_GROUP_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                if (fielddef_1.isFieldDef(fieldDef) && !fieldDef.aggregate) {
                    sc.push({
                        channel: channel,
                        fieldDef: fieldDef
                    });
                }
            });
        }
        return sc;
    }, []);
    if (stackBy.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var hasXField = fielddef_1.isFieldDef(encoding.x);
    var hasYField = fielddef_1.isFieldDef(encoding.y);
    var xIsAggregate = fielddef_1.isFieldDef(encoding.x) && !!encoding.x.aggregate;
    var yIsAggregate = fielddef_1.isFieldDef(encoding.y) && !!encoding.y.aggregate;
    if (xIsAggregate !== yIsAggregate) {
        var fieldChannel = xIsAggregate ? channel_1.X : channel_1.Y;
        var fieldDef = encoding[fieldChannel];
        var fieldChannelAggregate = fieldDef.aggregate;
        var fieldChannelScale = fieldDef.scale;
        var stackOffset = null;
        if (fieldDef.stack !== undefined) {
            stackOffset = fieldDef.stack;
        }
        else if (util_1.contains(exports.STACK_BY_DEFAULT_MARKS, mark)) {
            // Bar and Area with sum ops are automatically stacked by default
            stackOffset = stackConfig === undefined ? 'zero' : stackConfig;
        }
        else {
            stackOffset = stackConfig;
        }
        if (!stackOffset || stackOffset === 'none') {
            return null;
        }
        // If stacked, check if it qualifies for stacking (and log warning if not qualified.)
        if (fieldChannelScale && fieldChannelScale.type && fieldChannelScale.type !== scale_1.ScaleType.LINEAR) {
            log.warn(log.message.cannotStackNonLinearScale(fieldChannelScale.type));
            return null;
        }
        if (encoding_1.channelHasField(encoding, fieldChannel === channel_1.X ? channel_1.X2 : channel_1.Y2)) {
            log.warn(log.message.cannotStackRangedMark(fieldChannel));
            return null;
        }
        if (!util_1.contains(aggregate_1.SUM_OPS, fieldChannelAggregate)) {
            log.warn(log.message.cannotStackNonSummativeAggregate(fieldChannelAggregate));
            return null;
        }
        return {
            groupbyChannel: xIsAggregate ? (hasYField ? channel_1.Y : null) : (hasXField ? channel_1.X : null),
            fieldChannel: fieldChannel,
            stackBy: stackBy,
            offset: stackOffset
        };
    }
    return null;
}
exports.stack = stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFFN0IseUNBQW9DO0FBQ3BDLHFDQUFzRTtBQUN0RSx1Q0FBa0U7QUFDbEUsdUNBQWtFO0FBQ2xFLCtCQUEwRztBQUMxRyxpQ0FBa0M7QUFDbEMsK0JBQXlDO0FBK0I1QixRQUFBLGVBQWUsR0FBRyxDQUFDLFVBQUcsRUFBRSxXQUFJLEVBQUUsV0FBSSxFQUFFLFlBQUssRUFBRSxhQUFNLEVBQUUsYUFBTSxFQUFFLFdBQUksRUFBRSxXQUFJLEVBQUUsV0FBSSxDQUFDLENBQUM7QUFDN0UsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLFVBQUcsRUFBRSxXQUFJLENBQUMsQ0FBQztBQUVsRCxpR0FBaUc7QUFDakcsZ0VBQWdFO0FBRWhFLGVBQXNCLENBQWlCLEVBQUUsUUFBa0IsRUFBRSxXQUF3QjtJQUNuRixJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLDZCQUE2QjtJQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyx1QkFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDJCQUEyQjtJQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsdUNBQXVDO0lBQ3ZDLElBQU0sT0FBTyxHQUFHLDhCQUFvQixDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQUUsRUFBRSxPQUFPO1FBQ3RELEVBQUUsQ0FBQyxDQUFDLDBCQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZ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