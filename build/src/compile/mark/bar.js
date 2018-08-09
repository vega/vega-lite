"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var common_1 = require("../common");
var mixins = tslib_1.__importStar(require("./mixins"));
var ref = tslib_1.__importStar(require("./valueref"));
exports.bar = {
    vgMark: 'rect',
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), x(model), y(model));
    }
};
function x(model) {
    var config = model.config, encoding = model.encoding, markDef = model.markDef, width = model.width;
    var orient = markDef.orient;
    var sizeDef = encoding.size;
    var xDef = encoding.x;
    var x2Def = encoding.x2;
    var xScaleName = model.scaleName(channel_1.X);
    var xScale = model.getScaleComponent(channel_1.X);
    // x, x2, and width -- we must specify two of these in all conditions
    if (fielddef_1.isFieldDef(xDef) && bin_1.isBinned(xDef.bin)) {
        return mixins.binPosition(xDef, x2Def, channel_1.X, xScaleName, util_1.getFirstDefined(markDef.binSpacing, config.bar.binSpacing), xScale.get('reverse'));
    }
    else if (orient === 'horizontal' || x2Def) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
    else {
        // vertical
        if (fielddef_1.isFieldDef(xDef)) {
            var xScaleType = xScale.get('type');
            if (bin_1.isBinning(xDef.bin) && !sizeDef && !scale_1.hasDiscreteDomain(xScaleType)) {
                return mixins.binPosition(xDef, undefined, channel_1.X, model.scaleName('x'), util_1.getFirstDefined(markDef.binSpacing, config.bar.binSpacing), xScale.get('reverse'));
            }
            else {
                if (xScaleType === scale_1.ScaleType.BAND) {
                    return mixins.bandPosition(xDef, 'x', model);
                }
            }
        }
        // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
        return mixins.centeredBandPosition('x', model, tslib_1.__assign({}, ref.mid(width)), defaultSizeRef(markDef, xScaleName, xScale, config));
    }
}
function y(model) {
    var config = model.config, encoding = model.encoding, height = model.height, markDef = model.markDef;
    var orient = markDef.orient;
    var sizeDef = encoding.size;
    var yDef = encoding.y;
    var y2Def = encoding.y2;
    var yScaleName = model.scaleName(channel_1.Y);
    var yScale = model.getScaleComponent(channel_1.Y);
    // y, y2 & height -- we must specify two of these in all conditions
    if (fielddef_1.isFieldDef(yDef) && bin_1.isBinned(yDef.bin)) {
        return mixins.binPosition(yDef, y2Def, channel_1.Y, yScaleName, util_1.getFirstDefined(markDef.binSpacing, config.bar.binSpacing), yScale.get('reverse'));
    }
    else if (orient === 'vertical' || y2Def) {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
    else {
        if (fielddef_1.isFieldDef(yDef)) {
            var yScaleType = yScale.get('type');
            if (bin_1.isBinning(yDef.bin) && !sizeDef && !scale_1.hasDiscreteDomain(yScaleType)) {
                return mixins.binPosition(yDef, undefined, channel_1.Y, model.scaleName('y'), util_1.getFirstDefined(markDef.binSpacing, config.bar.binSpacing), yScale.get('reverse'));
            }
            else if (yScaleType === scale_1.ScaleType.BAND) {
                return mixins.bandPosition(yDef, 'y', model);
            }
        }
        return mixins.centeredBandPosition('y', model, ref.mid(height), defaultSizeRef(markDef, yScaleName, yScale, config));
    }
}
function defaultSizeRef(markDef, scaleName, scale, config) {
    if (markDef.size !== undefined) {
        return { value: markDef.size };
    }
    var sizeConfig = common_1.getMarkConfig('size', markDef, config, {
        // config.mark.size shouldn't affect bar size
        skipGeneralMarkConfig: true
    });
    if (sizeConfig !== undefined) {
        return { value: sizeConfig };
    }
    if (scale) {
        var scaleType = scale.get('type');
        if (scaleType === 'point' || scaleType === 'band') {
            if (config.bar.discreteBandSize !== undefined) {
                return { value: config.bar.discreteBandSize };
            }
            if (scaleType === scale_1.ScaleType.POINT) {
                var scaleRange = scale.get('range');
                if (vega_schema_1.isVgRangeStep(scaleRange) && vega_util_1.isNumber(scaleRange.step)) {
                    return { value: scaleRange.step - 1 };
                }
                log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
            }
            else {
                // BAND
                return ref.bandRef(scaleName);
            }
        }
        else {
            // continuous scale
            return { value: config.bar.continuousBandSize };
        }
    }
    // No Scale
    var value = util_1.getFirstDefined(
    // No scale is like discrete bar (with one item)
    config.bar.discreteBandSize, config.scale.rangeStep ? config.scale.rangeStep - 1 : undefined, 
    // If somehow default rangeStep is set to null or undefined, use 20 as back up
    20);
    return { value: value };
}
//# sourceMappingURL=bar.js.map