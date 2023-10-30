import { normalizeEncoding } from '../encoding';
import * as log from '../log';
import { CompositeMarkNormalizer } from './base';
import { makeCompositeAggregatePartFactory } from './common';
import { errorBarParams } from './errorbar';
export const ERRORBAND = 'errorband';
export const ERRORBAND_PARTS = ['band', 'borders'];
export const errorBandNormalizer = new CompositeMarkNormalizer(ERRORBAND, normalizeErrorBand);
export function normalizeErrorBand(spec, { config }) {
    // Need to initEncoding first so we can infer type
    spec = {
        ...spec,
        encoding: normalizeEncoding(spec.encoding, config)
    };
    const { transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis, markDef, outerSpec, tooltipEncoding } = errorBarParams(spec, ERRORBAND, config);
    const errorBandDef = markDef;
    const makeErrorBandPart = makeCompositeAggregatePartFactory(errorBandDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorband);
    const is2D = spec.encoding.x !== undefined && spec.encoding.y !== undefined;
    let bandMark = { type: is2D ? 'area' : 'rect' };
    let bordersMark = { type: is2D ? 'line' : 'rule' };
    const interpolate = {
        ...(errorBandDef.interpolate ? { interpolate: errorBandDef.interpolate } : {}),
        ...(errorBandDef.tension && errorBandDef.interpolate ? { tension: errorBandDef.tension } : {})
    };
    if (is2D) {
        bandMark = {
            ...bandMark,
            ...interpolate,
            ariaRoleDescription: 'errorband'
        };
        bordersMark = {
            ...bordersMark,
            ...interpolate,
            aria: false
        };
    }
    else if (errorBandDef.interpolate) {
        log.warn(log.message.errorBand1DNotSupport('interpolate'));
    }
    else if (errorBandDef.tension) {
        log.warn(log.message.errorBand1DNotSupport('tension'));
    }
    return {
        ...outerSpec,
        transform,
        layer: [
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
        ]
    };
}
//# sourceMappingURL=errorband.js.map