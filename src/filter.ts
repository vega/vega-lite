import {DateTime} from './datetime';
import {TimeUnit} from './timeunit';
import {isArray} from './util';

export type Filter = EqualFilter | RangeFilter | InFilter ;


export interface EqualFilter {
  // TODO: support aggregate

  /**
   * Time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

  /**
   * Field to be filtered.
   */
  field: string;

  /**
   * Value that the field should be equal to.
   */
  equal: string | number | boolean | DateTime;

}

export function isEqualFilter(filter: any): filter is EqualFilter {
  return filter && !!filter.field && filter.equal!==undefined;
}

export interface RangeFilter {
  // TODO: support aggregate

  /**
   * time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

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
  range: Array<number|DateTime>;

}

export function isRangeFilter(filter: any): filter is RangeFilter {
  if (filter && !!filter.field) {
    if (isArray(filter.range) && filter.range.length === 2) {
      return true;
    }
  }
  return false;
}

export interface InFilter {
  // TODO: support aggregate

  /**
   * time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

  /**
   * Field to be filtered
   */
  field: string;

  /**
   * A set of values that the `field`'s value should be a member of,
   * for a data item included in the filtered data.
   */
  in: Array<string|number|boolean|DateTime>;

}

export function isInFilter(filter: any): filter is InFilter {
  return filter && !!filter.field && isArray(filter.in);
}
