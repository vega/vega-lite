import { Align, AxisOrient, SignalRef } from 'vega';
import { Axis } from '../../axis';
import { PositionScaleChannel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { UnitModel } from '../unit';
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export declare function grid(scaleType: ScaleType, fieldDef: FieldDef<string>): boolean;
export declare function gridScale(model: UnitModel, channel: PositionScaleChannel): string;
export declare function labelAngle(model: UnitModel, specifiedAxis: Axis, channel: PositionScaleChannel, fieldDef: FieldDef<string>): number;
export declare function labelBaseline(angle: number, axisOrient: AxisOrient): "top" | "middle" | "bottom";
export declare function labelAlign(angle: number, axisOrient: AxisOrient): Align;
export declare function labelFlush(fieldDef: FieldDef<string>, channel: PositionScaleChannel, specifiedAxis: Axis): number | boolean;
export declare function labelOverlap(fieldDef: FieldDef<string>, specifiedAxis: Axis, channel: PositionScaleChannel, scaleType: ScaleType): import("vega-typings/types/spec/axis").LabelOverlap;
export declare function orient(channel: PositionScaleChannel): "left" | "bottom";
export declare function tickCount(channel: PositionScaleChannel, fieldDef: FieldDef<string>, scaleType: ScaleType, size: SignalRef, scaleName: string, specifiedAxis: Axis): {
    signal: string;
};
export declare function values(specifiedAxis: Axis, model: UnitModel, fieldDef: FieldDef<string>, channel: PositionScaleChannel): (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[] | {
    signal: string;
};
