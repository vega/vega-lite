"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var mark_1 = require("../../mark");
var log = require("../../log");
var mixins = require("./mixins");
exports.rect = {
    vgMark: 'rect',
    role: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, x(model), y(model), mixins.color(model), mixins.nonPosition('opacity', model));
    }
};
function x(model) {
    var xDef = model.encoding.x;
    var x2Def = model.encoding.x2;
    var xScale = model.scale(channel_1.X);
    if (fielddef_1.isFieldDef(xDef) && xDef.bin && !x2Def) {
        return mixins.binnedPosition('x', model, 0);
    }
    else if (xScale && scale_1.hasDiscreteDomain(xScale.type)) {
        /* istanbul ignore else */
        if (xScale.type === scale_1.ScaleType.BAND) {
            return mixins.bandPosition('x', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, xScale.type));
        }
    }
    else {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
}
function y(model) {
    var yDef = model.encoding.y;
    var y2Def = model.encoding.y2;
    var yScale = model.scale(channel_1.Y);
    if (fielddef_1.isFieldDef(yDef) && yDef.bin && !y2Def) {
        return mixins.binnedPosition('y', model, 0);
    }
    else if (yScale && scale_1.hasDiscreteDomain(yScale.type)) {
        /* istanbul ignore else */
        if (yScale.type === scale_1.ScaleType.BAND) {
            return mixins.bandPosition('y', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, yScale.type));
        }
    }
    else {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
}
//# sourceMappingURL=rect.js.map