import { singleOrMultiSignals } from './multi';
import { TUPLE, unitName } from './selection';
const single = {
    signals: singleOrMultiSignals,
    modifyExpr: (model, selCmpt) => {
        const tpl = selCmpt.name + TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : `{unit: ${unitName(model)}}`);
    }
};
export default single;
//# sourceMappingURL=single.js.map