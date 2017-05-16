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
    color?: NonspatialResolve;
    opacity?: NonspatialResolve;
    size?: NonspatialResolve;
    shape?: NonspatialResolve;
};
export declare function initLayerResolve(resolve: ResolveMapping): ResolveMapping;
