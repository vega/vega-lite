import {isString} from 'vega-util';
import {LogicalComposition} from '../logical.js';
import {fieldFilterExpression, isSelectionPredicate, Predicate} from '../predicate.js';
import {logicalExpr} from '../util.js';
import {DataFlowNode} from './data/dataflow.js';
import {Model} from './model.js';
import {parseSelectionPredicate} from './selection/parse.js';

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
      return fieldFilterExpression(predicate);
    }
  });
}
