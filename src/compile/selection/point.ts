import {Signal, Stream} from 'vega';
import {array, stringValue} from 'vega-util';
import {SelectionCompiler, SelectionComponent, TUPLE, isTimerSelection, unitName} from './index.js';
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

// Data-driven pausing. The store holds the pause entries matching the current
// frame, so the signals below read entry zero.
export const PAUSE_STORE = '_pause_store';
export const PAUSE_DURATION = 'pause_duration';
export const PAUSE_PLAYING = 'pause_playing';
export const PAUSE_SINCE = 'pause_since';

const animationSignals = (selectionName: string, scaleName: string): Signal[] => {
  return [
    // timer signals
    {
      name: EASED_ANIM_CLOCK,
      // update: 'easeLinear(anim_clock / max_range_extent) * max_range_extent'
      update: ANIM_CLOCK, // TODO: replace with above once easing functions are implemented in vega-functions
    },

    // scale signals
    // TODO(jzong): uncomment commented signals below when implementing interpolation https://github.com/vega/vega-lite/issues/9590
    {name: `${selectionName}_domain`, init: `domain('${scaleName}')`},
    {name: MIN_EXTENT, init: `extent(${selectionName}_domain)[0]`},
    // {name: 'max_extent', init: `extent(${selectionName}_domain)[1]`},
    {name: MAX_RANGE_EXTENT, init: `extent(range('${scaleName}'))[1]`},
    // {name: 't_index', update: `indexof(${selectionName}_domain, anim_value)`},
    {name: ANIM_VALUE, update: `invert('${scaleName}', ${EASED_ANIM_CLOCK})`},
  ];
};

/**
 * The condition under which the clock advances, along with the signals it
 * depends on and any signals that have to be emitted to support it.
 *
 * Two optional conditions gate playback. A specification supplies the first as
 * an `is_playing` switch or an expression in the timer's event filter, and the
 * second as a dwell on particular frames.
 */
function playbackGate(selCmpt: SelectionComponent<'point'>): {
  gate: string;
  dependencies: {signal: string}[];
  signals: Signal[];
} {
  const name = selCmpt.name;
  const terms: string[] = [];
  const dependencies: {signal: string}[] = [];
  const signals: Signal[] = [];

  // A timer event filter lets a specification drive playback from its own
  // parameters, as in a checkbox bound to play/pause. A specification that
  // supplies the filter owns the switch, so the compiler emits no `is_playing`
  // of its own. Emitting one would collide with the parameter the filter names.
  const filters = array<string>(selCmpt.events?.find((e) => 'type' in e && e.type === 'timer')?.filter ?? []);

  if (filters.length) {
    terms.push(...filters);
    dependencies.push(...filters.map((f) => ({signal: f})));
  } else {
    terms.push(IS_PLAYING);
    dependencies.push({signal: IS_PLAYING});
    signals.push({name: IS_PLAYING, init: 'true'});
  }

  if (selCmpt.pause?.length) {
    const playing = `${name}_${PAUSE_PLAYING}`;
    const duration = `${name}_${PAUSE_DURATION}`;
    const since = `${name}_${PAUSE_SINCE}`;

    terms.push(playing);
    dependencies.push({signal: playing});

    signals.push(
      // null when the current frame is not a pause point, otherwise how long to dwell
      {
        name: duration,
        update: `length(data(${stringValue(name + PAUSE_STORE)})) ? data(${stringValue(name + PAUSE_STORE)})[0].duration : null`,
      },
      // restart the dwell timer on arriving at a new pause point
      {name: since, init: 'now()', on: [{events: [{signal: duration}], update: 'now()'}]},
      {
        name: playing,
        init: 'true',
        on: [
          {
            events: {type: 'timer', throttle: THROTTLE},
            update: `${duration} ? (now() - ${since} > ${duration}) : true`,
          },
        ],
      },
    );
  }

  return {gate: terms.join(' && '), dependencies, signals};
}

const point: SelectionCompiler<'point'> = {
  defined: (selCmpt) => selCmpt.type === 'point',

  topLevelSignals: (model, selCmpt, signals) => {
    if (isTimerSelection(selCmpt)) {
      const {gate, dependencies, signals: gateSignals} = playbackGate(selCmpt);

      signals = signals.concat(
        [
          {
            name: ANIM_CLOCK,
            init: '0',
            on: [
              {
                events: {type: 'timer', throttle: THROTTLE},
                update: `${gate} ? (${ANIM_CLOCK} + (now() - ${LAST_TICK}) > ${MAX_RANGE_EXTENT} ? 0 : ${ANIM_CLOCK} + (now() - ${LAST_TICK})) : ${ANIM_CLOCK}`,
              },
            ],
          },
          {
            // Reset the reference point whenever playback stops or starts, so a
            // pause does not bank up elapsed time and jump on resume.
            name: LAST_TICK,
            init: 'now()',
            on: [{events: [{signal: ANIM_CLOCK}, ...dependencies], update: 'now()'}],
          },
        ],
        gateSignals,
      );
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
          // An `update` expression rather than an `on` handler: unlike a
          // direct-manipulation selection, an animation always has a current
          // frame, including before any event has fired. Event handlers do not
          // run during the initial pulse, so an `on` handler here leaves the
          // selection store empty for the first render -- the frame filter
          // matches nothing until the first timer tick lands.
          name: name + TUPLE,
          update: `{${update}}`,
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
