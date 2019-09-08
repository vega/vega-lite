import { Axis as VgAxis } from 'vega';
import { Axis, AxisPart, BaseAxisNoSignals, ConditionalAxisProp, ConditionalAxisProperty } from '../../axis';
import { FieldDefBase } from '../../channeldef';
import { Split } from '../split';
export declare type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp> & {
    title: string | FieldDefBase<string>[];
    labelExpr: string;
} & {
    [k in ConditionalAxisProp]?: BaseAxisNoSignals[k] | ConditionalAxisProperty<BaseAxisNoSignals[k]>;
};
export declare const AXIS_COMPONENT_PROPERTIES: ("values" | "scale" | "domain" | "format" | "orient" | "ticks" | "formatType" | "title" | "tickCount" | "tickMinStep" | "zindex" | "encode" | "offset" | "titleAlign" | "titleAnchor" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleOpacity" | "titlePadding" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelLimit" | "labelOpacity" | "labelPadding" | "labelOverlap" | "labelSeparation" | "labelExpr" | "titleAngle" | "labels" | "labelAngle" | "gridColor" | "gridDash" | "gridDashOffset" | "gridOpacity" | "gridWidth" | "tickColor" | "tickDash" | "tickDashOffset" | "tickOpacity" | "tickWidth" | "grid" | "labelFlush" | "minExtent" | "maxExtent" | "bandPosition" | "titleX" | "titleY" | "domainDash" | "domainDashOffset" | "domainColor" | "domainOpacity" | "domainWidth" | "tickExtra" | "tickOffset" | "tickRound" | "tickSize" | "labelBound" | "labelFlushOffset" | "gridScale" | "position")[];
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