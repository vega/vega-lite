import {stringValue} from '../../util';
import multi from './multi';
import {SelectionCompiler, STORE, TUPLE} from './selection';

const single:SelectionCompiler = {
  predicate: multi.predicate,

  signals: multi.signals,

  topLevelSignals: function(model, selCmpt) {
    const name = selCmpt.name;
    return [{
      name: name,
      update: `data(${stringValue(name + STORE)})[0]`
    }];
  },

  tupleExpr: function(model, selCmpt) {
    const name = selCmpt.name, values = `${name}.values`;
    return `fields: ${name}.fields, values: ${values}, ` +
      selCmpt.project.map(function(p, i) {
        return `${p.field}: ${values}[${i}]`;
      }).join(', ');
  },

  modifyExpr: function(model, selCmpt) {
    let tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'true' : `{unit: ${tpl}.unit}`);
  }
};

export {single as default};
