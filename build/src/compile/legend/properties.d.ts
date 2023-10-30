import { LabelOverlap, LegendOrient, LegendType, Orientation, SignalRef, SymbolShape } from 'vega';
import { DatumDef, MarkPropFieldOrDatumDef, TypedFieldDef } from '../../channeldef';
import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { Legend, LegendConfig, LegendInternal } from '../../legend';
import { Mark, MarkDef } from '../../mark';
import { ScaleType } from '../../scale';
import { TimeUnit } from '../../timeunit';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { NonPositionScaleChannel } from './../../channel';
import { LegendComponentProps } from './component';
export interface LegendRuleParams {
    legend: LegendInternal;
    channel: NonPositionScaleChannel;
    model: UnitModel;
    markDef: MarkDef<Mark, SignalRef>;
    encoding: Encoding<string>;
    fieldOrDatumDef: MarkPropFieldOrDatumDef<string>;
    legendConfig: LegendConfig<SignalRef>;
    config: Config<SignalRef>;
    scaleType: ScaleType;
    orient: LegendOrient;
    legendType: LegendType;
    direction: Orientation;
}
export declare const legendRules: {
    [k in keyof LegendComponentProps]?: (params: LegendRuleParams) => LegendComponentProps[k];
};
export declare function values(legend: LegendInternal, fieldOrDatumDef: TypedFieldDef<string> | DatumDef): SignalRef | (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[];
export declare function defaultSymbolType(mark: Mark, channel: NonPositionScaleChannel, shapeChannelDef: Encoding<string>['shape'], markShape: SymbolShape | SignalRef): SymbolShape | SignalRef;
export declare function clipHeight(legendType: LegendType): number;
export declare function getLegendType(params: {
    legend: LegendInternal;
    channel: NonPositionScaleChannel;
    timeUnit?: TimeUnit;
    scaleType: ScaleType;
}): LegendType;
export declare function defaultType({ channel, timeUnit, scaleType }: {
    channel: NonPositionScaleChannel;
    timeUnit?: TimeUnit;
    scaleType: ScaleType;
}): LegendType;
export declare function getDirection({ legendConfig, legendType, orient, legend }: {
    orient: LegendOrient;
    legendConfig: LegendConfig<SignalRef>;
    legendType: LegendType;
    legend: Legend<SignalRef>;
}): Orientation;
export declare function defaultDirection(orient: LegendOrient, legendType: LegendType): 'horizontal' | undefined;
export declare function defaultGradientLength({ legendConfig, model, direction, orient, scaleType }: {
    scaleType: ScaleType;
    direction: Orientation;
    orient: LegendOrient;
    model: Model;
    legendConfig: LegendConfig<SignalRef>;
}): number | {
    signal: string;
};
export declare function defaultLabelOverlap(scaleType: ScaleType): LabelOverlap;
//# sourceMappingURL=properties.d.ts.map