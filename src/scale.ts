import {DateTime} from './datetime';
import {contains, toSet} from './util';

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

export const CONTINUOUS_TO_CONTINUOUS_SCALES: ScaleType[] = ['linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
const CONTINUOUS_TO_CONTINUOUS_INDEX = toSet(CONTINUOUS_TO_CONTINUOUS_SCALES);

export const CONTINUOUS_DOMAIN_SCALES: ScaleType[] = CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
const CONTINUOUS_DOMAIN_INDEX = toSet(CONTINUOUS_DOMAIN_SCALES);

export const DISCRETE_DOMAIN_SCALES: ScaleType[] = ['ordinal', 'point', 'band'];
const DISCRETE_DOMAIN_INDEX = toSet(DISCRETE_DOMAIN_SCALES);

export const TIME_SCALE_TYPES: ScaleType[] = ['time', 'utc'];

export function hasDiscreteDomain(type: ScaleType): type is 'ordinal' | 'point' | 'band' {
  return type in DISCRETE_DOMAIN_INDEX;
}

export function hasContinuousDomain(type: ScaleType):
  type is 'linear' | 'log' | 'pow' | 'sqrt' |  'time' | 'utc'|
          'sequential' /* TODO add | 'quantile' | 'quantize' | 'threshold' */ {
  return type in CONTINUOUS_DOMAIN_INDEX;
}

export function isContinuousToContinuous(type: ScaleType): type is 'linear' | 'log' | 'pow' | 'sqrt' |  'time' | 'utc' {
  return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
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

export const RANGESTEP_FIT: 'fit' = 'fit';
export type RangeStep = typeof RANGESTEP_FIT;


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
   *  @minimum 0
   */
  textXRangeStep?: number; // FIXME: consider if we will rename this "tableColumnWidth"
  /**
   * Default range step for (1) `y` ordinal scale,
   * and (2) `x` ordinal scale when the mark is not `text`.
   * @minimum 0
   */
  rangeStep?: number | RangeStep;

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

  // nice should depends on type (quantitative or temporal), so
  // let's not make a config.
}

export const defaultScaleConfig = {
  round: true,
  textXRangeStep: 90,
  rangeStep: 21,
  pointPadding: 1,
  bandPadding: 0.1,
  facetSpacing: 16,
  useRawDomain: false,
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
  rangeStep?: number | RangeStep;

  /**
   * Color scheme that determines output color of a color scale.
   */
  scheme?: string;

  /**
   * Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the band size will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).
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
  'type', 'domain', 'range', 'round', 'rangeStep', 'scheme', 'padding', 'clamp', 'nice',
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
      return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
    case 'rangeStep':
    case 'padding':
      return contains(['point', 'band'], scaleType);
    case 'scheme':
      // ordinal can use nominal color scheme, sequential can use sequential color scheme
      return contains(['ordinal', 'sequential'], scaleType);
    case 'clamp':
      return isContinuousToContinuous(scaleType) || scaleType === 'sequential';
    case 'nice':
      return isContinuousToContinuous(scaleType) || scaleType === 'sequential' || scaleType as any === 'quantize';
    case 'exponent':
      return scaleType === 'pow';
    case 'zero':
      // TODO: what about quantize, threshold?
      return !hasDiscreteDomain(scaleType) && !contains(['log', 'time', 'utc'], scaleType);

    case 'useRawDomain':
      // TODO: 'quantize', 'quantile', 'threshold'
      return isContinuousToContinuous(scaleType) || contains(['quantize', 'quantile', 'threshold'], scaleType);
  }
  /* istanbul ignore next: should never reach here*/
  throw new Error(`Invalid scale property ${propName}.`);
}
