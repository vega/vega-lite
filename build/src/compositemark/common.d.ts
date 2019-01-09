import { CompositeMark, CompositeMarkDef } from '.';
import { Channel } from '../channel';
import { Encoding } from '../encoding';
import { Field, FieldDefWithoutScale, PositionFieldDef, SecondaryFieldDef } from '../fielddef';
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
export interface CompositeMarkTooltipSummary {
    /**
     * The prefix of the field to be shown in tooltip
     */
    fieldPrefix: string;
    /**
     * The title prefix to show, corresponding to the field with field prefix `fieldPrefix`
     */
    titlePrefix: string;
}
export declare function getCompositeMarkTooltip(tooltipSummary: CompositeMarkTooltipSummary[], continuousAxisChannelDef: PositionFieldDef<string>, encodingWithoutContinuousAxis: Encoding<string>, withFieldName?: boolean): Encoding<string>;
export declare function makeCompositeAggregatePartFactory<P extends PartsMixins<any>>(compositeMarkDef: GenericCompositeMarkDef<any> & P, continuousAxis: 'x' | 'y', continuousAxisChannelDef: PositionFieldDef<string>, sharedEncoding: Encoding<string>, compositeMarkConfig: P): ({ partName, mark, positionPrefix, endPositionPrefix, extraEncoding }: {
    partName: keyof P;
    mark: "square" | "area" | "circle" | "line" | "rect" | "text" | "point" | "rule" | "trail" | "geoshape" | "bar" | "tick" | MarkDef;
    positionPrefix: string;
    endPositionPrefix?: string;
    extraEncoding?: Encoding<string>;
}) => GenericUnitSpec<Encoding<Field>, "square" | "area" | "circle" | "line" | "rect" | "text" | "point" | "rule" | "trail" | "geoshape" | "bar" | "tick" | MarkDef>[];
export declare function partLayerMixins<P extends PartsMixins<any>>(markDef: GenericCompositeMarkDef<any> & P, part: keyof P, compositeMarkConfig: P, partBaseSpec: NormalizedUnitSpec): NormalizedUnitSpec[];
export declare function compositeMarkContinuousAxis<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>, orient: Orient, compositeMark: M): {
    continuousAxisChannelDef: PositionFieldDef<string>;
    continuousAxisChannelDef2: SecondaryFieldDef<string>;
    continuousAxisChannelDefError: FieldDefWithoutScale<string, import("../type").StandardType>;
    continuousAxisChannelDefError2: FieldDefWithoutScale<string, import("../type").StandardType>;
    continuousAxis: "x" | "y";
};
export declare function compositeMarkOrient<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<Field>, CompositeMark | CompositeMarkDef>, compositeMark: M): Orient;
export declare function filterUnsupportedChannels<M extends CompositeMark, MD extends GenericCompositeMarkDef<M>>(spec: GenericUnitSpec<Encoding<string>, M | MD>, supportedChannels: Channel[], compositeMark: M): GenericUnitSpec<Encoding<string>, M | MD>;
