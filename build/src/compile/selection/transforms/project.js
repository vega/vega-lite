"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var project = {
    has: function (selDef) {
        return selDef.fields !== undefined || selDef.encodings !== undefined;
    },
    parse: function (model, selDef, selCmpt) {
        var fields = {};
        // TODO: find a possible channel mapping for these fields.
        (selDef.fields || []).forEach(function (f) { return fields[f] = null; });
        (selDef.encodings || []).forEach(function (e) { return fields[model.field(e)] = e; });
        var projection = selCmpt.project || (selCmpt.project = []);
        for (var field in fields) {
            if (fields.hasOwnProperty(field)) {
                projection.push({ field: field, encoding: fields[field] });
            }
        }
    }
};
exports.default = project;
//# sourceMappingURL=project.js.map