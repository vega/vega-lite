import {isArray} from './util';

export type Filter = EqualFilter | RangeFilter | InFilter | CompareFilter;

export interface EqualFilter {
  // TODO: support timeUnit, aggregate, bin
  /**
   * Field to be filtered.
   */
  field: string;

  /**
   * Value that the field should be equal to.
   */
  equal: string | number | boolean;

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}

export function isEqualFilter(filter: any): filter is EqualFilter {
  return filter && !!filter.field && filter.equal!==undefined;
}

export interface RangeFilter {
  // TODO: support timeUnit, aggregate, bin
  /**
   * Field to be filtered
   */
  field: string;

  /**
   * Array of inclusive minimum and maximum values
   * for a field value of a data item to be included in the filtered data.
   * @maxItems 2
   * @minItems 2
   */
  range: any;

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}

export function isRangeFilter(filter: any): filter is RangeFilter {
  if (filter && !!filter.field) {
    if (isArray(filter.range) && filter.range.length === 2) {
      return true;
    }
  }
  return false;
}



export type CompareFilter = LtFilter | LteFilter | GtFilter | GteFilter;
  // TODO: add this once this issue is supported:
  // https://github.com/YousefED/typescript-json-schema/issues/46
  // Or undo splitting CompareFilter if the following issue is supported
  // https://github.com/YousefED/typescript-json-schema/issues/47

  // combination of lt/lte and gt/gte
  // (LtFilter & GtFilter) |
  // (LtFilter & GteFilter) |
  // (LteFilter & GtFilter) |
  // (LteFilter & GteFilter);

export interface LtFilter {
  /**
   * Field to be filtered
   */
  field: string;

  /**
   * Value that the `field`'s value should be less than
   */
  lt: number;

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}


export interface LteFilter {
  /**
   * Field to be filtered
   */
  field: string;

  /**
   * Value that the `field`'s value should be less than or equal to
   */
  lte: number;

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}


export interface GtFilter {
  /**
   * Field to be filtered
   */
  field: string;

  /**
   * Value that the `field`'s value should be greater than
   */
  gt: number;

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}


export interface GteFilter {
  /**
   * Field to be filtered
   */
  field: string;

  /**
   * Value that the `field`'s value should be greater than or equal to
   */
  gte: number;

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}



export function isCompareFilter(filter: any): filter is CompareFilter {
  if (filter && !!filter.field) {
    if (filter.gt !==undefined || filter.gte!==undefined || filter.lt!==undefined || filter.lte!==undefined ) {
      return true;
    }
  }
  return false;
}

export interface InFilter {
  // TODO: support timeUnit, aggregate, bin
  /**
   * Field to be filtered
   */
  field: string;

  /**
   * A set of values that the `field`'s value should be a member of,
   * for a data item included in the filtered data.
   * @minItems 1
   */
  in: any[];

  /**
   * If `true`, negate the logic. Default value : `false`
   */
  negate?: boolean;
}

export function isInFilter(filter: any): filter is InFilter {
  return filter && !!filter.field && isArray(filter.in);
}
