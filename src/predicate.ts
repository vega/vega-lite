import {isArray} from 'vega-util';
import {valueExpr, vgField} from './channeldef';
import {DateTime} from './datetime';
import {LogicalOperand} from './logical';
import {fieldExpr as timeUnitFieldExpr, normalizeTimeUnit, TimeUnit} from './timeunit';
import {AggregateOp} from 'vega';
import {Flag, flagKeys, varName} from './util';
import {AGG_STORE} from './compile/selection';

// Lookup for better strategies for implementing Selection Comparison Interfaces
export type Predicate =
  // a) FieldPredicate (but we don't type FieldFilter here so the schema has no nesting
  // and thus the documentation shows all of the types clearly)
  | FieldEqualPredicate<SelectionComparisonPredicate>
  | FieldRangePredicate
  | FieldOneOfPredicate
  | FieldLTPredicate<SelectionComparisonPredicate>
  | FieldGTPredicate<SelectionComparisonPredicate>
  | FieldLTEPredicate<SelectionComparisonPredicate>
  | FieldGTEPredicate<SelectionComparisonPredicate>
  | FieldValidPredicate
  // b) Selection Predicate
  | SelectionPredicate
  // c) Vega Expression string
  | string;

export type FieldPredicate =
  | FieldEqualPredicate<SelectionComparisonPredicate>
  | FieldLTPredicate<SelectionComparisonPredicate>
  | FieldGTPredicate<SelectionComparisonPredicate>
  | FieldLTEPredicate<SelectionComparisonPredicate>
  | FieldGTEPredicate<SelectionComparisonPredicate>
  | FieldRangePredicate
  | FieldOneOfPredicate
  | FieldValidPredicate;

export interface SelectionPredicate {
  /**
   * Filter using a selection name.
   */
  selection: LogicalOperand<string>;
}

export function isSelectionPredicate(predicate: LogicalOperand<Predicate>): predicate is SelectionPredicate {
  return predicate && predicate['selection'];
}

export interface FieldPredicateBase {
  // TODO: support aggregate

  /**
   * Time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

  /**
   * Field to be filtered.
   */
  field: string;
}

export const DEFAULT_AGGREGATE = 'mean';
export type ComparisonOp = 'lt' | 'gt' | 'lte' | 'gte' | 'equal' | 'nequal';

const COMPARISON_OPERATOR_INDEX: Flag<ComparisonOp> = {
  lt: 1,
  lte: 1,
  gt: 1,
  gte: 1,
  equal: 1,
  nequal: 1
};

export const COMPARISON_OPERATORS = flagKeys(COMPARISON_OPERATOR_INDEX);

export function getComparisonOperator(keys: string[]): ComparisonOp {
  for (const key of keys) {
    if (COMPARISON_OPERATORS.includes(key as ComparisonOp)) return key as ComparisonOp;
  }
  return null;
}

// What should be the type of return here??
export function isSelectionComparisonPredicate(predicate: any) {
  if (predicate && typeof predicate === 'object' && !!predicate.field) {
    const operator = getComparisonOperator(Object.keys(predicate));
    return operator ? !!predicate[operator].selection : false;
  }
  return false;
}

export type SelectionComparisonPredicate = {
  field: string;
  aggregate?: AggregateOp;
  selection: string;
};

// https://stackoverflow.com/questions/55457347/dynamic-keys-and-value-type-checking-in-typescript
// export type DatumSelectionComparisonPredicate = {[key in ComparisonOp]: SelectionComparisonPredicate} & {
//   field: string;
// };

export interface FieldEqualPredicate<T> extends FieldPredicateBase {
  /**
   * The value that the field should be equal to.
   */

  // Suggest better alternative for types
  equal: string | number | boolean | DateTime | T extends SelectionComparisonPredicate ? T : number;
}

export function isFieldEqualPredicate(predicate: any): predicate is FieldEqualPredicate<null> {
  return predicate && !!predicate.field && predicate.equal !== undefined;
}

