import {stringValue} from '../../util';
import multi from './multi';
import {SelectionCompiler, STORE, TUPLE} from './selection';

const single:SelectionCompiler = {
  predicate: multi.predicate,

  signals: multi.signals,

  topLevelSignals: function(model, selCmpt, signals) {
    const hasSignal = signals.filter((s) => s.name === selCmpt.name);
    return hasSignal.length ? signals : signals.concat({
      name: selCmpt.name,
      update: `data(${stringValue(selCmpt.name + STORE)})[0]`
    });
  },

  tupleExpr: function(model, selCmpt) {
    const name = selCmpt.name, values = `${name}.values`;
    return `encodings: ${name}.encodings, fields: ${name}.fields, ` +
      `values: ${values}, ` +
      selCmpt.project.map(function(p, i) {
        return `${p.field}: ${values}[${i}]`;
      }).join(', ');
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'true' : `{unit: ${stringValue(model.getName(''))}}`);
  }
};

export {single as default};
