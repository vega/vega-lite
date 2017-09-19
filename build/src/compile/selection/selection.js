"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../channel");
var log_1 = require("../../log");
var selection_1 = require("../../selection");
var util_1 = require("../../util");
var model_1 = require("../model");
var interval_1 = require("./interval");
var multi_1 = require("./multi");
var single_1 = require("./single");
var transforms_1 = require("./transforms/transforms");
exports.STORE = '_store';
exports.TUPLE = '_tuple';
exports.MODIFY = '_modify';
exports.SELECTION_DOMAIN = '_selection_domain_';
function parseUnitSelection(model, selDefs) {
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
        name_1 = util_1.varName(name_1);
        var selCmpt = selCmpts[name_1] = tslib_1.__assign({}, selDef, { name: name_1, events: util_1.isString(selDef.on) ? vega_event_selector_1.selector(selDef.on, 'scope') : selDef.on });
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
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
exports.parseUnitSelection = parseUnitSelection;
function assembleUnitSelectionSignals(model, signals) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        var name = selCmpt.name;
        var modifyExpr = selCompiler.modifyExpr(model, selCmpt);
        signals.push.apply(signals, selCompiler.signals(model, selCmpt));
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.signals) {
                signals = txCompiler.signals(model, selCmpt, signals);
            }
            if (txCompiler.modifyExpr) {
                modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
            }
        });
        signals.push({
            name: name + exports.MODIFY,
            on: [{
                    events: { signal: name + exports.TUPLE },
                    update: "modify(" + util_1.stringValue(selCmpt.name + exports.STORE) + ", " + modifyExpr + ")"
                }]
        });
    });
    var facetModel = getFacetModel(model);
    if (signals.length && facetModel) {
        var name_2 = util_1.stringValue(facetModel.getName('cell'));
        signals.unshift({
            name: 'facet',
            value: {},
            on: [{
                    events: vega_event_selector_1.selector('mousemove', 'scope'),
                    update: "isTuple(facet) ? facet : group(" + name_2 + ").datum"
                }]
        });
    }
    return signals;
}
exports.assembleUnitSelectionSignals = assembleUnitSelectionSignals;
function assembleTopLevelSignals(model, signals) {
    var needsUnit = false;
    forEachSelection(model, function (selCmpt, selCompiler) {
        if (selCompiler.topLevelSignals) {
            signals = selCompiler.topLevelSignals(model, selCmpt, signals);
        }
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.topLevelSignals) {
                signals = txCompiler.topLevelSignals(model, selCmpt, signals);
            }
        });
        needsUnit = true;
    });
    if (needsUnit) {
        var hasUnit = signals.filter(function (s) { return s.name === 'unit'; });
        if (!(hasUnit.length)) {
            signals.unshift({
                name: 'unit',
                value: {},
                on: [{ events: 'mousemove', update: 'isTuple(group()) ? group() : unit' }]
            });
        }
    }
    return signals;
}
exports.assembleTopLevelSignals = assembleTopLevelSignals;
function assembleUnitSelectionData(model, data) {
    forEachSelection(model, function (selCmpt) {
        var contains = data.filter(function (d) { return d.name === selCmpt.name + exports.STORE; });
        if (!contains.length) {
            data.push({ name: selCmpt.name + exports.STORE });
        }
    });
    return data;
}
exports.assembleUnitSelectionData = assembleUnitSelectionData;
function assembleUnitSelectionMarks(model, marks) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        marks = selCompiler.marks ? selCompiler.marks(model, selCmpt, marks) : marks;
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.marks) {
                marks = txCompiler.marks(model, selCmpt, marks);
            }
        });
    });
    return marks;
}
exports.assembleUnitSelectionMarks = assembleUnitSelectionMarks;
function assembleLayerSelectionMarks(model, marks) {
    model.children.forEach(function (child) {
        if (model_1.isUnitModel(child)) {
            marks = assembleUnitSelectionMarks(child, marks);
        }
    });
    return marks;
}
exports.assembleLayerSelectionMarks = assembleLayerSelectionMarks;
function predicate(model, selections, dfnode) {
    var stores = [];
    function expr(name) {
        var vname = util_1.varName(name);
        var selCmpt = model.getSelectionComponent(vname, name);
        var store = util_1.stringValue(vname + exports.STORE);
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
        stores.push(store);
        return compiler(selCmpt.type).predicate + ("(" + store + ", datum") +
            (selCmpt.resolve === 'global' ? ')' : ", " + util_1.stringValue(selCmpt.resolve) + ")");
    }
    var predicateStr = util_1.logicalExpr(selections, expr);
    return '!(' + stores.map(function (s) { return "length(data(" + s + "))"; }).join(' || ') +
        (") || (" + predicateStr + ")");
}
exports.predicate = predicate;
// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
function isRawSelectionDomain(domainRaw) {
    return domainRaw.signal.indexOf(exports.SELECTION_DOMAIN) >= 0;
}
exports.isRawSelectionDomain = isRawSelectionDomain;
function selectionScaleDomain(model, domainRaw) {
    var selDomain = JSON.parse(domainRaw.signal.replace(exports.SELECTION_DOMAIN, ''));
    var name = util_1.varName(selDomain.selection);
    var selCmpt = model.component.selection && model.component.selection[name];
    if (selCmpt) {
        log_1.warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
    }
    else {
        selCmpt = model.getSelectionComponent(name, selDomain.selection);
        if (!selDomain.encoding && !selDomain.field) {
            selDomain.field = selCmpt.project[0].field;
            if (selCmpt.project.length > 1) {
                log_1.warn('A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
                    ("Using \"field\": " + util_1.stringValue(selDomain.field) + "."));
            }
        }
        return {
            signal: compiler(selCmpt.type).scaleDomain +
                ("(" + util_1.stringValue(name + exports.STORE) + ", " + util_1.stringValue(selDomain.encoding || null) + ", ") +
                util_1.stringValue(selDomain.field || null) +
                (selCmpt.resolve === 'global' ? ')' : ", " + util_1.stringValue(selCmpt.resolve) + ")")
        };
    }
    return { signal: 'null' };
}
exports.selectionScaleDomain = selectionScaleDomain;
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
            return single_1.default;
        case 'multi':
            return multi_1.default;
        case 'interval':
            return interval_1.default;
    }
    return null;
}
function getFacetModel(model) {
    var parent = model.parent;
    while (parent) {
        if (model_1.isFacetModel(parent)) {
            break;
        }
        parent = parent.parent;
    }
    return parent;
}
function unitName(model) {
    var name = util_1.stringValue(model.name);
    var facet = getFacetModel(model);
    if (facet) {
        name += (facet.facet.row ? " + '_' + facet[" + util_1.stringValue(facet.field('row')) + "]" : '')
            + (facet.facet.column ? " + '_' + facet[" + util_1.stringValue(facet.field('column')) + "]" : '');
    }
    return name;
}
exports.unitName = unitName;
function requiresSelectionId(model) {
    var identifier = false;
    forEachSelection(model, function (selCmpt) {
        identifier = identifier || selCmpt.project.some(function (proj) { return proj.field === selection_1.SELECTION_ID; });
    });
    return identifier;
}
exports.requiresSelectionId = requiresSelectionId;
function channelSignalName(selCmpt, channel, range) {
    return util_1.varName(selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]));
}
exports.channelSignalName = channelSignalName;
function positionalProjections(selCmpt) {
    var x = null;
    var xi = null;
    var y = null;
    var yi = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.channel === channel_1.X) {
            x = p;
            xi = i;
        }
        else if (p.channel === channel_1.Y) {
            y = p;
            yi = i;
        }
    });
    return { x: x, xi: xi, y: y, yi: yi };
}
exports.positionalProjections = positionalProjections;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBOEQ7QUFDOUQseUNBQTBEO0FBQzFELGlDQUErQjtBQUUvQiw2Q0FBNEc7QUFDNUcsbUNBQTZFO0FBTTdFLGtDQUEwRDtBQUUxRCx1Q0FBMEM7QUFDMUMsaUNBQW9DO0FBRXBDLG1DQUFzQztBQUN0QyxzREFBeUQ7QUFHNUMsUUFBQSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ2pCLFFBQUEsS0FBSyxHQUFJLFFBQVEsQ0FBQztBQUNsQixRQUFBLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDbkIsUUFBQSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQztBQW9DckQsNEJBQW1DLEtBQWdCLEVBQUUsT0FBMkI7SUFDOUUsSUFBTSxRQUFRLEdBQTZCLEVBQUUsQ0FBQztJQUM5QyxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs0QkFFdEMsTUFBSTtRQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBRXBDLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxzRUFBc0U7UUFDdEUsbUVBQW1FO1FBQ25FLHVFQUF1RTtRQUN2RSxzQ0FBc0M7UUFDdEMsR0FBRyxDQUFDLENBQUMsSUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QixzRUFBc0U7WUFDdEUsdUVBQXVFO1lBQ3ZFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxD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