"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var mixins = tslib_1.__importStar(require("./mixins"));
exports.rect = {
    vgMark: 'rect',
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), x(model), y(model));
    }
};
function x(model) {
    var xDef = model.encoding.x;
    var x2Def = model.encoding.x2;
    var xScale = model.getScaleComponent(channel_1.X);
    var xScaleType = xScale ? xScale.get('type') : undefined;
    if (fielddef_1.isFieldDef(xDef) && xDef.bin && !x2Def) {
        return mixins.binnedPosition(xDef, 'x', model.scaleName('x'), 0, xScale.get('reverse'));
    }
    else if (fielddef_1.isFieldDef(xDef) && xScale && scale_1.hasDiscreteDomain(xScaleType)) {
        /* istanbul ignore else */
        if (xScaleType === scale_1.ScaleType.BAND) {
            return mixins.bandPosition(xDef, 'x', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, xScaleType));
        }
    }
    else { // continuous scale or no scale
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
}
exports.x = x;
function y(model) {
    var yDef = model.encoding.y;
    var y2Def = model.encoding.y2;
    var yScale = model.getScaleComponent(channel_1.Y);
    var yScaleType = yScale ? yScale.get('type') : undefined;
    if (fielddef_1.isFieldDef(yDef) && yDef.bin && !y2Def) {
        return mixins.binnedPosition(yDef, 'y', model.scaleName('y'), 0, yScale.get('reverse'));
    }
    else if (fielddef_1.isFieldDef(yDef) && yScale && scale_1.hasDiscreteDomain(yScaleType)) {
        /* istanbul ignore else */
        if (yScaleType === scale_1.ScaleType.BAND) {
            return mixins.bandPosition(yDef, 'y', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, yScaleType));
        }
    }
    else { // continuous scale or no scale
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
}
exports.y = y;
//# sourceMappingURL=rect.js.map