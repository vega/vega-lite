import { __rest } from "tslib";
import { selector as parseSelector } from 'vega-event-selector';
import { hasOwnProperty, isString, stringValue } from 'vega-util';
import { STORE } from '.';
import { duplicate, logicalExpr, varName } from '../../util';
import { forEachTransform } from './transforms/transforms';
export function parseUnitSelection(model, selDefs) {
    const selCmpts = {};
    const selectionConfig = model.config.selection;
    for (let name in selDefs) {
        if (!hasOwnProperty(selDefs, name)) {
            continue;
        }
        const selDef = duplicate(selDefs[name]);
        const _a = selectionConfig[selDef.type], { fields, encodings } = _a, cfg = __rest(_a, ["fields", "encodings"]); // Project transform applies its defaults.
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
                selDef[key] = Object.assign(Object.assign({}, cfg[key]), selDef[key]);
            }
            if (selDef[key] === undefined || selDef[key] === true) {
                selDef[key] = cfg[key] || selDef[key];
            }
        }
        name = varName(name);
        const selCmpt = (selCmpts[name] = Object.assign(Object.assign({}, selDef), { name: name, events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on }));
        forEachTransform(selCmpt, txCompiler => {
            if (txCompiler.parse) {
                txCompiler.parse(model, selCmpt, selDef, selDefs[name]);
            }
        });
    }
    return selCmpts;
}
export function parseSelectionPredicate(model, selections, dfnode) {
    const stores = [];
    function expr(name) {
        const vname = varName(name);
        const selCmpt = model.getSelectionComponent(vname, name);
        const store = stringValue(vname + STORE);
        if (selCmpt.project.timeUnit) {
            const child = dfnode || model.component.data.raw;
            const tunode = selCmpt.project.timeUnit.clone();
            if (child.parent) {
                tunode.insertAsParentOf(child);
            }
            else {
                child.parent = tunode;
            }
        }
        if (selCmpt.empty !== 'none') {
            stores.push(store);
        }
        return (`vlSelectionTest(${store}, datum` + (selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`));
    }
    const predicateStr = logicalExpr(selections, expr);
    return ((stores.length ? '!(' + stores.map(s => `length(data(${s}))`).join(' || ') + ') || ' : '') + `(${predicateStr})`);
}
//# sourceMappingURL=parse.js.map