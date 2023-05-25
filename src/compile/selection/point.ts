import {Signal, Stream} from 'vega';
import {stringValue} from 'vega-util';
import {SelectionCompiler, TUPLE, isTimerSelection, unitName} from '.';
import {SELECTION_ID} from '../../selection';
import {vals} from '../../util';
import {BRUSH} from './interval';
import {TUPLE_FIELDS} from './project';

export const CURR = '_curr';

const animationSignals = (selectionName: string, scaleName: string): Signal[] => {
  return [
    // timer signals
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
      // update: 'easeLinear(anim_clock / max_range_extent) * max_range_extent'
      update: 'anim_clock' // TODO: replace with above once easing functions are implemented in vega-functions
    },

    // scale signals
    {name: `${selectionName}_domain`, init: `domain('${scaleName}')`},
    {name: 'min_extent', init: `extent(${selectionName}_domain)[0]`},
    {name: 'max_extent', init: `extent(${selectionName}_domain)[1]`},
    {name: 'max_range_extent', init: `extent(range('${scaleName}'))[1]`},
    {name: 't_index', update: `indexof(${selectionName}_domain, anim_value)`},
    {name: 'anim_value', update: `invert('${scaleName}', eased_anim_clock)`}
  ];
};

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
    } else if (isTimerSelection(selCmpt)) {
      update += `fields: ${fieldsSg}, values: [anim_value ? anim_value : min_extent]`;
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
      // TODO(jzong) scale name currently hardcoded to 'time'
      return signals.concat(animationSignals(selCmpt.name, 'time'), [
        {
          name: name + TUPLE,
          on: [
            {
              events: [{signal: 'eased_anim_clock'}, {signal: 'anim_value'}],
              update: `{${update}}`,
              force: true
            }
          ]
        }
      ]);
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
