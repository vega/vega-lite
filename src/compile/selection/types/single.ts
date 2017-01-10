import {stringValue} from '../../../util';
import {TypeCompiler, multi} from './';
import {NS} from '../';

const single:TypeCompiler = {
  predicate: multi.predicate,

  signals: multi.signals,

  topLevelSignals: function(model, sel) {
    let name = sel.name;
    return [{
      name: name,
      update: 'tuples(' + stringValue(name + NS.STORE) + ')[0]'
    }];
  },

  tupleExpr: function(model, sel) {
    let name = sel.name, values = name + '.values';
    return 'fields: ' + name + '.fields, values: ' + values + ', ' +
      sel.project.map(function(p, i) {
        return p.field + ': ' + values + '[' + i + ']';
      }).join(', ');
  },

  modifyExpr: function(model, sel) {
    return sel.name + NS.TUPLE + ', true';
  }
};

export {single as default};
