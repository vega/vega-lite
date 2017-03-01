"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var log = require("../../log");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.bar = {
    vgMark: 'rect',
    role: 'bar',
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
            if (xDef.bin && !sizeDef) {
                // TODO: check scale type = linear
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
//# sourceMappingURL=bar.js.map