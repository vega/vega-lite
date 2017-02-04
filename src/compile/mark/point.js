"use strict";
var channel_1 = require("../../channel");
var common_1 = require("./common");
var ref = require("./valueref");
function encodeEntry(model, fixedShape) {
    var e = {};
    var config = model.config();
    var markSpecificConfig = fixedShape ? config[fixedShape] : config.point;
    var stack = model.stack();
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    e.x = ref.stackable(channel_1.X, model.encoding().x, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, ref.midX(config));
    e.y = ref.stackable(channel_1.Y, model.encoding().y, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, ref.midY(config));
    e.size = ref.midPoint(channel_1.SIZE, model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), { value: markSpecificConfig.size });
    e.shape = shape(model.encoding().shape, model.scaleName(channel_1.SHAPE), model.scale(channel_1.SHAPE), config.point, fixedShape);
    common_1.applyColorAndOpacity(e, model);
    return e;
}
function shape(shapeDef, scaleName, scale, pointConfig, fixedShape) {
    // shape
    if (fixedShape) {
        return { value: fixedShape };
    }
    return ref.midPoint(channel_1.SHAPE, shapeDef, scaleName, scale, { value: pointConfig.shape });
}
exports.point = {
    vgMark: 'symbol',
    role: 'point',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
exports.circle = {
    vgMark: 'symbol',
    role: 'circle',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
exports.square = {
    vgMark: 'symbol',
    role: 'square',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=point.js.map