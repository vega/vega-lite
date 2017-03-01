"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var transforms_1 = require("./transforms/transforms");
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
var single_1 = require("./single");
var multi_1 = require("./multi");
var interval_1 = require("./interval");
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
            events: util_1.isString(selDef.on) ? event_selector_1.default(selDef.on, 'scope') : selDef.on,
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
//# sourceMappingURL=selection.js.map