import { stringValue } from 'vega-util';
import { signals as multiSignals } from './multi';
import { STORE, TUPLE, unitName } from './selection';
var single = {
    predicate: 'vlSingle',
    scaleDomain: 'vlSingleDomain',
    signals: multiSignals,
    topLevelSignals: function (model, selCmpt, signals) {
        var hasSignal = signals.filter(function (s) { return s.name === selCmpt.name; });
        var data = "data(" + stringValue(selCmpt.name + STORE) + ")";
        var values = data + "[0].values";
        return hasSignal.length
            ? signals
            : signals.concat({
                name: selCmpt.name,
                update: data + ".length && {" + selCmpt.project.map(function (p, i) { return p.field + ": " + values + "[" + i + "]"; }).join(', ') + '}'
            });
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : "{unit: " + unitName(model) + "}");
    }
};
export default single;
//# sourceMappingURL=single.js.map