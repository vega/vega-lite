import {stringValue} from '../../../util';
import {TypeCompiler, multi} from './';
import {defaultValue, NS} from '../';

const single:TypeCompiler = {
  predicate: multi.predicate,

  parse: function(model, def) {
    return {
      events: defaultValue(def.on, 'click'),
      fields: defaultValue(def.fields, def.encodings ? undefined : ['_id']),
    };
  },

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
