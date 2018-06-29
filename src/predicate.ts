import {isArray, isString} from 'vega-util';
import {DataFlowNode} from './compile/data/dataflow';
import {Model} from './compile/model';
import {selectionPredicate} from './compile/selection/selection';
import {DateTime, dateTimeExpr, isDateTime} from './datetime';
import {vgField} from './fielddef';
import {LogicalOperand} from './logical';
import {fieldExpr as timeUnitFieldExpr, getLocalTimeUnit, isLocalSingleTimeUnit, isUtcSingleTimeUnit, normalizeTimeUnit, TimeUnit} from './timeunit';
import {logicalExpr} from './util';

export type Predicate =
  // a) FieldPredicate (but we don't type FieldFilter here so the schema has no nesting
  // and thus the documentation shows all of the types clearly)
  FieldEqualPredicate | FieldRangePredicate | FieldOneOfPredicate | FieldLTPredicate | FieldGTPredicate | FieldLTEPredicate | FieldGTEPredicate |
  // b) Selection Predicate
  SelectionPredicate |
  // c) Vega Expression string
  string;



export type FieldPredicate = FieldEqualPredicate | FieldLTPredicate | FieldGTPredicate | FieldLTEPredicate | FieldGTEPredicate |FieldRangePredicate | FieldOneOfPredicate;

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

export interface FieldEqualPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be equal to.
   */
  equal: string | number | boolean | DateTime;

}

export function isFieldEqualPredicate(predicate: any): predicate is FieldEqualPredicate {
  return predicate && !!predicate.field && predicate.equal !== undefined;
}

export interface FieldLTPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be less than.
   */
  lt: string | number | DateTime;

}

export function isFieldLTPredicate(predicate: any): predicate is FieldLTPredicate {
  return predicate && !!predicate.field && predicate.lt !== undefined;
}


export interface FieldLTEPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be less than or equals to.
   */
  lte: string | number | DateTime;

}

export function isFieldLTEPredicate(predicate: any): predicate is FieldLTEPredicate {
  return predicate && !!predicate.field && predicate.lte !== undefined;
}


export interface FieldGTPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be greater than.
   */
  gt: string | number | DateTime;

}

export function isFieldGTPredicate(predicate: any): predicate is FieldGTPredicate {
  return predicate && !!predicate.field && predicate.gt !== undefined;
}

export interface FieldGTEPredicate extends FieldPredicateBase {
  /**
   * The value that the field should be greater than or equals to.
   */
  gte: string | number | DateTime;

}

export function isFieldGTEPredicate(predicate: any): predicate is FieldGTEPredicate {
  return predicate && !!predicate.field && predicate.gte !== undefined;
}

export interface FieldRangePredicate extends FieldPredicateBase {
  /**
   * An array of inclusive minimum and maximum values
   * for a field value of a data item to be included in the filtered data.
   * @maxItems 2
   * @minItems 2
   */
  range: (number|DateTime|null)[];
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

export function isFieldOneOfPredicate(predicate: any): predicate is FieldOneOfPredicate {
  return predicate && !!predicate.field && (
    isArray(predicate.oneOf) ||
    isArray(predicate.in) // backward compatibility
  );
}

export function isFieldPredicate(predicate: Predicate): predicate is FieldOneOfPredicate | FieldEqualPredicate | FieldRangePredicate | FieldLTPredicate | FieldGTPredicate | FieldLTEPredicate | FieldGTEPredicate {
  return isFieldOneOfPredicate(predicate) || isFieldEqualPredicate(predicate) || isFieldRangePredicate(predicate) || isFieldLTPredicate(predicate) || isFieldGTPredicate(predicate) || isFieldLTEPredicate(predicate) || isFieldGTEPredicate(predicate);
}

/**
 * Converts a predicate into an expression.
 */
// model is only used for selection filters.
export function expression(model: Model, filterOp: LogicalOperand<Predicate>, node?: DataFlowNode): string {
  return logicalExpr(filterOp, (predicate: Predicate) => {
    if (isString(predicate)) {
      return predicate;
    } else if (isSelectionPredicate(predicate)) {
      return selectionPredicate(model, predicate.selection, node);
    } else { // Filter Object
      return fieldFilterExpression(predicate);
    }
  });
}

// This method is used by Voyager.  Do not change its behavior without changing Voyager.
export function fieldFilterExpression(predicate: FieldPredicate, useInRange=true) {
  const fieldExpr = predicate.timeUnit ?
    // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
      // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
      // TODO: support utc
    ('time(' + timeUnitFieldExpr(predicate.timeUnit, predicate.field) + ')') :
    vgField(predicate, {expr: 'datum'});

  if (isFieldEqualPredicate(predicate)) {
    return fieldExpr + '===' + valueExpr(predicate.equal, predicate.timeUnit);
  } else if (isFieldLTPredicate(predicate)) {
    const upper = predicate.lt;
    return `${fieldExpr}<${valueExpr(upper, predicate.timeUnit)}`;
  } else if (isFieldGTPredicate(predicate)) {
    const lower = predicate.gt;
    return `${fieldExpr}>${valueExpr(lower, predicate.timeUnit)}`;
  } else if (isFieldLTEPredicate(predicate)) {
    const upper = predicate.lte;
    return `${fieldExpr}<=${valueExpr(upper, predicate.timeUnit)}`;
  } else if (isFieldGTEPredicate(predicate)) {
    const lower = predicate.gte;
    return `${fieldExpr}>=${valueExpr(lower, predicate.timeUnit)}`;
  } else if (isFieldOneOfPredicate(predicate)) {
    // "oneOf" was formerly "in" -- so we need to add backward compatibility
    const oneOf: FieldOneOfPredicate[] = predicate.oneOf || predicate['in'];
    return 'indexof([' +
      oneOf.map((v) => valueExpr(v, predicate.timeUnit)).join(',') +
      '], ' + fieldExpr + ') !== -1';
  } else if (isFieldRangePredicate(predicate)) {
    const lower = predicate.range[0];
    const upper = predicate.range[1];

    if (lower !== null && upper !== null && useInRange) {
      return 'inrange(' + fieldExpr + ', [' +
        valueExpr(lower, predicate.timeUnit) + ', ' +
        valueExpr(upper, predicate.timeUnit) + '])';
    }

    const exprs = [];
    if (lower !== null) {
      exprs.push(`${fieldExpr} >= ${valueExpr(lower, predicate.timeUnit)}`);
    }
    if (upper !== null) {
      exprs.push(`${fieldExpr} <= ${valueExpr(upper, predicate.timeUnit)}`);
    }

    return exprs.length > 0 ? exprs.join(' && ') : 'true';
  }

  /* istanbul ignore next: it should never reach here */
  throw new Error(`Invalid field predicate: ${JSON.stringify(predicate)}`);
}

function valueExpr(v: any, timeUnit: TimeUnit): string {
  if (isDateTime(v)) {
    const expr = dateTimeExpr(v, true);
    return 'time(' + expr + ')';
  }
  if (isLocalSingleTimeUnit(timeUnit)) {
    const datetime: DateTime = {};
    datetime[timeUnit] = v;
    const expr = dateTimeExpr(datetime, true);
    return 'time(' + expr + ')';
  } else if (isUtcSingleTimeUnit(timeUnit)) {
    return valueExpr(v, getLocalTimeUnit(timeUnit));
  }
  return JSON.stringify(v);
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
