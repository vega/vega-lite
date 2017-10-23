import { NonPositionScaleChannel, PositionScaleChannel, ScaleChannel } from './channel';
export declare type ResolveMode = 'independent' | 'shared';
/**
 * Defines how scales, axes, and legends from different specs should be combined. Resolve is a mapping from `scale`, `axis`, and `legend` to a mapping from channels to resolutions.
 */
export interface Resolve {
    scale?: ScaleResolveMap;
    axis?: AxisResolveMap;
    legend?: LegendResolveMap;
}
export declare type ScaleResolveMap = {
    [C in ScaleChannel]?: ResolveMode;
};
export declare type AxisResolveMap = {
    [C in PositionScaleChannel]?: ResolveMode;
};
export declare type LegendResolveMap = {
    [C in NonPositionScaleChannel]?: ResolveMode;
};
