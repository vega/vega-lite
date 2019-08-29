import { Channel } from '../../channel';
import { ScaleFieldDef, TypedFieldDef } from '../../channeldef';
import { Config } from '../../config';
import { Mark, MarkDef, RectConfig } from '../../mark';
import { Domain, NiceTime, Scale, ScaleConfig, ScaleType } from '../../scale';
import { Sort } from '../../sort';
import { Type } from '../../type';
import { Model } from '../model';
import { SignalRefWrapper } from './../signal';
import { ScaleComponentProps } from './component';
export declare function parseScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export declare function getDefaultValue(property: keyof Scale, model: Model, channel: Channel, fieldDef: ScaleFieldDef<string, Type>, scaleType: ScaleType, scalePadding: number, scalePaddingInner: number, specifiedDomain: Scale['domain'], markDef: MarkDef, config: Config): any;
export declare function parseScaleRange(model: Model): void;
export declare function parseNonUnitScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export declare function bins(model: Model, fieldDef: TypedFieldDef<string>): SignalRefWrapper | {
    step: number;
};
export declare function interpolate(channel: Channel, type: Type): string;
export declare function nice(scaleType: ScaleType, channel: Channel, fieldDef: TypedFieldDef<string>): boolean | NiceTime;
export declare function padding(channel: Channel, scaleType: ScaleType, scaleConfig: ScaleConfig, fieldDef: TypedFieldDef<string>, markDef: MarkDef, barConfig: RectConfig): number;
export declare function paddingInner(paddingValue: number, channel: Channel, mark: Mark, scaleConfig: ScaleConfig): number;
export declare function paddingOuter(paddingValue: number, channel: Channel, scaleType: ScaleType, mark: Mark, paddingInnerValue: number, scaleConfig: ScaleConfig): number;
export declare function reverse(scaleType: ScaleType, sort: Sort<string>): boolean;
export declare function zero(channel: Channel, fieldDef: TypedFieldDef<string>, specifiedDomain: Domain, markDef: MarkDef, scaleType: ScaleType): boolean;
//# sourceMappingURL=properties.d.ts.map