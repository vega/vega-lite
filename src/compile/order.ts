import {codegenExpression, parseExpression} from 'vega-expression';
import {array, stringValue} from 'vega-util';
import {isConditionalParameter, isOrderDatumDef} from '../channeldef.js';
import {ExprRef, isExprRef} from '../expr.js';
import {SortOrder} from '../sort.js';
import {flatAccessWithDatum, varName} from '../util.js';
import {isSignalRef} from '../vega.schema.js';
import {DataFlowNode} from './data/dataflow.js';
import {expression} from './predicate.js';
import {SelectionComponent, STORE} from './selection/index.js';
import {UnitModel} from './unit.js';

/** Selection-store insertion order for a single enumerated field. */
function selectionOrderExpression(model: UnitModel, param: string): string | undefined {
  let selection: SelectionComponent;
  try {
    selection = model.getSelectionComponent(varName(param), param);
  } catch {
    // Variable parameters have no selection history.
    return undefined;
  }

  const {project} = selection;
  if (
    selection.type !== 'point' ||
    selection.resolve !== 'global' ||
    project.hasSelectionId ||
    project.items.length !== 1 ||
    project.items[0].type !== 'E'
  ) {
    return undefined;
  }

  const field = flatAccessWithDatum(project.items[0].field);
  const store = stringValue(selection.name + STORE);
  // Selection predicates coerce dates to timestamps when testing membership.
  const value = `isDate(${field}) ? time(${field}) : ${field}`;
  return `length(data(${store})) ? indexof(pluck(data(${store}), "values[0]"), ${value}) : 0`;
}

/** Compile datum-based ordering in the data domain, before mark encoding. */
export function orderDatumSort(
  model: UnitModel,
  node?: DataFlowNode,
  markScope = false,
): {field: ExprRef[]; order: SortOrder[]} | undefined {
  const order = model.encoding.order;
  if (!isOrderDatumDef(order)) {
    return undefined;
  }

  const datumExpr = (datum: typeof order.datum) =>
    isExprRef(datum) ? datum.expr : isSignalRef(datum) ? datum.signal : JSON.stringify(datum ?? 0);

  let hasSelectionOrder = false;
  const expressions = array(order.condition ?? []).reduceRight(
    (otherwise, condition) => {
      const isParameter = isConditionalParameter(condition);
      const predicate = isParameter ? {param: condition.param, empty: condition.empty} : condition.test;
      const test = expression(model, predicate, node);
      const selectionOrder = isParameter ? selectionOrderExpression(model, condition.param) : undefined;
      hasSelectionOrder ||= selectionOrder !== undefined;
      return {
        rank: `(${test}) ? (${datumExpr(condition.datum)}) : (${otherwise.rank})`,
        // Mirror first-match precedence; later selections must not break ties
        // for data whose rank was supplied by an earlier condition.
        selection: `(${test}) ? (${selectionOrder ?? 0}) : (${otherwise.selection})`,
      };
    },
    {rank: datumExpr(order.datum), selection: '0'},
  );

  const keys = [expressions.rank, ...(hasSelectionOrder ? [expressions.selection] : [])];
  return {
    field: keys.map((expr) => ({expr: markScope ? expressionInMarkScope(expr) : expr})),
    // Explicit ranks always take precedence. Click order stays chronological
    // even when the primary ranks are sorted descending.
    order: [order.sort ?? 'ascending', ...(hasSelectionOrder ? ['ascending' as const] : [])],
  };
}

function expressionInMarkScope(expr: string): string {
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
