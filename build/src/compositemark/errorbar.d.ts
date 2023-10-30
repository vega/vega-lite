import { Orientation, SignalRef, Text } from 'vega';
import { PositionChannel } from '../channel';
import { Field, PositionFieldDef, SecondaryFieldDef, ValueDef } from '../channeldef';
import { Config } from '../config';
import { Data } from '../data';
import { Encoding } from '../encoding';
import { ExprRef } from '../expr';
import { NormalizerParams } from '../normalize';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { Step } from '../spec/base';
import { NormalizedUnitSpec } from '../spec/unit';
import { TitleParams } from '../title';
import { Transform } from '../transform';
import { CompositeMarkNormalizer } from './base';
import { GenericCompositeMarkDef, PartsMixins } from './common';
import { ErrorBand, ErrorBandDef } from './errorband';
export declare const ERRORBAR: "errorbar";
export type ErrorBar = typeof ERRORBAR;
export type ErrorBarExtent = 'ci' | 'iqr' | 'stderr' | 'stdev';
export type ErrorBarCenter = 'mean' | 'median';
export type ErrorInputType = 'raw' | 'aggregated-upper-lower' | 'aggregated-error';
export declare const ERRORBAR_PARTS: readonly ["ticks", "rule"];
export type ErrorBarPart = (typeof ERRORBAR_PARTS)[number];
export interface ErrorExtraEncoding<F extends Field> {
    /**
     * Error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    xError?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Secondary error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    xError2?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    yError?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Secondary error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    yError2?: SecondaryFieldDef<F> | ValueDef<number>;
}
export type ErrorEncoding<F extends Field> = Pick<Encoding<F>, PositionChannel | 'color' | 'detail' | 'opacity'> & ErrorExtraEncoding<F>;
export type ErrorBarPartsMixins = PartsMixins<ErrorBarPart>;
export interface ErrorBarConfig extends ErrorBarPartsMixins {
    /** Size of the ticks of an error bar */
    size?: number;
    /** Thickness of the ticks and the bar of an error bar */
    thickness?: number;
    /**
     * The center of the errorbar. Available options include:
     * - `"mean"`: the mean of the data points.
     * - `"median"`: the median of the data points.
     *
     * __Default value:__ `"mean"`.
     * @hidden
     */
    center?: ErrorBarCenter;
    /**
     * The extent of the rule. Available options include:
     * - `"ci"`: Extend the rule to the confidence interval of the mean.
     * - `"stderr"`: The size of rule are set to the value of standard error, extending from the mean.
     * - `"stdev"`: The size of rule are set to the value of standard deviation, extending from the mean.
     * - `"iqr"`: Extend the rule to the q1 and q3.
     *
     * __Default value:__ `"stderr"`.
     */
    extent?: ErrorBarExtent;
}
export type ErrorBarDef = GenericCompositeMarkDef<ErrorBar> & ErrorBarConfig & {
    /**
     * Orientation of the error bar. This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orientation;
};
export interface ErrorBarConfigMixins {
    /**
     * ErrorBar Config
     */
    errorbar?: ErrorBarConfig;
}
export declare const errorBarNormalizer: CompositeMarkNormalizer<"errorbar">;
export declare function normalizeErrorBar(spec: GenericUnitSpec<ErrorEncoding<string>, ErrorBar | ErrorBarDef>, { config }: NormalizerParams): NormalizedLayerSpec | NormalizedUnitSpec;
export declare function errorBarParams<M extends ErrorBar | ErrorBand, MD extends GenericCompositeMarkDef<M> & (ErrorBarDef | ErrorBandDef)>(spec: GenericUnitSpec<ErrorEncoding<string>, M | MD>, compositeMark: M, config: Config): {
    transform: Transform[];
    groupby: string[];
    continuousAxisChannelDef: PositionFieldDef<string>;
    continuousAxis: 'x' | 'y';
    encodingWithoutContinuousAxis: ErrorEncoding<string>;
    ticksOrient: Orientation;
    markDef: MD;
    outerSpec: {
        data?: Data;
        title?: Text | TitleParams<ExprRef | SignalRef>;
        name?: string;
        description?: string;
        transform?: Transform[];
        width?: number | 'container' | Step;
        height?: number | 'container' | Step;
    };
    tooltipEncoding: ErrorEncoding<string>;
};
//# sourceMappingURL=errorbar.d.ts.map