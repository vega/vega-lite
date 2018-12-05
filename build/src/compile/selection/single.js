import { signals as multiSignals } from './multi';
import { TUPLE, unitName } from './selection';
var single = {
    signals: multiSignals,
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : "{unit: " + unitName(model) + "}");
    }
};
export default single;
//# sourceMappingURL=single.js.map