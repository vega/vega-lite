import {Signal, Stream} from 'vega';
import {stringValue} from 'vega-util';
import {SelectionCompiler, TUPLE, isTimerSelection, unitName} from '.';
import {SELECTION_ID} from '../../selection';
import {vals} from '../../util';
import {BRUSH} from './interval';
import {TUPLE_FIELDS} from './project';

const timerSignals: Signal[] = [
  {
    name: 'anim_clock',
    init: '0',
    on: [
      {
        events: {type: 'timer', throttle: 16.666666666666668},
        update:
          'true ? (anim_clock + (now() - last_tick_at) > max_range_extent ? 0 : anim_clock + (now() - last_tick_at)) : anim_clock'
      }
    ]
  },
  {
    name: 'last_tick_at',
    init: 'now()',
    on: [{events: [{signal: 'anim_clock'}], update: 'now()'}]
  },
  {
    name: 'eased_anim_clock',
    update: 'easeLinear(anim_clock / max_range_extent) * max_range_extent'
  },
  {name: 't_index', update: 'indexof(date_domain, anim_value)'},
  {name: 'max_range_extent', init: "extent(range('time_date'))[1]"},
  {name: 'min_extent', init: 'extent(date_domain)[0]'},
  {name: 'max_extent', init: 'extent(date_domain)[1]'},
  {name: 'anim_value', update: "invert('time_date', eased_anim_clock)"},

  {name: 'date_domain', init: "domain('time_date')"},

  {name: 'date_tuple_fields', value: [{type: 'E', field: 'date'}]},
  {
    name: 'date_tuple',
    on: [
      {
        events: [{signal: 'eased_anim_clock'}, {signal: 'anim_value'}],
        update: '{unit: "", fields: date_tuple_fields, values: [anim_value ? anim_value : min_extent]}',
        force: true
      }
    ]
  }
];

const point: SelectionCompiler<'point'> = {
  defined: selCmpt => selCmpt.type === 'point',

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const fieldsSg = name + TUPLE_FIELDS;
    const project = selCmpt.project;
    const datum = '(item().isVoronoi ? datum.datum : datum)';

    // Only add a discrete selection to the store if a datum is present _and_
    // the interaction isn't occurring on a group mark. This guards against
    // polluting interactive state with invalid values in faceted displays
    // as the group marks are also data-driven. We force the update to account
    // for constant null states but varying toggles (e.g., shift-click in
    // whitespace followed by a click in whitespace; the store should only
    // be cleared on the second click).
    const brushes = vals(model.component.selection ?? {})
      .reduce((acc, cmpt) => {
        return cmpt.type === 'interval' ? acc.concat(cmpt.name + BRUSH) : acc;
      }, [])
      .map(b => `indexof(item().mark.name, '${b}') < 0`)
      .join(' && ');

    const test = `datum && item().mark.marktype !== 'group' && indexof(item().mark.role, 'legend') < 0${
      brushes ? ` && ${brushes}` : ''
    }`;

    let update = `unit: ${unitName(model)}, `;

    if (selCmpt.project.hasSelectionId) {
      update += `${SELECTION_ID}: ${datum}[${stringValue(SELECTION_ID)}]`;
    } else {
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

      update += `fields: ${fieldsSg}, values: [${values}]`;
    }

    if (isTimerSelection(selCmpt)) {
      // timer event: selection is for animation
      return signals.concat(timerSignals);
    } else {
      const events: Stream[] = selCmpt.events;
      return signals.concat([
        {
          name: name + TUPLE,
          on: events
            ? [
                {
                  events,
                  update: `${test} ? {${update}} : null`,
                  force: true
                }
              ]
            : []
        }
      ]);
    }
  }
};

export default point;
