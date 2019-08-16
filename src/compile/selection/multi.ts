import {selector as parseSelector} from 'vega-event-selector';
import {SelectionCompiler, SelectionComponent, TUPLE, unitName} from '.';
import {accessPathWithDatum, keys} from '../../util';
import {UnitModel} from '../unit';
import {TUPLE_FIELDS} from './transforms/project';

export function singleOrMultiSignals(model: UnitModel, selCmpt: SelectionComponent<'single' | 'multi'>) {
  const name = selCmpt.name;
  const fieldsSg = name + TUPLE_FIELDS;
  const project = selCmpt.project;
  const datum = '(item().isVoronoi ? datum.datum : datum)';
  const values = project.items
    .map(p => {
      const fieldDef = model.fieldDef(p.channel);
      // Binned fields should capture extents, for a range test against the raw field.
      return fieldDef && fieldDef.bin
        ? `[${accessPathWithDatum(model.vgField(p.channel, {}), datum)}, ` +
            `${accessPathWithDatum(model.vgField(p.channel, {binSuffix: 'end'}), datum)}]`
        : `${accessPathWithDatum(p.field, datum)}`;
    })
    .join(', ');

  // Only add a discrete selection to the store if a datum is present _and_
  // the interaction isn't occurring on a group mark. This guards against
  // polluting interactive state with invalid values in faceted displays
  // as the group marks are also data-driven. We force the update to account
  // for constant null states but varying toggles (e.g., shift-click in
  // whitespace followed by a click in whitespace; the store should only
  // be cleared on the second click).
  const update = `unit: ${unitName(model)}, fields: ${fieldsSg}, values`;
  const on = [
    {
      events: selCmpt.events,
      update: `datum && item().mark.marktype !== 'group' ? {${update}: [${values}]} : null`,
      force: true
    }
  ];

  if (selCmpt.legends) {
    for (const field of keys(selCmpt.legends)) {
      const {signals, ...proj} = selCmpt.legends[field];
      const prefix = `@${field}_legend`;
      on.push({
        events: parseSelector(`${prefix}_symbols:click, ${prefix}_labels:click`, 'view'),
        update: `{unit: "${prefix}", fields: [${JSON.stringify(proj)}], values: [datum.value]}`,
        force: true
      });
    }
  }

  return [{name: name + TUPLE, on: on}];
}

const multi: SelectionCompiler<'multi'> = {
  signals: singleOrMultiSignals,

  modifyExpr: (model, selCmpt) => {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' + (selCmpt.resolve === 'global' ? 'null' : `{unit: ${unitName(model)}}`);
  }
};

export default multi;
