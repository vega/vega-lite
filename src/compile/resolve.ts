import {ScaleChannel, SPATIAL_SCALE_CHANNELS} from '../channel';
import * as log from '../log';
import {ResolveMapping, ResolveMode} from '../resolve';
import {contains} from '../util';
import {ConcatModel} from './concat';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {RepeatModel} from './repeat';

export function defaultScaleResolve(channel: ScaleChannel, model: Model): ResolveMode {
  if (model instanceof LayerModel || model instanceof FacetModel) {
    return 'shared';
  } else if (model instanceof ConcatModel || model instanceof RepeatModel) {
    return contains(SPATIAL_SCALE_CHANNELS, channel) ? 'independent' : 'shared';
  }
  /* istanbul ignore next: should never reach here. */
  throw new Error('invalid model type for resolve');
}

export function parseGuideResolve(resolve: ResolveMapping, channel: ScaleChannel): ResolveMode {
  const channelResolve = resolve[channel];
  const guide = contains(SPATIAL_SCALE_CHANNELS, channel) ? 'axis' : 'legend';

  if (channelResolve.scale === 'independent') {
    if (channelResolve[guide] === 'shared') {
      log.warn(log.message.independentScaleMeansIndependentGuide(channel));
    }
    return 'independent';
  }

  return channelResolve[guide] || 'shared';
}
