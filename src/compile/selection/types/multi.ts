import {TypeCompiler} from './';
import {NS} from '../';
import {stringValue} from '../../../util';

const multi:TypeCompiler = {
  predicate: 'inPointSelection',

  signals: function(model, sel) {
    let proj = sel.project,
        d = '(item().isVoronoi ? datum.datum : datum)';
    return [{
      name: sel.name,
      value: {},
      on: [{
        events: sel.events,
        update: '{fields: [' +
          proj.map((p) => stringValue(p.field)).join(', ') +
          '], values: [' +
          proj.map((p) => d + '[' + stringValue(p.field) + ']').join(', ') +
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
