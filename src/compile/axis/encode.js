"use strict";
var channel_1 = require("../../channel");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
// TODO: @yuhanlu -- please change method signature to require only what are really needed
function domain(model, channel, domainPropsSpec, _) {
    var axis = model.axis(channel);
    return util_1.extend(axis.axisColor !== undefined ?
        { stroke: { value: axis.axisColor } } :
        {}, axis.axisWidth !== undefined ?
        { strokeWidth: { value: axis.axisWidth } } :
        {}, domainPropsSpec || {});
}
exports.domain = domain;
// TODO: @yuhanlu -- please change method signature to require only what are really needed
function grid(model, channel, gridPropsSpec, _) {
    var axis = model.axis(channel);
    return util_1.extend(axis.gridColor !== undefined ? { stroke: { value: axis.gridColor } } : {}, axis.gridOpacity !== undefined ? { strokeOpacity: { value: axis.gridOpacity } } : {}, axis.gridWidth !== undefined ? { strokeWidth: { value: axis.gridWidth } } : {}, axis.gridDash !== undefined ? { strokeDashOffset: { value: axis.gridDash } } : {}, gridPropsSpec || {});
}
exports.grid = grid;
// TODO: @yuhanlu -- please change method signature to require only what are really needed
function labels(model, channel, labelsSpec, def) {
    var fieldDef = model.fieldDef(channel);
    var axis = model.axis(channel);
    var config = model.config();
    // Text
    if (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) && axis.labelMaxLength) {
        // TODO replace this with Vega's labelMaxLength once it is introduced
        labelsSpec = util_1.extend({
            text: {
                signal: "truncate(datum.value, " + axis.labelMaxLength + ")"
            }
        }, labelsSpec || {});
    }
    else if (fieldDef.type === type_1.TEMPORAL) {
        labelsSpec = util_1.extend({
            text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, axis.shortTimeLabels, config)
            }
        }, labelsSpec);
    }
    // Label Angle
    if (axis.labelAngle !== undefined) {
        labelsSpec.angle = { value: axis.labelAngle };
    }
    else {
        // auto rotate for X
        if (channel === channel_1.X && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === type_1.TEMPORAL)) {
            labelsSpec.angle = { value: 270 };
        }
    }
    if (axis.labelAlign !== undefined) {
        labelsSpec.align = { value: axis.labelAlign };
    }
    else {
        // Auto set align if rotated
        // TODO: consider other value besides 270, 90
        if (labelsSpec.angle) {
            if (labelsSpec.angle.value === 270) {
                labelsSpec.align = {
                    value: def.orient === 'top' ? 'left' :
                        (channel === channel_1.X || channel === channel_1.COLUMN) ? 'right' :
                            'center'
                };
            }
            else if (labelsSpec.angle.value === 90) {
                labelsSpec.align = { value: 'center' };
            }
        }
    }
    if (axis.labelBaseline !== undefined) {
        labelsSpec.baseline = { value: axis.labelBaseline };
    }
    else {
        if (labelsSpec.angle) {
            // Auto set baseline if rotated
            // TODO: consider other value besides 270, 90
            if (labelsSpec.angle.value === 270) {
                labelsSpec.baseline = { value: (channel === channel_1.X || channel === channel_1.COLUMN) ? 'middle' : 'bottom' };
            }
            else if (labelsSpec.angle.value === 90) {
                labelsSpec.baseline = { value: 'bottom' };
            }
        }
    }
    if (axis.tickLabelColor !== undefined) {
        labelsSpec.fill = { value: axis.tickLabelColor };
    }
    if (axis.tickLabelFont !== undefined) {
        labelsSpec.font = { value: axis.tickLabelFont };
    }
    if (axis.tickLabelFontSize !== undefined) {
        labelsSpec.fontSize = { value: axis.tickLabelFontSize };
    }
    return util_1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
exports.labels = labels;
// TODO: @yuhanlu -- please change method signature to require only what are really needed
function ticks(model, channel, ticksPropsSpec, _) {
    var axis = model.axis(channel);
    return util_1.extend(axis.tickColor !== undefined ? { stroke: { value: axis.tickColor } } : {}, axis.tickWidth !== undefined ? { strokeWidth: { value: axis.tickWidth } } : {}, ticksPropsSpec || {});
}
exports.ticks = ticks;
// TODO: @yuhanlu -- please change method signature to require only what are really needed
function title(model, channel, titlePropsSpec, _) {
    var axis = model.axis(channel);
    return util_1.extend(axis.titleColor !== undefined ? { fill: { value: axis.titleColor } } : {}, axis.titleFont !== undefined ? { font: { value: axis.titleFont } } : {}, axis.titleFontSize !== undefined ? { fontSize: { value: axis.titleFontSize } } : {}, axis.titleFontWeight !== undefined ? { fontWeight: { value: axis.titleFontWeight } } : {}, titlePropsSpec || {});
}
exports.title = title;
//# sourceMappingURL=encode.js.map