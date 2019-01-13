import { Channel } from '../channel';
import { Config } from '../config';
import { Data } from '../data';
import { Encoding } from '../encoding';
import { PositionFieldDef } from '../fielddef';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { TitleParams } from '../title';
import { Transform } from '../transform';
import { Orient } from '../vega.schema';
import { GenericCompositeMarkDef, PartsMixins } from './common';
import { ErrorBand, ErrorBandDef } from './errorband';
export declare const ERRORBAR: 'errorbar';
export declare type ErrorBar = typeof ERRORBAR;
export declare type ErrorBarExtent = 'ci' | 'iqr' | 'stderr' | 'stdev';
export declare type ErrorBarCenter = 'mean' | 'median';
export declare type ErrorBarPart = 'ticks' | 'rule';
export declare type ErrorInputType = 'raw' | 'aggregated-upper-lower' | 'aggregated-error';
export declare const ERRORBAR_PARTS: ErrorBarPart[];
export declare type ErrorBarPartsMixins = PartsMixins<ErrorBarPart>;
export interface ErrorBarConfig extends ErrorBarPartsMixins {
    /**
     * The center of the errorbar. Available options include:
     * - `"mean"`: the mean of the data points.
     * - `"median"`: the median of the data points.
     *
     * __Default value:__ `"mean"`.
     * @hide
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
export declare type ErrorBarDef = GenericCompositeMarkDef<ErrorBar> & ErrorBarConfig & {
    /**
     * Orientation of the error bar.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orient;
};
export interface ErrorBarConfigMixins {
    /**
     * ErrorBar Config
     */
    errorbar?: ErrorBarConfig;
}
export declare function normalizeErrorBar(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>, config: Config): NormalizedLayerSpec;
export declare const errorBarSupportedChannels: Channel[];
export declare function errorBarParams<M extends ErrorBar | ErrorBand, MD extends GenericCompositeMarkDef<M> & (ErrorBarDef | ErrorBandDef)>(spec: GenericUnitSpec<Encoding<string>, M | MD>, compositeMark: M, config: Config): {
    transform: Transform[];
    groupby: string[];
    continuousAxisChannelDef: PositionFieldDef<string>;
    continuousAxis: 'x' | 'y';
    encodingWithoutContinuousAxis: Encoding<string>;
    ticksOrient: Orient;
    markDef: MD;
    outerSpec: {
        data?: Data;
        title?: string | TitleParams;
        name?: string;
        description?: string;
        transform?: Transform[];
        width?: number;
        height?: number;
    };
    tooltipEncoding: Encoding<string>;
};
