import { Orientation } from 'vega';
import { CompositeMark, CompositeMarkDef } from '.';
import { Field, PositionFieldDef, SecondaryFieldDef, TextFieldDef, TextFieldDefWithCondition, TextValueDefWithCondition } from '../channeldef';
import { Encoding } from '../encoding';
import { ColorMixins, GenericMarkDef, Mark, MarkConfig, MarkDef } from '../mark';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec';
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
export declare function filterTooltipWithAggregatedField<F extends Field>(oldEncoding: Encoding<F>): {
    customTooltipWithoutAggregatedField?: TextFieldDefWithCondition<F> | TextValueDefWithCondition<F> | TextFieldDef<F>[];
    filteredEncoding: Encoding<F>;
};
export declare function getCompositeMarkTooltip(tooltipSummary: CompositeMarkTooltipSummary[], continuousAxisChannelDef: PositionFieldDef<string>, encodingWithoutContinuousAxis: Encoding<string>, withFieldName?: boolean): Encoding<string>;
export declare function makeCompositeAggregatePartFactory<P extends PartsMixins<any>>(compositeMarkDef: GenericCompositeMarkDef<any> & P, continuousAxis: 'x' | 'y', continuousAxisChannelDef: PositionFieldDef<string>, sharedEncoding: Encoding<string>, compositeMarkConfig: P): ({ partName, mark, positionPrefix, endPositionPrefix, extraEncoding }: {
    partName: keyof P;
    mark: "text" | "area" | "bar" | "line" | "trail" | "point" | "tick" | "rect" | "rule" | "circle" | "square" | "geoshape" | MarkDef<Mark>;
    positionPrefix: string;
    endPositionPrefix?: string;
    extraEncoding?: Encoding<string>;
}) => GenericUnitSpec<Encoding<Field>, "text" | "area" | "bar" | "line" | "trail" | "point" | "tick" | "rect" | "rule" | "circle" | "square" | "geoshape" | MarkDef<Mark>>[];
export declare function partLayerMixins<P extends PartsMixins<any>>(markDef: GenericCompositeMarkDef<any> & P, part: keyof P, compositeMarkConfig: P, partBaseSpec: NormalizedUnitSpec): NormalizedUnitSpec[];
export declare function compositeMarkContinuousAxis<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>, orient: Orientation, compositeMark: M): {
    continuousAxisChannelDef: PositionFieldDef<string>;
    continuousAxisChannelDef2: SecondaryFieldDef<string>;
    continuousAxisChannelDefError: SecondaryFieldDef<string>;
    continuousAxisChannelDefError2: SecondaryFieldDef<string>;
    continuousAxis: 'x' | 'y';
};
export declare function compositeMarkOrient<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<Field>, CompositeMark | CompositeMarkDef>, compositeMark: M): Orientation;
//# sourceMappingURL=common.d.ts.map