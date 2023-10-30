import { SignalRef, TimeInterval } from 'vega';
import { ScaleChannel } from '../../channel';
import { ScaleDatumDef, ScaleFieldDef, TypedFieldDef } from '../../channeldef';
import { Config } from '../../config';
import { Mark, MarkDef, RectConfig } from '../../mark';
import { Domain, Scale, ScaleConfig, ScaleType } from '../../scale';
import { Sort } from '../../sort';
import { Type } from '../../type';
import { Model } from '../model';
import { SignalRefWrapper } from '../signal';
import { ScaleComponentProps } from './component';
export declare function parseScaleProperty(model: Model, property: Exclude<keyof (Scale | ScaleComponentProps), 'range'>): void;
export interface ScaleRuleParams {
    model: Model;
    channel: ScaleChannel;
    fieldOrDatumDef: ScaleFieldDef<string, Type> | ScaleDatumDef;
    hasNestedOffsetScale: boolean;
    scaleType: ScaleType;
    scalePadding: number | SignalRef;
    scalePaddingInner: number | SignalRef;
    domain: Domain;
    domainMin: Scale['domainMin'];
    domainMax: Scale['domainMax'];
    markDef: MarkDef<Mark, SignalRef>;
    config: Config<SignalRef>;
    hasSecondaryRangeChannel: boolean;
}
export declare const scaleRules: {
    [k in keyof Scale]?: (params: ScaleRuleParams) => Scale[k];
};
export declare function parseScaleRange(model: Model): void;
export declare function parseNonUnitScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export declare function bins(model: Model, fieldDef: TypedFieldDef<string>): SignalRefWrapper | {
    step: number;
};
export declare function interpolate(channel: ScaleChannel, type: Type): Scale['interpolate'];
export declare function nice(scaleType: ScaleType, channel: ScaleChannel, specifiedDomain: Domain, domainMin: Scale['domainMin'], domainMax: Scale['domainMax'], fieldOrDatumDef: TypedFieldDef<string> | ScaleDatumDef): boolean | TimeInterval;
export declare function padding(channel: ScaleChannel, scaleType: ScaleType, scaleConfig: ScaleConfig<SignalRef>, fieldOrDatumDef: TypedFieldDef<string> | ScaleDatumDef, markDef: MarkDef<Mark, SignalRef>, barConfig: RectConfig<SignalRef>): number | SignalRef;
export declare function paddingInner(paddingValue: number | SignalRef, channel: ScaleChannel, mark: Mark, scaleType: ScaleType, scaleConfig: ScaleConfig<SignalRef>, hasNestedOffsetScale?: boolean): number | SignalRef;
export declare function paddingOuter(paddingValue: number | SignalRef, channel: ScaleChannel, scaleType: ScaleType, paddingInnerValue: number | SignalRef, scaleConfig: ScaleConfig<SignalRef>, hasNestedOffsetScale?: boolean): number | SignalRef;
export declare function reverse(scaleType: ScaleType, sort: Sort<string>, channel: ScaleChannel, scaleConfig: ScaleConfig<SignalRef>): boolean | SignalRef;
export declare function zero(channel: ScaleChannel, fieldDef: TypedFieldDef<string> | ScaleDatumDef, specifiedDomain: Domain, markDef: MarkDef, scaleType: ScaleType, scaleConfig: ScaleConfig<SignalRef>, hasSecondaryRangeChannel: boolean): boolean;
//# sourceMappingURL=properties.d.ts.map