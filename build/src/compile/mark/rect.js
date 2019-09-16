import { isNumber } from 'vega-util';
import { isBinned, isBinning } from '../../bin';
import { getBand, isFieldDef, isPositionFieldDef } from '../../channeldef';
import { DEFAULT_STEP, getViewConfigDiscreteStep } from '../../config';
import { hasDiscreteDomain, ScaleType } from '../../scale';
import { getFirstDefined } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
export const rect = {
    vgMark: 'rect',
    encodeEntry: (model) => {
        return Object.assign(Object.assign(Object.assign({}, mixins.baseEncodeEntry(model, {
            align: 'ignore',
            baseline: 'ignore',
            color: 'include',
            orient: 'ignore',
            size: 'ignore'
        })), rectPosition(model, 'x', 'rect')), rectPosition(model, 'y', 'rect'));
    }
};
export function rectPosition(model, channel, mark) {
    const { config, encoding, markDef } = model;
    const channel2 = channel === 'x' ? 'x2' : 'y2';
    const sizeChannel = channel === 'x' ? 'width' : 'height';
    const fieldDef = encoding[channel];
    const fieldDef2 = encoding[channel2];
    const scale = model.getScaleComponent(channel);
    const scaleType = scale ? scale.get('type') : undefined;
    const scaleName = model.scaleName(channel);
    const orient = markDef.orient;
    const hasSizeDef = encoding[sizeChannel] ||
        encoding.size ||
        markDef[sizeChannel] ||
        markDef.size ||
        getMarkConfig('size', markDef, config, { vgChannel: sizeChannel });
    const isBarBand = channel === 'x' ? orient === 'vertical' : orient === 'horizontal';
    // x, x2, and width -- we must specify two of these in all conditions
    if (isFieldDef(fieldDef) &&
        (isBinning(fieldDef.bin) || isBinned(fieldDef.bin) || (fieldDef.timeUnit && !fieldDef2)) &&
        !hasSizeDef &&
        !hasDiscreteDomain(scaleType)) {
        const band = getBand(channel, fieldDef, undefined, markDef, config);
        return mixins.binPosition({
            fieldDef,
            fieldDef2,
            channel,
            markDef,
            scaleName,
            band,
            spacing: getFirstDefined(markDef.binSpacing, config[mark].binSpacing),
            reverse: scale.get('reverse')
        });
    }
    else if (((isFieldDef(fieldDef) && hasDiscreteDomain(scaleType)) || isBarBand) && !fieldDef2) {
        // vertical
        if (isFieldDef(fieldDef) && scaleType === ScaleType.BAND) {
            const band = isPositionFieldDef(fieldDef) ? fieldDef.band : undefined;
            return mixins.bandPosition(fieldDef, channel, model, defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config, band));
        }
        // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
        return mixins.centeredPointPositionWithSize(channel, model, ref.mid(model[sizeChannel]), defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config));
    }
    else {
        return mixins.rangePosition(channel, model, { defaultRef: 'zeroOrMax', defaultRef2: 'zeroOrMin' });
    }
}
function defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config, band) {
    const markPropOrConfig = getFirstDefined(markDef[sizeChannel], markDef.size, 
    // TODO: deal with sizeChannel config
    getMarkConfig('size', markDef, config, { vgChannel: sizeChannel }));
    if (markPropOrConfig !== undefined) {
        return { value: markPropOrConfig };
    }
    if (scale) {
        const scaleType = scale.get('type');
        if (scaleType === 'point' || scaleType === 'band') {
            if (config[mark].discreteBandSize !== undefined) {
                return { value: config[mark].discreteBandSize };
            }
            if (scaleType === ScaleType.POINT) {
                const scaleRange = scale.get('range');
                if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
                    return { value: scaleRange.step - 2 };
                }
                return { value: DEFAULT_STEP - 2 };
            }
            else {
                // BAND
                return ref.bandRef(scaleName, band);
            }
        }
        else {
            // continuous scale
            return { value: config[mark].continuousBandSize };
        }
    }
    // No Scale
    const step = getViewConfigDiscreteStep(config.view, sizeChannel);
    const value = getFirstDefined(
    // No scale is like discrete bar (with one item)
    config[mark].discreteBandSize, step - 2);
    return { value };
}
//# sourceMappingURL=rect.js.map