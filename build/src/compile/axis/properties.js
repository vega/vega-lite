"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var config_1 = require("./config");
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
function grid(scaleType, fieldDef) {
    return !scale_1.hasDiscreteDomain(scaleType) && !bin_1.isBinning(fieldDef.bin);
}
exports.grid = grid;
function gridScale(model, channel) {
    var gridChannel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
        return model.scaleName(gridChannel);
    }
    return undefined;
}
exports.gridScale = gridScale;
function labelAngle(model, specifiedAxis, channel, fieldDef) {
    // try axis value
    if (specifiedAxis.labelAngle !== undefined) {
        // Make angle within [0,360)
        return ((specifiedAxis.labelAngle % 360) + 360) % 360;
    }
    else {
        // try axis config value
        var angle = config_1.getAxisConfig('labelAngle', model.config, channel, orient(channel), model.getScaleComponent(channel).get('type'));
        if (angle !== undefined) {
            return ((angle % 360) + 360) % 360;
        }
        else {
            // get default value
            if (channel === channel_1.X && util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type)) {
                return 270;
            }
            // no default
            return undefined;
        }
    }
}
exports.labelAngle = labelAngle;
function labelBaseline(angle, axisOrient) {
    if (angle !== undefined) {
        if (axisOrient === 'top' || axisOrient === 'bottom') {
            if (angle <= 45 || 315 <= angle) {
                return axisOrient === 'top' ? 'bottom' : 'top';
            }
            else if (135 <= angle && angle <= 225) {
                return axisOrient === 'top' ? 'top' : 'bottom';
            }
            else {
                return 'middle';
            }
        }
        else {
            if (angle <= 45 || 315 <= angle || (135 <= angle && angle <= 225)) {
                return 'middle';
            }
            else if (45 <= angle && angle <= 135) {
                return axisOrient === 'left' ? 'top' : 'bottom';
            }
            else {
                return axisOrient === 'left' ? 'bottom' : 'top';
            }
        }
    }
    return undefined;
}
exports.labelBaseline = labelBaseline;
function labelAlign(angle, axisOrient) {
    if (angle !== undefined) {
        angle = ((angle % 360) + 360) % 360;
        if (axisOrient === 'top' || axisOrient === 'bottom') {
            if (angle % 180 === 0) {
                return 'center';
            }
            else if (0 < angle && angle < 180) {
                return axisOrient === 'top' ? 'right' : 'left';
            }
            else {
                return axisOrient === 'top' ? 'left' : 'right';
            }
        }
        else {
            if ((angle + 90) % 180 === 0) {
                return 'center';
            }
            else if (90 <= angle && angle < 270) {
                return axisOrient === 'left' ? 'left' : 'right';
            }
            else {
                return axisOrient === 'left' ? 'right' : 'left';
            }
        }
    }
    return undefined;
}
exports.labelAlign = labelAlign;
function labelFlush(fieldDef, channel, specifiedAxis) {
    if (specifiedAxis.labelFlush !== undefined) {
        return specifiedAxis.labelFlush;
    }
    if (channel === 'x' && util_1.contains(['quantitative', 'temporal'], fieldDef.type)) {
        return true;
    }
    return undefined;
}
exports.labelFlush = labelFlush;
function labelOverlap(fieldDef, specifiedAxis, channel, scaleType) {
    if (specifiedAxis.labelOverlap !== undefined) {
        return specifiedAxis.labelOverlap;
    }
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
function tickCount(channel, fieldDef, scaleType, size, scaleName, specifiedAxis) {
    if (!scale_1.hasDiscreteDomain(scaleType) &&
        scaleType !== 'log' &&
        !util_1.contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {
        if (specifiedAxis.tickStep) {
            return { signal: "(domain('" + scaleName + "')[1] - domain('" + scaleName + "')[0]) / " + specifiedAxis.tickStep + " + 1" };
        }
        else if (bin_1.isBinning(fieldDef.bin)) {
            // for binned data, we don't want more ticks than maxbins
            return { signal: "ceil(" + size.signal + "/20)" };
        }
        return { signal: "ceil(" + size.signal + "/40)" };
    }
    return undefined;
}
exports.tickCount = tickCount;
function values(specifiedAxis, model, fieldDef, channel) {
    var vals = specifiedAxis.values;
    if (vals) {
        return fielddef_1.valueArray(fieldDef, vals);
    }
    if (fieldDef.type === type_1.QUANTITATIVE) {
        if (bin_1.isBinning(fieldDef.bin)) {
            var domain = model.scaleDomain(channel);
            if (domain && domain !== 'unaggregated' && !scale_1.isSelectionDomain(domain)) {
                // explicit value
                return vals;
            }
            var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
            return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
        }
        else if (specifiedAxis.tickStep) {
            var scaleName = model.scaleName(channel);
            var step = specifiedAxis.tickStep;
            return { signal: "sequence(domain('" + scaleName + "')[0], domain('" + scaleName + "')[1] + " + step + ", " + step + ")" };
        }
    }
    return undefined;
}
exports.values = values;
//# sourceMappingURL=properties.js.map