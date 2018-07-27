import { TUPLE, unitName } from '../selection';
var TOGGLE = '_toggle';
var toggle = {
    has: function (selCmpt) {
        return selCmpt.type === 'multi' && selCmpt.toggle;
    },
    signals: function (model, selCmpt, signals) {
        return signals.concat({
            name: selCmpt.name + TOGGLE,
            value: false,
            on: [{ events: selCmpt.events, update: selCmpt.toggle }]
        });
    },
    modifyExpr: function (model, selCmpt, expr) {
        var tpl = selCmpt.name + TUPLE;
        var signal = selCmpt.name + TOGGLE;
        return (signal + " ? null : " + tpl + ", " +
            (selCmpt.resolve === 'global' ? signal + " ? null : true, " : signal + " ? null : {unit: " + unitName(model) + "}, ") +
            (signal + " ? " + tpl + " : null"));
    }
};
export default toggle;
//# sourceMappingURL=toggle.js.map