import type {SignalRef} from 'vega';
import {isArray} from 'vega-util';
import {FieldName, valueExpr, vgField} from './channeldef.js';
import {DateTime} from './datetime.js';
import {ExprRef, replaceExprRef} from './expr.js';
import {LogicalComposition} from './logical.js';
import {ParameterName} from './parameter.js';
import {
  fieldExpr as timeUnitFieldExpr,
  normalizeTimeUnit,
  TimeUnit,
  TimeUnitParams,
  BinnedTimeUnit,
} from './timeunit.js';
import {hasProperty, stringify} from './util.js';
import {isSignalRef} from './vega.schema.js';

export type Predicate =
  // a) FieldPredicate (but we don't type FieldFilter here so the schema has no nesting
  // and thus the documentation shows all of the types clearly)
  | FieldEqualPredicate
  | FieldRangePredicate
  | FieldOneOfPredicate
  | FieldLTPredicate
  | FieldGTPredicate
  | FieldLTEPredicate
  | FieldGTEPredicate
  | FieldValidPredicate
  // b) Selection Predicate
  | ParameterPredicate
  // c) Vega Expression string
  | string;

export type FieldPredicate =
  | FieldEqualPredicate
  | FieldLTPredicate
  | FieldGTPredicate
  | FieldLTEPredicate
  | FieldGTEPredicate
  | FieldRangePredicate
  | FieldOneOfPredicate
  | FieldValidPredicate;

export interface ParameterPredicate {
  /**
   * Filter using a parameter name.
   */
  param: ParameterName;
  /**
   * For selection parameters, the predicate of empty selections returns true by default.
   * Override this behavior, by setting this property `empty: false`.
   */
  empty?: boolean;
}

export function isSelectionPredicate(predicate: LogicalComposition<Predicate>): predicate is ParameterPredicate {
  return hasProperty(predicate, 'param');
}

export interface FieldPredicateBase {
  // TODO: support aggregate

  /**
   * Time unit for the field to be tested.
   */
  timeUnit?: TimeUnit | BinnedTimeUnit | TimeUnitParams;

  /**
   * Field to be tested.
   */
  field: FieldName;
}

export interface FieldEqualPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be equal to.
   */
  equal: string | number | boolean | DateTime | ExprRef | SignalRef;
}

export function isFieldEqualPredicate(predicate: any): predicate is FieldEqualPredicate {
  return !!predicate?.field && predicate.equal !== undefined;
}

export interface FieldLTPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be less than.
   */
  lt: string | number | DateTime | ExprRef | SignalRef;
}

export function isFieldLTPredicate(predicate: any): predicate is FieldLTPredicate {
  return !!predicate?.field && predicate.lt !== undefined;
}

export interface FieldLTEPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be less than or equals to.
   */
  lte: string | number | DateTime | ExprRef | SignalRef;
}

export function isFieldLTEPredicate(predicate: any): predicate is FieldLTEPredicate {
  return !!predicate?.field && predicate.lte !== undefined;
}

export interface FieldGTPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be greater than.
   */
  gt: string | number | DateTime | ExprRef | SignalRef;
}

export function isFieldGTPredicate(predicate: any): predicate is FieldGTPredicate {
  return !!predicate?.field && predicate.gt !== undefined;
}

export interface FieldGTEPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be greater than or equals to.
   */
  gte: string | number | DateTime | ExprRef | SignalRef;
}

export function isFieldGTEPredicate(predicate: any): predicate is FieldGTEPredicate {
  return !!predicate?.field && predicate.gte !== undefined;
}

export interface FieldRangePredicate extends FieldPredicateBase {
  /**
   * An array of inclusive minimum and maximum values
   * for a field value of a data item to be included in the filtered data.
   * @maxItems 2
   * @minItems 2
   */
  range: (number | DateTime | null | ExprRef | SignalRef)[] | ExprRef | SignalRef;
}

