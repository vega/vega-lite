"use strict";
var log = require("../../log");
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
function format(specifiedAxis, channel, fieldDef, config) {
    return common_1.numberFormat(fieldDef, specifiedAxis.format, config, channel);
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
    return !model.hasDiscreteScale(channel) && !model.fieldDef(channel).bin;
}
exports.gridShow = gridShow;
function grid(model, channel, isGridAxis) {
    if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
        // never apply grid for ROW and COLUMN since we manually create rule-group for them
        return undefined;
    }
    if (!isGridAxis) {
        return undefined;
    }
    return gridShow(model, channel);
}
exports.grid = grid;
function gridScale(model, channel, isGridAxis) {
    if (isGridAxis) {
        var gridChannel = channel === 'x' ? 'y' : 'x';
        if (model.scale(gridChannel)) {
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
    if (specifiedAxis.title !== undefined) {
        return specifiedAxis.title;
    }
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fielddef_1.title(fieldDef, config);
    var maxLength = specifiedAxis.titleMaxLength;
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
function values(specifiedAxis) {
    var vals = specifiedAxis.values;
    if (specifiedAxis.values && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return datetime_1.timestamp(dt, true);
        });
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
;
//# sourceMappingURL=rules.js.map