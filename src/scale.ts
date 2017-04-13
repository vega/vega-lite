import {Channel} from './channel';
import {DateTime} from './datetime';
import * as log from './log';
import {contains, toSet} from './util';

export namespace ScaleType {
  // Continuous - Quantitative
  export const LINEAR: 'linear' = 'linear';
  export const BIN_LINEAR: 'bin-linear' = 'bin-linear';
  export const LOG: 'log' = 'log';
  export const POW: 'pow' = 'pow';
  export const SQRT: 'sqrt' = 'sqrt';
  // Continuous - Time
  export const TIME: 'time' = 'time';
  export const UTC: 'utc'  = 'utc';
  // sequential
  export const SEQUENTIAL: 'sequential' = 'sequential';

  // Quantile, Quantize, threshold
  export const QUANTILE: 'quantile' = 'quantile';
  export const QUANTIZE: 'quantize' = 'quantize';
  export const THRESHOLD: 'threshold' = 'threshold';

  export const ORDINAL: 'ordinal' = 'ordinal';
  export const BIN_ORDINAL: 'bin-ordinal' = 'bin-ordinal';
  export const POINT: 'point' = 'point';
  export const BAND: 'band' = 'band';
}

export type ScaleType = typeof ScaleType.LINEAR | typeof ScaleType.BIN_LINEAR |
  typeof ScaleType.LOG | typeof ScaleType.POW | typeof ScaleType.SQRT |
  typeof ScaleType.TIME | typeof ScaleType.UTC |
  // TODO: add 'quantize', 'quantile', 'threshold' back when we really support them
  typeof ScaleType.SEQUENTIAL | // typeof ScaleType.QUANTILE | typeof ScaleType.QUANTIZE | typeof ScaleType.THRESHOLD |
  typeof ScaleType.ORDINAL | typeof ScaleType.BIN_ORDINAL | typeof ScaleType.POINT | typeof ScaleType.BAND;

export const SCALE_TYPES: ScaleType[] = [
  // Continuous - Quantitative
  'linear', 'bin-linear', 'log', 'pow', 'sqrt',
  // Continuous - Time
  'time', 'utc',
  // Sequential
  'sequential', // TODO: add 'quantile', 'quantize' when we really support them
  // Discrete
  'ordinal', 'bin-ordinal', 'point', 'band',
];

export const CONTINUOUS_TO_CONTINUOUS_SCALES: ScaleType[] = ['linear', 'bin-linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
const CONTINUOUS_TO_CONTINUOUS_INDEX = toSet(CONTINUOUS_TO_CONTINUOUS_SCALES);

export const CONTINUOUS_DOMAIN_SCALES: ScaleType[] = CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
const CONTINUOUS_DOMAIN_INDEX = toSet(CONTINUOUS_DOMAIN_SCALES);

export const DISCRETE_DOMAIN_SCALES: ScaleType[] = ['ordinal', 'bin-ordinal', 'point', 'band'];
const DISCRETE_DOMAIN_INDEX = toSet(DISCRETE_DOMAIN_SCALES);

const BIN_SCALES_INDEX = toSet(['bin-linear', 'bin-ordinal']);

export const TIME_SCALE_TYPES: ScaleType[] = ['time', 'utc'];

export function hasDiscreteDomain(type: ScaleType): type is 'ordinal' | 'bin-ordinal' | 'point' | 'band' {
  return type in DISCRETE_DOMAIN_INDEX;
}

export function isBinScale(type: ScaleType): type is 'bin-linear' | 'bin-ordinal' {
  return type in BIN_SCALES_INDEX;
}

export function hasContinuousDomain(type: ScaleType):
  type is 'linear' | 'log' | 'pow' | 'sqrt' |  'time' | 'utc'|
          'sequential' /* TODO add | 'quantile' | 'quantize' | 'threshold' */ {
  return type in CONTINUOUS_DOMAIN_INDEX;
}

export function isContinuousToContinuous(type: ScaleType): type is 'linear' | 'bin-linear' | 'log' | 'pow' | 'sqrt' |  'time' | 'utc' {
  return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
}

export type NiceTime = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

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
  textXRangeStep?: number; // FIXME: consider if we will rename this "tableColumnWidth"
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

  // nice should depends on type (quantitative or temporal), so
  // let's not make a config.

  // Configs for Range


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

export const defaultScaleConfig = {
  round: true,
  textXRangeStep: 90,
  rangeStep: 21,
  pointPadding: 0.5,
  bandPaddingInner: 0.1,
  facetSpacing: 16,

  minFontSize: 8,
  maxFontSize: 40,

  minOpacity: 0.3,
  maxOpacity: 0.8,

  // FIXME: revise if these *can* become ratios of rangeStep
  minSize: 9, // Point size is area. For square point, 9 = 3 pixel ^ 2, not too small!

  minStrokeWidth: 1,
  maxStrokeWidth: 4,

  shapes: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down']
};

export interface ExtendedScheme {
  /**
   * Color scheme that determines output color of an ordinal/sequential color scale.
   */
  name: string;

  // TODO: add docs
  extent?: number[];

  // TODO: add docs
  count?: number;
}

export type Domain = number[] | string[] | DateTime[] | 'unaggregated';
export type Scheme = string | ExtendedScheme;

export type Range = number[] | string[] | string;

export function isExtendedScheme(scheme: string | ExtendedScheme): scheme is ExtendedScheme {
  return scheme && !!scheme['name'];
}

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

  // ordinal
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

  // typical
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

  // FIXME: Add description
  interpolate?: 'rgb'| 'lab' | 'hcl' | 'hsl' | 'hsl-long' | 'hcl-long' | 'cubehelix' | 'cubehelix-long';
}

