"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var common_1 = require("../common");
var mixins = tslib_1.__importStar(require("./mixins"));
var ref = tslib_1.__importStar(require("./valueref"));
exports.text = {
    vgMark: 'text',
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding, width = model.width, height = model.height, markDef = model.markDef;
        // We have to support mark property and config for both size and fontSize for text
        // - size is from original Vega-Lite, which allows users to easily transition from size channel of other marks to text.
        // - fontSize is from Vega and we need support it to make sure that all Vega configs all work correctly in Vega-Lite.
        // Precedence: markDef > style config > mark-specific config
        // For each of them, fontSize is more specific than size, thus has higher precedence
        var defaultValue = util_1.getFirstDefined(markDef.fontSize, markDef.size, common_1.getStyleConfig('fontSize', markDef, config.style), common_1.getStyleConfig('size', markDef, config.style), config[markDef.type].fontSize, config[markDef.type].size
        // general mark config shouldn't be used as they are only for point/circle/square
        );
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.text(model), mixins.nonPosition('size', model, {
            defaultValue: defaultValue,
            vgChannel: 'fontSize' // VL's text size is fontSize
        }), mixins.valueIfDefined('align', align(model.markDef, encoding, config)));
    }
};
function align(markDef, encoding, config) {
    var a = markDef.align || common_1.getMarkConfig('align', markDef, config);
    if (a === undefined) {
        return 'center';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=text.js.map