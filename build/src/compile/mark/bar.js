import * as tslib_1 from "tslib";
import { isNumber } from 'vega-util';
import { isBinned, isBinning } from '../../bin';
import { X, Y } from '../../channel';
import { isFieldDef } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain, ScaleType } from '../../scale';
import { getFirstDefined } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
export var bar = {
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
    var xScaleName = model.scaleName(X);
    var xScale = model.getScaleComponent(X);
    // x, x2, and width -- we must specify two of these in all conditions
    if (isFieldDef(xDef) && isBinned(xDef.bin)) {
        return mixins.binPosition(xDef, x2Def, X, xScaleName, getFirstDefined(markDef.binSpacing, config.bar.binSpacing), xScale.get('reverse'));
    }
    else if (orient === 'horizontal' || x2Def) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
    else {
        // vertical
        if (isFieldDef(xDef)) {
            var xScaleType = xScale.get('type');
            if (isBinning(xDef.bin) && !sizeDef && !hasDiscreteDomain(xScaleType)) {
                return mixins.binPosition(xDef, undefined, X, model.scaleName('x'), getFirstDefined(markDef.binSpacing, config.bar.binSpacing), xScale.get('reverse'));
            }
            else {
                if (xScaleType === ScaleType.BAND) {
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
    var yScaleName = model.scaleName(Y);
    var yScale = model.getScaleComponent(Y);
    // y, y2 & height -- we must specify two of these in all conditions
    if (isFieldDef(yDef) && isBinned(yDef.bin)) {
        return mixins.binPosition(yDef, y2Def, Y, yScaleName, getFirstDefined(markDef.binSpacing, config.bar.binSpacing), yScale.get('reverse'));
    }
    else if (orient === 'vertical' || y2Def) {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
    else {
        if (isFieldDef(yDef)) {
            var yScaleType = yScale.get('type');
            if (isBinning(yDef.bin) && !sizeDef && !hasDiscreteDomain(yScaleType)) {
                return mixins.binPosition(yDef, undefined, Y, model.scaleName('y'), getFirstDefined(markDef.binSpacing, config.bar.binSpacing), yScale.get('reverse'));
            }
            else if (yScaleType === ScaleType.BAND) {
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
    var sizeConfig = getMarkConfig('size', markDef, config, {
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
            if (scaleType === ScaleType.POINT) {
                var scaleRange = scale.get('range');
                if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
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
    var value = getFirstDefined(
    // No scale is like discrete bar (with one item)
    config.bar.discreteBandSize, config.scale.rangeStep ? config.scale.rangeStep - 1 : undefined, 
    // If somehow default rangeStep is set to null or undefined, use 20 as back up
    20);
    return { value: value };
}
//# sourceMappingURL=bar.js.map