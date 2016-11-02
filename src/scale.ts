import {DateTime} from './datetime';

export namespace ScaleType {
    export const LINEAR: 'linear' = 'linear';
    export type LINEAR = typeof LINEAR;
    export const LOG: 'log' = 'log';
    export type LOG = typeof LOG;
    export const POW: 'pow' = 'pow';
    export type POW = typeof POW;
    export const SQRT: 'sqrt' = 'sqrt';
    export type SQRT = typeof SQRT;
    export const QUANTILE: 'quantile' = 'quantile';
    export type QUANTILE = typeof QUANTILE;
    export const QUANTIZE: 'quantize' = 'quantize';
    export type QUANTIZE = typeof QUANTIZE;
    export const ORDINAL: 'ordinal' = 'ordinal';
    export type ORDINAL = typeof ORDINAL;
    export const TIME: 'time' = 'time';
    export type TIME = typeof TIME;
    export const UTC: 'utc'  = 'utc';
    export type UTC = typeof UTC;
}
export type ScaleType = ScaleType.LINEAR | ScaleType.LOG | ScaleType.POW
  | ScaleType.SQRT | ScaleType.QUANTILE | ScaleType.QUANTIZE
  | ScaleType.ORDINAL | ScaleType.TIME | ScaleType.UTC;

export namespace NiceTime {
    export const SECOND: 'second' = 'second';
    export type SECOND = typeof SECOND;
    export const MINUTE: 'minute' = 'minute';
    export type MINUTE = typeof MINUTE;
    export const HOUR: 'hour' = 'hour';
    export type HOUR = typeof HOUR;
    export const DAY: 'day' = 'day';
    export type DAY = typeof DAY;
    export const WEEK: 'week' = 'week';
    export type WEEK = typeof WEEK;
    export const MONTH: 'month' = 'month';
    export type MONTH = typeof MONTH;
    export const YEAR: 'year' = 'year';
    export type YEAR = typeof YEAR;
}
export type NiceTime = NiceTime.SECOND | NiceTime.MINUTE | NiceTime.HOUR
  | NiceTime.DAY | NiceTime.WEEK | NiceTime.MONTH | NiceTime.YEAR;

export namespace BandSize {
  export const FIT: 'fit' = 'fit';
  export type FIT = typeof FIT;
}
export type BandSize = BandSize.FIT;

export const BANDSIZE_FIT = BandSize.FIT;

export interface ScaleConfig {
  /**
   * If true, rounds numeric output values to integers.
   * This can be helpful for snapping to the pixel grid.
   * (Only available for `x`, `y`, `size`, `row`, and `column` scales.)
   */
  round?: boolean;
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
   * Default padding for `x` and `y` ordinal scales.
   */
  padding?: number;

  /**
   * Uses the source data range as scale domain instead of aggregated data for aggregate axis.
   * This property only works with aggregate functions that produce values within the raw data domain (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`). For other aggregations that produce values outside of the raw data domain (e.g. `"count"`, `"sum"`), this property is ignored.
   */
  useRawDomain?: boolean;

  /** Default range for nominal color scale */
  nominalColorRange?: string | string[];
  /** Default range for ordinal / continuous color scale */
  sequentialColorRange?: string | string[];
  /** Default range for shape */
  shapeRange?: string | string[];

  /** Default range for bar size scale */
  barSizeRange?: number[];

  /** Default range for font size scale */
  fontSizeRange?: number[];

  /** Default range for rule stroke widths */
  ruleSizeRange?: number[];

  /** Default range for tick spans */
  tickSizeRange?: number[];

  /** Default range for bar size scale */
  pointSizeRange?: number[];

  // nice should depends on type (quantitative or temporal), so
  // let's not make a config.
}

export const defaultScaleConfig = {
  round: true,
  textBandWidth: 90,
  bandSize: 21,
  padding: 0.1,
  useRawDomain: false,
  opacity: [0.3, 0.8],

  nominalColorRange: 'category10',
  sequentialColorRange: ['#AFC6A3', '#09622A'], // tableau greens
  shapeRange: 'shapes',
  fontSizeRange: [8, 40],
  ruleSizeRange: [1, 5],
  tickSizeRange: [1, 20]
};

export interface FacetScaleConfig {
  round?: boolean;
  padding?: number;
}

export const defaultFacetScaleConfig: FacetScaleConfig = {
  round: true,
  padding: 16
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
  range?: string | number[] | string[]; // TODO: declare vgRangeDomain
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
   * Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).
   */
  padding?: number;

  // FIXME: integrated to type when migrate to Vega 3
  points?: boolean;

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
