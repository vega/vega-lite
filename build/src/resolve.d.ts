import { NonspatialScaleChannel } from './channel';
export declare type ResolveMode = 'independent' | 'shared';
export interface SpatialResolve {
    scale?: ResolveMode;
    axis?: ResolveMode;
}
export interface NonspatialResolve {
    scale?: ResolveMode;
    legend?: ResolveMode;
}
export declare type Resolve = SpatialResolve | NonspatialResolve;
export declare type ResolveMapping = {
    x?: SpatialResolve;
    y?: SpatialResolve;
} & {
    [C in NonspatialScaleChannel]?: NonspatialResolve;
};
export declare function initLayerResolve(resolve: ResolveMapping): ResolveMapping;
export declare function initConcatResolve(resolve: ResolveMapping): ResolveMapping;
export declare function initRepeatResolve(resolve: ResolveMapping): ResolveMapping;
export declare function initFacetResolve(resolve: ResolveMapping): ResolveMapping;