export function isFieldRangePredicate(predicate: any): predicate is FieldRangePredicate {
  if (predicate?.field) {
    if (isArray(predicate.range) && predicate.range.length === 2) {
      return true;
    } else if (isSignalRef(predicate.range)) {
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
    !!predicate?.field && (isArray(predicate.oneOf) || isArray(predicate.in)) // backward compatibility
  );
}

export function isFieldValidPredicate(predicate: any): predicate is FieldValidPredicate {
  return !!predicate?.field && predicate.valid !== undefined;
}

export function isFieldPredicate(
  predicate: Predicate,
): predicate is
  | FieldOneOfPredicate
  | FieldEqualPredicate
  | FieldRangePredicate
  | FieldLTPredicate
  | FieldGTPredicate
  | FieldLTEPredicate
  | FieldGTEPredicate {
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

function predicateValueExpr(v: number | string | boolean | DateTime | ExprRef | SignalRef, timeUnit: TimeUnit) {
  return valueExpr(v, {timeUnit, wrapTime: true});
}

function predicateValuesExpr(vals: (number | string | boolean | DateTime)[], timeUnit: TimeUnit) {
  return vals.map((v) => predicateValueExpr(v, timeUnit));
}

// This method is used by Voyager. Do not change its behavior without changing Voyager.
export function fieldFilterExpression(predicate: FieldPredicate, useInRange = true) {
  const {field} = predicate;
  const normalizedTimeUnit = normalizeTimeUnit(predicate.timeUnit);
  const {unit, binned} = normalizedTimeUnit || {};
  const rawFieldExpr = vgField(predicate, {expr: 'datum'});
  const fieldExpr = unit
    ? // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
      // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
      // TODO: support utc
      `time(${!binned ? timeUnitFieldExpr(unit, field) : rawFieldExpr})`
    : rawFieldExpr;

  if (isFieldEqualPredicate(predicate)) {
    return `${fieldExpr}===${predicateValueExpr(predicate.equal, unit)}`;
  } else if (isFieldLTPredicate(predicate)) {
    const upper = predicate.lt;
    return `${fieldExpr}<${predicateValueExpr(upper, unit)}`;
  } else if (isFieldGTPredicate(predicate)) {
    const lower = predicate.gt;
    return `${fieldExpr}>${predicateValueExpr(lower, unit)}`;
  } else if (isFieldLTEPredicate(predicate)) {
    const upper = predicate.lte;
    return `${fieldExpr}<=${predicateValueExpr(upper, unit)}`;
  } else if (isFieldGTEPredicate(predicate)) {
    const lower = predicate.gte;
    return `${fieldExpr}>=${predicateValueExpr(lower, unit)}`;
  } else if (isFieldOneOfPredicate(predicate)) {
    return `indexof([${predicateValuesExpr(predicate.oneOf, unit).join(',')}], ${fieldExpr}) !== -1`;
  } else if (isFieldValidPredicate(predicate)) {
    return fieldValidPredicate(fieldExpr, predicate.valid);
  } else if (isFieldRangePredicate(predicate)) {
    const {range} = replaceExprRef(predicate);
    const lower = isSignalRef(range) ? {signal: `${range.signal}[0]`} : range[0];
    const upper = isSignalRef(range) ? {signal: `${range.signal}[1]`} : range[1];

    if (lower !== null && upper !== null && useInRange) {
      return `inrange(${fieldExpr}, [${predicateValueExpr(lower, unit)}, ${predicateValueExpr(upper, unit)}])`;
    }

    const exprs = [];
    if (lower !== null) {
      exprs.push(`${fieldExpr} >= ${predicateValueExpr(lower, unit)}`);
    }
    if (upper !== null) {
      exprs.push(`${fieldExpr} <= ${predicateValueExpr(upper, unit)}`);
    }

    return exprs.length > 0 ? exprs.join(' && ') : 'true';
  }

  /* istanbul ignore next: it should never reach here */
  throw new Error(`Invalid field predicate: ${stringify(predicate)}`);
}

export function fieldValidPredicate(fieldExpr: string, valid = true) {
  if (valid) {
    return `isValid(${fieldExpr}) && isFinite(+${fieldExpr})`;
  } else {
    return `!isValid(${fieldExpr}) || !isFinite(+${fieldExpr})`;
  }
}

export function normalizePredicate(f: Predicate): Predicate {
  if (isFieldPredicate(f) && f.timeUnit) {
    return {
      ...f,
      timeUnit: normalizeTimeUnit(f.timeUnit),
    };
  }
  return f;
}
