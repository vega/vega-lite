"use strict";
var channel_1 = require("../../channel");
var common_1 = require("../common");
var common_2 = require("./common");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
var ref = require("./valueref");
exports.text = {
    vgMark: 'text',
    role: undefined,
    encodeEntry: function (model) {
        var e = {};
        common_1.applyConfig(e, model.config().text, ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
            'fontStyle', 'radius', 'theta', 'text']);
        var config = model.config();
        var stack = model.stack();
        var textDef = model.encoding().text;
        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        e.x = ref.stackable(channel_1.X, model.encoding().x, model.scaleName(channel_1.X), model.scale(channel_1.X), stack, xDefault(config, textDef));
        e.y = ref.stackable(channel_1.Y, model.encoding().y, model.scaleName(channel_1.Y), model.scale(channel_1.Y), stack, ref.midY(config));
        e.fontSize = ref.midPoint(channel_1.SIZE, model.encoding().size, model.scaleName(channel_1.SIZE), model.scale(channel_1.SIZE), { value: config.text.fontSize });
        e.text = textRef(textDef, config);
        common_2.applyColorAndOpacity(e, model);
        return e;
    }
};
function xDefault(config, textDef) {
    if (fielddef_1.isFieldDef(textDef) && textDef.type === type_1.QUANTITATIVE) {
        return { field: { group: 'width' }, offset: -5 };
    }
    // TODO: allow this to fit (Be consistent with ref.midX())
    return { value: config.scale.textXRangeStep / 2 };
}
function textRef(textDef, config) {
    // text
    if (textDef) {
        if (fielddef_1.isFieldDef(textDef)) {
            if (type_1.QUANTITATIVE === textDef.type) {
                // FIXME: what happens if we have bin?
                var format = common_1.numberFormat(textDef, config.text.format, config, channel_1.TEXT);
                return {
                    signal: "format(" + fielddef_1.field(textDef, { datum: true }) + ", '" + format + "')"
                };
            }
            else if (type_1.TEMPORAL === textDef.type) {
                return {
                    signal: common_1.timeFormatExpression(fielddef_1.field(textDef, { datum: true }), textDef.timeUnit, config.text.format, config.text.shortTimeLabels, config)
                };
            }
            else {
                return { field: textDef.field };
            }
        }
        else if (textDef.value) {
            return { value: textDef.value };
        }
    }
    return { value: config.text.text };
}
exports.textRef = textRef;
//# sourceMappingURL=text.js.map