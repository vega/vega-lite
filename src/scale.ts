import {DateTime} from './datetime';
import {contains, toMap} from './util';

export namespace ScaleType {
  // Continuous - Quantitative
  export const LINEAR: 'linear' = 'linear';
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

  // TODO: rename this back to ORDINAL once we are done
  export const ORDINAL_LOOKUP: 'ordinal' = 'ordinal';
  export const POINT: 'point' = 'point';
  export const BAND: 'band' = 'band';
}

export type ScaleType = typeof ScaleType.LINEAR |
  typeof ScaleType.LOG | typeof ScaleType.POW | typeof ScaleType.SQRT |
  typeof ScaleType.TIME | typeof ScaleType.UTC |
  // TODO: add 'quantize', 'quantile', 'threshold' back when we really support them
  typeof ScaleType.SEQUENTIAL | // typeof ScaleType.QUANTILE | typeof ScaleType.QUANTIZE | typeof ScaleType.THRESHOLD |
  typeof ScaleType.ORDINAL_LOOKUP | typeof ScaleType.POINT | typeof ScaleType.BAND;

export const SCALE_TYPES: ScaleType[] = [
  // Continuous - Quantitative
  'linear', 'log', 'pow', 'sqrt',
  // Continuous - Time
  'time', 'utc',
  // Sequential
  'sequential', // TODO: add 'quantile', 'quantize' when we really support them
  // Discrete
  'ordinal', 'point', 'band',
];

export const CONTINUOUS_SCALE_TYPES: ScaleType[] = ['linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
const CONTINUOUS_SCALE_TYPE_INDEX = toMap(CONTINUOUS_SCALE_TYPES);

export const DISCRETE_SCALE_TYPES: ScaleType[] = ['ordinal', 'point', 'band'];
const DISCRETE_SCALE_TYPE_INDEX = toMap(DISCRETE_SCALE_TYPES);

export const TIME_SCALE_TYPES: ScaleType[] = ['time', 'utc'];

export function isDiscreteScale(type: ScaleType): type is 'ordinal' | 'point' | 'band' {
  return type in DISCRETE_SCALE_TYPE_INDEX;
}
export function isContinuousScale(type: ScaleType): type is 'linear' | 'log' | 'pow' | 'sqrt' |  'time' | 'utc' {
  return type in CONTINUOUS_SCALE_TYPE_INDEX;
}

export namespace NiceTime {
  export const SECOND: 'second' = 'second';
  export const MINUTE: 'minute' = 'minute';
  export const HOUR: 'hour' = 'hour';
  export const DAY: 'day' = 'day';
  export const WEEK: 'week' = 'week';
  export const MONTH: 'month' = 'month';
  export const YEAR: 'year' = 'year';
}

export type NiceTime = typeof NiceTime.SECOND | typeof NiceTime.MINUTE | typeof NiceTime.HOUR
  | typeof NiceTime.DAY | typeof NiceTime.WEEK | typeof NiceTime.MONTH | typeof NiceTime.YEAR;

export const BANDSIZE_FIT: 'fit' = 'fit';
export type BandSize = typeof BANDSIZE_FIT;


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
   *  Default band width for `x` ordinal scale when is mark is `text`.
   *  @minimum 0
   */
  textBandWidth?: number;
  /**
   * Default band size for (1) `y` ordinal scale,
   * and (2) `x` ordinal scale when the mark is not `text`.
   * @minimum 0
   */
  bandSize?: number | BandSize;
  /**
   * Default range for opacity.
   */
  opacity?: number[];
  /**
   * Default padding for `x` and `y` band-ordinal scales.
   * @minimum 0
   * @maximum 1
   */
  bandPadding?: number;
  /**
   * Default padding for `x` and `y` point-ordinal scales.
   * @minimum 0
   * @maximum 1
   */
  pointPadding?: number;

  /**
   * Default spacing between faceted plots.
   * @type {integer}
   * @minimum 0
   */
  facetSpacing?: number;

  /**
   * Uses the source data range as scale domain instead of aggregated data for aggregate axis.
   * This property only works with aggregate functions that produce values within the raw data domain (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`). For other aggregations that produce values outside of the raw data domain (e.g. `"count"`, `"sum"`), this property is ignored.
   */
  useRawDomain?: boolean;

  /** Default color scheme for nominal (categorical) data */
  nominalColorScheme?: string;

  /** Default color scheme for ordinal, quantitative and temporal field */
  sequentialColorScheme?: string;

  /** Default range for shape */
  shapeRange?: string[];

  /**
   * Default minimum range for bar size scale with zero=false.
   * @minimum 1
   */
  minBarSize?: number;

  /**
   * Default max range for bar size scale.
   * If undefined (default), we will use bandSize - 1.
   * @minimum 1
   */
  maxBarSize?: number;

  /**
   * Default minimum range for tick size (tick span) scale with zero=false.
   * @minimum 1
   */
  minTickSize?: number;

  /**
   * Default max range for tick size (tick span) scale.
   * If undefined (default), we will use bandSize - 1.
   * @minimum 1
   */
  maxTickSize?: number;

  /**
   * Default minimum range for rule size (strokeWidth) scale with zero=false.
   * @minimum 1
   */
  minRuleSize?: number;

  /**
   * Default max range for rule size (strokeWidth) scale.
   * @minimum 1
   */
  maxRuleSize?: number;

  /**
   * Default minimum range for point size scale with zero=false.
   * @minimum 1
   */
  minPointSize?: number;

  /**
   * Default max range for point size scale.
   * @minimum 1
   */
  maxPointSize?: number;

  /**
   * Default minimum range for text size (fontSize) scale with zero=false.
   * @minimum 1
   */
  minTextSize?: number;

  /**
   * Default max range for text size (fontSize) scale.
   * @minimum 1
   */
  maxTextSize?: number;

  // nice should depends on type (quantitative or temporal), so
  // let's not make a config.
}

