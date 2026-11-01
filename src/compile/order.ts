import {codegenExpression, parseExpression} from 'vega-expression';
import {array} from 'vega-util';
import {isConditionalParameter, isOrderDatumDef} from '../channeldef.js';
import {isExprRef} from '../expr.js';
import {isSignalRef} from '../vega.schema.js';
import {DataFlowNode} from './data/dataflow.js';
import {expression} from './predicate.js';
import {UnitModel} from './unit.js';

/** Compile datum-based ordering in the data domain, before mark encoding. */
export function orderDatumExpression(model: UnitModel, node?: DataFlowNode, markScope = false): string | undefined {
  const order = model.encoding.order;
  if (!isOrderDatumDef(order)) {
    return undefined;
  }

  const datumExpr = (datum: typeof order.datum) =>
    isExprRef(datum) ? datum.expr : isSignalRef(datum) ? datum.signal : JSON.stringify(datum ?? 0);

  const expr = array(order.condition ?? []).reduceRight((otherwise, condition) => {
    const predicate = isConditionalParameter(condition)
      ? {param: condition.param, empty: condition.empty}
      : condition.test;
    const test = expression(model, predicate, node);
    return `(${test}) ? (${datumExpr(condition.datum)}) : (${otherwise})`;
  }, datumExpr(order.datum));

  if (!markScope) {
    return expr;
  }

  // Mark sort accessors receive scenegraph items, whose data tuple is item.datum.
  // Rebase identifiers through the AST so string literals and property names
  // containing "datum" are preserved. Keep Vega function calls uncompiled.
  const ast = parseExpression(expr);
  const functions: Record<string, string> = {};
  (ast as any).visit((astNode: any) => {
    if (astNode.type === 'CallExpression') {
      functions[astNode.callee.name] = astNode.callee.name;
    }
  });
  return codegenExpression({
    constants: {},
    functions: () => functions,
    globalvar: (name) => (name === 'datum' ? 'datum.datum' : name),
  })(ast).code;
}
