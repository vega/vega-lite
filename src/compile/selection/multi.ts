import {keys, stringValue} from '../../util';
import {SelectionCompiler, TUPLE} from './selection';

const multi:SelectionCompiler = {
  predicate: 'vlPoint',

  signals: function(model, selCmpt) {
    const proj = selCmpt.project;
    const datum = '(item().isVoronoi ? datum.datum : datum)';
    const bins = {};
    const encodings = proj.map((p) => stringValue(p.encoding)).filter((e) => e).join(', ');
    const fields = proj.map((p) => stringValue(p.field)).join(', ');
    const values = proj.map((p) => {
      const channel = p.encoding;
      // Binned fields should capture extents, for a range test against the raw field.
      return model.fieldDef(channel).bin ? (bins[p.field] = 1,
        `[${datum}[${stringValue(model.field(channel, {binSuffix: 'start'}))}], ` +
            `${datum}[${stringValue(model.field(channel, {binSuffix: 'end'}))}]]`) :
        `${datum}[${stringValue(p.field)}]`;
    }).join(', ');

    return [{
      name: selCmpt.name + TUPLE,
      value: {},
      on: [{
        events: selCmpt.events,
        update: `{encodings: [${encodings}], fields: [${fields}], values: [${values}]` +
          (keys(bins).length ? `, bins: ${JSON.stringify(bins)}}` : '}')
      }]
    }];
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'null' : `{unit: ${stringValue(model.getName(''))}}`);
  }
};

export {multi as default};
