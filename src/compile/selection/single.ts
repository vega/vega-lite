import {stringValue} from '../../util';
import multi from './multi';
import {SelectionCompiler, STORE, TUPLE} from './selection';

const single:SelectionCompiler = {
  predicate: multi.predicate,

  signals: multi.signals,

  topLevelSignals: function(model, selCmpt, signals) {
    const hasSignal = signals.filter((s) => s.name === selCmpt.name);
    const data = `data(${stringValue(selCmpt.name + STORE)})`;
    const values = `${data}[0].values`;
    return hasSignal.length ? signals : signals.concat({
      name: selCmpt.name,
      update: `${data}.length && {` +
        selCmpt.project.map((p, i) => `${p.field}: ${values}[${i}]`).join(',') + '}'
    });
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'true' : `{unit: ${stringValue(model.getName(''))}}`);
  }
};

export {single as default};
