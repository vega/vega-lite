import {isXorY, ScaleChannel} from '../channel';
import * as log from '../log';
import {Resolve, ResolveMode} from '../resolve';
import {isConcatModel, isFacetModel, isLayerModel, Model} from './model';

export function defaultScaleResolve(channel: ScaleChannel, model: Model): ResolveMode {
  if (isFacetModel(model)) {
    return channel === 'theta' ? 'independent' : 'shared';
  } else if (isLayerModel(model)) {
    return 'shared';
  } else if (isConcatModel(model)) {
    return isXorY(channel) || channel === 'theta' || channel === 'radius' ? 'independent' : 'shared';
  }
  /* istanbul ignore next: should never reach here. */
  throw new Error('invalid model type for resolve');
}

export function parseGuideResolve(resolve: Resolve, channel: ScaleChannel): ResolveMode {
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
