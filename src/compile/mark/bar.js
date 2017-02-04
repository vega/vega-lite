"use strict";
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var log = require("../../log");
var common_1 = require("./common");
var ref = require("./valueref");
exports.bar = {
    vgMark: 'rect',
    role: 'bar',
    encodeEntry: function (model) {
        var stack = model.stack();
        var e = util_1.extend(x(model, stack), y(model, stack));
        common_1.applyColorAndOpacity(e, model);
        return e;
    }
};
function x(model, stack) {
    var e = {};
    var config = model.config();
    var orient = model.config().mark.orient;
    var sizeDef = model.encoding().size;
    var xDef = model.encoding().x;
    var xScaleName = model.scaleName(channel_1.X);
    var xScale = model.scale(channel_1.X);
    // x, x2, and width -- we must specify two of these in all conditions
    if (orient === 'horizontal') {
        e.x = ref.stackable(channel_1.X, xDef, xScaleName, model.scale(channel_1.X), stack, 'base');
        e.x2 = ref.stackable2(channel_1.X2, xDef, model.encoding().x2, xScaleName, model.scale(channel_1.X), stack, 'base');
        return e;
    }
    else {
        if (fielddef_1.isFieldDef(xDef)) {
            if (xDef.bin && !sizeDef) {
                // TODO: check scale type = linear
                e.x2 = ref.bin(xDef, xScaleName, 'start', config.bar.binSpacing);
                e.x = ref.bin(xDef, xScaleName, 'end');
                return e;
            }
            else if (xScale.type === scale_1.ScaleType.BAND) {
                // TODO: band scale doesn't support size yet
                e.x = ref.fieldRef(xDef, xScaleName, {});
                e.width = ref.band(xScaleName);
                return e;
            }
        }
        // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
        e.xc = ref.midPoint(channel_1.X, xDef, xScaleName, model.scale(channel_1.X), util_1.extend(ref.midX(config), { offset: 1 }) // TODO: config.singleBarOffset
        );
        e.width = ref.midPoint(channel_1.SIZE, model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), defaultSizeRef(xScaleName, model.scale(channel_1.X), config));
        return e;
    }
}
function y(model, stack) {
    var e = {};
    var config = model.config();
    var orient = model.config().mark.orient;
    var sizeDef = model.encoding().size;
    var yDef = model.encoding().y;
    var yScaleName = model.scaleName(channel_1.Y);
    var yScale = model.scale(channel_1.Y);
    // y, y2 & height -- we must specify two of these in all conditions
    if (orient === 'vertical') {
        e.y = ref.stackable(channel_1.Y, model.encoding().y, yScaleName, model.scale(channel_1.Y), stack, 'base');
        e.y2 = ref.stackable2(channel_1.Y2, model.encoding().y, model.encoding().y2, yScaleName, model.scale(channel_1.Y), stack, 'base');
        return e;
    }
    else {
        if (fielddef_1.isFieldDef(yDef)) {
            if (yDef.bin && !sizeDef) {
                e.y2 = ref.bin(yDef, yScaleName, 'start');
                e.y = ref.bin(yDef, yScaleName, 'end', config.bar.binSpacing);
                return e;
            }
            else if (yScale.type === scale_1.ScaleType.BAND) {
                // TODO: band scale doesn't support size yet
                e.y = ref.fieldRef(yDef, yScaleName, {});
                e.height = ref.band(yScaleName);
                return e;
            }
        }
        e.yc = ref.midPoint(channel_1.Y, yDef, yScaleName, model.scale(channel_1.Y), ref.midY(config));
        e.height = ref.midPoint(channel_1.SIZE, model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), defaultSizeRef(yScaleName, model.scale(channel_1.Y), config));
        return e;
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