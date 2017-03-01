"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.bind && selCmpt.bind !== 'scales';
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var name = selCmpt.name, proj = selCmpt.project, bind = selCmpt.bind, datum = '(item().isVoronoi ? datum.datum : datum)';
        proj.forEach(function (p) {
            signals.unshift({
                name: name + id(p.field),
                value: '',
                on: [{
                        events: selCmpt.events,
                        update: datum + "[" + util_1.stringValue(p.field) + "]"
                    }],
                bind: bind[p.field] || bind[p.encoding] || bind
            });
        });
        return signals;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, proj = selCmpt.project, signal = signals.filter(function (s) { return s.name === name; })[0], fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return name + id(p.field); }).join(', ');
        signal.update = "{fields: [" + fields + "], values: [" + values + "]}";
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
exports.default = inputBindings;
function id(str) {
    return '_' + str.replace(/\W/g, '_');
}
//# sourceMappingURL=inputs.js.map