import {Channel, NONSPATIAL_SCALE_CHANNELS, SPATIAL_SCALE_CHANNELS, UNIT_SCALE_CHANNELS} from './channel';
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

// TODO: replace this with {[P in NonspatialScaleChannel]?: NonspatialResolve} & {[P in SpatialScaleChannel]?: SpatialResolve}; and make sure that the right schema is being generated
export type ResolveMapping = {
  // spatial channels
  x?: SpatialResolve
  y?: SpatialResolve
  // non-spatial channels
  color?: NonspatialResolve
  opacity?: NonspatialResolve
  size?: NonspatialResolve
  shape?: NonspatialResolve
};

function initResolve(resolve: ResolveMapping, defaultScaleResolve: (channel: Channel) => 'shared'| 'independent') {
  const out: ResolveMapping = {};
  UNIT_SCALE_CHANNELS.forEach(channel => {
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

export function initRepeatResolve(resolve: ResolveMapping): ResolveMapping {
  return initResolve(resolve, channel => (contains(NONSPATIAL_SCALE_CHANNELS, channel) ? 'shared' : 'independent'));
}
