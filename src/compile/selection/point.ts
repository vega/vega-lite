import {Stream} from 'vega';
import {stringValue} from 'vega-util';
import {SelectionCompiler, TUPLE, unitName} from '.';
import {vals} from '../../util';
import {BRUSH} from './interval';
import {TUPLE_FIELDS} from './project';

const point: SelectionCompiler<'point'> = {
  defined: selCmpt => selCmpt.type === 'point',

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const fieldsSg = name + TUPLE_FIELDS;
    const project = selCmpt.project;
    const datum = '(item().isVoronoi ? datum.datum : datum)';
    const values = project.items
      .map(p => {
        const fieldDef = model.fieldDef(p.channel);
        // Binned fields should capture extents, for a range test against the raw field.
        return fieldDef?.bin
          ? `[${datum}[${stringValue(model.vgField(p.channel, {}))}], ` +
              `${datum}[${stringValue(model.vgField(p.channel, {binSuffix: 'end'}))}]]`
          : `${datum}[${stringValue(p.field)}]`;
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

    const events: Stream[] = selCmpt.events;

    const brushes = vals(model.component.selection ?? {})
      .reduce((acc, cmpt) => {
        return cmpt.type === 'interval' ? acc.concat(cmpt.name + BRUSH) : acc;
      }, [])
      .map(b => `indexof(item().mark.name, '${b}') < 0`)
      .join(' && ');

    const test = `datum && item().mark.marktype !== 'group'${brushes ? ` && ${brushes}` : ''}`;

    return signals.concat([
      {
        name: name + TUPLE,
        on: events
          ? [
              {
                events,
                update: `${test} ? {${update}: [${values}]} : null`,
                force: true
              }
            ]
          : []
      }
    ]);
  }
};

export default point;
