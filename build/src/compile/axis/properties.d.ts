import { Align, AxisOrient, Orient, SignalRef } from 'vega';
import { AxisInternal } from '../../axis';
import { PositionScaleChannel } from '../../channel';
import { DatumDef, PositionDatumDef, PositionFieldDef, TypedFieldDef } from '../../channeldef';
import { Config, StyleConfigIndex } from '../../config';
import { Mark } from '../../mark';
import { Sort } from '../../sort';
import { Type } from '../../type';
import { guideFormatType } from '../format';
import { UnitModel } from '../unit';
import { ScaleType } from './../../scale';
import { AxisComponentProps } from './component';
import { AxisConfigs } from './config';
export interface AxisRuleParams {
    fieldOrDatumDef: PositionFieldDef<string> | PositionDatumDef<string>;
    axis: AxisInternal;
    channel: PositionScaleChannel;
    model: UnitModel;
    mark: Mark;
    scaleType: ScaleType;
    orient: Orient | SignalRef;
    labelAngle: number | SignalRef;
    format: string | SignalRef;
    formatType: ReturnType<typeof guideFormatType>;
    config: Config;
}
export declare const axisRules: {
    [k in keyof AxisComponentProps]?: (params: AxisRuleParams) => AxisComponentProps[k];
};
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export declare function defaultGrid(scaleType: ScaleType, fieldDef: TypedFieldDef<string> | DatumDef): boolean;
export declare function gridScale(model: UnitModel, channel: PositionScaleChannel): string;
export declare function getLabelAngle(fieldOrDatumDef: PositionFieldDef<string> | PositionDatumDef<string>, axis: AxisInternal, channel: PositionScaleChannel, styleConfig: StyleConfigIndex<SignalRef>, axisConfigs?: AxisConfigs): number | SignalRef;
export declare function normalizeAngleExpr(angle: SignalRef): string;
export declare function defaultLabelBaseline(angle: number | SignalRef, orient: AxisOrient | SignalRef, channel: 'x' | 'y', alwaysIncludeMiddle?: boolean): "bottom" | "middle" | "top" | {
    signal: string;
};
export declare function defaultLabelAlign(angle: number | SignalRef, orient: AxisOrient | SignalRef, channel: 'x' | 'y'): Align | SignalRef;
export declare function defaultLabelFlush(type: Type, channel: PositionScaleChannel): boolean;
export declare function defaultLabelOverlap(type: Type, scaleType: ScaleType, hasTimeUnit: boolean, sort?: Sort<string>): true | "greedy";
export declare function defaultOrient(channel: PositionScaleChannel): "left" | "bottom";
export declare function defaultTickCount({ fieldOrDatumDef, scaleType, size, values: vals }: {
    fieldOrDatumDef: TypedFieldDef<string> | DatumDef;
    scaleType: ScaleType;
    size?: SignalRef;
    values?: AxisInternal['values'];
}): {
    signal: string;
};
export declare function defaultTickMinStep({ format, fieldOrDatumDef }: Pick<AxisRuleParams, 'format' | 'fieldOrDatumDef'>): 1 | {
    signal: string;
};
export declare function getFieldDefTitle(model: UnitModel, channel: 'x' | 'y'): SignalRef | import("vega").Text;
export declare function values(axis: AxisInternal, fieldOrDatumDef: TypedFieldDef<string> | DatumDef): SignalRef | (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[];
export declare function defaultZindex(mark: Mark, fieldDef: TypedFieldDef<string> | DatumDef): 0 | 1;
//# sourceMappingURL=properties.d.ts.map