"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("../selection");
var TOGGLE = '_toggle';
var toggle = {
    has: function (selCmpt) {
        return selCmpt.toggle !== undefined && selCmpt.toggle !== false;
    },
    signals: function (model, selCmpt, signals) {
        return signals.concat({
            name: selCmpt.name + TOGGLE,
            value: false,
            on: [{ events: selCmpt.events, update: selCmpt.toggle }]
        });
    },
    modifyExpr: function (model, selCmpt, expr) {
        var tpl = selCmpt.name + selection_1.TUPLE, signal = selCmpt.name + TOGGLE;
        return signal + " ? null : " + tpl + ", " +
            (signal + " ? null : true, ") +
            (signal + " ? " + tpl + " : null");
    }
};
exports.default = toggle;
//# sourceMappingURL=toggle.js.map