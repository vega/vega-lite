/**
 * Utility files for producing Vega ValueRef for marks
 */
import { SignalRef } from 'vega';
import { Channel } from '../../channel';
import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { ChannelDef, ChannelDefWithCondition, FieldDef, FieldDefBase, FieldRefOption, SecondaryFieldDef, TypedFieldDef } from '../../fielddef';
import { Mark, MarkDef } from '../../mark';
import { StackProperties } from '../../stack';
import { VgValueRef } from '../../vega.schema';
import { ScaleComponent } from '../scale/component';
/**
 * @return Vega ValueRef for normal x- or y-position without projection
 */
export declare function position(channel: 'x' | 'y', channelDef: ChannelDef, channel2Def: ChannelDef, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef | (() => VgValueRef)): VgValueRef;
/**
 * @return Vega ValueRef for normal x2- or y2-position without projection
 */
export declare function position2(channel: 'x2' | 'y2', aFieldDef: ChannelDef, a2fieldDef: ChannelDef, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef | (() => VgValueRef)): VgValueRef;
export declare function getOffset(channel: 'x' | 'y' | 'x2' | 'y2', markDef: MarkDef): any;
/**
 * Value Ref for binned fields
 */
export declare function bin(fieldDef: TypedFieldDef<string>, scaleName: string, side: 'start' | 'end', offset?: number): VgValueRef;
export declare function fieldRef(fieldDef: FieldDefBase<string>, scaleName: string, opt: FieldRefOption, mixins?: {
    offset?: number | VgValueRef;
    band?: number | boolean;
}): VgValueRef;
export declare function bandRef(scaleName: string, band?: number | boolean): VgValueRef;
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export declare function midPoint(channel: Channel, channelDef: ChannelDef, channel2Def: ChannelDef<SecondaryFieldDef<string>>, scaleName: string, scale: ScaleComponent, stack: StackProperties, defaultRef: VgValueRef | (() => VgValueRef)): VgValueRef;
export declare function tooltipForEncoding(encoding: Encoding<string>, config: Config): {
    signal: string;
};
export declare function text(channelDef: ChannelDefWithCondition<FieldDef<string>, string | number | boolean>, config: Config): VgValueRef;
export declare function mid(sizeRef: SignalRef): VgValueRef;
export declare function getDefaultRef(defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax', channel: 'x' | 'y', scaleName: string, scale: ScaleComponent, mark: Mark): () => VgValueRef;
