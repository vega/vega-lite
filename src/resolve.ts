import {NonPositionScaleChannel, PositionScaleChannel, ScaleChannel} from './channel';


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
  [C in PositionScaleChannel]?: ResolveMode
};

export type LegendResolveMap = {
  [C in NonPositionScaleChannel]?: ResolveMode
};
