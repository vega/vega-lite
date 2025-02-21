import {isXorY, ScaleChannel} from '../channel.js';
import * as log from '../log/index.js';
import {Resolve, ResolveMode} from '../resolve.js';
import {isConcatModel, isFacetModel, isLayerModel, Model} from './model.js';

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
    if ((resolve[guide] as any)[channel] === 'shared') {
      log.warn(log.message.independentScaleMeansIndependentGuide(channel));
    }
    return 'independent';
  }

  return (resolve[guide] as any)[channel] || 'shared';
}
