import {isString, stringValue} from 'vega-util';
import {LogicalComposition} from '../logical.js';
import {
  fieldFilterExpression,
  FieldPredicate,
  isFieldEqualPredicate,
  isFieldGTEPredicate,
  isFieldGTPredicate,
  isFieldLTEPredicate,
  isFieldLTPredicate,
  isParameterValueRef,
  isSelectionPredicate,
  ParameterValueRef,
  Predicate,
} from '../predicate.js';
import {logicalExpr} from '../util.js';
import {DataFlowNode} from './data/dataflow.js';
import {Model} from './model.js';
import {parseSelectionPredicate} from './selection/parse.js';

function resolveSelectionParameterValueExpr(model: Model, v: any): string {
  if (!isParameterValueRef(v) || !v.field) {
    return undefined;
  }

  const selCmpt = model?.component?.selection?.[v.param];
  const fieldProjection = selCmpt?.project?.hasField?.[v.field];

  if (!fieldProjection) {
    return undefined;
  }

  const store = stringValue(v.param + '_store');
  const idx = fieldProjection.index;
  return `(length(data(${store})) ? data(${store})[0].values[${idx}] : null)`;
}

function getParameterValueRef(predicate: FieldPredicate): ParameterValueRef {
  if (isFieldEqualPredicate(predicate) && isParameterValueRef(predicate.equal)) {
    return predicate.equal;
  }
  if (isFieldLTPredicate(predicate) && isParameterValueRef(predicate.lt)) {
    return predicate.lt;
  }
  if (isFieldLTEPredicate(predicate) && isParameterValueRef(predicate.lte)) {
    return predicate.lte;
  }
  if (isFieldGTPredicate(predicate) && isParameterValueRef(predicate.gt)) {
    return predicate.gt;
  }
  if (isFieldGTEPredicate(predicate) && isParameterValueRef(predicate.gte)) {
    return predicate.gte;
  }

  return undefined;
}

function applyEmptySelectionSemantics(model: Model, predicate: FieldPredicate, expr: string): string {
  const valueRef = getParameterValueRef(predicate);

  if (!valueRef) {
    return expr;
  }

  const selCmpt = model?.component?.selection?.[valueRef.param];
  if (!selCmpt) {
    return expr;
  }

  const store = stringValue(valueRef.param + '_store');
  const isEmptyExpr = `!length(data(${store}))`;
  const empty = valueRef.empty ?? true;
  return empty ? `(${isEmptyExpr} || (${expr}))` : `(!${isEmptyExpr} && (${expr}))`;
}

/**
 * Converts a predicate into an expression.
 */
// model is only used for selection filters.
export function expression(model: Model, filterOp: LogicalComposition<Predicate>, node?: DataFlowNode): string {
  return logicalExpr(filterOp, (predicate: Predicate) => {
    if (isString(predicate)) {
      return predicate;
    } else if (isSelectionPredicate(predicate)) {
      return parseSelectionPredicate(model, predicate, node);
    } else {
      // Filter Object
      const expr = fieldFilterExpression(predicate, true, (v) => resolveSelectionParameterValueExpr(model, v));
      return applyEmptySelectionSemantics(model, predicate, expr);
    }
  });
}
