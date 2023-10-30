/**
 * Utility files for producing Vega ValueRef for marks
 */
import type { SignalRef } from 'vega';
import { Channel, PolarPositionChannel, PositionChannel } from '../../../channel';
import { ChannelDef, DatumDef, FieldDef, FieldDefBase, FieldName, FieldRefOption, SecondaryChannelDef, SecondaryFieldDef, TypedFieldDef, Value } from '../../../channeldef';
import { Config } from '../../../config';
import { Mark, MarkDef } from '../../../mark';
import { StackProperties } from '../../../stack';
import { VgValueRef } from '../../../vega.schema';
import { ScaleComponent } from '../../scale/component';
export declare function midPointRefWithPositionInvalidTest(params: MidPointParams & {
    channel: PositionChannel | PolarPositionChannel;
}): VgValueRef | VgValueRef[];
export declare function wrapPositionInvalidTest({ fieldDef, channel, markDef, ref, config }: {
    fieldDef: FieldDef<string>;
    channel: PositionChannel | PolarPositionChannel;
    markDef: MarkDef<Mark>;
    ref: VgValueRef;
    config: Config<SignalRef>;
}): VgValueRef | VgValueRef[];
export declare function fieldInvalidTestValueRef(fieldDef: FieldDef<string>, channel: PositionChannel | PolarPositionChannel): {
    field: {
        group: string;
    };
    value?: undefined;
    test: string;
} | {
    value: number;
    field?: undefined;
    test: string;
};
export declare function fieldInvalidPredicate(field: FieldName | FieldDef<string>, invalid?: boolean): string;
export declare function datumDefToExpr(datumDef: DatumDef<string>): string;
export declare function valueRefForFieldOrDatumDef(fieldDef: FieldDefBase<string> | DatumDef<string>, scaleName: string, opt: FieldRefOption, encode: {
    offset?: number | VgValueRef;
    band?: number | boolean | SignalRef;
}): VgValueRef;
/**
 * Signal that returns the middle of a bin from start and end field. Should only be used with x and y.
 */
export declare function interpolatedSignalRef({ scaleName, fieldOrDatumDef, fieldOrDatumDef2, offset, startSuffix, endSuffix, bandPosition }: {
    scaleName: string;
    fieldOrDatumDef: TypedFieldDef<string>;
    fieldOrDatumDef2?: SecondaryFieldDef<string>;
    startSuffix?: string;
    endSuffix?: string;
    offset: number | SignalRef | VgValueRef;
    bandPosition: number | SignalRef;
}): VgValueRef;
export declare function binSizeExpr({ scaleName, fieldDef }: {
    scaleName: string;
    fieldDef: TypedFieldDef<string>;
}): string;
export interface MidPointParams {
    channel: Channel;
    channelDef: ChannelDef;
    channel2Def?: SecondaryChannelDef<string>;
    markDef: MarkDef<Mark, SignalRef>;
    config: Config<SignalRef>;
    scaleName: string;
    scale: ScaleComponent;
    stack?: StackProperties;
    offset?: number | SignalRef | VgValueRef;
    defaultRef: VgValueRef | (() => VgValueRef);
    bandPosition?: number | SignalRef;
}
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export declare function midPoint({ channel, channelDef, channel2Def, markDef, config, scaleName, scale, stack, offset, defaultRef, bandPosition }: MidPointParams): VgValueRef;
/**
 * Convert special "width" and "height" values in Vega-Lite into Vega value ref.
 */
export declare function widthHeightValueOrSignalRef(channel: Channel, value: Value | SignalRef): SignalRef | {
    value: string | number | boolean | string[] | number[] | import("vega").LinearGradient | import("vega").RadialGradient;
} | {
    field: {
        group: string;
    };
};
//# sourceMappingURL=valueref.d.ts.map