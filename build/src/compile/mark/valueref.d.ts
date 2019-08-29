/**
 * Utility files for producing Vega ValueRef for marks
 */
import { SignalRef } from 'vega';
import { Channel, PositionChannel } from '../../channel';
import { ChannelDef, ChannelDefWithCondition, FieldDef, FieldDefBase, FieldName, FieldRefOption, SecondaryFieldDef, TypedFieldDef, Value, ValueOrGradient } from '../../channeldef';
import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { Mark, MarkDef } from '../../mark';
import { StackProperties } from '../../stack';
import { VgValueRef } from '../../vega.schema';
import { ScaleComponent } from '../scale/component';
export declare function fieldInvalidTestValueRef(fieldDef: FieldDef<string>, channel: PositionChannel): {
    value: number;
    field?: undefined;
    test: string;
} | {
    field: {
        group: string;
    };
    value?: undefined;
    test: string;
};
export declare function fieldInvalidPredicate(field: FieldName | FieldDef<string>, invalid?: boolean): string;
/**
 * @return Vega ValueRef for normal x- or y-position without projection
 */
export declare function position(params: MidPointParams & {
    channel: 'x' | 'y';
}): VgValueRef | VgValueRef[];
/**
 * @return Vega ValueRef for normal x2- or y2-position without projection
 */
export declare function position2({ channel, channelDef, channel2Def, markDef, config, scaleName, scale, stack, offset, defaultRef }: MidPointParams & {
    channel: 'x2' | 'y2';
}): VgValueRef | VgValueRef[];
export declare function getOffset(channel: PositionChannel, markDef: MarkDef): number;
/**
 * Value Ref for binned fields
 */
export declare function bin({ channel, fieldDef, scaleName, markDef, band, offset }: {
    channel: PositionChannel;
    fieldDef: TypedFieldDef<string>;
    scaleName: string;
    markDef: MarkDef<Mark>;
    band: number;
    offset?: number;
}): VgValueRef | VgValueRef[];
export declare function fieldRef(fieldDef: FieldDefBase<string>, scaleName: string, opt: FieldRefOption, mixins: {
    offset?: number | VgValueRef;
    band?: number | boolean;
}): VgValueRef;
export declare function bandRef(scaleName: string, band?: number | boolean): VgValueRef;
export interface MidPointParams {
    channel: Channel;
    channelDef: ChannelDef;
    channel2Def?: ChannelDef<SecondaryFieldDef<string>>;
    markDef: MarkDef<Mark>;
    config: Config;
    scaleName: string;
    scale: ScaleComponent;
    stack?: StackProperties;
    offset?: number;
    defaultRef: VgValueRef | (() => VgValueRef);
}
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
export declare function midPoint({ channel, channelDef, channel2Def, markDef, config, scaleName, scale, stack, offset, defaultRef }: MidPointParams): VgValueRef;
/**
 * Convert special "width" and "height" values in Vega-Lite into Vega value ref.
 */
export declare function vgValueRef(channel: Channel, value: ValueOrGradient): {
    field: {
        group: string;
    };
    value?: undefined;
} | {
    value: ValueOrGradient;
    field?: undefined;
};
export declare function tooltipForEncoding(encoding: Encoding<string>, config: Config, { reactiveGeom }?: {
    reactiveGeom?: boolean;
}): {
    signal: string;
};
export declare function text(channelDef: ChannelDefWithCondition<FieldDef<string>, Value>, config: Config, expr?: 'datum' | 'datum.datum'): VgValueRef;
export declare function mid(sizeRef: SignalRef): VgValueRef;
export declare function positionDefault({ markDef, config, defaultRef, channel, scaleName, scale, mark, checkBarAreaWithoutZero: checkBarAreaWithZero }: {
    markDef: MarkDef;
    config: Config;
    defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax';
    channel: PositionChannel;
    scaleName: string;
    scale: ScaleComponent;
    mark: Mark;
    checkBarAreaWithoutZero: boolean;
}): () => VgValueRef | {
    field: {
        group: string;
    };
    value?: undefined;
} | {
    value: ValueOrGradient;
    field?: undefined;
};
//# sourceMappingURL=valueref.d.ts.map