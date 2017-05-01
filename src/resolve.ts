import {NonspatialScaleChannel, SCALE_CHANNELS, SPATIAL_SCALE_CHANNELS, SpatialScaleChannel, UNIT_SCALE_CHANNELS} from './channel';
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

export function initLayerResolve(resolve: ResolveMapping): ResolveMapping {
  const out: ResolveMapping = {};
  UNIT_SCALE_CHANNELS.forEach(channel => {
    const res: Resolve = resolve[channel] || {scale: 'shared'};
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
