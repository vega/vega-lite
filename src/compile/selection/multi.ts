import {stringValue} from '../../util';
import {SelectionCompiler, TUPLE} from './selection';

const multi:SelectionCompiler = {
  predicate: 'vlPoint',

  signals: function(model, selCmpt) {
    const proj = selCmpt.project,
        datum  = '(item().isVoronoi ? datum.datum : datum)',
        fields = proj.map((p) => stringValue(p.field)).join(', '),
        values = proj.map((p) => `${datum}[${stringValue(p.field)}]`).join(', ');
    return [{
      name: selCmpt.name,
      value: {},
      on: [{
        events: selCmpt.events,
        update: `{fields: [${fields}], values: [${values}]}`
      }]
    }];
  },

  tupleExpr: function(model, selCmpt) {
    const name = selCmpt.name;
    return `fields: ${name}.fields, values: ${name}.values`;
  },

  modifyExpr: function(model, selCmpt) {
    return selCmpt.name + TUPLE;
  }
};

export {multi as default};
