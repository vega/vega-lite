import { CompositeMark, CompositeMarkDef } from '.';
import { Channel } from '../channel';
import { Encoding } from '../encoding';
import { Field, FieldDef, PositionFieldDef } from '../fielddef';
import { ColorMixins, GenericMarkDef, MarkConfig, MarkDef } from '../mark';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec';
import { Orient } from '../vega.schema';
export declare type PartsMixins<P extends string> = Partial<Record<P, boolean | MarkConfig>>;
export declare type GenericCompositeMarkDef<T> = GenericMarkDef<T> & ColorMixins & {
    /**
     * The opacity (value between [0,1]) of the mark.
     */
    opacity?: number;
    /**
     * Whether a composite mark be clipped to the enclosing group’s width and height.
     */
    clip?: boolean;
};
export declare function makeCompositeAggregatePartFactory<P extends PartsMixins<any>>(compositeMarkDef: GenericCompositeMarkDef<any> & P, continuousAxis: 'x' | 'y', continuousAxisChannelDef: PositionFieldDef<string>, sharedEncoding: Encoding<string>, compositeMarkConfig: P): (partName: keyof P, mark: "square" | "area" | "circle" | "line" | "rect" | "text" | "point" | "rule" | "trail" | "geoshape" | "bar" | "tick" | MarkDef, positionPrefix: string, endPositionPrefix?: string, extraEncoding?: Encoding<string>) => GenericUnitSpec<Encoding<string | import("../fielddef").RepeatRef>, "square" | "area" | "circle" | "line" | "rect" | "text" | "point" | "rule" | "trail" | "geoshape" | "bar" | "tick" | MarkDef>[];
export declare function partLayerMixins<P extends PartsMixins<any>>(markDef: GenericCompositeMarkDef<any> & P, part: keyof P, compositeMarkConfig: P, partBaseSpec: NormalizedUnitSpec): NormalizedUnitSpec[];
export declare function compositeMarkContinuousAxis<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>, orient: Orient, compositeMark: M): {
    continuousAxisChannelDef: PositionFieldDef<string>;
    continuousAxisChannelDef2: FieldDef<string>;
    continuousAxisChannelDefError: FieldDef<string>;
    continuousAxisChannelDefError2: FieldDef<string>;
    continuousAxis: 'x' | 'y';
};
export declare function compositeMarkOrient<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<Field>, CompositeMark | CompositeMarkDef>, compositeMark: M): Orient;
export declare function filterUnsupportedChannels<M extends CompositeMark, MD extends GenericCompositeMarkDef<M>>(spec: GenericUnitSpec<Encoding<string>, M | MD>, supportedChannels: Channel[], compositeMark: M): GenericUnitSpec<Encoding<string>, M | MD>;