export const SCALE_PROPERTIES:(keyof Scale)[]= [
  'type', 'domain', 'range', 'round', 'rangeStep', 'scheme', 'padding', 'paddingInner', 'paddingOuter', 'clamp', 'nice',
  'exponent', 'zero', 'interpolate'
];

export function scaleTypeSupportProperty(scaleType: ScaleType, propName: keyof Scale) {
  switch (propName) {
    case 'type':
    case 'domain':
    case 'range':
    case 'scheme':
      return true;
    case 'interpolate':
      return contains(['linear', 'bin-linear', 'pow', 'log', 'sqrt', 'utc', 'time'], scaleType);
    case 'round':
      return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
    case 'rangeStep':
    case 'padding':
    case 'paddingOuter':
      return contains(['point', 'band'], scaleType);
    case 'paddingInner':
      return scaleType === 'band';
    case 'clamp':
      return isContinuousToContinuous(scaleType) || scaleType === 'sequential';
    case 'nice':
      return isContinuousToContinuous(scaleType) || scaleType === 'sequential' || scaleType as any === 'quantize';
    case 'exponent':
      return scaleType === 'pow' || scaleType === 'log';
    case 'zero':
      // TODO: what about quantize, threshold?
      return scaleType === 'bin-ordinal' || (!hasDiscreteDomain(scaleType) && !contains(['log', 'time', 'utc', 'bin-linear'], scaleType));
  }
  /* istanbul ignore next: should never reach here*/
  throw new Error(`Invalid scale property ${propName}.`);
}

/**
 * Returns undefined if the input channel supports the input scale property name
 */
export function channelScalePropertyIncompatability(channel: Channel, propName: keyof Scale): string {
  switch (propName) {
    case 'range':
      // User should not customize range for position and facet channel directly.
      if (channel === 'x' || channel === 'y') {
        return log.message.CANNOT_USE_RANGE_WITH_POSITION;
      }
      if (channel === 'row' || channel === 'column') {
        return log.message.cannotUseRangePropertyWithFacet('range');
      }
      return undefined; // GOOD!
    // band / point
    case 'rangeStep':
      if (channel === 'row' || channel === 'column') {
        return log.message.cannotUseRangePropertyWithFacet('rangeStep');
      }
      return undefined; // GOOD!
    case 'padding':
    case 'paddingInner':
    case 'paddingOuter':
      if (channel === 'row' || channel === 'column') {
        /*
         * We do not use d3 scale's padding for row/column because padding there
         * is a ratio ([0, 1]) and it causes the padding to be decimals.
         * Therefore, we manually calculate "spacing" in the layout by ourselves.
         */
        return log.message.CANNOT_USE_PADDING_WITH_FACET;
      }
      return undefined; // GOOD!
    case 'interpolate':
    case 'scheme':
      if (channel !== 'color') {
        return log.message.cannotUseScalePropertyWithNonColor(channel);
      }
      return undefined;
    case 'type':
    case 'domain':
    case 'round':
    case 'clamp':
    case 'exponent':
    case 'nice':
    case 'zero':
      // These channel do not have strict requirement
      return undefined; // GOOD!
  }
  /* istanbul ignore next: it should never reach here */
  throw new Error('Invalid scale property "${propName}".');
}
