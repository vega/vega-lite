import {stringValue} from '../../util';
import {SelectionCompiler, TUPLE} from './selection';

const multi:SelectionCompiler = {
  predicate: 'vlPoint',

  signals: function(model, selCmpt) {
    const proj = selCmpt.project,
        datum  = '(item().isVoronoi ? datum.datum : datum)',
        encodings = proj.map((p) => stringValue(p.encoding)).join(', '),
        fields = proj.map((p) => stringValue(p.field)).join(', '),
        values = proj.map((p) => `${datum}[${stringValue(p.field)}]`).join(', ');
    return [{
      name: selCmpt.name,
      value: {},
      on: [{
        events: selCmpt.events,
        update: `{encodings: [${encodings}], fields: [${fields}], values: [${values}]}`
      }]
    }];
  },

  tupleExpr: function(model, selCmpt) {
    const name = selCmpt.name;
    return `encodings: ${name}.encodings, fields: ${name}.fields, values: ${name}.values`;
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'null' : `{unit: ${tpl}.unit}`);
  }
};

export {multi as default};
