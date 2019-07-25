import * as tslib_1 from "tslib";
import { selector as parseSelector } from 'vega-event-selector';
import { isString } from 'vega-util';
import { duplicate, varName } from '../../util';
import { forEachTransform } from './transforms/transforms';
export function parseUnitSelection(model, selDefs) {
    const selCmpts = {};
    const selectionConfig = model.config.selection;
    if (selDefs) {
        selDefs = duplicate(selDefs); // duplicate to avoid side effects to original spec
    }
    for (let name in selDefs) {
        if (!selDefs.hasOwnProperty(name)) {
            continue;
        }
        const selDef = selDefs[name];
        const _a = selectionConfig[selDef.type], { fields, encodings } = _a, cfg = tslib_1.__rest(_a, ["fields", "encodings"]); // Project transform applies its defaults.
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
                selDef[key] = Object.assign({}, cfg[key], selDef[key]);
            }
            if (selDef[key] === undefined || selDef[key] === true) {
                selDef[key] = cfg[key] || selDef[key];
            }
        }
        name = varName(name);
        const selCmpt = (selCmpts[name] = Object.assign({}, selDef, { name: name, events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on }));
        forEachTransform(selCmpt, txCompiler => {
            if (txCompiler.parse) {
                txCompiler.parse(model, selDef, selCmpt);
            }
        });
    }
    return selCmpts;
}
//# sourceMappingURL=parse.js.map