import { POSITION_SCALE_CHANNELS } from '../channel';
import * as log from '../log';
import { contains } from '../util';
import { isConcatModel, isFacetModel, isLayerModel, isRepeatModel } from './model';
export function defaultScaleResolve(channel, model) {
    if (isLayerModel(model) || isFacetModel(model)) {
        return 'shared';
    }
    else if (isConcatModel(model) || isRepeatModel(model)) {
        return contains(POSITION_SCALE_CHANNELS, channel) ? 'independent' : 'shared';
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('invalid model type for resolve');
}
export function parseGuideResolve(resolve, channel) {
    const channelScaleResolve = resolve.scale[channel];
    const guide = contains(POSITION_SCALE_CHANNELS, channel) ? 'axis' : 'legend';
    if (channelScaleResolve === 'independent') {
        if (resolve[guide][channel] === 'shared') {
            log.warn(log.message.independentScaleMeansIndependentGuide(channel));
        }
        return 'independent';
    }
    return resolve[guide][channel] || 'shared';
}
//# sourceMappingURL=resolve.js.map