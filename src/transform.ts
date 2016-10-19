import {Filter} from './filter';

/**
 * Top-level transform object.
 */
export interface Transform {
  /**
   * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
   */
  filter?: string | Filter | (string | Filter)[];
  /**
   * Whether to filter invalid values (`null` and `NaN`) from the data. By default (`undefined`), only quantitative and temporal fields are filtered. If set to `true`, all data items with null values are filtered. If `false`, all data items are included.
   */
  filterInvalid?: boolean;
  /**
   * Calculate new field(s) using the provided expresssion(s). Calculation are applied before filter.
   */
  calculate?: Formula[];
}

/**
 * Formula object for calculate.
 */
export interface Formula {
  /**
   * The field in which to store the computed formula value.
   */
  field: string;
  /**
   * A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object.
   */
  expr: string;
}
