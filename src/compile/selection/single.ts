import {TUPLE, STORE, SelectionCompiler} from './selection';
import multi from './multi';
import {stringValue} from '../../util';

const single:SelectionCompiler = {
  predicate: multi.predicate,

  signals: multi.signals,

  topLevelSignals: function(model, selCmpt) {
    let name = selCmpt.name;
    return [{
      name: name,
      update: `data(${stringValue(name + STORE)})[0]`
    }];
  },

  tupleExpr: function(model, selCmpt) {
    let name = selCmpt.name, values = `${name}.values`;
    return `fields: ${name}.fields, values: ${values}, ` +
      selCmpt.project.map(function(p, i) {
        return `${p.field}: ${values}[${i}]`;
      }).join(', ');
  },

  modifyExpr: function(model, selCmpt) {
    return selCmpt.name + TUPLE + ', true';
  }
};

export {single as default};
