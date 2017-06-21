import {Channel, NONSPATIAL_SCALE_CHANNELS, NonspatialScaleChannel, SCALE_CHANNELS, SPATIAL_SCALE_CHANNELS} from './channel';
import * as log from './log';
import {contains} from './util';


export type ResolveMode = 'independent' | 'shared';

export interface SpatialResolve {
  scale?: ResolveMode;
  axis?: ResolveMode;
}

export interface NonspatialResolve {
  scale?: ResolveMode;
  legend?: ResolveMode;
}

export type Resolve = SpatialResolve | NonspatialResolve;

export type ResolveMapping = {
  // Spatial channels
  x?: SpatialResolve
  y?: SpatialResolve
} & {
  // Non-spatial channels
  [C in NonspatialScaleChannel]?: NonspatialResolve
};

function initResolve(resolve: ResolveMapping, defaultScaleResolve: (channel: Channel) => 'shared'| 'independent') {
  const out: ResolveMapping = {};
  SCALE_CHANNELS.forEach(channel => {
    const res: Resolve = resolve[channel] || {scale: defaultScaleResolve(channel)};
    const guide = contains(SPATIAL_SCALE_CHANNELS, channel) ? 'axis' : 'legend';

    if (res.scale === 'independent' && (res['axis'] === 'shared' || res['legend'] === 'shared')) {
      log.warn(log.message.independentScaleMeansIndependentGuide(channel));
    }

    out[channel] = {
      scale: res.scale || 'shared',
      [guide]: res.scale === 'independent' ? 'independent' : (res[guide] || 'shared')
    };
  });

  return out;
}

export function initLayerResolve(resolve: ResolveMapping): ResolveMapping {
  return initResolve(resolve, channel => 'shared');
}

export function initConcatResolve(resolve: ResolveMapping): ResolveMapping {
  return initResolve(resolve, channel => 'independent');
}

export function initRepeatResolve(resolve: ResolveMapping): ResolveMapping {
  return initResolve(resolve, channel => (contains(NONSPATIAL_SCALE_CHANNELS, channel) ? 'shared' : 'independent'));
}

export function initFacetResolve(resolve: ResolveMapping): ResolveMapping {
  return initResolve(resolve, channel => 'shared');
}
