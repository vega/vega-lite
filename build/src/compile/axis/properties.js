"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function domainAndTicks(property, specifiedAxis, isGridAxis, channel) {
    if (isGridAxis) {
        return false;
    }
    return specifiedAxis[property];
}
exports.domainAndTicks = domainAndTicks;
exports.domain = domainAndTicks;
exports.ticks = domainAndTicks;
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
function grid(scaleType, fieldDef) {
    return !scale_1.hasDiscreteDomain(scaleType) && !fieldDef.bin;
}
exports.grid = grid;
function gridScale(model, channel, isGridAxis) {
    if (isGridAxis) {
        var gridChannel = channel === 'x' ? 'y' : 'x';
        if (model.getScaleComponent(gridChannel)) {
            return model.scaleName(gridChannel);
        }
    }
    return undefined;
}
exports.gridScale = gridScale;
function labelOverlap(fieldDef, specifiedAxis, channel, scaleType) {
    // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
    if ((channel === 'x' || channel === 'y') && fieldDef.type !== 'nominal') {
        if (scaleType === 'log') {
            return 'greedy';
        }
        return true;
    }
    return undefined;
}
exports.labelOverlap = labelOverlap;
function minMaxExtent(specifiedExtent, isGridAxis) {
    if (isGridAxis) {
        // Always return 0 to make sure that `config.axis*.minExtent` and `config.axis*.maxExtent`
        // would not affect gridAxis
        return 0;
    }
    else {
        return specifiedExtent;
    }
}
exports.minMaxExtent = minMaxExtent;
function orient(channel) {
    switch (channel) {
        case channel_1.X:
            return 'bottom';
        case channel_1.Y:
            return 'left';
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}
exports.orient = orient;
function tickCount(channel, fieldDef, scaleType, size) {
    if (!scale_1.hasDiscreteDomain(scaleType) && scaleType !== 'log' && !util_1.contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {
        if (fieldDef.bin) {
            // for binned data, we don't want more ticks than maxbins
            return { signal: "min(ceil(" + size.signal + "/40), " + fieldDef.bin.maxbins + ")" };
        }
        return { signal: "ceil(" + size.signal + "/40)" };
    }
    return undefined;
}
exports.tickCount = tickCount;
function title(maxLength, fieldDef, config) {
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fielddef_1.title(fieldDef, config);
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
function values(specifiedAxis, model, fieldDef) {
    var vals = specifiedAxis.values;
    if (specifiedAxis.values && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return { signal: datetime_1.dateTimeExpr(dt, true) };
        });
    }
    return vals;
}
exports.values = values;
function zindex(isGridAxis) {
    if (isGridAxis) {
        // if grid is true, need to put layer on the back so that grid is behind marks
        return 0;
    }
    return 1; // otherwise return undefined and use Vega's default.
}
exports.zindex = zindex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlDQUE0QztBQUU1QywyQ0FBa0U7QUFDbEUsMkNBQWdFO0FBQ2hFLCtCQUFpQztBQUNqQyxxQ0FBeUQ7QUFDekQsbUNBQThDO0FBSzlDLHdCQUErQixRQUE0QixFQUFFLGFBQW1CLEVBQUUsVUFBbUIsRUFBRSxPQUFnQjtJQUNySCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFMRCx3Q0FLQztBQUVZLFFBQUEsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUN4QixRQUFBLEtBQUssR0FBRyxjQUFjLENBQUM7QUFFcEMsaUZBQWlGO0FBQ2pGOzs7R0FHRztBQUNILGNBQXFCLFNBQW9CLEVBQUUsUUFBMEI7SUFDbkUsTUFBTSxDQUFDLENBQUMseUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3hELENBQUM7QUFGRCxvQkFFQztBQUVELG1CQUEwQixLQUFnQixFQUFFLE9BQWdCLEVBQUUsVUFBbUI7SUFDL0UsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNmLElBQU0sV0FBVyxHQUFZLE9BQU8sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFB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