import { Axis as VgAxis } from 'vega';
import { Axis, AxisPart, BaseAxisNoSignals, ConditionalAxisProp, ConditionalAxisProperty } from '../../axis';
import { FieldDefBase } from '../../channeldef';
import { Omit } from '../../util';
import { Split } from '../split';
export declare type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp> & {
    title: string | FieldDefBase<string>[];
    labelExpr: string;
} & {
    [k in ConditionalAxisProp]?: BaseAxisNoSignals[k] | ConditionalAxisProperty<BaseAxisNoSignals[k]>;
};
export declare const AXIS_COMPONENT_PROPERTIES: ("ticks" | "values" | "title" | "scale" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelOpacity" | "gridColor" | "gridDash" | "gridDashOffset" | "gridOpacity" | "gridWidth" | "tickColor" | "tickDash" | "tickDashOffset" | "tickOpacity" | "tickWidth" | "grid" | "labelFlush" | "labelOverlap" | "minExtent" | "maxExtent" | "bandPosition" | "titlePadding" | "titleAlign" | "titleAnchor" | "titleAngle" | "titleX" | "titleY" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleOpacity" | "domain" | "domainDash" | "domainDashOffset" | "domainColor" | "domainOpacity" | "domainWidth" | "tickExtra" | "tickOffset" | "tickRound" | "tickSize" | "labels" | "labelBound" | "labelFlushOffset" | "labelSeparation" | "labelAngle" | "labelLimit" | "labelPadding" | "orient" | "offset" | "format" | "formatType" | "gridScale" | "position" | "tickCount" | "tickMinStep" | "zindex" | "encode" | "labelExpr")[];
export declare class AxisComponent extends Split<AxisComponentProps> {
    readonly explicit: Partial<AxisComponentProps>;
    readonly implicit: Partial<AxisComponentProps>;
    mainExtracted: boolean;
    constructor(explicit?: Partial<AxisComponentProps>, implicit?: Partial<AxisComponentProps>, mainExtracted?: boolean);
    clone(): AxisComponent;
    hasAxisPart(part: AxisPart): boolean;
}
export interface AxisComponentIndex {
    x?: AxisComponent[];
    y?: AxisComponent[];
}
export interface AxisIndex {
    x?: Axis;
    y?: Axis;
}
//# sourceMappingURL=component.d.ts.map