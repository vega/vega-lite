"use strict";
var mark_1 = require("../../mark");
var util = require("../../util");
var common_1 = require("../common");
var ref = require("./valueref");
function applyColorAndOpacity(e, model) {
    var config = model.config();
    var filled = config.mark.filled;
    // TODO: remove this once we correctly integrate theme
    // Apply fill stroke config first so that color field / value can override
    // fill / stroke
    if (filled) {
        common_1.applyMarkConfig(e, model, mark_1.FILL_CONFIG);
    }
    else {
        common_1.applyMarkConfig(e, model, mark_1.STROKE_CONFIG);
    }
    var colorRef = ref.midPoint('color', model.encoding().color, model.scaleName('color'), model.scale('color'), undefined);
    var opacityRef = ref.midPoint('opacity', model.encoding().opacity, model.scaleName('opacity'), model.scale('opacity'), config.mark.opacity && { value: config.mark.opacity });
    if (colorRef !== undefined) {
        if (filled) {
            e.fill = colorRef;
        }
        else {
            e.stroke = colorRef;
        }
    }
    else {
        // apply color config if there is no fill / stroke config
        e[filled ? 'fill' : 'stroke'] = e[filled ? 'fill' : 'stroke'] ||
            { value: model.config().mark.color };
    }
    // If there is no fill, always fill symbols
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
        e.fill = { value: 'transparent' };
    }
    if (opacityRef) {
        e.opacity = opacityRef;
    }
}
exports.applyColorAndOpacity = applyColorAndOpacity;
//# sourceMappingURL=common.js.map