import { isNumber } from 'vega-util';
import { isBinned, isBinning } from '../../bin';
import { isFieldDef } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain, ScaleType } from '../../scale';
import { getFirstDefined } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
export const bar = {
    vgMark: 'rect',
    encodeEntry: (model) => {
        return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), barPosition(model, 'x'), barPosition(model, 'y'));
    }
};
function barPosition(model, channel) {
    const { config, encoding, markDef } = model;
    const orient = markDef.orient;
    const sizeDef = encoding.size;
    const isBarLength = channel === 'x' ? orient === 'horizontal' : orient === 'vertical';
    const channel2 = channel === 'x' ? 'x2' : 'y2';
    const fieldDef = encoding[channel];
    const fieldDef2 = encoding[channel2];
    const scaleName = model.scaleName(channel);
    const scale = model.getScaleComponent(channel);
    const spacing = getFirstDefined(markDef.binSpacing, config.bar.binSpacing);
    const reverse = scale ? scale.get('reverse') : undefined;
    const mark = 'bar';
    // x, x2, and width -- we must specify two of these in all conditions
    if (isFieldDef(fieldDef) && isBinned(fieldDef.bin)) {
        return mixins.binPosition({ fieldDef, fieldDef2, channel, mark, scaleName, spacing, reverse });
    }
    else if (isBarLength || fieldDef2) {
        return Object.assign({}, mixins.pointPosition(channel, model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', channel2));
    }
    else {
        // vertical
        if (isFieldDef(fieldDef)) {
            const scaleType = scale.get('type');
            if (isBinning(fieldDef.bin) && !sizeDef && !hasDiscreteDomain(scaleType)) {
                return mixins.binPosition({ fieldDef, channel, scaleName, mark, spacing, reverse });
            }
            else {
                if (scaleType === ScaleType.BAND) {
                    return mixins.bandPosition(fieldDef, channel, model);
                }
            }
        }
        // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
        return mixins.centeredPointPositionWithSize(channel, model, Object.assign({}, ref.mid(channel === 'x' ? model.width : model.height)), defaultSizeRef(markDef, scaleName, scale, config));
    }
}
function defaultSizeRef(markDef, scaleName, scale, config) {
    if (markDef.size !== undefined) {
        return { value: markDef.size };
    }
    const sizeConfig = getMarkConfig('size', markDef, config, {
        // config.mark.size shouldn't affect bar size
        skipGeneralMarkConfig: true
    });
    if (sizeConfig !== undefined) {
        return { value: sizeConfig };
    }
    if (scale) {
        const scaleType = scale.get('type');
        if (scaleType === 'point' || scaleType === 'band') {
            if (config.bar.discreteBandSize !== undefined) {
                return { value: config.bar.discreteBandSize };
            }
            if (scaleType === ScaleType.POINT) {
                const scaleRange = scale.get('range');
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
    const value = getFirstDefined(
    // No scale is like discrete bar (with one item)
    config.bar.discreteBandSize, config.scale.rangeStep ? config.scale.rangeStep - 1 : undefined, 
    // If somehow default rangeStep is set to null or undefined, use 20 as back up
    20);
    return { value };
}
//# sourceMappingURL=bar.js.map