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
    if (fieldDef.type !== 'nominal') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlDQUF5RDtBQUV6RCwyQ0FBa0U7QUFDbEUsMkNBQWdFO0FBQ2hFLCtCQUFpQztBQUNqQyxxQ0FBeUQ7QUFDekQsbUNBQThDO0FBSzlDLHdCQUErQixRQUE0QixFQUFFLGFBQW1CLEVBQUUsVUFBbUIsRUFBRSxPQUE2QjtJQUNsSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFMRCx3Q0FLQztBQUVZLFFBQUEsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUN4QixRQUFBLEtBQUssR0FBRyxjQUFjLENBQUM7QUFFcEMsaUZBQWlGO0FBQ2pGOzs7R0FHRztBQUNILGNBQXFCLFNBQW9CLEVBQUUsUUFBMEI7SUFDbkUsTUFBTSxDQUFDLENBQUMseUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3hELENBQUM7QUFGRCxvQkFFQztBQUVELG1CQUEwQixLQUFnQixFQUFFLE9BQTZCLEVBQUUsVUFBbUI7SUFDNUYsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNmLElBQU0sV0FBVyxHQUF5QixPQUFPLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0gsQ0FBQztJQUNELE1B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