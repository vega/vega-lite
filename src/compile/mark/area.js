"use strict";
var channel_1 = require("../../channel");
var common_1 = require("../common");
var common_2 = require("./common");
var ref = require("./valueref");
exports.area = {
    vgMark: 'area',
    role: undefined,
    encodeEntry: function (model) {
        var e = {};
        var config = model.config();
        // We should always have orient as we augment it in config.ts
        var orient = config.mark.orient;
        e.orient = { value: orient };
        var stack = model.stack();
        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        e.x = ref.stackable(channel_1.X, model.encoding().x, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, 'base');
        e.y = ref.stackable(channel_1.Y, model.encoding().y, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, 'base');
        // Have only x2 or y2 based on orientation
        if (orient === 'horizontal') {
            e.x2 = ref.stackable2(channel_1.X2, model.encoding().x, model.encoding().x2, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, 'base');
        }
        else {
            e.y2 = ref.stackable2(channel_1.Y2, model.encoding().y, model.encoding().y2, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, 'base');
        }
        common_2.applyColorAndOpacity(e, model);
        common_1.applyMarkConfig(e, model, ['interpolate', 'tension']);
        return e;
    }
};
//# sourceMappingURL=area.js.map