"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var common_1 = require("../common");
var mixins = require("./mixins");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
var ref = require("./valueref");
var encoding_1 = require("../../encoding");
exports.text = {
    vgMark: 'text',
    role: undefined,
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding;
        var textDef = encoding.text;
        return tslib_1.__assign({}, mixins.pointPosition('x', model, xDefault(config, textDef)), mixins.pointPosition('y', model, ref.midY(config)), mixins.text(model), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'fontSize' // VL's text size is fontSize
        }), mixins.valueIfDefined('align', align(encoding, config)));
    }
};
function xDefault(config, textDef) {
    if (fielddef_1.isFieldDef(textDef) && textDef.type === type_1.QUANTITATIVE) {
        return { field: { group: 'width' }, offset: -5 };
    }
    // TODO: allow this to fit (Be consistent with ref.midX())
    return { value: config.scale.textXRangeStep / 2 };
}
function align(encoding, config) {
    var alignConfig = common_1.getMarkConfig('align', 'text', config);
    if (alignConfig === undefined) {
        return encoding_1.channelHasField(encoding, channel_1.X) ? 'center' : 'right';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=text.js.map