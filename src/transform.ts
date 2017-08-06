import {AggregateOp} from './aggregate';
import {Bin} from './bin';
import {Data} from './data';
import {Filter} from './filter';
import {LogicalOperand} from './logical';
import {TimeUnit} from './timeunit';
import {VgFieldRef} from './vega.schema';


export interface FilterTransform {
  /**
   * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
   */
  filter: LogicalOperand<Filter>;
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

export interface BinTransform {
  /**
   * An object indicating bin properties, or simply `true` for using default bin values..
   */
  bin: Bin | true;

  /**
   * The data field to bin.
   */
  field: string;

  /**
   * The output fields at which to write the start and end bin values.
   */
  as: string;
}

export interface TimeUnitTransform {
  /**
   * The timeUnit.
   */
  timeUnit: TimeUnit;

  /**
   * The data field to apply time unit.
   */
  field: string;

  /**
   * The output field to write the timeUnit value.
   */
  as: string;
}

export interface SummarizeTransform {
  /**
   * Array of objects that define aggregate fields.
   */
  summarize: Summarize[];

  /**
   * The data fields to group by. If not specified, a single group containing all data objects will be used.
   */
  groupby?: string[];
}

export interface Summarize {
  /**
   * The aggregation operations to apply to the fields, such as sum, average or count.
   * See the [full list of supported aggregation operations](https://vega.github.io/vega-lite/docs/aggregate.html#supported-aggregation-operations)
   * for more information.
   */
  aggregate: AggregateOp;

  /**
   * The data field for which to compute aggregate function.
   */
  field: string;

  /**
   * The output field names to use for each aggregated field.
   */
  as: string;
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
  fields?: string[];
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

export function isFilter(t: Transform): t is FilterTransform {
  return t['filter'] !== undefined;
}

export function isLookup(t: Transform): t is LookupTransform {
  return t['lookup'] !== undefined;
}

export function isCalculate(t: Transform): t is CalculateTransform {
  return t['calculate'] !== undefined;
}

export function isBin(t: Transform): t is BinTransform {
  return t['bin'] !== undefined;
}

export function isTimeUnit(t: Transform): t is TimeUnitTransform {
  return t['timeUnit'] !== undefined;
}

export function isSummarize(t: Transform): t is SummarizeTransform {
  return t['summarize'] !== undefined;
}

export type Transform = FilterTransform | CalculateTransform | LookupTransform | BinTransform | TimeUnitTransform | SummarizeTransform;
