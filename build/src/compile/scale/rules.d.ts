import { Channel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { NiceTime, Scale, ScaleConfig, ScaleType } from '../../scale';
export declare function nice(scaleType: ScaleType, channel: Channel, fieldDef: FieldDef): boolean | NiceTime;
export declare function padding(channel: Channel, scaleType: ScaleType, scaleConfig: ScaleConfig): number;
export declare function paddingInner(padding: number, channel: Channel, scaleConfig: ScaleConfig): number;
export declare function paddingOuter(padding: number, channel: Channel, scaleType: ScaleType, paddingInner: number, scaleConfig: ScaleConfig): number;
export declare function round(channel: Channel, scaleConfig: ScaleConfig): boolean;
export declare function zero(specifiedScale: Scale, channel: Channel, fieldDef: FieldDef): boolean;
