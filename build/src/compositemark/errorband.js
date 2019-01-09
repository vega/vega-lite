import * as log from '../log';
import { keys } from '../util';
import { makeCompositeAggregatePartFactory } from './common';
import { errorBarParams } from './errorbar';
export const ERRORBAND = 'errorband';
const ERRORBAND_PART_INDEX = {
    band: 1,
    borders: 1
};
export const ERRORBAND_PARTS = keys(ERRORBAND_PART_INDEX);
export function normalizeErrorBand(spec, config) {
    const { transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis, markDef, outerSpec, tooltipEncoding } = errorBarParams(spec, ERRORBAND, config);
    const makeErrorBandPart = makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorband);
    const is2D = spec.encoding.x !== undefined && spec.encoding.y !== undefined;
    let bandMark = { type: is2D ? 'area' : 'rect' };
    let bordersMark = { type: is2D ? 'line' : 'rule' };
    const interpolate = Object.assign({}, (markDef.interpolate ? { interpolate: markDef.interpolate } : {}), (markDef.tension && markDef.interpolate ? { interpolate: markDef.tension } : {}));
    if (is2D) {
        bandMark = Object.assign({}, bandMark, interpolate);
        bordersMark = Object.assign({}, bordersMark, interpolate);
    }
    else if (markDef.interpolate) {
        log.warn(log.message.errorBand1DNotSupport('interpolate'));
    }
    else if (markDef.tension) {
        log.warn(log.message.errorBand1DNotSupport('tension'));
    }
    return Object.assign({}, outerSpec, { transform, layer: [
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