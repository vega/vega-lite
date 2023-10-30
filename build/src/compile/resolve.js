import { isXorY } from '../channel';
import * as log from '../log';
import { isConcatModel, isFacetModel, isLayerModel } from './model';
export function defaultScaleResolve(channel, model) {
    if (isFacetModel(model)) {
        return channel === 'theta' ? 'independent' : 'shared';
    }
    else if (isLayerModel(model)) {
        return 'shared';
    }
    else if (isConcatModel(model)) {
        return isXorY(channel) || channel === 'theta' || channel === 'radius' ? 'independent' : 'shared';
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('invalid model type for resolve');
}
export function parseGuideResolve(resolve, channel) {
    const channelScaleResolve = resolve.scale[channel];
    const guide = isXorY(channel) ? 'axis' : 'legend';
    if (channelScaleResolve === 'independent') {
        if (resolve[guide][channel] === 'shared') {
            log.warn(log.message.independentScaleMeansIndependentGuide(channel));
        }
        return 'independent';
    }
    return resolve[guide][channel] || 'shared';
}
//# sourceMappingURL=resolve.js.map