export const defaultScaleConfig = {
  round: true,
  textBandWidth: 90,
  bandSize: 21,
  pointPadding: 1,
  bandPadding: 0.1,
  facetSpacing: 16,
  useRawDomain: false,
  opacity: [0.3, 0.8],

  // if tickSize = 1, it becomes a dot.
  // To be consistent, we just use 3 to be somewhat consistent with point, which use area = 9.
  minTickSize: 3,

  minRuleSize: 1,
  maxRuleSize: 5,

  // TODO: revise if these *can* become ratios of rangeStep
  minPointSize: 9, // Point size is area. For square point, 9 = 3 pixel ^ 2, not too small!

  // QUESTION: should these be min/maxFontSize?
  minTextSize: 8, // smaller than 8 would be illegible
  maxTextSize: 40,

  nominalColorScheme: 'category10',
  sequentialColorScheme: 'Greens',
  shapeRange: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
};

export interface Scale {
  type?: ScaleType;
  /**
   * The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values.
   */
  domain?: number[] | string[] | DateTime[];
  /**
   * The range of the scale, representing the set of visual values. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. For ordinal scales only, the range can be defined using a DataRef: the range values are then drawn dynamically from a backing data set.
   */
  range?: number[] | string[]; // TODO: declare vgRangeDomain
  /**
   * If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.
   */
  round?: boolean;

  // ordinal
  /**
   * @minimum 0
   */
  bandSize?: number | BandSize;

  /**
   * Color scheme that determines output color of a color scale.
   */
  scheme?: string;

  /**
   * Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).
   */
  padding?: number;

  // typical
  /**
   * If true, values that exceed the data domain are clamped to either the minimum or maximum range value
   */
  clamp?: boolean;
  /**
   * If specified, modifies the scale domain to use a more human-friendly value range. If specified as a true boolean, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96). If specified as a string, modifies the scale domain to use a more human-friendly value range. For time and utc scale types only, the nice value should be a string indicating the desired time interval.
   */
  nice?: boolean | NiceTime;
  /**
   * Sets the exponent of the scale transformation. For pow scale types only, otherwise ignored.
   */
  exponent?: number;
  /**
   * If `true`, ensures that a zero baseline value is included in the scale domain.
   * Default value: `true` for `x` and `y` channel if the quantitative field is not binned
   * and no custom `domain` is provided; `false` otherwise.
   */
  zero?: boolean;

  // Vega-Lite only
  /**
   * Uses the source data range as scale domain instead of aggregated data for aggregate axis.
   * This property only works with aggregate functions that produce values within the raw data domain (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`). For other aggregations that produce values outside of the raw data domain (e.g. `"count"`, `"sum"`), this property is ignored.
   */
  useRawDomain?: boolean;
}

export const SCALE_PROPERTIES = [
  'type', 'domain', 'range', 'round', 'bandSize', 'scheme', 'padding', 'clamp', 'nice',
  'exponent', 'zero',
  // TODO: add interpolate here
  // FIXME: determine if 'useRawDomain' should really be included here
  'useRawDomain'
];

export function scaleTypeSupportProperty(scaleType: ScaleType, propName: string) {
  switch (propName) {
    case 'type':
    case 'domain':
      return true;
    case 'range':
      return scaleType !== 'sequential'; // sequential only support scheme
    case 'round':
      return isContinuousScale(scaleType) || scaleType === 'band' || scaleType === 'point';
    case 'bandSize':
    case 'padding':
      return contains(['point', 'band'], scaleType);
    case 'scheme':
      return contains(['ordinal', 'sequential'], scaleType);
    case 'clamp':
      return isContinuousScale(scaleType) || scaleType === 'sequential';
    case 'nice':
      return isContinuousScale(scaleType) || scaleType === 'sequential' || scaleType as any === 'quantize';
    case 'exponent':
      return scaleType === 'pow';
    case 'zero':
      // TODO: what about quantize, threshold?
      return !isDiscreteScale(scaleType) && !contains(['log', 'time', 'utc'], scaleType);

    case 'useRawDomain':
      // TODO: 'quantize', 'quantile', 'threshold'
      return isContinuousScale(scaleType) || contains(['quantize', 'quantile', 'threshold'], scaleType);
  }
  /* istanbul ignore next: should never reach here*/
  throw new Error(`Invalid scale property ${propName}.`);
}
