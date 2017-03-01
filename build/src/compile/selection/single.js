"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("./selection");
var multi_1 = require("./multi");
var util_1 = require("../../util");
var single = {
    predicate: multi_1.default.predicate,
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt) {
        var name = selCmpt.name;
        return [{
                name: name,
                update: "data(" + util_1.stringValue(name + selection_1.STORE) + ")[0]"
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name, values = name + ".values";
        return "fields: " + name + ".fields, values: " + values + ", " +
            selCmpt.project.map(function (p, i) {
                return p.field + ": " + values + "[" + i + "]";
            }).join(', ');
    },
    modifyExpr: function (model, selCmpt) {
        return selCmpt.name + selection_1.TUPLE + ', true';
    }
};
exports.default = single;
//# sourceMappingURL=single.js.map