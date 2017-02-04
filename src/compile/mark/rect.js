"use strict";
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var mark_1 = require("../../mark");
var util_1 = require("../../util");
var log = require("../../log");
var common_1 = require("./common");
var ref = require("./valueref");
exports.rect = {
    vgMark: 'rect',
    role: undefined,
    encodeEntry: function (model) {
        var e = util_1.extend(x(model), y(model));
        common_1.applyColorAndOpacity(e, model);
        return e;
    }
};
function x(model) {
    var e = {};
    var xDef = model.encoding().x;
    var x2Def = model.encoding().x2;
    var xScaleName = model.scaleName(channel_1.X);
    var xScale = model.scale(channel_1.X);
    if (fielddef_1.isFieldDef(xDef) && xDef.bin && !x2Def) {
        e.x2 = ref.bin(xDef, xScaleName, 'start');
        e.x = ref.bin(xDef, xScaleName, 'end');
    }
    else if (xScale && scale_1.hasDiscreteDomain(xScale.type)) {
        /* istanbul ignore else */
        if (xScale.type === scale_1.ScaleType.BAND) {
            e.x = ref.fieldRef(xDef, xScaleName, {});
            e.width = ref.band(xScaleName);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, xScale.type));
        }
    }
    else {
        e.x = ref.midPoint(channel_1.X, xDef, xScaleName, xScale, 'baseOrMax');
        e.x2 = ref.midPoint(channel_1.X2, x2Def, xScaleName, xScale, 'base');
    }
    return e;
}
function y(model) {
    var e = {};
    var yDef = model.encoding().y;
    var y2Def = model.encoding().y2;
    var yScaleName = model.scaleName(channel_1.Y);
    var yScale = model.scale(channel_1.Y);
    if (fielddef_1.isFieldDef(yDef) && yDef.bin && !y2Def) {
        e.y2 = ref.bin(yDef, yScaleName, 'start');
        e.y = ref.bin(yDef, yScaleName, 'end');
    }
    else if (yScale && scale_1.hasDiscreteDomain(yScale.type)) {
        /* istanbul ignore else */
        if (yScale.type === scale_1.ScaleType.BAND) {
            e.y = ref.fieldRef(yDef, yScaleName, {});
            e.height = ref.band(yScaleName);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, yScale.type));
        }
    }
    else {
        e.y = ref.midPoint(channel_1.Y, yDef, yScaleName, yScale, 'baseOrMax');
        e.y2 = ref.midPoint(channel_1.Y2, y2Def, yScaleName, yScale, 'base');
    }
    return e;
}
//# sourceMappingURL=rect.js.map