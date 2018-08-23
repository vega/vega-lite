import * as tslib_1 from "tslib";
import { selector as parseSelector } from 'vega-event-selector';
import { isString, stringValue } from 'vega-util';
import { X, Y } from '../../channel';
import { warn } from '../../log';
import { SELECTION_ID } from '../../selection';
import { accessPathWithDatum, keys, logicalExpr, varName } from '../../util';
import { isFacetModel, isUnitModel } from '../model';
import intervalCompiler from './interval';
import multiCompiler from './multi';
import singleCompiler from './single';
import { forEachTransform } from './transforms/transforms';
export var STORE = '_store';
export var TUPLE = '_tuple';
export var MODIFY = '_modify';
export var SELECTION_DOMAIN = '_selection_domain_';
export function parseUnitSelection(model, selDefs) {
    var selCmpts = {};
    var selectionConfig = model.config.selection;
    var _loop_1 = function (name_1) {
        if (!selDefs.hasOwnProperty(name_1)) {
            return "continue";
        }
        var selDef = selDefs[name_1];
        var cfg = selectionConfig[selDef.type];
        // Set default values from config if a property hasn't been specified,
        // or if it is true. E.g., "translate": true should use the default
        // event handlers for translate. However, true may be a valid value for
        // a property (e.g., "nearest": true).
        for (var key in cfg) {
            // A selection should contain either `encodings` or `fields`, only use
            // default values for these two values if neither of them is specified.
            if ((key === 'encodings' && selDef.fields) || (key === 'fields' && selDef.encodings)) {
                continue;
            }
            if (key === 'mark') {
                selDef[key] = tslib_1.__assign({}, cfg[key], selDef[key]);
            }
            if (selDef[key] === undefined || selDef[key] === true) {
                selDef[key] = cfg[key] || selDef[key];
            }
        }
        name_1 = varName(name_1);
        var selCmpt = (selCmpts[name_1] = tslib_1.__assign({}, selDef, { name: name_1, events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on }));
        forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.parse) {
                txCompiler.parse(model, selDef, selCmpt);
            }
        });
    };
    for (var name_1 in selDefs) {
        _loop_1(name_1);
    }
    return selCmpts;
}
export function assembleUnitSelectionSignals(model, signals) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        var name = selCmpt.name;
        var modifyExpr = selCompiler.modifyExpr(model, selCmpt);
        signals.push.apply(signals, selCompiler.signals(model, selCmpt));
        forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.signals) {
                signals = txCompiler.signals(model, selCmpt, signals);
            }
            if (txCompiler.modifyExpr) {
                modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
            }
        });
        signals.push({
            name: name + MODIFY,
            on: [
                {
                    events: { signal: name + TUPLE },
                    update: "modify(" + stringValue(selCmpt.name + STORE) + ", " + modifyExpr + ")"
                }
            ]
        });
    });
    return signals;
}
export function assembleFacetSignals(model, signals) {
    if (model.component.selection && keys(model.component.selection).length) {
        var name_2 = stringValue(model.getName('cell'));
        signals.unshift({
            name: 'facet',
            value: {},
            on: [
                {
                    events: parseSelector('mousemove', 'scope'),
                    update: "isTuple(facet) ? facet : group(" + name_2 + ").datum"
                }
            ]
        });
    }
    return signals;
}
export function assembleTopLevelSignals(model, signals) {
    var needsUnit = false;
    forEachSelection(model, function (selCmpt, selCompiler) {
        if (selCompiler.topLevelSignals) {
            signals = selCompiler.topLevelSignals(model, selCmpt, signals);
        }
        forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.topLevelSignals) {
                signals = txCompiler.topLevelSignals(model, selCmpt, signals);
            }
        });
        needsUnit = true;
    });
    if (needsUnit) {
        var hasUnit = signals.filter(function (s) { return s.name === 'unit'; });
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
    forEachSelection(model, function (selCmpt) {
        var contains = data.filter(function (d) { return d.name === selCmpt.name + STORE; });
        if (!contains.length) {
            data.push({ name: selCmpt.name + STORE });
        }
    });
    return data;
}
export function assembleUnitSelectionMarks(model, marks) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        marks = selCompiler.marks ? selCompiler.marks(model, selCmpt, marks) : marks;
        forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.marks) {
                marks = txCompiler.marks(model, selCmpt, marks);
            }
        });
    });
    return marks;
}
export function assembleLayerSelectionMarks(model, marks) {
    model.children.forEach(function (child) {
        if (isUnitModel(child)) {
            marks = assembleUnitSelectionMarks(child, marks);
        }
    });
    return marks;
}
export function selectionPredicate(model, selections, dfnode) {
    var stores = [];
    function expr(name) {
        var vname = varName(name);
        var selCmpt = model.getSelectionComponent(vname, name);
        var store = stringValue(vname + STORE);
        if (selCmpt.timeUnit) {
            var child = dfnode || model.component.data.raw;
            var tunode = selCmpt.timeUnit.clone();
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
        return (compiler(selCmpt.type).predicate +
            ("(" + store + ", datum") +
            (selCmpt.resolve === 'global' ? ')' : ", " + stringValue(selCmpt.resolve) + ")"));
    }
    var predicateStr = logicalExpr(selections, expr);
    return ((stores.length ? '!(' + stores.map(function (s) { return "length(data(" + s + "))"; }).join(' || ') + ') || ' : '') + ("(" + predicateStr + ")"));
}
// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
export function isRawSelectionDomain(domainRaw) {
    return domainRaw.signal.indexOf(SELECTION_DOMAIN) >= 0;
}
export function selectionScaleDomain(model, domainRaw) {
    var selDomain = JSON.parse(domainRaw.signal.replace(SELECTION_DOMAIN, ''));
    var name = varName(selDomain.selection);
    var selCmpt = model.component.selection && model.component.selection[name];
    if (selCmpt) {
        warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
    }
    else {
        selCmpt = model.getSelectionComponent(name, selDomain.selection);
        if (!selDomain.encoding && !selDomain.field) {
            selDomain.field = selCmpt.project[0].field;
            if (selCmpt.project.length > 1) {
                warn('A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
                    ("Using \"field\": " + stringValue(selDomain.field) + "."));
            }
        }
        return {
            signal: compiler(selCmpt.type).scaleDomain +
                ("(" + stringValue(name + STORE) + ", " + stringValue(selDomain.encoding || null) + ", ") +
                stringValue(selDomain.field || null) +
                (selCmpt.resolve === 'global' ? ')' : ", " + stringValue(selCmpt.resolve) + ")")
        };
    }
    return { signal: 'null' };
}
// Utility functions
function forEachSelection(model, cb) {
    var selections = model.component.selection;
    for (var name_3 in selections) {
        if (selections.hasOwnProperty(name_3)) {
            var sel = selections[name_3];
            cb(sel, compiler(sel.type));
        }
    }
}
function compiler(type) {
    switch (type) {
        case 'single':
            return singleCompiler;
        case 'multi':
            return multiCompiler;
        case 'interval':
            return intervalCompiler;
    }
    return null;
}
function getFacetModel(model) {
    var parent = model.parent;
    while (parent) {
        if (isFacetModel(parent)) {
            break;
        }
        parent = parent.parent;
    }
    return parent;
}
export function unitName(model) {
    var name = stringValue(model.name);
    var facet = getFacetModel(model);
    if (facet) {
        name +=
            (facet.facet.row ? " + '_' + (" + accessPathWithDatum(facet.vgField('row'), 'facet') + ")" : '') +
                (facet.facet.column ? " + '_' + (" + accessPathWithDatum(facet.vgField('column'), 'facet') + ")" : '');
    }
    return name;
}
export function requiresSelectionId(model) {
    var identifier = false;
    forEachSelection(model, function (selCmpt) {
        identifier = identifier || selCmpt.project.some(function (proj) { return proj.field === SELECTION_ID; });
    });
    return identifier;
}
export function channelSignalName(selCmpt, channel, range) {
    var sgNames = selCmpt._signalNames || (selCmpt._signalNames = {});
    if (sgNames[channel] && sgNames[channel][range]) {
        return sgNames[channel][range];
    }
    sgNames[channel] = sgNames[channel] || {};
    var basename = varName(selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]));
    var name = basename;
    var counter = 1;
    while (sgNames[name]) {
        name = basename + "_" + counter++;
    }
    return (sgNames[name] = sgNames[channel][range] = name);
}
export function positionalProjections(selCmpt) {
    var x = null;
    var xi = null;
    var y = null;
    var yi = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.channel === X) {
            x = p;
            xi = i;
        }
        else if (p.channel === Y) {
            y = p;
            yi = i;
        }
    });
    return { x: x, xi: xi, y: y, yi: yi };
}
//# sourceMappingURL=selection.js.map