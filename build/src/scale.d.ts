import { Channel } from './channel';
import { DateTime } from './datetime';
export declare namespace ScaleType {
    const LINEAR: 'linear';
    const BIN_LINEAR: 'bin-linear';
    const LOG: 'log';
    const POW: 'pow';
    const SQRT: 'sqrt';
    const TIME: 'time';
    const UTC: 'utc';
    const SEQUENTIAL: 'sequential';
    const QUANTILE: 'quantile';
    const QUANTIZE: 'quantize';
    const THRESHOLD: 'threshold';
    const ORDINAL: 'ordinal';
    const BIN_ORDINAL: 'bin-ordinal';
    const POINT: 'point';
    const BAND: 'band';
}
export declare type ScaleType = typeof ScaleType.LINEAR | typeof ScaleType.BIN_LINEAR | typeof ScaleType.LOG | typeof ScaleType.POW | typeof ScaleType.SQRT | typeof ScaleType.TIME | typeof ScaleType.UTC | typeof ScaleType.SEQUENTIAL | typeof ScaleType.ORDINAL | typeof ScaleType.BIN_ORDINAL | typeof ScaleType.POINT | typeof ScaleType.BAND;
export declare const SCALE_TYPES: ScaleType[];
export declare const CONTINUOUS_TO_CONTINUOUS_SCALES: ScaleType[];
export declare const CONTINUOUS_DOMAIN_SCALES: ScaleType[];
export declare const DISCRETE_DOMAIN_SCALES: ScaleType[];
export declare const TIME_SCALE_TYPES: ScaleType[];
export declare function hasDiscreteDomain(type: ScaleType): type is 'ordinal' | 'bin-ordinal' | 'point' | 'band';
export declare function isBinScale(type: ScaleType): type is 'bin-linear' | 'bin-ordinal';
export declare function hasContinuousDomain(type: ScaleType): type is 'linear' | 'log' | 'pow' | 'sqrt' | 'time' | 'utc' | 'sequential';
export declare function isContinuousToContinuous(type: ScaleType): type is 'linear' | 'bin-linear' | 'log' | 'pow' | 'sqrt' | 'time' | 'utc';
export declare type NiceTime = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export interface ScaleConfig {
    /**
     * If true, rounds numeric output values to integers.
     * This can be helpful for snapping to the pixel grid.
     * (Only available for `x`, `y`, `size`, `row`, and `column` scales.)
     */
    round?: boolean;
    /**
     * If true, values that exceed the data domain are clamped to either the minimum or maximum range value
     */
    clamp?: boolean;
    /**
     *  Default range step for `x` ordinal scale when is mark is `text`.
     *
     * __Default value:__ `90`
     *
     *  @minimum 0
     */
    textXRangeStep?: number;
    /**
     * Default range step for (1) `y` ordinal scale,
     * and (2) `x` ordinal scale when the mark is not `text`.
     *
     * __Default value:__ `21`
     *
     * @minimum 0
     * @nullable
     */
    rangeStep?: number | null;
    /**
     * Default inner padding for `x` and `y` band-ordinal scales.
     *
     * __Default value:__ `0.1`
     *
     * @minimum 0
     * @maximum 1
     */
    bandPaddingInner?: number;
    /**
     * Default outer padding for `x` and `y` band-ordinal scales.
     * If not specified, by default, band scale's paddingOuter is paddingInner/2.
     * @minimum 0
     * @maximum 1
     */
    bandPaddingOuter?: number;
    /**
     * Default outer padding for `x` and `y` point-ordinal scales.
     *
     * __Default value:__ `0.5`
     *
     * @minimum 0
     * @maximum 1
     */
    pointPadding?: number;
    /**
     * Default spacing between faceted plots.
     *
     * __Default value:__ `16`
     *
     * @TJS-type integer
     * @minimum 0
     */
    facetSpacing?: number;
    /**
     * Use the source data range before aggregation as scale domain instead of aggregated data for aggregate axis.
     * This property only works with aggregate functions that produce values within the raw data domain (`"mean"`, `"average"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`). For other aggregations that produce values outside of the raw data domain (e.g. `"count"`, `"sum"`), this property is ignored.
     */
    useUnaggregatedDomain?: boolean;
    /**
     * The default max value for mapping quantitative fields to bar's size/bandSize.
     * If undefined (default), we will use bandSize - 1.
     * @minimum 0
     */
    maxBandSize?: number;
    /**
     * The default min value for mapping quantitative fields to bar and tick's size/bandSize scale with zero=false
     * If undefined (default), we will use the `continuousBandSize` value for bar and 3 for ticks.
     * @minimum 0
     */
    minBandSize?: number;
    /**
     * The default max value for mapping quantitative fields to text's size/fontSize.
     * If undefined (default), we will use bandSize - 1.
     *
     * __Default value:__ `40`
     *
     * @minimum 0
     */
    maxFontSize?: number;
    /**
     * The default min value for mapping quantitative fields to tick's size/fontSize scale with zero=false
     *
     * __Default value:__ `8`
     *
     * @minimum 0
     */
    minFontSize?: number;
    /**
     * Default minimum opacity for mapping a field to opacity.
     *
     * __Default value:__ `0.3`
     *
     * @minimum 0
     * @maximum 1
     */
    minOpacity?: number;
    /**
     * Default max opacity for mapping a field to opacity.
     *
     * __Default value:__ `0.8`
     *
     * @minimum 0
     * @maximum 1
     */
    maxOpacity?: number;
    /**
     * Default minimum value for point size scale with zero=false.
     *
     * __Default value:__ `9`
     *
     * @minimum 0
     */
    minSize?: number;
    /**
     * Default max value for point size scale.
     * @minimum 0
     */
    maxSize?: number;
    /**
     * Default minimum strokeWidth for strokeWidth (or rule/line's size) scale with zero=false.
     *
     * __Default value:__ `1`
     *
     * @minimum 0
     */
    minStrokeWidth?: number;
    /**
     * Default max strokeWidth for strokeWidth  (or rule/line's size) scale.
     *
     * __Default value:__ `4`
     *
     * @minimum 0
     */
    maxStrokeWidth?: number;
    /**
     * The default collection of symbol shapes for mapping nominal fields to shapes of point marks (i.e., range of a `shape` scale).
     * Each value should be one of: `"circle"`, `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`, or a custom SVG path.
     *
     * __Default value:__ `["circle", "square", "cross", "diamond", "triangle-up", "triangle-down"]`
     *
     */
    shapes?: string[];
}
export declare const defaultScaleConfig: {
    round: boolean;
    textXRangeStep: number;
    rangeStep: number;
    pointPadding: number;
    bandPaddingInner: number;
    facetSpacing: number;
    minFontSize: number;
    maxFontSize: number;
    minOpacity: number;
    maxOpacity: number;
    minSize: number;
    minStrokeWidth: number;
    maxStrokeWidth: number;
    shapes: string[];
};
export interface ExtendedScheme {
    /**
     * Color scheme that determines output color of an ordinal/sequential color scale.
     */
    name: string;
    extent?: number[];
    count?: number;
}
export declare type Domain = number[] | string[] | DateTime[] | 'unaggregated';
export declare type Scheme = string | ExtendedScheme;
export declare type Range = number[] | string[] | string;
export declare function isExtendedScheme(scheme: string | ExtendedScheme): scheme is ExtendedScheme;
export interface Scale {
    /**
     * The type of scale.
     * - For a _quantitative_ field, supported quantitative scale types  are `"linear"` (default), `"log"`, `"pow"`, `"sqrt"`, `"quantile"`, `"quantize"`, and `"threshold"`.
     * - For a _temporal_ field without `timeUnit`, the scale type should be `"time"` (default) or `"ordinal"`.
     * - For _ordinal_ and _nominal_ fields, the type is always `"ordinal"`.
     * Unsupported values will be ignored.
     */
    type?: ScaleType;
    /**
     * The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values.
     *
     * If the domain is `"unaggregated"`, we use the source data range before aggregation as scale domain instead of aggregated data for aggregate axis.
     * This property only works with aggregate functions that produce values within the raw data domain (`"mean"`, `"average"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`). For other aggregations that produce values outside of the raw data domain (e.g. `"count"`, `"sum"`), this property is ignored.
     */
    domain?: Domain;
    /**
     * The range of the scale, representing the set of visual values. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain.
     */
    range?: Range;
    /**
     * If `true`, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.
     *
     * __Default Rule:__ `true` for `"x"`, `"y"`, `"row"`, `"column"` channels if scale config's `round` is `true`; `false` otherwise.
     */
    round?: boolean;
    /**
     * The distance between the starts of adjacent bands or points in band or point scales.
     * If this value is `null`, this will be determined to fit width (for x) or height (for y) of the plot.
     * If both width and x-scale's rangeStep is provided, rangeStep will be dropped.  (The same rule is applied for height and y-scale's rangeStep.)
     *
     * __Default Rule:__ for `x` ordinal scale of a `text` mark, derived from [scale config](config.html#scale-config)'s `textXRangeStep`. Otherwise, derived from [scale config](config.html#scale-config)'s `rangeStep`.
     * __Warning:__ If the cardinality of the scale domain is too high, the rangeStep might become less than one pixel and the mark might not appear correctly.
     * @minimum 0
     * @nullable
     */
    rangeStep?: number | null;
    /**
     * Range scheme (e.g., color schemes such as `"category10"` or `"viridis"`).
     *
     * __Default value:__ [scale config](config.html#scale-config)'s `"nominalColorScheme"` for nominal field and `"sequentialColorScheme"` for other types of fields.
     *
     */
    scheme?: Scheme;
    /**
     * (For `row` and `column` only) A pixel value for padding between cells in the trellis plots.
     *
     * __Default value:__ derived from [scale config](config.html#scale-config)'s `facetSpacing`
     *
     * @TJS-type integer
     */
    spacing?: number;
    /**
     * Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the band size will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).
     * A convenience property for setting the inner and outer padding to the same value.
     *
     * __Default value:__ `x` and `y` channels are derived from [scale config](config.html#scale-config)'s `pointPadding` for `point` scale and `bandPadding` for `band` scale.  Other channels has `0` padding by default.
     *
     * @minimum 0
     * @maximum 1
     */
    padding?: number;
    /**
     * The inner padding of a band scale determines the ratio of the range that is reserved for blank space between bands. (For point scale, this property is ignored.)
     * @minimum 0
     * @maximum 1
     */
    paddingInner?: number;
    /**
     * The outer padding determines the ratio of the range that is reserved for blank space before the first and after the last bands/points.
     * @minimum 0
     * @maximum 1
     */
    paddingOuter?: number;
    /**
     * If `true`, values that exceed the data domain are clamped to either the minimum or maximum range value
     *
     * __Default value:__ derived from [scale config](config.html#scale-config) (`true` by default)
     *
     * __Supported types:__ only `linear`, `pow`, `sqrt`, and `log` (Not applicable for `quantile`, `quantize`, and `threshold` scales as they output discrete ranges.)
     *
     */
    clamp?: boolean;
    /**
     * As quantitative scale property, if specified, modifies the scale domain to use a more human-friendly value range. If specified as a `true` boolean, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96). If specified as a string, modifies the scale domain to use a more human-friendly value range. For time and utc scale types only, the nice value should be a string indicating the desired time interval.
     * As time scale properties, if `true`, values that exceed the data domain are clamped to either the minimum or maximum range value. (Not applicable for `quantile`, `quantize`, and `threshold` scales as they output discrete ranges.)
     *
     * __Default value:__ `true` only for quantitative x and y scales and `false` otherwise.
     *
     */
    nice?: boolean | string;
    /**
     * Sets the exponent of the scale transformation. For `pow` scale types only, otherwise ignored.
     */
    exponent?: number;
    /**
     * If `true`, ensures that a zero baseline value is included in the scale domain.
     * Default value: `true` for `x` and `y` channel if the quantitative field is not binned
     * and no custom `domain` is provided; `false` otherwise.
     *
     * __Default value:__ `true` for `x` and `y` channel if the quantitative field is not binned and no custom `domain` is provided; `false` otherwise.
     *
     * __Note:__  This property is always `false` for log scale.
     *
     */
    zero?: boolean;
    interpolate?: 'rgb' | 'lab' | 'hcl' | 'hsl' | 'hsl-long' | 'hcl-long' | 'cubehelix' | 'cubehelix-long';
}
export declare const SCALE_PROPERTIES: (keyof Scale)[];
export declare function scaleTypeSupportProperty(scaleType: ScaleType, propName: keyof Scale): boolean;
/**
 * Returns undefined if the input channel supports the input scale property name
 */
export declare function channelScalePropertyIncompatability(channel: Channel, propName: keyof Scale): string;
