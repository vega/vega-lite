import { Align, AxisOrient, SignalRef } from 'vega';
import { Axis } from '../../axis';
import { PositionScaleChannel } from '../../channel';
import { TypedFieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { UnitModel } from '../unit';
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export declare function defaultGrid(scaleType: ScaleType, fieldDef: TypedFieldDef<string>): boolean;
export declare function gridScale(model: UnitModel, channel: PositionScaleChannel): string;
export declare function labelAngle(model: UnitModel, specifiedAxis: Axis, channel: PositionScaleChannel, fieldDef: TypedFieldDef<string>): number;
export declare function defaultLabelBaseline(angle: number, axisOrient: AxisOrient): "top" | "middle" | "bottom";
export declare function defaultLabelAlign(angle: number, axisOrient: AxisOrient): Align;
export declare function defaultLabelFlush(fieldDef: TypedFieldDef<string>, channel: PositionScaleChannel): boolean;
export declare function defaultLabelOverlap(fieldDef: TypedFieldDef<string>, scaleType: ScaleType): true | "greedy";
export declare function orient(channel: PositionScaleChannel): "left" | "bottom";
export declare function defaultTickCount({ fieldDef, scaleType, size, scaleName, specifiedAxis }: {
    fieldDef: TypedFieldDef<string>;
    scaleType: ScaleType;
    size?: SignalRef;
    scaleName?: string;
    specifiedAxis?: Axis;
}): {
    signal: string;
};
export declare function values(specifiedAxis: Axis, model: UnitModel, fieldDef: TypedFieldDef<string>, channel: PositionScaleChannel): (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[] | {
    signal: string;
};
