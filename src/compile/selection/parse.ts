import {parseSelector} from 'vega-event-selector';
import {array, isObject, isString, stringValue} from 'vega-util';
import {selectionCompilers, SelectionComponent, STORE} from '.';
import {warn} from '../../log';
import {BaseSelectionConfig, SelectionParameter, ParameterExtent} from '../../selection';
import {Dict, duplicate, entries, replacePathInField, varName} from '../../util';
import {DataFlowNode, OutputNode} from '../data/dataflow';
import {FilterNode} from '../data/filter';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {DataSourceType} from '../../data';
import {ParameterPredicate} from '../../predicate';

export function parseUnitSelection(model: UnitModel, selDefs: SelectionParameter[]) {
  const selCmpts: Dict<SelectionComponent<any /* this has to be "any" so typing won't fail in test files*/>> = {};
  const selectionConfig = model.config.selection;

  if (!selDefs || !selDefs.length) return selCmpts;

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
        defaults[key] = {...cfg[key], ...defaults[key]};
      }

      if (defaults[key] === undefined || defaults[key] === true) {
        defaults[key] = cfg[key] ?? defaults[key];
      }
    }

    const selCmpt: SelectionComponent<any> = (selCmpts[name] = {
      ...defaults,
      name,
      type,
      init: def.value,
      bind: def.bind,
      events: isString(defaults.on) ? parseSelector(defaults.on, 'scope') : array(duplicate(defaults.on))
    } as any);

    for (const c of selectionCompilers) {
      if (c.defined(selCmpt) && c.parse) {
        c.parse(model, selCmpt, def);
      }
    }
  }

  return selCmpts;
}

export function parseSelectionPredicate(
  model: Model,
  pred: ParameterPredicate,
  dfnode?: DataFlowNode,
  datum = 'datum'
): string {
  const name = isString(pred) ? pred : pred.param;
  const vname = varName(name);
  const store = stringValue(vname + STORE);
  let selCmpt;

  try {
    selCmpt = model.getSelectionComponent(vname, name);
  } catch (e) {
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

  const test = `vlSelectionTest(${store}, ${datum}${
    selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`
  }`;
  const length = `length(data(${store}))`;

  return pred.empty === false ? `${length} && ${test}` : `!${length} || ${test}`;
}

export function parseSelectionExtent(model: Model, name: string, extent: ParameterExtent) {
  const vname = varName(name);
  const encoding = extent['encoding'];
  let field = extent['field'];
  let selCmpt;

  try {
    selCmpt = model.getSelectionComponent(vname, name);
  } catch (e) {
    // If a selection isn't found, treat it as a variable parameter.
    return vname;
  }

  if (!encoding && !field) {
    field = selCmpt.project.items[0].field;
    if (selCmpt.project.items.length > 1) {
      warn(
        'A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
          `Using "field": ${stringValue(field)}.`
      );
    }
  } else if (encoding && !field) {
    const encodings = selCmpt.project.items.filter(p => p.channel === encoding);
    if (!encodings.length || encodings.length > 1) {
      field = selCmpt.project.items[0].field;
      warn(
        (!encodings.length ? 'No ' : 'Multiple ') +
          `matching ${stringValue(encoding)} encoding found for selection ${stringValue(extent.param)}. ` +
          `Using "field": ${stringValue(field)}.`
      );
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
      model.component.data.outputNodeRefCounts
    );
  }
}
