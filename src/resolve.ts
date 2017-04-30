import {NonspatialScaleChannel, SCALE_CHANNELS, SPATIAL_SCALE_CHANNELS, SpatialScaleChannel, UNIT_SCALE_CHANNELS} from './channel';
import * as log from './log';
import {contains} from './util';

export type ResolveMode = 'independent' | 'shared';

export interface SpatialResolve {
  scale: ResolveMode;
  axis?: ResolveMode;
}

export interface NonspatialResolve {
  scale: ResolveMode;
  legend?: ResolveMode;
}

export type Resolve = SpatialResolve | NonspatialResolve;

export function isSpatialResolve(resolve: Resolve): resolve is SpatialResolve {
  return 'axis' in resolve;
}

export function isNonspatialResolve(resolve: Resolve): resolve is NonspatialResolve {
  return 'legend' in resolve;
}

export type ResolveMapping = {[P in NonspatialScaleChannel]?: NonspatialResolve} | {[P in SpatialScaleChannel]?: SpatialResolve};

export function initLayerResolve(resolve: ResolveMapping): ResolveMapping {
  UNIT_SCALE_CHANNELS.forEach(channel => {
    const res: Resolve = resolve[channel] || {scale: 'shared'};
    const guide = contains(SPATIAL_SCALE_CHANNELS, channel) ? 'axis' : 'legend';

    if (res.scale === 'independent' && (
      (isSpatialResolve(res) && res.axis === 'shared') ||
      (isNonspatialResolve(res) && res.legend === 'shared'))) {
      log.warn(log.message.independentScaleMeansIndependentGuide(channel));
    }

    resolve[channel] = {
      scale: res.scale || 'shared',
      [guide]: res.scale === 'independent' ? 'independent' : (res[guide] || 'shared')
    };
  });

  return resolve;
}
