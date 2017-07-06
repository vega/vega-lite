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

