export type SortEnum = string; // TODO: string literal "ascending", "descending", "none"

export interface SortField {
  /**
   * The field name to aggregate over.
   */
  field: string;
  /**
   * The field name to aggregate over.
   * @enum ["values", "count", "valid", "missing", "distinct",
   *   "sum", "mean", "average", "variance", "variancep", "stdev",
   *   "stdevp", "median", "q1", "q3", "modeskew", "min", "max",
   *   "argmin", "argmax"]
   *
   */
  op: string;

  /**
   * @enum: ["ascending", "descending"]
   */
  order?: string;
}
