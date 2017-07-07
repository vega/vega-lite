"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var log_1 = require("../../log");
var util_1 = require("../../util");
var layer_1 = require("../layer");
var unit_1 = require("../unit");
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
            if (selDef[key] === undefined || selDef[key] === true) {
                selDef[key] = cfg[key] || selDef[key];
            }
        }
        name_1 = util_1.varName(name_1);
        var selCmpt = selCmpts[name_1] = util_1.extend({}, selDef, {
            name: name_1,
            events: util_1.isString(selDef.on) ? vega_event_selector_1.selector(selDef.on, 'scope') : selDef.on,
        });
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
                on: [{ events: 'mousemove', update: 'group()._id ? group() : unit' }]
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
    var clipGroup = false;
    var selMarks = marks;
    forEachSelection(model, function (selCmpt, selCompiler) {
        selMarks = selCompiler.marks ? selCompiler.marks(model, selCmpt, selMarks) : selMarks;
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            clipGroup = clipGroup || txCompiler.clipGroup;
            if (txCompiler.marks) {
                selMarks = txCompiler.marks(model, selCmpt, marks, selMarks);
            }
        });
    });
    // In a layered spec, we want to clip all layers together rather than
    // only the layer within which the selection is defined. Propagate
    // our assembled state up and let the LayerModel make the right call.
    if (model.parent && model.parent instanceof layer_1.LayerModel) {
        return [selMarks, clipMarks];
    }
    else {
        return clipGroup ? clipMarks(selMarks) : selMarks;
    }
}
exports.assembleUnitSelectionMarks = assembleUnitSelectionMarks;
function assembleLayerSelectionMarks(model, marks) {
    var clipGroup = false;
    model.children.forEach(function (child) {
        if (child instanceof unit_1.UnitModel) {
            var unit = assembleUnitSelectionMarks(child, marks);
            marks = unit[0];
            clipGroup = clipGroup || unit[1];
        }
    });
    return clipGroup ? clipMarks(marks) : marks;
}
exports.assembleLayerSelectionMarks = assembleLayerSelectionMarks;
var PREDICATES_OPS = {
    global: '"union", "all"',
    independent: '"intersect", "unit"',
    union: '"union", "all"',
    union_others: '"union", "others"',
    intersect: '"intersect", "all"',
    intersect_others: '"intersect", "others"'
};
function predicate(model, selections) {
    function expr(name) {
        var vname = util_1.varName(name);
        var selCmpt = model.getSelectionComponent(vname, name);
        var store = util_1.stringValue(vname + exports.STORE);
        var op = PREDICATES_OPS[selCmpt.resolve];
        return compiler(selCmpt.type).predicate +
            ("(" + store + ", " + util_1.stringValue(model.getName('')) + ", datum, " + op + ")");
    }
    return util_1.logicalExpr(selections, expr);
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
    else if (!selDomain.encoding && !selDomain.field) {
        log_1.warn('A "field" or "encoding" must be specified when using a selection as a scale domain.');
    }
    else {
        selCmpt = model.getSelectionComponent(name, selDomain.selection);
        return {
            signal: compiler(selCmpt.type).scaleDomain +
                ("(" + util_1.stringValue(name + exports.STORE) + ", " + util_1.stringValue(selDomain.encoding || null) + ", ") +
                (util_1.stringValue(selDomain.field || null) + ", " + PREDICATES_OPS[selCmpt.resolve] + ")")
        };
    }
    return { signal: 'null' };
}
exports.selectionScaleDomain = selectionScaleDomain;
// Utility functions
function forEachSelection(model, cb) {
    var selections = model.component.selection;
    for (var name_2 in selections) {
        if (selections.hasOwnProperty(name_2)) {
            var sel = selections[name_2];
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
function channelSignalName(selCmpt, channel, range) {
    return util_1.varName(selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]));
}
exports.channelSignalName = channelSignalName;
function clipMarks(marks) {
    return marks.map(function (m) { return (m.clip = true, m); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE4RDtBQUU5RCxpQ0FBK0I7QUFJL0IsbUNBQXFGO0FBRXJGLGtDQUFvQztBQUVwQyxnQ0FBa0M7QUFDbEMsdUNBQTBDO0FBQzFDLGlDQUFvQztBQUVwQyxtQ0FBc0M7QUFDdEMsc0RBQXlEO0FBRzVDLFFBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUNqQixRQUFBLEtBQUssR0FBSSxRQUFRLENBQUM7QUFDbEIsUUFBQSxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ25CLFFBQUEsZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUM7QUFtQ3JELDRCQUFtQyxLQUFnQixFQUFFLE9BQTJCO0lBQzlFLElBQU0sUUFBUSxHQUE2QixFQUFFLENBQUM7SUFDOUMsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7NEJBRXRDLE1BQUk7UUFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUVwQyxDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQUksQ0FBQyxDQUFDO1FBQzdCLElBQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsc0VBQXNFO1FBQ3RFLG1FQUFtRTtRQUNuRSx1RUFBdUU7UUFDdkUsc0NBQXNDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEIsc0VBQXNFO1lBQ3RFLHVFQUF1RTtZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMs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