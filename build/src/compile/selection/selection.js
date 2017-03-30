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
        var name = selCmpt.name, tupleExpr = selCompiler.tupleExpr(model, selCmpt), modifyExpr = selCompiler.modifyExpr(model, selCmpt);
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
                marks: selMarks
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUE4RDtBQUc5RCxtQ0FBK0Q7QUFJL0QsdUNBQTBDO0FBQzFDLGlDQUFvQztBQUVwQyxtQ0FBc0M7QUFDdEMsc0RBQXlEO0FBRTVDLFFBQUEsS0FBSyxHQUFHLFFBQVEsRUFDM0IsUUFBQSxLQUFLLEdBQUksUUFBUSxFQUNqQixRQUFBLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFrQ3JCLDRCQUFtQyxLQUFnQixFQUFFLE9BQTJCO0lBQzlFLElBQUksUUFBUSxHQUE2QixFQUFFLEVBQ3ZDLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs0QkFFcEMsTUFBSTtRQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBRXBDLENBQUM7UUFFRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBSSxDQUFDLEVBQ3RCLEdBQUcsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLHNFQUFzRTtRQUN0RSxtRUFBbUU7UUFDbkUsdUVBQXVFO1FBQ3ZFLHNDQUFzQztRQUN0QyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLHNFQUFzRTtZQUN0RSx1RUFBdUU7WUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckYsUUFBUSxDQUFDO1lBQ1gsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1B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