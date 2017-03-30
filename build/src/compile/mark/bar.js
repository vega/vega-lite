"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var scale_1 = require("../../scale");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.bar = {
    vgMark: 'rect',
    defaultRole: 'bar',
    encodeEntry: function (model) {
        var stack = model.stack;
        return tslib_1.__assign({}, x(model, stack), y(model, stack), mixins.color(model), mixins.nonPosition('opacity', model));
    }
};
function x(model, stack) {
    var config = model.config;
    var orient = model.markDef.orient;
    var sizeDef = model.encoding.size;
    var xDef = model.encoding.x;
    var xScaleName = model.scaleName(channel_1.X);
    var xScale = model.scale(channel_1.X);
    // x, x2, and width -- we must specify two of these in all conditions
    if (orient === 'horizontal') {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'));
    }
    else {
        if (fielddef_1.isFieldDef(xDef)) {
            if (!sizeDef && scale_1.isBinScale(xScale.type)) {
                return mixins.binnedPosition('x', model, config.bar.binSpacing);
            }
            else if (xScale.type === scale_1.ScaleType.BAND) {
                return mixins.bandPosition('x', model);
            }
        }
        // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
        return mixins.centeredBandPosition('x', model, tslib_1.__assign({}, ref.midX(config), { offset: 1 }), // TODO: config.singleBarOffset,
        defaultSizeRef(xScaleName, model.scale(channel_1.X), config));
    }
}
function y(model, stack) {
    var config = model.config, encoding = model.encoding;
    var orient = model.markDef.orient;
    var sizeDef = encoding.size;
    var yDef = encoding.y;
    var yScaleName = model.scaleName(channel_1.Y);
    var yScale = model.scale(channel_1.Y);
    // y, y2 & height -- we must specify two of these in all conditions
    if (orient === 'vertical') {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'));
    }
    else {
        if (fielddef_1.isFieldDef(yDef)) {
            if (yDef.bin && !sizeDef) {
                return mixins.binnedPosition('y', model, config.bar.binSpacing);
            }
            else if (yScale.type === scale_1.ScaleType.BAND) {
                return mixins.bandPosition('y', model);
            }
        }
        return mixins.centeredBandPosition('y', model, ref.midY(config), defaultSizeRef(yScaleName, model.scale(channel_1.Y), config));
    }
}
function defaultSizeRef(scaleName, scale, config) {
    if (config.bar.discreteBandSize) {
        return { value: config.bar.discreteBandSize };
    }
    if (scale) {
        if (scale.type === scale_1.ScaleType.POINT) {
            if (scale.rangeStep !== null) {
                return { value: scale.rangeStep - 1 };
            }
            log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
        }
        else if (scale.type === scale_1.ScaleType.BAND) {
            return ref.band(scaleName);
        }
        else {
            return { value: config.bar.continuousBandSize };
        }
    }
    if (config.scale.rangeStep && config.scale.rangeStep !== null) {
        return { value: config.scale.rangeStep - 1 };
    }
    // TODO: this should depends on cell's width / height?
    return { value: 20 };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQW1DO0FBRW5DLDJDQUEwQztBQUMxQywrQkFBaUM7QUFDakMscUNBQXlEO0FBTXpELGlDQUFtQztBQUduQyxnQ0FBa0M7QUFFckIsUUFBQSxHQUFHLEdBQWlCO0lBQy9CLE1BQU0sRUFBRSxNQUFNO0lBQ2QsV0FBVyxFQUFFLEtBQUs7SUFDbEIsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQixNQUFNLHNCQUNELENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQ2YsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFDZixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUNuQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFDdkM7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLFdBQVcsS0FBZ0IsRUFBRSxLQUFzQjtJQUMxQyxJQUFBLHFCQUFNLENBQVU7SUFDdkIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFFcEMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDOUIsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQztJQUN0QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQUMsQ0FBQyxDQUFDO0lBQzlCLHFFQUFxRTtJQUNyRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztRQUM1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