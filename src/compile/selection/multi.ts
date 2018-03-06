import {stringValue} from 'vega-util';
import {accessPath} from '../../util';
import {SelectionCompiler, TUPLE, unitName} from './selection';
import nearest from './transforms/nearest';


const multi:SelectionCompiler = {
  predicate: 'vlMulti',
  scaleDomain: 'vlMultiDomain',

  signals: function(model, selCmpt) {
    const proj = selCmpt.project;
    const datum = nearest.has(selCmpt) ?
      '(item().isVoronoi ? datum.datum : datum)' : 'datum';
    const bins: string[] = [];
    const encodings = proj.map((p) => stringValue(p.channel)).filter((e) => e).join(', ');
    const fields = proj.map((p) => stringValue(p.field)).join(', ');
    const values = proj.map((p) => {
      const channel = p.channel;
      const fieldDef = model.fieldDef(channel);
      // Binned fields should capture extents, for a range test against the raw field.
      return (fieldDef && fieldDef.bin) ? (bins.push(p.field),
        `[${datum}${accessPath(model.vgField(channel, {}))}, ` +
            `${datum}${accessPath(model.vgField(channel, {binSuffix: 'end'}))}]`) :
        `${datum}${accessPath(p.field)}`;
    }).join(', ');

    // Only add a discrete selection to the store if a datum is present _and_
    // the interaction isn't occurring on a group mark. This guards against
    // polluting interactive state with invalid values in faceted displays
    // as the group marks are also data-driven. We force the update to account
    // for constant null states but varying toggles (e.g., shift-click in
    // whitespace followed by a click in whitespace; the store should only
    // be cleared on the second click).
    return [{
      name: selCmpt.name + TUPLE,
      value: {},
      on: [{
        events: selCmpt.events,
        update: `datum && item().mark.marktype !== 'group' ? ` +
          `{unit: ${unitName(model)}, encodings: [${encodings}], ` +
          `fields: [${fields}], values: [${values}]` +
          (bins.length ? ', ' + bins.map((b) => `${stringValue('bin_' + b)}: 1`).join(', ') : '') +
          '} : null',
        force: true
      }]
    }];
  },

  modifyExpr: function(model, selCmpt) {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' +
      (selCmpt.resolve === 'global' ? 'null' : `{unit: ${unitName(model)}}`);
  }
};

export {multi as default};
