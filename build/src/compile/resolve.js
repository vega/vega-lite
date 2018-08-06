"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var log = tslib_1.__importStar(require("../log"));
var util_1 = require("../util");
var model_1 = require("./model");
function defaultScaleResolve(channel, model) {
    if (model_1.isLayerModel(model) || model_1.isFacetModel(model)) {
        return 'shared';
    }
    else if (model_1.isConcatModel(model) || model_1.isRepeatModel(model)) {
        return util_1.contains(channel_1.POSITION_SCALE_CHANNELS, channel) ? 'independent' : 'shared';
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('invalid model type for resolve');
}
exports.defaultScaleResolve = defaultScaleResolve;
function parseGuideResolve(resolve, channel) {
    var channelScaleResolve = resolve.scale[channel];
    var guide = util_1.contains(channel_1.POSITION_SCALE_CHANNELS, channel) ? 'axis' : 'legend';
    if (channelScaleResolve === 'independent') {
        if (resolve[guide][channel] === 'shared') {
            log.warn(log.message.independentScaleMeansIndependentGuide(channel));
        }
        return 'independent';
    }
    return resolve[guide][channel] || 'shared';
}
exports.parseGuideResolve = parseGuideResolve;
//# sourceMappingURL=resolve.js.map