import { Orientation, SignalRef, Text } from 'vega';
import { CompositeMark, CompositeMarkDef } from '.';
import { Field, PositionFieldDef, SecondaryFieldDef, StringFieldDef, StringFieldDefWithCondition, StringValueDefWithCondition } from '../channeldef';
import { Encoding } from '../encoding';
import { ExprRef } from '../expr';
import { ColorMixins, GenericMarkDef, Mark, AnyMarkConfig, MarkDef } from '../mark';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec';
export type PartsMixins<P extends string> = Partial<Record<P, boolean | AnyMarkConfig<ExprRef | SignalRef>>>;
export type GenericCompositeMarkDef<T> = GenericMarkDef<T> & ColorMixins<ExprRef | SignalRef> & {
    /**
     * The opacity (value between [0,1]) of the mark.
     *
     * @minimum 0
     * @maximum 1
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
    titlePrefix: Text | SignalRef;
}
export declare function filterTooltipWithAggregatedField<F extends Field>(oldEncoding: Encoding<F>): {
    customTooltipWithoutAggregatedField?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F> | StringFieldDef<F>[];
    filteredEncoding: Encoding<F>;
};
export declare function getCompositeMarkTooltip(tooltipSummary: CompositeMarkTooltipSummary[], continuousAxisChannelDef: PositionFieldDef<string>, encodingWithoutContinuousAxis: Encoding<string>, withFieldName?: boolean): Encoding<string>;
export declare function getTitle(continuousAxisChannelDef: PositionFieldDef<string>): SignalRef | Text;
export declare function makeCompositeAggregatePartFactory<P extends PartsMixins<any>>(compositeMarkDef: GenericCompositeMarkDef<any> & P, continuousAxis: 'x' | 'y', continuousAxisChannelDef: PositionFieldDef<string>, sharedEncoding: Encoding<string>, compositeMarkConfig: P): ({ partName, mark, positionPrefix, endPositionPrefix, extraEncoding }: {
    partName: keyof P;
    mark: Mark | MarkDef;
    positionPrefix: string;
    endPositionPrefix?: string;
    extraEncoding?: Encoding<string>;
}) => NormalizedUnitSpec[];
export declare function partLayerMixins<P extends PartsMixins<any>>(markDef: GenericCompositeMarkDef<any> & P, part: keyof P, compositeMarkConfig: P, partBaseSpec: NormalizedUnitSpec): NormalizedUnitSpec[];
export declare function compositeMarkContinuousAxis<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>, orient: Orientation, compositeMark: M): {
    continuousAxisChannelDef: PositionFieldDef<string>;
    continuousAxisChannelDef2: SecondaryFieldDef<string>;
    continuousAxisChannelDefError: SecondaryFieldDef<string>;
    continuousAxisChannelDefError2: SecondaryFieldDef<string>;
    continuousAxis: 'x' | 'y';
};
export declare function compositeMarkOrient<M extends CompositeMark>(spec: GenericUnitSpec<Encoding<string>, CompositeMark | CompositeMarkDef>, compositeMark: M): Orientation;
//# sourceMappingURL=common.d.ts.map