import {BindRange, Binding, Signal, Stream} from 'vega';
import {array, isObject, stringValue} from 'vega-util';
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
export const SCRUB_PLAYING = 'scrub_playing';
// Vega labels a bound widget with its signal's name. The animation signals are
// named for the compiler rather than the viewer, so the bindings carry a label.
export const PLAYING_LABEL = 'Playing';
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
 * The signal backing an animated selection's range binding, or undefined when
 * the selection has no binding. The signal holds a point in the time field's
 * domain, so a specification states `min`, `max`, and `step` in data units.
 */
function sliderName(selCmpt: SelectionComponent<'point'>): string | undefined {
  const {bind} = selCmpt;
  return bind && bind !== 'scales' && isObject(bind) && (bind as BindRange).input === 'range'
    ? `${selCmpt.name}_time`
    : undefined;
}

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
  const slider = sliderName(selCmpt);

  if (filters.length) {
    const filterRefs: {signal: string}[] = [];
    for (const [i, filter] of filters.entries()) {
      const f = filter.trim();
      if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(f)) {
        terms.push(f);
        filterRefs.push({signal: f});
      } else {
        // An expression filter cannot be referenced from an event stream, so
        // it gets a signal of its own. The signal also brackets the
        // expression, so an `||` inside it cannot regroup the gate's `&&`s.
        const term = `${name}_gate${i > 0 ? `_${i}` : ''}`;
        signals.push({name: term, update: `(${f})`});
        terms.push(term);
        filterRefs.push({signal: term});
      }
    }
    dependencies.push(...filterRefs);

    if (slider) {
      // Scrubbing stops playback whichever switch gates the clock, so the
      // clock never fights the pointer. The compiler cannot write to the
      // parameter the filter names, so it stops playback in a signal of its
      // own and releases that signal when the parameter next changes. Toggling
      // the specification's switch therefore resumes playback.
      terms.push(SCRUB_PLAYING);
      dependencies.push({signal: SCRUB_PLAYING});
      signals.push({
        name: SCRUB_PLAYING,
        init: 'true',
        on: [
          // ignore the slider echoing the current frame during playback
          {events: {signal: slider}, update: `${slider} !== ${ANIM_VALUE} ? false : ${SCRUB_PLAYING}`},
          {events: filterRefs, update: 'true'},
        ],
      });
    }
  } else {
    terms.push(IS_PLAYING);
    dependencies.push({signal: IS_PLAYING});
    signals.push(
      slider
        ? {
            // Scrubbing takes over from playback, so the clock does not fight
            // the pointer. The compiler owns this switch, so scrubbing clears
            // the checkbox and checking it again resumes playback.
            name: IS_PLAYING,
            init: 'true',
            // Vega labels a widget with the signal's name unless the binding
            // gives one, and `is_playing` is a compiler-internal name.
            bind: {input: 'checkbox', name: PLAYING_LABEL},
            // ignore the slider echoing the current frame during playback
            on: [{events: {signal: slider}, update: `${slider} !== ${ANIM_VALUE} ? false : ${IS_PLAYING}`}],
          }
        : {name: IS_PLAYING, init: 'true'},
    );
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
      // Restart the dwell timer on arriving at a new frame. Keying off the
      // frame rather than the duration matters when two consecutive pause
      // points share a duration: the duration signal would not change, and
      // the second pause would inherit an already-elapsed timer.
      {name: since, init: 'now()', on: [{events: [{signal: ANIM_VALUE}], update: 'now()'}]},
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
      const slider = sliderName(selCmpt);

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
              // Scrubbing sets the clock directly. The slider reads in data
              // units, so scaling it gives the elapsed time of that frame. The
              // guards matter: the slider echoes the current frame during
              // playback, and without them the echo would quantize the clock
              // to keyframe starts every tick; and a value off the domain
              // scales to undefined, which would poison the clock into NaN.
              ...(slider
                ? [
                    {
                      events: {signal: slider},
                      update:
                        `${slider} !== ${ANIM_VALUE} && isValid(scale('${model.scaleName(TIME)}', ${slider})) ? ` +
                        `scale('${model.scaleName(TIME)}', ${slider}) : ${ANIM_CLOCK}`,
                    },
                  ]
                : []),
            ],
          },
          {
            // Reset the reference point whenever playback stops or starts, so a
            // pause does not bank up elapsed time and jump on resume.
            name: LAST_TICK,
            init: 'now()',
            on: [{events: [{signal: ANIM_CLOCK}, ...dependencies], update: 'now()'}],
          },
          // The slider reads in the units of the field the selection projects
          // onto, so that field labels it. A binding that gives its own `name`
          // keeps that label. The binding is two-way: the slider tracks the
          // current frame while the animation plays, and dragging it scrubs.
          ...(slider
            ? [
                {
                  name: slider,
                  bind: {name: selCmpt.project.items[0]?.field, ...(selCmpt.bind as Binding)} as Binding,
                  // The echo listens to the timer rather than to `anim_value`:
                  // a signal event stream is an edge in Vega's dataflow graph,
                  // and the slider already feeds the clock, so listening to
                  // the clock's descendant would close a cycle.
                  on: [{events: {type: 'timer', throttle: THROTTLE}, update: ANIM_VALUE}],
                },
              ]
            : []),
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
