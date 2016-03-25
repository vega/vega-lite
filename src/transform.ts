export interface Transform {
  /**
   * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
   */
  filter?: string;

  /**
   * Filter null values from the data. If set to true, all rows with null values are filtered. If false, no rows are filtered. Set the property to undefined to filter only quantitative and temporal fields.
   */
  filterNull?: boolean;

  /**
   * Calculate new field(s) using the provided expresssion(s). Calculation are applied before filter.
   */
  calculate?: Formula[];

  /**
   * Lookup values from another dataset
   */
  lookup?: Lookup[];
}

// TODO move all Vega interfaces to one central position
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

// TODO: revise this to be a bit slimmer. Separate vega transform and vega-lite lookup object.
export interface Lookup {
  type?: string;
  on: string;
  onKey: string;
  keys: string[];
  as: string[];
  default: any;
}
