"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
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
function parseUnitSelection(model, selDefs) {
    var selCmpts = {}, selectionConfig = model.config.selection;
    var _loop_1 = function (name_1) {
        if (!selDefs.hasOwnProperty(name_1)) {
            return "continue";
        }
        var selDef = selDefs[name_1], cfg = selectionConfig[selDef.type];
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
        var selCmpt = selCmpts[name_1] = util_1.extend({}, selDef, {
            name: name_1,
            events: util_1.isString(selDef.on) ? vega_event_selector_1.selector(selDef.on, 'scope') : selDef.on,
            domain: 'data',
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
        var name = selCmpt.name, tupleExpr = selCompiler.tupleExpr(model, selCmpt);
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
            name: name + exports.TUPLE,
            on: [{
                    events: { signal: name },
                    update: "{unit: " + util_1.stringValue(model.getName('')) + ", " + tupleExpr + "}"
                }]
        }, {
            name: name + exports.MODIFY,
            on: [{
                    events: { signal: name },
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
    var clipGroup = false, selMarks = marks;
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
function predicate(model, name, type, resolve, datum) {
    var store = util_1.stringValue(name + exports.STORE), op = PREDICATES_OPS[resolve || 'global'];
    datum = datum || 'datum';
    return compiler(type).predicate + ("(" + store + ", " + util_1.stringValue(model.getName('')) + ", " + datum + ", " + op + ")");
}
exports.predicate = predicate;
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
    return selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]);
}
exports.channelSignalName = channelSignalName;
function clipMarks(marks) {
    return marks.map(function (m) { return (m.clip = true, m); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE4RDtBQUk5RCxtQ0FBK0Q7QUFFL0Qsa0NBQW9DO0FBRXBDLGdDQUFrQztBQUNsQyx1Q0FBMEM7QUFDMUMsaUNBQW9DO0FBRXBDLG1DQUFzQztBQUN0QyxzREFBeUQ7QUFFNUMsUUFBQSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ2pCLFFBQUEsS0FBSyxHQUFJLFFBQVEsQ0FBQztBQUNsQixRQUFBLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFtQ2hDLDRCQUFtQyxLQUFnQixFQUFFLE9BQTJCO0lBQzlFLElBQU0sUUFBUSxHQUE2QixFQUFFLEVBQ3pDLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs0QkFFbEMsTUFBSTtRQUNiLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBRXBDLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBSSxDQUFDLEVBQ3hCLEdBQUcsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLHNFQUFzRTtRQUN0RSxtRUFBbUU7UUFDbkUsdUVBQXVFO1FBQ3ZFLHNDQUFzQztRQUN0QyxHQUFHLENBQUMsQ0FBQyxJQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLHNFQUFzRTtZQUN0RSx1RUFBdUU7WUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckYsUUFBUSxD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