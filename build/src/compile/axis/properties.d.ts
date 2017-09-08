import { Axis } from '../../axis';
import { SpatialScaleChannel } from '../../channel';
import { Config } from '../../config';
import { DateTime } from '../../datetime';
import { FieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { VgSignalRef } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function domainAndTicks(property: 'domain' | 'ticks', specifiedAxis: Axis, isGridAxis: boolean, channel: SpatialScaleChannel): boolean;
export declare const domain: typeof domainAndTicks;
export declare const ticks: typeof domainAndTicks;
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export declare function grid(scaleType: ScaleType, fieldDef: FieldDef<string>): boolean;
export declare function gridScale(model: UnitModel, channel: SpatialScaleChannel, isGridAxis: boolean): string;
export declare function labelOverlap(fieldDef: FieldDef<string>, specifiedAxis: Axis, channel: SpatialScaleChannel, scaleType: ScaleType): true | "greedy";
export declare function minMaxExtent(specifiedExtent: number, isGridAxis: boolean): number;
export declare function orient(channel: SpatialScaleChannel): "left" | "bottom";
export declare function tickCount(channel: SpatialScaleChannel, fieldDef: FieldDef<string>, scaleType: ScaleType, size: VgSignalRef): {
    signal: string;
};
export declare function title(maxLength: number, fieldDef: FieldDef<string>, config: Config): string;
export declare function values(specifiedAxis: Axis, model: UnitModel, fieldDef: FieldDef<string>): number[] | DateTime[] | {
    signal: string;
}[];
export declare function zindex(isGridAxis: boolean): 1 | 0;
