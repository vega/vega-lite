import {selector as parseSelector} from 'vega-event-selector';
import {isString} from 'vega-util';
import {SelectionComponent} from '.';
import {SelectionDef} from '../../selection';
import {Dict, duplicate, varName} from '../../util';
import {UnitModel} from '../unit';
import {forEachTransform} from './transforms/transforms';

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
      events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on
    } as any);

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.parse) {
        txCompiler.parse(model, selDef, selCmpt);
      }
    });
  }

  return selCmpts;
}
