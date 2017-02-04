"use strict";
var channel_1 = require("../../channel");
var common_1 = require("./common");
var ref = require("./valueref");
exports.tick = {
    vgMark: 'rect',
    role: 'tick',
    encodeEntry: function (model) {
        var e = {};
        var config = model.config();
        var stack = model.stack();
        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        e.xc = ref.stackable(channel_1.X, model.encoding().x, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, ref.midX(config));
        e.yc = ref.stackable(channel_1.Y, model.encoding().y, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, ref.midY(config));
        if (config.mark.orient === 'horizontal') {
            e.width = size(model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), config, (model.scale(channel_1.X) || {}).rangeStep);
            e.height = { value: config.tick.thickness };
        }
        else {
            e.width = { value: config.tick.thickness };
            e.height = size(model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), config, (model.scale(channel_1.Y) || {}).rangeStep);
        }
        common_1.applyColorAndOpacity(e, model);
        return e;
    }
};
function size(fieldDef, scaleName, scale, config, scaleRangeStep) {
    var defaultSize;
    if (config.tick.bandSize !== undefined) {
        defaultSize = config.tick.bandSize;
    }
    else {
        var rangeStep = scaleRangeStep !== undefined ?
            scaleRangeStep :
            config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        defaultSize = rangeStep / 1.5;
    }
    return ref.midPoint(channel_1.SIZE, fieldDef, scaleName, scale, { value: defaultSize });
}
//# sourceMappingURL=tick.js.map