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
            name: model.getName(name_1),
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
function assembleUnitSignals(model, signals) {
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
                    update: "modify(" + util_1.stringValue(name + exports.STORE) + ", " + modifyExpr + ")"
                }]
        });
    });
    return signals;
}
exports.assembleUnitSignals = assembleUnitSignals;
function assembleTopLevelSignals(model) {
    var signals = [{
            name: 'unit',
            value: {},
            on: [{ events: 'mousemove', update: 'group()._id ? group() : unit' }]
        }];
    forEachSelection(model, function (selCmpt, selCompiler) {
        if (selCompiler.topLevelSignals) {
            signals.push.apply(signals, selCompiler.topLevelSignals(model, selCmpt));
        }
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.topLevelSignals) {
                signals = txCompiler.topLevelSignals(model, selCmpt, signals);
            }
        });
    });
    return signals;
}
exports.assembleTopLevelSignals = assembleTopLevelSignals;
function assembleUnitData(model, data) {
    forEachSelection(model, function (selCmpt) {
        data.push({ name: selCmpt.name + exports.STORE });
    });
    return data;
}
exports.assembleUnitData = assembleUnitData;
function assembleUnitMarks(model, marks) {
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
        return [selMarks, clippedGroup];
    }
    else {
        return clipGroup ? clippedGroup(model, selMarks) : selMarks;
    }
}
exports.assembleUnitMarks = assembleUnitMarks;
function assembleLayerMarks(model, marks) {
    var clipGroup = false;
    model.children.forEach(function (child) {
        var unit = assembleUnitMarks(child, marks);
        marks = unit[0];
        clipGroup = clipGroup || unit[1];
    });
    return clipGroup ? clippedGroup(model, marks) : marks;
}
exports.assembleLayerMarks = assembleLayerMarks;
var PREDICATES_OPS = {
    'global': '"union", "all"',
    'independent': '"intersect", "unit"',
    'union': '"union", "all"',
    'union_others': '"union", "others"',
    'intersect': '"intersect", "all"',
    'intersect_others': '"intersect", "others"'
};
function predicate(selCmpt, datum) {
    var store = util_1.stringValue(selCmpt.name + exports.STORE), op = PREDICATES_OPS[selCmpt.resolve];
    datum = datum || 'datum';
    return compiler(selCmpt).predicate + ("(" + store + ", parent._id, " + datum + ", " + op + ")");
}
exports.predicate = predicate;
// Utility functions
function forEachSelection(model, cb) {
    var selections = model.component.selection;
    for (var name_2 in selections) {
        if (selections.hasOwnProperty(name_2)) {
            var sel = selections[name_2];
            cb(sel, compiler(sel));
        }
    }
}
function compiler(selCmpt) {
    switch (selCmpt.type) {
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
    return selCmpt.name + '_' + channel;
}
exports.channelSignalName = channelSignalName;
function clippedGroup(model, marks) {
    return [{
            type: 'group',
            encode: {
                enter: {
                    width: { field: { group: 'width' } },
                    height: { field: { group: 'height' } },
                    fill: { value: 'transparent' },
                    clip: { value: true }
                }
            },
            marks: marks.map(model.correctDataNames)
        }];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE4RDtBQUc5RCxtQ0FBK0Q7QUFFL0Qsa0NBQW9DO0FBR3BDLHVDQUEwQztBQUMxQyxpQ0FBb0M7QUFFcEMsbUNBQXNDO0FBQ3RDLHNEQUF5RDtBQUU1QyxRQUFBLEtBQUssR0FBRyxRQUFRLENBQUM7QUFDakIsUUFBQSxLQUFLLEdBQUksUUFBUSxDQUFDO0FBQ2xCLFFBQUEsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQWtDaEMsNEJBQW1DLEtBQWdCLEVBQUUsT0FBMkI7SUFDOUUsSUFBTSxRQUFRLEdBQTZCLEVBQUUsRUFDekMsZUFBZSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDOzRCQUVsQyxNQUFJO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7UUFFcEMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFJLENBQUMsRUFDeEIsR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkMsc0VBQXNFO1FBQ3RFLG1FQUFtRTtRQUNuRSx1RUFBdUU7UUFDdkUsc0NBQXNDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFDLElBQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEIsc0VBQXNFO1lBQ3RFLHVFQUF1RTtZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRixRQUFRLENBQUM7WUFDWCxDQUFD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