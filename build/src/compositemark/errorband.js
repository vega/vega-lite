"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = tslib_1.__importStar(require("../log"));
var util_1 = require("../util");
var common_1 = require("./common");
var errorbar_1 = require("./errorbar");
exports.ERRORBAND = 'errorband';
var ERRORBAND_PART_INDEX = {
    band: 1,
    borders: 1
};
exports.ERRORBAND_PARTS = util_1.keys(ERRORBAND_PART_INDEX);
function normalizeErrorBand(spec, config) {
    var _a = errorbar_1.errorBarParams(spec, exports.ERRORBAND, config), transform = _a.transform, continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis, encodingWithoutContinuousAxis = _a.encodingWithoutContinuousAxis, markDef = _a.markDef, outerSpec = _a.outerSpec;
    var makeErrorBandPart = common_1.makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorband);
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
exports.normalizeErrorBand = normalizeErrorBand;
//# sourceMappingURL=errorband.js.map