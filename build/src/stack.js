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
    var stackBy = channel_1.NONSPATIAL_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (cDef) {
                var fieldDef = fielddef_1.getFieldDef(cDef);
                if (!fieldDef.aggregate) {
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
            impute: util_1.contains(['area', 'line'], mark),
            stackBy: stackBy,
            offset: stackOffset
        };
    }
    return null;
}
exports.stack = stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBb0M7QUFDcEMscUNBQStFO0FBQy9FLHVDQUFrRTtBQUNsRSx1Q0FBc0Y7QUFDdEYsMkJBQTZCO0FBQzdCLCtCQUEwRztBQUMxRyxpQ0FBa0M7QUFDbEMsK0JBQXlDO0FBNkI1QixRQUFBLGVBQWUsR0FBRyxDQUFDLFVBQUcsRUFBRSxXQUFJLEVBQUUsV0FBSSxFQUFFLFlBQUssRUFBRSxhQUFNLEVBQUUsYUFBTSxFQUFFLFdBQUksRUFBRSxXQUFJLEVBQUUsV0FBSSxDQUFDLENBQUM7QUFDN0UsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLFVBQUcsRUFBRSxXQUFJLENBQUMsQ0FBQztBQUVsRCxpR0FBaUc7QUFDakcsZ0VBQWdFO0FBRWhFLGVBQXNCLENBQWlCLEVBQUUsUUFBeUIsRUFBRSxXQUF3QjtJQUMxRixJQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLDZCQUE2QjtJQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyx1QkFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDJCQUEyQjtJQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsdUNBQXVDO0lBQ3ZDLElBQU0sT0FBTyxHQUFHLDZCQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQUUsRUFBRSxPQUFPO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLDBCQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZ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