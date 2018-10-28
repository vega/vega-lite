import { Config } from '../config';
import { Encoding } from '../encoding';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { Interpolate, Orient } from '../vega.schema';
import { GenericCompositeMarkDef, PartsMixins } from './common';
import { ErrorBarCenter, ErrorBarExtent } from './errorbar';
export declare const ERRORBAND: 'errorband';
export declare type ErrorBand = typeof ERRORBAND;
export declare type ErrorBandPart = 'band' | 'borders';
export declare const ERRORBAND_PARTS: ErrorBandPart[];
export declare type ErrorBandPartsMixins = PartsMixins<ErrorBandPart>;
export interface ErrorBandConfig extends ErrorBandPartsMixins {
    /**
     * The center of the error band. Available options include:
     * - `"mean"`: the mean of the data points.
     * - `"median"`: the median of the data points.
     *
     * __Default value:__ `"mean"`.
     * @hide
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
     * - `"step"`: alternate between horizontal and vertical segments, as in a step function.
     * - `"step-before"`: alternate between vertical and horizontal segments, as in a step function.
     * - `"step-after"`: alternate between horizontal and vertical segments, as in a step function.
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
     * @minimum 0
     * @maximum 1
     */
    tension?: number;
}
export declare type ErrorBandDef = GenericCompositeMarkDef<ErrorBand> & ErrorBandConfig & {
    /**
     * Orientation of the error band. This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orient;
};
export interface ErrorBandConfigMixins {
    /**
     * ErrorBand Config
     */
    errorband?: ErrorBandConfig;
}
export declare function normalizeErrorBand(spec: GenericUnitSpec<Encoding<string>, ErrorBand | ErrorBandDef>, config: Config): NormalizedLayerSpec;
