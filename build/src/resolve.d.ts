import { NonspatialScaleChannel, ScaleChannel, SpatialScaleChannel } from './channel';
export declare type ResolveMode = 'independent' | 'shared';
export interface Resolve {
    scale?: ScaleResolveMap;
    axis?: AxisResolveMap;
    legend?: LegendResolveMap;
}
export declare type ScaleResolveMap = {
    [C in ScaleChannel]?: ResolveMode;
};
export declare type AxisResolveMap = {
    [C in SpatialScaleChannel]?: ResolveMode;
};
export declare type LegendResolveMap = {
    [C in NonspatialScaleChannel]?: ResolveMode;
};
