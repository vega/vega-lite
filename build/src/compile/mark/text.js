"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var common_1 = require("../common");
var mixins = tslib_1.__importStar(require("./mixins"));
var ref = tslib_1.__importStar(require("./valueref"));
exports.text = {
    vgMark: 'text',
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding, width = model.width, height = model.height, markDef = model.markDef;
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.text(model), mixins.nonPosition('size', model, tslib_1.__assign({}, (markDef.size ? { defaultValue: markDef.size } : {}), { vgChannel: 'fontSize' // VL's text size is fontSize
         })), mixins.valueIfDefined('align', align(model.markDef, encoding, config)));
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