export interface FieldLTPredicate<T> extends FieldPredicateBase {
  /**
   * The value that the field should be less than.
   */
  lt: string | number | DateTime | T extends SelectionComparisonPredicate ? T : number;
}

export function isFieldLTPredicate(predicate: any): predicate is FieldLTPredicate<null> {
  return predicate && !!predicate.field && predicate.lt !== undefined;
}

export interface FieldLTEPredicate<T> extends FieldPredicateBase {
  /**
   * The value that the field should be less than or equals to.
   */
  lte: string | number | DateTime | T extends SelectionComparisonPredicate ? T : number;
}

export function isFieldLTEPredicate(predicate: any): predicate is FieldLTEPredicate<null> {
  return predicate && !!predicate.field && predicate.lte !== undefined;
}

export interface FieldGTPredicate<T> extends FieldPredicateBase {
  /**
   * The value that the field should be greater than.
   */
  gt: string | number | DateTime | T extends SelectionComparisonPredicate ? T : number;
}

export function isFieldGTPredicate(predicate: any): predicate is FieldGTPredicate<null> {
  return predicate && !!predicate.field && predicate.gt !== undefined;
}

export interface FieldGTEPredicate<T> extends FieldPredicateBase {
  /**
   * The value that the field should be greater than or equals to.
   */
  gte: string | number | DateTime | T extends SelectionComparisonPredicate ? T : number;
}

export function isFieldGTEPredicate(predicate: any): predicate is FieldGTEPredicate<null> {
  return predicate && !!predicate.field && predicate.gte !== undefined;
}

export interface FieldRangePredicate extends FieldPredicateBase {
  /**
   * An array of inclusive minimum and maximum values
   * for a field value of a data item to be included in the filtered data.
   * @maxItems 2
   * @minItems 2
   */
  range: (number | DateTime | null)[];
}

export function isFieldRangePredicate(predicate: any): predicate is FieldRangePredicate {
  if (predicate && predicate.field) {
    if (isArray(predicate.range) && predicate.range.length === 2) {
      return true;
    }
  }
  return false;
}

export interface FieldOneOfPredicate extends FieldPredicateBase {
  /**
   * A set of values that the `field`'s value should be a member of,
   * for a data item included in the filtered data.
   */
  oneOf: string[] | number[] | boolean[] | DateTime[];
}

export interface FieldValidPredicate extends FieldPredicateBase {
  /**
   * If set to true the field's value has to be valid, meaning both not `null` and not [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
   */
  valid: boolean;
}

export function isFieldOneOfPredicate(predicate: any): predicate is FieldOneOfPredicate {
  return (
    predicate && !!predicate.field && (isArray(predicate.oneOf) || isArray(predicate.in)) // backward compatibility
  );
}

export function isFieldValidPredicate(predicate: any): predicate is FieldValidPredicate {
  return predicate && !!predicate.field && predicate.valid !== undefined;
}

export function isFieldPredicate(
  predicate: Predicate
): predicate is
  | FieldOneOfPredicate
  | FieldEqualPredicate<SelectionComparisonPredicate>
  | FieldRangePredicate
  | FieldLTPredicate<SelectionComparisonPredicate>
  | FieldGTPredicate<SelectionComparisonPredicate>
  | FieldLTEPredicate<SelectionComparisonPredicate>
  | FieldGTEPredicate<SelectionComparisonPredicate> {
  return (
    isFieldOneOfPredicate(predicate) ||
    isFieldEqualPredicate(predicate) ||
    isFieldRangePredicate(predicate) ||
    isFieldLTPredicate(predicate) ||
    isFieldGTPredicate(predicate) ||
    isFieldLTEPredicate(predicate) ||
    isFieldGTEPredicate(predicate)
  );
}

function predicateValueExpr(v: number | string | boolean | DateTime, timeUnit: TimeUnit) {
  return valueExpr(v, {timeUnit, time: true});
}

