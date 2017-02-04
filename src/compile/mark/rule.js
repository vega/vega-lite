"use strict";
var channel_1 = require("../../channel");
var common_1 = require("./common");
var ref = require("./valueref");
exports.rule = {
    vgMark: 'rule',
    role: undefined,
    encodeEntry: function (model) {
        var e = {};
        var orient = model.config().mark.orient;
        var config = model.config();
        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        var stack = model.stack();
        e.x = ref.stackable(channel_1.X, model.encoding().x, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, 'base');
        e.y = ref.stackable(channel_1.Y, model.encoding().y, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, 'base');
        if (orient === 'vertical') {
            e.y2 = ref.stackable2(channel_1.Y2, model.encoding().y, model.encoding().y2, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, 'baseOrMax');
        }
        else {
            e.x2 = ref.stackable2(channel_1.X2, model.encoding().x, model.encoding().x2, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, 'baseOrMax');
        }
        // FIXME: this function would overwrite strokeWidth but shouldn't
        common_1.applyColorAndOpacity(e, model);
        e.strokeWidth = ref.midPoint(channel_1.SIZE, model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), {
            value: config.rule.strokeWidth
        });
        return e;
    }
};
//# sourceMappingURL=rule.js.map