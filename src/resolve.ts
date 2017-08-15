import {NonspatialScaleChannel, ScaleChannel, SpatialScaleChannel} from './channel';


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