function predicateValuesExpr(vals: (number | string | boolean | DateTime)[], timeUnit: TimeUnit) {
  return vals.map(v => predicateValueExpr(v, timeUnit));
}

function predicateComparisonSelectionExpr(predicate: FieldPredicate): string {
  const dfield = predicate.field;
  const operator = getComparisonOperator(Object.keys(predicate)) as ComparisonOp;
  const comparisonSpec = predicate[operator];
  const sfield = comparisonSpec.field;
  const aggregate = comparisonSpec.aggregate ? comparisonSpec.aggregate : DEFAULT_AGGREGATE;
  const aggStore = varName(comparisonSpec.selection + AGG_STORE);
  return `vlComparisonTest('${aggStore}', datum, {operator: '${operator}', sfieldAggregate: '${sfield}_${aggregate}', on: '${dfield}'})`;
  // return `datum`;
}

// This method is used by Voyager.  Do not change its behavior without changing Voyager.
export function fieldFilterExpression(predicate: FieldPredicate, useInRange = true) {
  const {field, timeUnit} = predicate;
  const fieldExpr = timeUnit
    ? // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
      // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
      // TODO: support utc
      'time(' + timeUnitFieldExpr(timeUnit, field) + ')'
    : vgField(predicate, {expr: 'datum'});

  if (isSelectionComparisonPredicate(predicate)) {
    return predicateComparisonSelectionExpr(predicate);
  } else if (isFieldEqualPredicate(predicate)) {
    return fieldExpr + '===' + predicateValueExpr(predicate.equal, timeUnit);
  } else if (isFieldLTPredicate(predicate)) {
    const upper = predicate.lt;
    return `${fieldExpr}<${predicateValueExpr(upper, timeUnit)}`;
  } else if (isFieldGTPredicate(predicate)) {
    const lower = predicate.gt;
    return `${fieldExpr}>${predicateValueExpr(lower, timeUnit)}`;
  } else if (isFieldLTEPredicate(predicate)) {
    const upper = predicate.lte;
    return `${fieldExpr}<=${predicateValueExpr(upper, timeUnit)}`;
  } else if (isFieldGTEPredicate(predicate)) {
    const lower = predicate.gte;
    return `${fieldExpr}>=${predicateValueExpr(lower, timeUnit)}`;
  } else if (isFieldOneOfPredicate(predicate)) {
    return `indexof([${predicateValuesExpr(predicate.oneOf, timeUnit).join(',')}], ${fieldExpr}) !== -1`;
  } else if (isFieldValidPredicate(predicate)) {
    return predicate.valid ? `${fieldExpr}!==null&&!isNaN(${fieldExpr})` : `${fieldExpr}===null||isNaN(${fieldExpr})`;
  } else if (isFieldRangePredicate(predicate)) {
    const lower = predicate.range[0];
    const upper = predicate.range[1];

    if (lower !== null && upper !== null && useInRange) {
      return (
        'inrange(' +
        fieldExpr +
        ', [' +
        predicateValueExpr(lower, timeUnit) +
        ', ' +
        predicateValueExpr(upper, timeUnit) +
        '])'
      );
    }

    const exprs = [];
    if (lower !== null) {
      exprs.push(`${fieldExpr} >= ${predicateValueExpr(lower, timeUnit)}`);
    }
    if (upper !== null) {
      exprs.push(`${fieldExpr} <= ${predicateValueExpr(upper, timeUnit)}`);
    }

    return exprs.length > 0 ? exprs.join(' && ') : 'true';
  }

  /* istanbul ignore next: it should never reach here */
  throw new Error(`Invalid field predicate: ${JSON.stringify(predicate)}`);
}

export function normalizePredicate(f: Predicate): Predicate {
  if (isFieldPredicate(f) && f.timeUnit) {
    return {
      ...f,
      timeUnit: normalizeTimeUnit(f.timeUnit)
    };
  }
  return f;
}
