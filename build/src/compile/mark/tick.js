"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.tick = {
    vgMark: 'rect',
    role: 'tick',
    encodeEntry: function (model) {
        var config = model.config, markDef = model.markDef;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(config), 'xc'), mixins.pointPosition('y', model, ref.midY(config), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a), mixins.color(model), mixins.nonPosition('opacity', model));
        var _a;
    }
};
function defaultSize(model) {
    var config = model.config;
    var orient = model.markDef.orient;
    var scaleRangeStep = (model.scale(orient === 'horizontal' ? 'x' : 'y') || {}).rangeStep;
    if (config.tick.bandSize !== undefined) {
        return config.tick.bandSize;
    }
    else {
        var rangeStep = scaleRangeStep !== undefined ?
            scaleRangeStep :
            config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        return rangeStep / 1.5;
    }
}
//# sourceMappingURL=tick.js.map