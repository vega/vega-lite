import {isString, stringValue} from 'vega-util';
import {LogicalComposition} from '../logical.js';
import {fieldFilterExpression, isSelectionPredicate, isParameterValueRef, Predicate} from '../predicate.js';
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
      return fieldFilterExpression(predicate, true, (v) => resolveSelectionParameterValueExpr(model, v));
    }
  });
}
