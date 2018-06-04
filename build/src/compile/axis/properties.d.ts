import { Axis } from '../../axis';
import { PositionScaleChannel } from '../../channel';
import { Config } from '../../config';
import { DateTime } from '../../datetime';
import { FieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { VgSignalRef } from '../../vega.schema';
import { UnitModel } from '../unit';
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export declare function grid(scaleType: ScaleType, fieldDef: FieldDef<string>): boolean;
export declare function gridScale(model: UnitModel, channel: PositionScaleChannel): string;
export declare function labelFlush(fieldDef: FieldDef<string>, channel: PositionScaleChannel, specifiedAxis: Axis): number | boolean;
export declare function labelOverlap(fieldDef: FieldDef<string>, specifiedAxis: Axis, channel: PositionScaleChannel, scaleType: ScaleType): boolean | "parity" | "greedy";
export declare function orient(channel: PositionScaleChannel): "left" | "bottom";
export declare function tickCount(channel: PositionScaleChannel, fieldDef: FieldDef<string>, scaleType: ScaleType, size: VgSignalRef): {
    signal: string;
};
export declare function title(maxLength: number, fieldDef: FieldDef<string>, config: Config): string;
export declare function values(specifiedAxis: Axis, model: UnitModel, fieldDef: FieldDef<string>, channel: PositionScaleChannel): number[] | DateTime[] | {
    signal: string;
}[] | {
    signal: string;
};
