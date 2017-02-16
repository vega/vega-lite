import {TypeCompiler} from './';
import {TUPLE} from '../';
import {stringValue} from '../../../util';

const multi:TypeCompiler = {
  predicate: 'vlPoint',

  signals: function(model, sel) {
    let proj = sel.project,
        datum  = '(item().isVoronoi ? datum.datum : datum)',
        fields = proj.map((p) => stringValue(p.field)).join(', '),
        values = proj.map((p) => `${datum}[${stringValue(p.field)}]`).join(', ');
    return [{
      name: sel.name,
      value: {},
      on: [{
        events: sel.events,
        update: `{fields: [${fields}], values: [${values}]}`
      }]
    }];
  },

  tupleExpr: function(model, sel) {
    let name = sel.name;
    return `fields: ${name}.fields, values: ${name}.values`;
  },

  modifyExpr: function(model, sel) {
    return sel.name + TUPLE;
  }
};

export {multi as default};
