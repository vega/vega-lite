import * as tslib_1 from "tslib";
import { selector as parseSelector } from 'vega-event-selector';
import { identity, isArray, stringValue } from 'vega-util';
import { forEachSelection, MODIFY, SELECTION_DOMAIN, STORE, unitName, VL_SELECTION_RESOLVE } from '.';
import { dateTimeExpr, isDateTime } from '../../datetime';
import { warn } from '../../log';
import { accessPathWithDatum, keys, logicalExpr, varName } from '../../util';
import { isUnitModel } from '../model';
import { forEachTransform } from './transforms/transforms';
export function assembleInit(init, wrap = identity) {
    if (isArray(init)) {
        const str = init.map(v => assembleInit(v, wrap)).join(', ');
        return `[${str}]`;
    }
    else if (isDateTime(init)) {
        return wrap(dateTimeExpr(init));
    }
    return wrap(JSON.stringify(init));
}
export function assembleInitData(init) {
    if (isArray(init)) {
        return init.map(v => assembleInitData(v));
    }
    else if (isDateTime(init)) {
        return dateTimeExpr(init, false, true);
    }
    return init;
}
export function assembleUnitSelectionSignals(model, signals) {
    forEachSelection(model, (selCmpt, selCompiler) => {
        const name = selCmpt.name;
        let modifyExpr = selCompiler.modifyExpr(model, selCmpt);
        signals.push(...selCompiler.signals(model, selCmpt));
        forEachTransform(selCmpt, txCompiler => {
            if (txCompiler.signals) {
                signals = txCompiler.signals(model, selCmpt, signals);
            }
            if (txCompiler.modifyExpr) {
                modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
            }
        });
        signals.push({
            name: name + MODIFY,
            update: `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`
        });
    });
    return signals;
}
export function assembleFacetSignals(model, signals) {
    if (model.component.selection && keys(model.component.selection).length) {
        const name = stringValue(model.getName('cell'));
        signals.unshift({
            name: 'facet',
            value: {},
            on: [
                {
                    events: parseSelector('mousemove', 'scope'),
                    update: `isTuple(facet) ? facet : group(${name}).datum`
                }
            ]
        });
    }
    return signals;
}
export function assembleTopLevelSignals(model, signals) {
    let hasSelections = false;
    forEachSelection(model, (selCmpt, selCompiler) => {
        const name = selCmpt.name;
        const store = stringValue(name + STORE);
        const hasSg = signals.filter(s => s.name === name);
        if (!hasSg.length) {
            signals.push({
                name: selCmpt.name,
                update: `${VL_SELECTION_RESOLVE}(${store}` +
                    (selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`)
            });
        }
        hasSelections = true;
        if (selCompiler.topLevelSignals) {
            signals = selCompiler.topLevelSignals(model, selCmpt, signals);
        }
        forEachTransform(selCmpt, txCompiler => {
            if (txCompiler.topLevelSignals) {
                signals = txCompiler.topLevelSignals(model, selCmpt, signals);
            }
        });
    });
    if (hasSelections) {
        const hasUnit = signals.filter(s => s.name === 'unit');
        if (!hasUnit.length) {
            signals.unshift({
                name: 'unit',
                value: {},
                on: [{ events: 'mousemove', update: 'isTuple(group()) ? group() : unit' }]
            });
        }
    }
    return signals;
}
export function assembleUnitSelectionData(model, data) {
    forEachSelection(model, selCmpt => {
        const init = { name: selCmpt.name + STORE };
        if (selCmpt.init) {
            const fields = selCmpt.project.items.map(proj => {
                const { signals } = proj, rest = tslib_1.__rest(proj, ["signals"]);
                return rest;
            });
            const insert = selCmpt.init.map((i) => assembleInitData(i));
            init.values =
                selCmpt.type === 'interval'
                    ? [{ unit: unitName(model), fields, values: insert }]
                    : insert.map(i => ({ unit: unitName(model), fields, values: i }));
        }
        const contains = data.filter(d => d.name === selCmpt.name + STORE);
        if (!contains.length) {
            data.push(init);
        }
    });
    return data;
}
export function assembleUnitSelectionMarks(model, marks) {
    forEachSelection(model, (selCmpt, selCompiler) => {
        marks = selCompiler.marks ? selCompiler.marks(model, selCmpt, marks) : marks;
        forEachTransform(selCmpt, txCompiler => {
            if (txCompiler.marks) {
                marks = txCompiler.marks(model, selCmpt, marks);
            }
        });
    });
    return marks;
}
export function assembleLayerSelectionMarks(model, marks) {
    for (const child of model.children) {
        if (isUnitModel(child)) {
            marks = assembleUnitSelectionMarks(child, marks);
        }
    }
    return marks;
}
export function assembleSelectionPredicate(model, selections, dfnode) {
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
// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
export function assembleSelectionScaleDomain(model, domainRaw) {
    const selDomain = JSON.parse(domainRaw.signal.replace(SELECTION_DOMAIN, ''));
    const name = varName(selDomain.selection);
    const encoding = selDomain.encoding;
    let field = selDomain.field;
    let selCmpt = model.component.selection && model.component.selection[name];
    if (selCmpt) {
        warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
    }
    else {
        selCmpt = model.getSelectionComponent(name, selDomain.selection);
        if (!encoding && !field) {
            field = selCmpt.project.items[0].field;
            if (selCmpt.project.items.length > 1) {
                warn('A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
                    `Using "field": ${stringValue(field)}.`);
            }
        }
        else if (encoding && !field) {
            const encodings = selCmpt.project.items.filter(p => p.channel === encoding);
            if (!encodings.length || encodings.length > 1) {
                field = selCmpt.project.items[0].field;
                warn((!encodings.length ? 'No ' : 'Multiple ') +
                    `matching ${stringValue(encoding)} encoding found for selection ${stringValue(selDomain.selection)}. ` +
                    `Using "field": ${stringValue(field)}.`);
            }
            else {
                field = encodings[0].field;
            }
        }
        return { signal: accessPathWithDatum(field, name) };
    }
    return { signal: 'null' };
}
//# sourceMappingURL=assemble.js.map