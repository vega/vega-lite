import {parseSelector} from 'vega-event-selector';
import {array, isObject, isString, stringValue} from 'vega-util';
import {isTimerSelection, selectionCompilers, SelectionComponent, STORE} from './index.js';
import {warn} from '../../log/index.js';
import {BaseSelectionConfig, SelectionParameter, ParameterExtent} from '../../selection.js';
import {Dict, duplicate, entries, replacePathInField, varName} from '../../util.js';
import {DataFlowNode, OutputNode} from '../data/dataflow.js';
import {FilterNode} from '../data/filter.js';
import {Model} from '../model.js';
import {UnitModel} from '../unit.js';
import {DataSourceType} from '../../data.js';
import {ParameterPredicate} from '../../predicate.js';
import {
  MULTIPLE_TIMER_ANIMATION_SELECTION,
  selectionAsScaleDomainWithoutField,
  selectionAsScaleDomainWrongEncodings,
} from '../../log/message.js';

export function parseUnitSelection(model: UnitModel, selDefs: SelectionParameter[]) {
  const selCmpts: Dict<SelectionComponent<any /* this has to be "any" so typing won't fail in test files*/>> = {};
  const selectionConfig = model.config.selection;

  if (!selDefs || !selDefs.length) return selCmpts;

  let nTimerSelections = 0;

  for (const def of selDefs) {
    const name = varName(def.name);
    const selDef = def.select;
    const type = isString(selDef) ? selDef : selDef.type;
    const defaults: BaseSelectionConfig = isObject(selDef) ? duplicate(selDef) : {type};

    // Set default values from config if a property hasn't been specified,
    // or if it is true. E.g., "translate": true should use the default
    // event handlers for translate. However, true may be a valid value for
    // a property (e.g., "nearest": true).
    const cfg = selectionConfig[type];
    for (const key in cfg) {
      // Project transform applies its defaults.
      if (key === 'fields' || key === 'encodings') {
        continue;
      }

      if (key === 'mark') {
        (defaults as any).mark = {...(cfg as any).mark, ...(defaults as any).mark};
      }

      if ((defaults as any)[key] === undefined || (defaults as any)[key] === true) {
        (defaults as any)[key] = duplicate((cfg as any)[key] ?? (defaults as any)[key]);
      }
    }

    const selCmpt: SelectionComponent<any> = (selCmpts[name] = {
      ...defaults,
      name,
      type,
      init: def.value,
      bind: def.bind,
      events: isString(defaults.on) ? parseSelector(defaults.on, 'scope') : array(duplicate(defaults.on)),
    } as any);

    if (isTimerSelection(selCmpt)) {
      nTimerSelections++;
      // check for multiple timer selections and ignore all but the first one
      if (nTimerSelections > 1) {
        delete selCmpts[name];
        continue;
      }
    }

    const def_ = duplicate(def); // defensive copy to prevent compilers from causing side effects
    for (const c of selectionCompilers) {
      if (c.defined(selCmpt) && c.parse) {
        c.parse(model, selCmpt, def_);
      }
    }
  }

  if (nTimerSelections > 1) {
    // if multiple timer selections were found, issue a warning
    warn(MULTIPLE_TIMER_ANIMATION_SELECTION);
  }

  return selCmpts;
}

export function parseSelectionPredicate(
  model: Model,
  pred: ParameterPredicate,
  dfnode?: DataFlowNode,
  datum = 'datum',
): string {
  const name = isString(pred) ? pred : pred.param;
  const vname = varName(name);
  const store = stringValue(vname + STORE);
  let selCmpt;

  try {
    selCmpt = model.getSelectionComponent(vname, name);
  } catch {
    // If a selection isn't found, treat as a variable parameter and coerce to boolean.
    return `!!${vname}`;
  }

  if (selCmpt.project.timeUnit) {
    const child = dfnode ?? model.component.data.raw;
    const tunode = selCmpt.project.timeUnit.clone();
    if (child.parent) {
      tunode.insertAsParentOf(child);
    } else {
      child.parent = tunode;
    }
  }

  const fn = selCmpt.project.hasSelectionId ? 'vlSelectionIdTest(' : 'vlSelectionTest(';
  const resolve = selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`;
  const test = `${fn}${store}, ${datum}${resolve}`;
  const length = `length(data(${store}))`;

  return pred.empty === false ? `${length} && ${test}` : `!${length} || ${test}`;
}

export function parseSelectionExtent(model: Model, name: string, extent: ParameterExtent) {
  const vname = varName(name);
  const encoding = (extent as any).encoding;
  let field = (extent as any).field;
  let selCmpt;

  try {
    selCmpt = model.getSelectionComponent(vname, name);
  } catch {
    // If a selection isn't found, treat it as a variable parameter.
    return vname;
  }

  if (!encoding && !field) {
    field = selCmpt.project.items[0].field;
    if (selCmpt.project.items.length > 1) {
      warn(selectionAsScaleDomainWithoutField(field));
    }
  } else if (encoding && !field) {
    const encodings = selCmpt.project.items.filter((p) => p.channel === encoding);
    if (!encodings.length || encodings.length > 1) {
      field = selCmpt.project.items[0].field;
      warn(selectionAsScaleDomainWrongEncodings(encodings, encoding, extent, field));
    } else {
      field = encodings[0].field;
    }
  }

  return `${selCmpt.name}[${stringValue(replacePathInField(field))}]`;
}

export function materializeSelections(model: UnitModel, main: OutputNode) {
  for (const [selection, selCmpt] of entries(model.component.selection ?? {})) {
    const lookupName = model.getName(`lookup_${selection}`);
    model.component.data.outputNodes[lookupName] = selCmpt.materialized = new OutputNode(
      new FilterNode(main, model, {param: selection}),
      lookupName,
      DataSourceType.Lookup,
      model.component.data.outputNodeRefCounts,
    );
  }
}
