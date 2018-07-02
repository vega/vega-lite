import * as tslib_1 from "tslib";
import { isNumber } from 'vega-util';
import { X, Y } from '../../channel';
import { isFieldDef } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain, ScaleType } from '../../scale';
import { isVgRangeStep } from '../../vega.schema';
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
    if (orient === 'horizontal' || x2Def) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
    else { // vertical
        if (isFieldDef(xDef)) {
            var xScaleType = xScale.get('type');
            if (xDef.bin && !sizeDef && !hasDiscreteDomain(xScaleType)) {
                return mixins.binnedPosition(xDef, 'x', model.scaleName('x'), markDef.binSpacing === undefined ? config.bar.binSpacing : markDef.binSpacing, xScale.get('reverse'));
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
    if (orient === 'vertical' || y2Def) {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
    else {
        if (isFieldDef(yDef)) {
            var yScaleType = yScale.get('type');
            if (yDef.bin && !sizeDef && !hasDiscreteDomain(yScaleType)) {
                return mixins.binnedPosition(yDef, 'y', model.scaleName('y'), markDef.binSpacing === undefined ? config.bar.binSpacing : markDef.binSpacing, yScale.get('reverse'));
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
    else if (config.bar.discreteBandSize) {
        return { value: config.bar.discreteBandSize };
    }
    else if (scale) {
        var scaleType = scale.get('type');
        if (scaleType === ScaleType.POINT) {
            var scaleRange = scale.get('range');
            if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
                return { value: scaleRange.step - 1 };
            }
            log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
        }
        else if (scaleType === ScaleType.BAND) {
            return ref.bandRef(scaleName);
        }
        else { // non-ordinal scale
            return { value: config.bar.continuousBandSize };
        }
    }
    else if (config.scale.rangeStep && config.scale.rangeStep !== null) {
        return { value: config.scale.rangeStep - 1 };
    }
    return { value: 20 };
}
//# sourceMappingURL=bar.js.map