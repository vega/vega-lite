import {selector as parseSelector} from 'vega-event-selector';
import {isString} from 'vega-util';
import {SelectionComponent, SelectionAggregate} from '.';
import {SelectionDef} from '../../selection';
import {Dict, duplicate, varName} from '../../util';
import {UnitModel} from '../unit';
import {forEachTransform} from './transforms/transforms';
import {CONDITION_CHANNELS, ConditionChannel} from '../../channel';
import {
  isSelectionComparisonPredicate,
  getComparisonOperator,
  ComparisonOp,
  DEFAULT_AGGREGATE,
  Predicate
} from '../../predicate';
import {forEachLeaf, LogicalOperand} from '../../logical';
import {MAIN} from '../../data';
import {Model} from '../model';
import {isFilter} from '../../transform';

export function parseEachSelectionAggregate(
  model: Model,
  logicalPredicate: LogicalOperand<Predicate>,
  selectionAggregates: SelectionAggregate[]
) {
  forEachLeaf(logicalPredicate, predicate => {
    if (isSelectionComparisonPredicate(predicate)) {
      const operator = getComparisonOperator(Object.keys(predicate)) as ComparisonOp;
      const comparisonSpec = predicate[operator];
      const selection = varName(comparisonSpec.selection);
      const sfield = comparisonSpec.field;
      const aggregate = comparisonSpec.aggregate ? comparisonSpec.aggregate : DEFAULT_AGGREGATE;
      const hasSelection = selectionAggregates.filter(s => s.selection === selection);

      if (hasSelection.length) {
        const aggregates = hasSelection[0].aggregates;
        if (aggregates.findIndex(t => t.sfield === sfield && t.op === aggregate) === -1) {
          aggregates.push({sfield, op: aggregate});
        }
      } else {
        selectionAggregates.push({selection, aggregates: [{sfield, op: aggregate}]});
      }
    }
  });
}

export function parseUnitSelectionComparisonTest(model: UnitModel, selCmpts: Dict<SelectionComponent>) {
  const {encoding} = model;
  const selectionAggregates: SelectionAggregate[] = [];

  CONDITION_CHANNELS.forEach((channel: ConditionChannel) => {
    const channelDef = encoding[channel];
    if (channelDef && channelDef['condition'] && channelDef['condition']['test']) {
      const logicalPredicate = channelDef['condition']['test'];
      parseEachSelectionAggregate(model, logicalPredicate, selectionAggregates);
    }
  });

  for (const t of model.transforms) {
    if (isFilter(t)) {
      const logicalPredicate = t.filter;
      parseEachSelectionAggregate(model, logicalPredicate, selectionAggregates);
    }
  }

  selectionAggregates.forEach(a => {
    if (selCmpts[a.selection]) {
      selCmpts[a.selection].aggregates = a.aggregates;
    } else {
      const selCmpt = model.getSelectionComponent(a.selection, a.selection);
      selCmpt.aggregates = a.aggregates;
    }
  });

  return selCmpts;
}

export function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>) {
  const selCmpts: Dict<SelectionComponent<any /* this has to be "any" so typing won't fail in test files*/>> = {};
  const selectionConfig = model.config.selection;

  if (selDefs) {
    selDefs = duplicate(selDefs); // duplicate to avoid side effects to original spec
  }

  for (let name in selDefs) {
    if (!selDefs.hasOwnProperty(name)) {
      continue;
    }

    const selDef = selDefs[name];
    const {fields, encodings, ...cfg} = selectionConfig[selDef.type]; // Project transform applies its defaults.

    // Set default values from config if a property hasn't been specified,
    // or if it is true. E.g., "translate": true should use the default
    // event handlers for translate. However, true may be a valid value for
    // a property (e.g., "nearest": true).
    for (const key in cfg) {
      // A selection should contain either `encodings` or `fields`, only use
      // default values for these two values if neither of them is specified.
      if ((key === 'encodings' && selDef.fields) || (key === 'fields' && selDef.encodings)) {
        continue;
      }

      if (key === 'mark') {
        selDef[key] = {...cfg[key], ...selDef[key]};
      }

      if (selDef[key] === undefined || selDef[key] === true) {
        selDef[key] = cfg[key] || selDef[key];
      }
    }

    name = varName(name);
    const selCmpt = (selCmpts[name] = {
      ...selDef,
      name: name,
      events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on,
      data: model.requestDataName(MAIN)
    } as any);

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.parse) {
        txCompiler.parse(model, selDef, selCmpt);
      }
    });
  }

  return selCmpts;
}
