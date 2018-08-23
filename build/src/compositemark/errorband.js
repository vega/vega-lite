import * as tslib_1 from "tslib";
import * as log from '../log';
import { keys } from '../util';
import { makeCompositeAggregatePartFactory } from './common';
import { errorBarParams } from './errorbar';
export var ERRORBAND = 'errorband';
var ERRORBAND_PART_INDEX = {
    band: 1,
    borders: 1
};
export var ERRORBAND_PARTS = keys(ERRORBAND_PART_INDEX);
export function normalizeErrorBand(spec, config) {
    var _a = errorBarParams(spec, ERRORBAND, config), transform = _a.transform, continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis, encodingWithoutContinuousAxis = _a.encodingWithoutContinuousAxis, markDef = _a.markDef, outerSpec = _a.outerSpec;
    var makeErrorBandPart = makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorband);
    var is2D = spec.encoding.x !== undefined && spec.encoding.y !== undefined;
    var bandMark = { type: is2D ? 'area' : 'rect' };
    var bordersMark = { type: is2D ? 'line' : 'rule' };
    var interpolate = tslib_1.__assign({}, (markDef.interpolate ? { interpolate: markDef.interpolate } : {}), (markDef.tension && markDef.interpolate ? { interpolate: markDef.tension } : {}));
    if (is2D) {
        bandMark = tslib_1.__assign({}, bandMark, interpolate);
        bordersMark = tslib_1.__assign({}, bordersMark, interpolate);
    }
    else if (markDef.interpolate) {
        log.warn(log.message.errorBand1DNotSupport('interpolate'));
    }
    else if (markDef.tension) {
        log.warn(log.message.errorBand1DNotSupport('tension'));
    }
    return tslib_1.__assign({}, outerSpec, { transform: transform, layer: makeErrorBandPart('band', bandMark, 'lower', 'upper').concat(makeErrorBandPart('borders', bordersMark, 'lower'), makeErrorBandPart('borders', bordersMark, 'upper')) });
}
//# sourceMappingURL=errorband.js.map