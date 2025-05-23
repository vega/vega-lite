import {parseSelector} from 'vega-event-selector';
import {array, isObject, isString, stringValue} from 'vega-util';
import {isTimerSelection, selectionCompilers, STORE} from './index.js';
import {warn} from '../../log/index.js';
import {duplicate, entries, replacePathInField, varName} from '../../util.js';
import {OutputNode} from '../data/dataflow.js';
import {FilterNode} from '../data/filter.js';
import {DataSourceType} from '../../data.js';
import {
  MULTIPLE_TIMER_ANIMATION_SELECTION,
  selectionAsScaleDomainWithoutField,
  selectionAsScaleDomainWrongEncodings,
} from '../../log/message.js';
export function parseUnitSelection(model, selDefs) {
  const selCmpts = {};
  const selectionConfig = model.config.selection;
  if (!selDefs || !selDefs.length) return selCmpts;
  let nTimerSelections = 0;
  for (const def of selDefs) {
    const name = varName(def.name);
    const selDef = def.select;
    const type = isString(selDef) ? selDef : selDef.type;
    const defaults = isObject(selDef) ? duplicate(selDef) : {type};
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
        defaults.mark = {...cfg.mark, ...defaults.mark};
      }
      if (defaults[key] === undefined || defaults[key] === true) {
        defaults[key] = duplicate(cfg[key] ?? defaults[key]);
      }
    }
    const selCmpt = (selCmpts[name] = {
      ...defaults,
      name,
      type,
      init: def.value,
      bind: def.bind,
      events: isString(defaults.on) ? parseSelector(defaults.on, 'scope') : array(duplicate(defaults.on)),
    });
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
export function parseSelectionPredicate(model, pred, dfnode, datum = 'datum') {
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
export function parseSelectionExtent(model, name, extent) {
  const vname = varName(name);
  const encoding = extent.encoding;
  let field = extent.field;
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
export function materializeSelections(model, main) {
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
//# sourceMappingURL=parse.js.map
