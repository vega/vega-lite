import {isString} from 'vega-util';
import {LogicalOperand} from '../logical';
import {fieldFilterExpression, isSelectionPredicate, Predicate} from '../predicate';
import {logicalExpr} from '../util';
import {DataFlowNode} from './data/dataflow';
import {Model} from './model';
import {selectionPredicate} from './selection/selection';

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
    } else {
      // Filter Object
      return fieldFilterExpression(predicate);
    }
  });
}
