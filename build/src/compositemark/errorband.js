import * as log from '../log';
import { keys } from '../util';
import { CompositeMarkNormalizer } from './base';
import { makeCompositeAggregatePartFactory } from './common';
import { errorBarParams } from './errorbar';
export const ERRORBAND = 'errorband';
const ERRORBAND_PART_INDEX = {
    band: 1,
    borders: 1
};
export const ERRORBAND_PARTS = keys(ERRORBAND_PART_INDEX);
export const errorBandNormalizer = new CompositeMarkNormalizer(ERRORBAND, normalizeErrorBand);
export function normalizeErrorBand(spec, { config }) {
    const { transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis, markDef, outerSpec, tooltipEncoding } = errorBarParams(spec, ERRORBAND, config);
    const errorBandDef = markDef;
    const makeErrorBandPart = makeCompositeAggregatePartFactory(errorBandDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorband);
    const is2D = spec.encoding.x !== undefined && spec.encoding.y !== undefined;
    let bandMark = { type: is2D ? 'area' : 'rect' };
    let bordersMark = { type: is2D ? 'line' : 'rule' };
    const interpolate = Object.assign(Object.assign({}, (errorBandDef.interpolate ? { interpolate: errorBandDef.interpolate } : {})), (errorBandDef.tension && errorBandDef.interpolate ? { interpolate: errorBandDef.tension } : {}));
    if (is2D) {
        bandMark = Object.assign(Object.assign({}, bandMark), interpolate);
        bordersMark = Object.assign(Object.assign({}, bordersMark), interpolate);
    }
    else if (errorBandDef.interpolate) {
        log.warn(log.message.errorBand1DNotSupport('interpolate'));
    }
    else if (errorBandDef.tension) {
        log.warn(log.message.errorBand1DNotSupport('tension'));
    }
    return Object.assign(Object.assign({}, outerSpec), { transform, layer: [
            ...makeErrorBandPart({
                partName: 'band',
                mark: bandMark,
                positionPrefix: 'lower',
                endPositionPrefix: 'upper',
                extraEncoding: tooltipEncoding
            }),
            ...makeErrorBandPart({
                partName: 'borders',
                mark: bordersMark,
                positionPrefix: 'lower',
                extraEncoding: tooltipEncoding
            }),
            ...makeErrorBandPart({
                partName: 'borders',
                mark: bordersMark,
                positionPrefix: 'upper',
                extraEncoding: tooltipEncoding
            })
        ] });
}
//# sourceMappingURL=errorband.js.map