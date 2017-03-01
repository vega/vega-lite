"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("./selection");
var util_1 = require("../../util");
var multi = {
    predicate: 'vlPoint',
    signals: function (model, selCmpt) {
        var proj = selCmpt.project, datum = '(item().isVoronoi ? datum.datum : datum)', fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return datum + "[" + util_1.stringValue(p.field) + "]"; }).join(', ');
        return [{
                name: selCmpt.name,
                value: {},
                on: [{
                        events: selCmpt.events,
                        update: "{fields: [" + fields + "], values: [" + values + "]}"
                    }]
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name;
        return "fields: " + name + ".fields, values: " + name + ".values";
    },
    modifyExpr: function (model, selCmpt) {
        return selCmpt.name + selection_1.TUPLE;
    }
};
exports.default = multi;
//# sourceMappingURL=multi.js.map