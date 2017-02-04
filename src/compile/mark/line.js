"use strict";
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var common_1 = require("../common");
var common_2 = require("./common");
var ref = require("./valueref");
exports.line = {
    vgMark: 'line',
    role: undefined,
    encodeEntry: function (model) {
        var e = {};
        var config = model.config();
        var stack = model.stack();
        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        e.x = ref.stackable(channel_1.X, model.encoding().x, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, 'base');
        e.y = ref.stackable(channel_1.Y, model.encoding().y, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, 'base');
        var _size = size(model.encoding().size, config);
        if (_size) {
            e.strokeWidth = _size;
        }
        common_2.applyColorAndOpacity(e, model);
        common_1.applyMarkConfig(e, model, ['interpolate', 'tension']);
        return e;
    }
};
// FIXME: replace this with normal size and throw warning if the size field is not the grouping field instead?
// NOTE: This is different from other size because
// Vega does not support variable line size.
function size(sizeDef, config) {
    if (fielddef_1.isValueDef(sizeDef)) {
        return { value: sizeDef.value };
    }
    // FIXME: We should not need this line since this should be taken care by applyColorAndOpacity
    // but we have to refactor \ first
    return { value: config.mark.strokeWidth };
}
//# sourceMappingURL=line.js.map