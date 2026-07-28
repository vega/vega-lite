import {Binding, Signal, Stream} from 'vega';
import {array, isArray, isNumber, stringValue} from 'vega-util';
import {
  BARE_SIGNAL_NAME,
  SelectionCompiler,
  SelectionComponent,
  TUPLE,
  isTimerSelection,
  sliderName,
  unitName,
} from './index.js';
import {EasingFunction, isEasingFunction, SELECTION_ID} from '../../selection.js';
import * as log from '../../log/index.js';
import {vals} from '../../util.js';
import {BRUSH} from './interval.js';
import {TUPLE_FIELDS} from './project.js';
import {TIME} from '../../channel.js';
import {UnitModel} from '../unit.js';
import {animationInterpolationSignals} from '../animation.js';

export const CURR = '_curr';
export const ANIM_VALUE = 'anim_value';
export const ANIM_CLOCK = 'anim_clock';
export const EASED_ANIM_CLOCK = 'eased_anim_clock';
export const MIN_EXTENT = 'min_extent';
export const MAX_EXTENT = 'max_extent';
export const MAX_RANGE_EXTENT = 'max_range_extent';
export const T_INDEX = 't_index';
export const ANIM_VALUE_NEXT = 'anim_value_next';
export const ANIM_TWEEN = 'anim_tween';
export const LAST_TICK = 'last_tick_at';
export const IS_PLAYING = 'is_playing';
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

/**
 * Reshapes the raw clock by the selection's easing. `easeLinear` is the
 * identity function, so an explicit `easeLinear` and an unset easing both pass
 * the clock straight through instead of emitting a call that changes nothing.
 */
function easedClockExpr(easing: EasingFunction | number[]): string {
  if (!easing || easing === 'easeLinear') {
    return ANIM_CLOCK;
  }

  const t = `${ANIM_CLOCK} / ${MAX_RANGE_EXTENT}`;
  const eased = isArray(easing) ? `interpolateLinear([${easing.join(', ')}], ${t})` : `${easing}(${t})`;

  return `${eased} * ${MAX_RANGE_EXTENT}`;
}

const animationSignals = (selCmpt: SelectionComponent<'point'>, scaleName: string): Signal[] => {
  const selectionName = selCmpt.name;
  return [
    // timer signals
    {
      name: EASED_ANIM_CLOCK,
      update: easedClockExpr(selCmpt.easing),
    },

    // scale signals
    {name: `${selectionName}_domain`, init: `domain('${scaleName}')`},
    {name: MIN_EXTENT, init: `extent(${selectionName}_domain)[0]`},
    {name: MAX_RANGE_EXTENT, init: `extent(range('${scaleName}'))[1]`},
    {name: ANIM_VALUE, update: `invert('${scaleName}', ${EASED_ANIM_CLOCK})`},
  ];
};

/**
 * The condition under which the shared clock advances, along with the signals
 * it depends on and any signals that have to be emitted to support it.
 *
 * The gate merges every timer selection's contribution: filters on any timer
 * event, an `is_playing` switch when no specification-supplied filter exists,
 * and a dwell on any selection's pause frames.
 */
function playbackGate(timers: SelectionComponent<'point'>[]): {
  gate: string;
  dependencies: {signal: string}[];
  signals: Signal[];
} {
  const terms: string[] = [];
  const dependencies: {signal: string}[] = [];
  const signals: Signal[] = [];

  const sliderOwner = timers.find((t) => sliderName(t));
  const slider = sliderOwner && sliderName(sliderOwner);

  // A timer event filter lets a specification drive playback from its own
  // parameters, as in a checkbox bound to play/pause. A specification that
  // supplies a filter owns the switch, so the compiler emits no `is_playing`
  // of its own. Emitting one would collide with the parameter the filter names.
  const filterRefs: {signal: string}[] = [];
  for (const t of timers) {
    const filters = array<string>(t.events?.find((e) => 'type' in e && e.type === 'timer')?.filter ?? []);
    for (const [i, filter] of filters.entries()) {
      const f = filter.trim();
      if (BARE_SIGNAL_NAME.test(f)) {
        terms.push(f);
        filterRefs.push({signal: f});
      } else {
        // An expression filter cannot be referenced from an event stream, so
        // it gets a signal of its own. The signal also brackets the
        // expression, so an `||` inside it cannot regroup the gate's `&&`s.
        const term = `${t.name}_gate${i > 0 ? `_${i}` : ''}`;
        signals.push({name: term, update: `(${f})`});
        terms.push(term);
        filterRefs.push({signal: term});
      }
    }
  }
  dependencies.push(...filterRefs);

  if (!filterRefs.length) {
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

  for (const t of timers) {
    if (!t.pause?.length) continue;
    const name = t.name;
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

  parse: (model, selCmpt) => {
    const {easing} = selCmpt;
    if (easing === undefined) return;

    if (!isTimerSelection(selCmpt)) {
      log.warn(log.message.SELECTION_EASING_REQUIRES_TIMER);
      delete selCmpt.easing;
    } else if (isArray(easing)) {
      if (easing.length < 2 || easing.some((v) => !isNumber(v) || v < 0 || v > 1)) {
        log.warn(log.message.invalidSelectionEasingControlPoints(easing));
        delete selCmpt.easing;
      }
    } else if (!isEasingFunction(easing)) {
      log.warn(log.message.invalidSelectionEasing(easing));
      delete selCmpt.easing;
    }
  },

  topLevelSignals: (model, selCmpt, signals) => {
    if (!isTimerSelection(selCmpt)) {
      return signals;
    }

    // The clock is one signal for the whole view, so its configuration merges
    // every timer selection's properties: whichever selection owns the range
    // binding, the pause, or a timer filter contributes it to the shared
    // clock, regardless of which selection assembles first.
    const timers = vals(model.component.selection ?? {}).filter((c) =>
      isTimerSelection(c),
    ) as SelectionComponent<'point'>[];

    const {gate, dependencies, signals: gateSignals} = playbackGate(timers);
    const sliderOwner = timers.find((t) => sliderName(t));
    const slider = sliderOwner && sliderName(sliderOwner);

    // These signals live at the top level, because an animation is one clock
    // for the whole view rather than per-unit state. A layered or concatenated
    // spec parses the same selection into each child. A clock scoped to one
    // child's group would be invisible to its siblings, and would fail to
    // resolve its own dependency on the time scale's extent.
    const animation: Signal[] = [
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
              bind: {name: sliderOwner.project.items[0]?.field, ...(sliderOwner.bind as Binding)} as Binding,
              // The echo listens to the timer rather than to `anim_value`:
              // a signal event stream is an edge in Vega's dataflow graph,
              // and the slider already feeds the clock, so listening to
              // the clock's descendant would close a cycle.
              on: [{events: {type: 'timer', throttle: THROTTLE} as Stream, update: ANIM_VALUE}],
            },
          ]
        : []),
      ...gateSignals,
      ...animationSignals(selCmpt, model.scaleName(TIME)),
      ...animationInterpolationSignals(model as UnitModel, selCmpt.name),
    ];

    // Each child of a layer parses the same selection and asks for the same
    // signals. The copies are identical, and Vega rejects a duplicate name.
    const existing = new Set(signals.map((s) => s.name));
    return signals.concat(animation.filter((s) => !existing.has(s.name)));
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
      // The clock and everything derived from it are top-level. The tuple stays
      // per-unit, because it records which unit it came from.
      return signals.concat([
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
