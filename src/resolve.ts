import {Channel, NONSPATIAL_SCALE_CHANNELS, NonspatialScaleChannel, SCALE_CHANNELS, ScaleChannel, SPATIAL_SCALE_CHANNELS, SpatialScaleChannel} from './channel';
import * as log from './log';
import {contains} from './util';


export type ResolveMode = 'independent' | 'shared';

export interface Resolve {
  scale?: ScaleResolveMap;

  axis?: AxisResolveMap;

  legend?: LegendResolveMap;
}

export type ScaleResolveMap = {
  [C in ScaleChannel]?: ResolveMode
};

export type AxisResolveMap = {
  [C in SpatialScaleChannel]?: ResolveMode
};

export type LegendResolveMap = {
  [C in NonspatialScaleChannel]?: ResolveMode
};
