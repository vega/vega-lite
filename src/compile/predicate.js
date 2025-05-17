import {isString} from 'vega-util';
import {fieldFilterExpression, isSelectionPredicate} from '../predicate.js';
import {logicalExpr} from '../util.js';
import {parseSelectionPredicate} from './selection/parse.js';
/**
 * Converts a predicate into an expression.
 */
// model is only used for selection filters.
export function expression(model, filterOp, node) {
  return logicalExpr(filterOp, (predicate) => {
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
//# sourceMappingURL=predicate.js.map
