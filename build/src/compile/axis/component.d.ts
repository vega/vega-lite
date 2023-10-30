import { Axis as VgAxis, SignalRef, Text } from 'vega';
import { AxisInternal, AxisPart, AxisPropsWithCondition, ConditionalAxisProp } from '../../axis';
import { FieldDefBase } from '../../channeldef';
import { Split } from '../split';
export type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp> & Omit<AxisPropsWithCondition<SignalRef>, 'title'> & {
    title: Text | FieldDefBase<string>[] | SignalRef;
    labelExpr: string;
    disable: boolean;
};
export declare const AXIS_COMPONENT_PROPERTIES: ("values" | "offset" | "grid" | "position" | "scale" | "translate" | "title" | "labels" | "description" | "encode" | "zindex" | "aria" | "orient" | "gridScale" | "format" | "formatType" | "tickCount" | "tickMinStep" | "titleAlign" | "titleAnchor" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleLineHeight" | "titleOpacity" | "titlePadding" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelLimit" | "labelOpacity" | "labelPadding" | "labelOffset" | "labelOverlap" | "labelSeparation" | "domain" | "ticks" | "gridColor" | "gridDash" | "gridDashOffset" | "gridOpacity" | "gridWidth" | "tickColor" | "tickDash" | "tickDashOffset" | "tickOpacity" | "tickSize" | "tickWidth" | "minExtent" | "maxExtent" | "bandPosition" | "titleAngle" | "titleX" | "titleY" | "domainCap" | "domainDash" | "domainDashOffset" | "domainColor" | "domainOpacity" | "domainWidth" | "tickBand" | "tickCap" | "tickExtra" | "tickOffset" | "tickRound" | "gridCap" | "labelBound" | "labelFlush" | "labelFlushOffset" | "labelLineHeight" | "labelAngle" | "labelExpr" | "disable")[];
export declare class AxisComponent extends Split<AxisComponentProps> {
    readonly explicit: Partial<AxisComponentProps>;
    readonly implicit: Partial<AxisComponentProps>;
    mainExtracted: boolean;
    constructor(explicit?: Partial<AxisComponentProps>, implicit?: Partial<AxisComponentProps>, mainExtracted?: boolean);
    clone(): AxisComponent;
    hasAxisPart(part: AxisPart): boolean;
    hasOrientSignalRef(): boolean;
}
export interface AxisComponentIndex {
    x?: AxisComponent[];
    y?: AxisComponent[];
}
export interface AxisInternalIndex {
    x?: AxisInternal;
    y?: AxisInternal;
}
//# sourceMappingURL=component.d.ts.map