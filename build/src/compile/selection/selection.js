"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var util_1 = require("../../util");
var interval_1 = require("./interval");
var multi_1 = require("./multi");
var single_1 = require("./single");
var transforms_1 = require("./transforms/transforms");
exports.STORE = '_store', exports.TUPLE = '_tuple', exports.MODIFY = '_modify';
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
            resolve: 'union'
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
    return data
        .concat(Object.keys(model.component.selection)
        .map(function (k) {
        return { name: k + exports.STORE };
    }));
}
exports.assembleUnitData = assembleUnitData;
function assembleUnitMarks(model, marks) {
    var clippedGroup = false, selMarks = marks;
    forEachSelection(model, function (selCmpt, selCompiler) {
        selMarks = selCompiler.marks ? selCompiler.marks(model, selCmpt, selMarks) : selMarks;
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            clippedGroup = clippedGroup || txCompiler.clippedGroup;
            if (txCompiler.marks) {
                selMarks = txCompiler.marks(model, selCmpt, marks, selMarks);
            }
        });
    });
    if (clippedGroup) {
        selMarks = [{
                type: 'group',
                encode: {
                    enter: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } },
                        fill: { value: 'transparent' },
                        clip: { value: true }
                    }
                },
                marks: selMarks.map(model.correctDataNames)
            }];
    }
    return selMarks;
}
exports.assembleUnitMarks = assembleUnitMarks;
var PREDICATES_OPS = {
    'single': '"intersect", "all"',
    'independent': '"intersect", "unit"',
    'union': '"union", "all"',
    'union_others': '"union", "others"',
    'intersect': '"intersect", "all"',
    'intersect_others': '"intersect", "others'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE4RDtBQUc5RCxtQ0FBK0Q7QUFJL0QsdUNBQTBDO0FBQzFDLGlDQUFvQztBQUVwQyxtQ0FBc0M7QUFDdEMsc0RBQXlEO0FBRTVDLFFBQUEsS0FBSyxHQUFHLFFBQVEsRUFDM0IsUUFBQSxLQUFLLEdBQUksUUFBUSxFQUNqQixRQUFBLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFrQ3JCLDRCQUFtQyxLQUFnQixFQUFFLE9BQTJCO0lBQzlFLElBQU0sUUFBUSxHQUE2QixFQUFFLEVBQ3pDLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs0QkFFbEMsTUFBSTtRQUNiLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBRXBDLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBSSxDQUFDLEVBQ3hCLEdBQUcsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLHNFQUFzRTtRQUN0RSxtRUFBbUU7UUFDbkUsdUVBQXVFO1FBQ3ZFLHNDQUFzQztRQUN0QyxHQUFHLENBQUMsQ0FBQyxJQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLHNFQUFzRTtZQUN0RSx1RUFBdUU7WUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckYsUUFBUSxDQUFDO1lBQ1gsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1B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