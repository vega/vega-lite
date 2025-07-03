import {Signal, Stream} from 'vega';
import {stringValue} from 'vega-util';
import {SelectionCompiler, TUPLE, isTimerSelection, unitName} from './index.js';
import {SELECTION_ID} from '../../selection.js';
import {vals} from '../../util.js';
import {BRUSH} from './interval.js';
import {TUPLE_FIELDS} from './project.js';
import {TIME} from '../../channel.js';

export const CURR = '_curr';
export const ANIM_VALUE = 'anim_value';
export const ANIM_CLOCK = 'anim_clock';
export const EASED_ANIM_CLOCK = 'eased_anim_clock';
export const MIN_EXTENT = 'min_extent';
export const MAX_RANGE_EXTENT = 'max_range_extent';
export const LAST_TICK = 'last_tick_at';
export const IS_PLAYING = 'is_playing';
export const THROTTLE = (1 / 60) * 1000; // 60 FPS

const animationSignals = (selectionName: string, scaleName: string): Signal[] => {
  return [
    // timer signals
    {
      name: EASED_ANIM_CLOCK,
      // update: 'easeLinear(anim_clock / max_range_extent) * max_range_extent'
      update: ANIM_CLOCK, // TODO: replace with above once easing functions are implemented in vega-functions
    },

    // scale signals
    // TODO(jzong): uncomment commented signals below when implementing interpolation
    {name: `${selectionName}_domain`, init: `domain('${scaleName}')`},
    {name: MIN_EXTENT, init: `extent(${selectionName}_domain)[0]`},
    // {name: 'max_extent', init: `extent(${selectionName}_domain)[1]`},
    {name: MAX_RANGE_EXTENT, init: `extent(range('${scaleName}'))[1]`},
    // {name: 't_index', update: `indexof(${selectionName}_domain, anim_value)`},
    {name: ANIM_VALUE, update: `invert('${scaleName}', ${EASED_ANIM_CLOCK})`},
  ];
};

const point: SelectionCompiler<'point'> = {
  defined: (selCmpt) => selCmpt.type === 'point',

  topLevelSignals: (model, selCmpt, signals) => {
    if (isTimerSelection(selCmpt)) {
      signals = signals.concat([
        {
          name: ANIM_CLOCK,
          init: '0',
          on: [
            {
              events: {type: 'timer', throttle: THROTTLE},
              update: `${IS_PLAYING} ? (${ANIM_CLOCK} + (now() - ${LAST_TICK}) > ${MAX_RANGE_EXTENT} ? 0 : ${ANIM_CLOCK} + (now() - ${LAST_TICK})) : ${ANIM_CLOCK}`,
            },
          ],
        },
        {
          name: LAST_TICK,
          init: 'now()',
          on: [{events: [{signal: ANIM_CLOCK}, {signal: IS_PLAYING}], update: 'now()'}],
        },
        {
          name: IS_PLAYING,
          init: 'true',
        },
      ]);
    }

    return signals;
  },

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
      .map((b) => `indexof(item().mark.name, '${b}') < 0`)
      .join(' && ');

    const test = `datum && item().mark.marktype !== 'group' && indexof(item().mark.role, 'legend') < 0${
      brushes ? ` && ${brushes}` : ''
    }`;

    let update = `unit: ${unitName(model)}, `;

    if (selCmpt.project.hasSelectionId) {
      update += `${SELECTION_ID}: ${datum}[${stringValue(SELECTION_ID)}]`;
    } else if (isTimerSelection(selCmpt)) {
      update += `fields: ${fieldsSg}, values: [${ANIM_VALUE} ? ${ANIM_VALUE} : ${MIN_EXTENT}]`;
    } else {
      const values = project.items
        .map((p) => {
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
      return signals.concat(animationSignals(selCmpt.name, model.scaleName(TIME)), [
        {
          name: name + TUPLE,
          on: [
            {
              events: [{signal: EASED_ANIM_CLOCK}, {signal: ANIM_VALUE}],
              update: `{${update}}`,
              force: true,
            },
          ],
        },
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
                  force: true,
                },
              ]
            : [],
        },
      ]);
    }
  },
};

export default point;
