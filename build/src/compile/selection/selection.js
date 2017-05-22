"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var util_1 = require("../../util");
var layer_1 = require("../layer");
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
                    update: "{unit: unit.datum && unit.datum._id, " + tupleExpr + "}"
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
        var unit = assembleUnitSelectionMarks(child, marks);
        marks = unit[0];
        clipGroup = clipGroup || unit[1];
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
// TODO: How to better differentiate unit than parent._id?
function predicate(name, type, resolve, datum, parent) {
    var store = util_1.stringValue(name + exports.STORE), op = PREDICATES_OPS[resolve || 'global'];
    datum = datum || 'datum';
    parent = parent === null ? null : 'parent._id';
    return compiler(type).predicate + ("(" + store + ", " + parent + ", " + datum + ", " + op + ")");
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
function invert(model, selCmpt, channel, expr) {
    var scale = util_1.stringValue(model.scaleName(channel));
    return selCmpt.domain === 'data' ? "invert(" + scale + ", " + expr + ")" : expr;
}
exports.invert = invert;
function channelSignalName(selCmpt, channel) {
    return selCmpt.name + '_' + selCmpt.fields[channel];
}
exports.channelSignalName = channelSignalName;
function clipMarks(marks) {
    return marks.map(function (m) { return (m.clip = true, m); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE4RDtBQUk5RCxtQ0FBK0Q7QUFFL0Qsa0NBQW9DO0FBR3BDLHVDQUEwQztBQUMxQyxpQ0FBb0M7QUFFcEMsbUNBQXNDO0FBQ3RDLHNEQUF5RDtBQUU1QyxRQUFBLEtBQUssR0FBRyxRQUFRLENBQUM7QUFDakIsUUFBQSxLQUFLLEdBQUksUUFBUSxDQUFDO0FBQ2xCLFFBQUEsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQW1DaEMsNEJBQW1DLEtBQWdCLEVBQUUsT0FBMkI7SUFDOUUsSUFBTSxRQUFRLEdBQTZCLEVBQUUsRUFDekMsZUFBZSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDOzRCQUVsQyxNQUFJO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7UUFFcEMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFJLENBQUMsRUFDeEIsR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkMsc0VBQXNFO1FBQ3RFLG1FQUFtRTtRQUNuRSx1RUFBdUU7UUFDdkUsc0NBQXNDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEIsc0VBQXNFO1lBQ3RFLHVFQUF1RTtZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRixRQUFRLENBQUM7WUFDWCxDQUFD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