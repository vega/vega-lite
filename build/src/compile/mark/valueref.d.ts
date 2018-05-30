import { Channel } from '../../channel';
import { Config } from '../../config';
import { ChannelDef, ChannelDefWithCondition, FieldDef, FieldRefOption, TextFieldDef } from '../../fielddef';
import { Mark, MarkDef } from '../../mark';
import { StackProperties } from '../../stack';
import { VgSignalRef, VgValueRef } from '../../vega.schema';
import { ScaleComponent } from '../scale/component';
/**
 * @return Vega ValueRef for stackable x or y
 */
export declare function stackable(channel: 'x' | 'y', channelDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef): VgValueRef;
/**
 * @return Vega ValueRef for stackable x2 or y2
 */
export declare function stackable2(channel: 'x2' | 'y2', aFieldDef: ChannelDef<string>, a2fieldDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef): VgValueRef;
export declare function getOffset(channel: 'x' | 'y' | 'x2' | 'y2', markDef: MarkDef): any;
/**
 * Value Ref for binned fields
 */
export declare function bin(fieldDef: FieldDef<string>, scaleName: string, side: 'start' | 'end', offset?: number): VgValueRef;
export declare function fieldRef(fieldDef: FieldDef<string>, scaleName: string, opt: FieldRefOption, mixins?: {
    offset?: number | VgValueRef;
    band?: number | boolean;
}): VgValueRef;
export declare function bandRef(scaleName: string, band?: number | boolean): VgValueRef;
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export declare function midPoint(channel: Channel, channelDef: ChannelDef<string>, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef): VgValueRef;
export declare function text(textDef: ChannelDefWithCondition<TextFieldDef<string>>, config: Config): VgValueRef;
export declare function mid(sizeRef: VgSignalRef): VgValueRef;
export declare function getDefaultRef(defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax', channel: 'x' | 'y', scaleName: string, scale: ScaleComponent, mark: Mark): VgValueRef;
