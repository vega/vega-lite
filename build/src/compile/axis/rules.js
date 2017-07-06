"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var util_1 = require("../../util");
var common_1 = require("../common");
var encode_1 = require("./encode");
function format(specifiedAxis, fieldDef, config) {
    return common_1.numberFormat(fieldDef, specifiedAxis.format, config);
}
exports.format = format;
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
function gridShow(model, channel) {
    var grid = model.axis(channel).grid;
    if (grid !== undefined) {
        return grid;
    }
    return !model.hasDiscreteDomain(channel) && !model.fieldDef(channel).bin;
}
exports.gridShow = gridShow;
function grid(model, channel, isGridAxis) {
    if (!isGridAxis) {
        return undefined;
    }
    return gridShow(model, channel);
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
function orient(specifiedAxis, channel) {
    var orient = specifiedAxis.orient;
    if (orient) {
        return orient;
    }
    switch (channel) {
        case channel_1.COLUMN:
            // FIXME test and decide
            return 'top';
        case channel_1.X:
            return 'bottom';
        case channel_1.ROW:
        case channel_1.Y:
            return 'left';
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}
exports.orient = orient;
function tickCount(specifiedAxis, channel, fieldDef) {
    var count = specifiedAxis.tickCount;
    if (count !== undefined) {
        return count;
    }
    // FIXME depends on scale type too
    if (channel === channel_1.X && !fieldDef.bin) {
        // Vega's default tickCount often lead to a lot of label occlusion on X without 90 degree rotation
        return 5;
    }
    return undefined;
}
exports.tickCount = tickCount;
function title(specifiedAxis, fieldDef, config, isGridAxis) {
    if (isGridAxis) {
        return undefined;
    }
    if (specifiedAxis.title === '') {
        return undefined;
    }
    if (specifiedAxis.title !== undefined) {
        return specifiedAxis.title;
    }
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fielddef_1.title(fieldDef, config);
    var maxLength = specifiedAxis.titleMaxLength;
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
    if (!vals && fieldDef.bin) {
        var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
        return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
    }
    return vals;
}
exports.values = values;
function zindex(specifiedAxis, isGridAxis) {
    var z = specifiedAxis.zindex;
    if (z !== undefined) {
        return z;
    }
    if (isGridAxis) {
        // if grid is true, need to put layer on the back so that grid is behind marks
        return 0;
    }
    return 1; // otherwise return undefined and use Vega's default.
}
exports.zindex = zindex;
function domainAndTicks(property, specifiedAxis, isGridAxis, channel) {
    if (isGridAxis || channel === channel_1.ROW || channel === channel_1.COLUMN) {
        return false;
    }
    return specifiedAxis[property];
}
exports.domainAndTicks = domainAndTicks;
function labelOverlap(fieldDef, specifiedAxis, channel, isGridAxis) {
    // TODO: use true for non-log continuous scales, and use "greedy" for log scales
    if (!isGridAxis && channel === 'x' && !encode_1.labelAngle(specifiedAxis, channel, fieldDef)) {
        return true;
    }
    return undefined;
}
exports.labelOverlap = labelOverlap;
exports.domain = domainAndTicks;
exports.ticks = domainAndTicks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3J1bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaUNBQXNDO0FBQ3RDLHlDQUE4RTtBQUU5RSwyQ0FBa0U7QUFDbEUsMkNBQWdFO0FBQ2hFLCtCQUFpQztBQUNqQyxtQ0FBb0M7QUFFcEMsb0NBQXVDO0FBRXZDLG1DQUFvQztBQUVwQyxnQkFBdUIsYUFBbUIsRUFBRSxRQUEwQixFQUFFLE1BQWM7SUFDcEYsTUFBTSxDQUFDLHFCQUFZLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUZELHdCQUVDO0FBRUQsaUZBQWlGO0FBQ2pGOzs7R0FHRztBQUNILGtCQUF5QixLQUFnQixFQUFFLE9BQTRCO0lBQ3JFLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDM0UsQ0FBQztBQVBELDRCQU9DO0FBRUQsY0FBcUIsS0FBZ0IsRUFBRSxPQUE0QixFQUFFLFVBQW1CO0lBQ3RGLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBTkQsb0JBTUM7QUFFRCxtQkFB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