import {TypeCompiler} from './';
import {defaultValue, NS} from '../';
import {stringValue} from '../../../util';

const multi:TypeCompiler = {
  predicate: 'inPointSelection',

  parse: function(model, def) {
    return {
      events: defaultValue(def.on, 'click'),
      fields: defaultValue(def.fields, def.encodings ? undefined : ['_id']),
      toggle: defaultValue(def.toggle, 'event.shiftKey')
    };
  },

  signals: function(model, sel) {
    let proj = sel.project;
    return [{
      name: sel.name,
      value: {},
      on: [{
        events: sel.events,
        update: '{fields: [' +
          proj.map((p) => stringValue(p.field)).join(', ') +
          '], values: [' +
          proj.map((p) => 'datum[' + stringValue(p.field) + ']').join(', ') +
          ']}'
      }]
    }];
  },

  tupleExpr: function(model, sel) {
    let name = sel.name;
    return 'fields: ' + name + '.fields, values: ' + name + '.values';
  },

  modifyExpr: function(model, sel) {
    return sel.name + NS.TUPLE;
  }
};

export {multi as default};
