import {Data} from './data';
import {Filter} from './filter';

export interface FilterTransform {
  /**
   * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
   */
  filter: Filter;
}

export function isFilter(t: Transform): t is FilterTransform {
  return t['filter'] !== undefined;
}


export interface CalculateTransform {
  /**
   * A string containing a Vega Expression. Use the variable `datum` to refer to the current data object.
   */
  calculate: string;
  /**
   * The field for storing the computed formula value.
   */
  as: string;
}

export function isCalculate(t: Transform): t is CalculateTransform {
  return t['calculate'] !== undefined;
}

export interface LookupData {
  /**
   * secondary data source to lookup in
   */
  data: Data;
  /**
   * key in data to lookup
   */
  key: string;
  /**
   * (Optional) fields in foreign data to lookup
   * if not specificied, the entire object is queried
   */
  fields?: string;
}

export interface LookupTransform {
  /**
   * key in primary data source
   */
  lookup: string;
  /**
   * secondary data reference
   */
  from: LookupData;
  /**
   * (Optional) The field or fields for storing the computed formula value.
   * If `from.fields` is not specified, `as` has to be a string and we put the whole object into the data
   */
  as?: string | string[];
  /**
   * (Optional) The default value to use if lookup fails
   */
  default?: string;
}

export function isLookup(t: Transform): t is LookupTransform {
  return t['lookup'] !== undefined;
}

export type Transform = FilterTransform | CalculateTransform | LookupTransform;
