import { Interpolate, Orientation } from 'vega';
import { Field } from '../channeldef';
import { Encoding } from '../encoding';
import { NormalizerParams } from '../normalize';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { CompositeMarkNormalizer } from './base';
import { GenericCompositeMarkDef, PartsMixins } from './common';
import { ErrorBarCenter, ErrorBarExtent, ErrorEncoding } from './errorbar';
export type ErrorBandUnitSpec<EE = undefined> = GenericUnitSpec<ErrorEncoding<Field> & EE, ErrorBand | ErrorBandDef>;
export declare const ERRORBAND: "errorband";
export type ErrorBand = typeof ERRORBAND;
export declare const ERRORBAND_PARTS: readonly ["band", "borders"];
type ErrorBandPart = (typeof ERRORBAND_PARTS)[number];
export type ErrorBandPartsMixins = PartsMixins<ErrorBandPart>;
export interface ErrorBandConfig extends ErrorBandPartsMixins {
    /**
     * The center of the error band. Available options include:
     * - `"mean"`: the mean of the data points.
     * - `"median"`: the median of the data points.
     *
     * __Default value:__ `"mean"`.
     * @hidden
     */
    center?: ErrorBarCenter;
    /**
     * The extent of the band. Available options include:
     * - `"ci"`: Extend the band to the confidence interval of the mean.
     * - `"stderr"`: The size of band are set to the value of standard error, extending from the mean.
     * - `"stdev"`: The size of band are set to the value of standard deviation, extending from the mean.
     * - `"iqr"`: Extend the band to the q1 and q3.
     *
     * __Default value:__ `"stderr"`.
     */
    extent?: ErrorBarExtent;
    /**
     * The line interpolation method for the error band. One of the following:
     * - `"linear"`: piecewise linear segments, as in a polyline.
     * - `"linear-closed"`: close the linear segments to form a polygon.
     * - `"step"`: a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines. The y-value changes at the midpoint of each pair of adjacent x-values.
     * - `"step-before"`: a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines. The y-value changes before the x-value.
     * - `"step-after"`: a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines. The y-value changes after the x-value.
     * - `"basis"`: a B-spline, with control point duplication on the ends.
     * - `"basis-open"`: an open B-spline; may not intersect the start or end.
     * - `"basis-closed"`: a closed B-spline, as in a loop.
     * - `"cardinal"`: a Cardinal spline, with control point duplication on the ends.
     * - `"cardinal-open"`: an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
     * - `"cardinal-closed"`: a closed Cardinal spline, as in a loop.
     * - `"bundle"`: equivalent to basis, except the tension parameter is used to straighten the spline.
     * - `"monotone"`: cubic interpolation that preserves monotonicity in y.
     */
    interpolate?: Interpolate;
    /**
     * The tension parameter for the interpolation type of the error band.
     *
     * @minimum 0
     * @maximum 1
     */
    tension?: number;
}
export type ErrorBandDef = GenericCompositeMarkDef<ErrorBand> & ErrorBandConfig & {
    /**
     * Orientation of the error band. This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orientation;
};
export interface ErrorBandConfigMixins {
    /**
     * ErrorBand Config
     */
    errorband?: ErrorBandConfig;
}
export declare const errorBandNormalizer: CompositeMarkNormalizer<"errorband">;
export declare function normalizeErrorBand(spec: GenericUnitSpec<Encoding<string>, ErrorBand | ErrorBandDef>, { config }: NormalizerParams): NormalizedLayerSpec;
export {};
//# sourceMappingURL=errorband.d.ts.map