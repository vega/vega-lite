import {describe, expect, it} from 'vitest';
import {compile} from '../../src/compile/compile.js';
import {SCRUB_PLAYING} from '../../src/compile/selection/point.js';
import {TopLevelSpec} from '../../src/index.js';

/**
 * Cross-cutting animation behavior, exercised through the whole compiler rather
 * than a single component -- these features work by coordinating scales, data,
 * marks, and signals, and testing them in isolation misses the coordination.
 */

const gapminder = (select: any, extraParams: any[] = []): TopLevelSpec => ({
  data: {url: 'data/gapminder.json'},
  params: [{name: 'frame', select: {type: 'point', fields: ['year'], ...select}}, ...extraParams],
  transform: [{filter: {param: 'frame'}}],
  mark: 'point',
  encoding: {
    x: {field: 'fertility', type: 'quantitative'},
    y: {field: 'life_expect', type: 'quantitative'},
    time: {field: 'year', type: 'ordinal'},
  },
});

const racingBars = (rescale: boolean): TopLevelSpec => ({
  data: {url: 'data/category-brands.csv'},
  params: [{name: 'frame', select: {type: 'point', on: 'timer'}}],
  transform: [{filter: {param: 'frame'}}],
  mark: 'bar',
  encoding: {
    x: {field: 'value', type: 'quantitative'},
    y: {field: 'name', type: 'nominal', sort: {field: 'value', order: 'descending'}},
    color: {field: 'category', type: 'nominal'},
    time: {field: 'date', type: 'ordinal', ...(rescale ? {rescale: true} : {})},
  },
});

const scaleDomains = (spec: TopLevelSpec) =>
  Object.fromEntries(compile(spec).spec.scales.map((s) => [s.name, (s.domain as any)?.data]));

const clockGate = (spec: TopLevelSpec) => {
  const update = (compile(spec).spec.signals.find((s) => s.name === 'anim_clock') as any).on[0].update;
  return update.slice(0, update.indexOf(' ? '));
};

describe('animation', () => {
  describe('frame filter placement', () => {
    it('moves the frame filter off an upstream dataset', () => {
      // The dataflow pushes a filter above an aggregate when it can. Left there,
      // the aggregate only ever sees one frame -- and so does the time scale's
      // domain, collapsing the animation to a single keyframe.
      const aggregated = compile({
        data: {url: 'data/population.json'},
        params: [{name: 'frame', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'people', type: 'quantitative'},
          // sorting by another field splits the pipeline, so the raw source and
          // the aggregated main source are separate datasets
          y: {field: 'age', type: 'ordinal', sort: {field: 'people', op: 'sum', order: 'descending'}},
          time: {field: 'year', type: 'ordinal'},
        },
      } as TopLevelSpec).spec;

      // the filter has to end up on the frame dataset, wherever it started
      expect(aggregated.data.map((d) => d.name)).toEqual(expect.arrayContaining(['source_0', 'data_0', 'data_0_curr']));

      const withFrameFilter = aggregated.data.filter((d) =>
        (d.transform ?? []).some((t: any) => t.type === 'filter' && t.expr.includes('vlSelectionTest')),
      );

      expect(withFrameFilter).toHaveLength(1);
      expect(withFrameFilter[0].name).toMatch(/_curr$/);

      // and the aggregate, now upstream of the filter, still groups by the time
      // field, so each frame keeps its own aggregated value
      const aggregate = aggregated.data
        .flatMap((d) => d.transform ?? [])
        .find((t: any) => t.type === 'aggregate') as any;
      expect(aggregate.groupby).toContain('year');
    });

    it('parses a quantitative time field as a number', () => {
      // the band time scale sorts its domain; an unparsed CSV column would
      // sort lexicographically and play 1, 10, 100, ... instead of in order
      const compiled = compile({
        data: {url: 'data/bird-migration.csv'},
        params: [{name: 'frame', select: {type: 'point', fields: ['day'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'circle',
        encoding: {
          longitude: {field: 'lon', type: 'quantitative'},
          latitude: {field: 'lat', type: 'quantitative'},
          time: {field: 'day', type: 'quantitative'},
        },
      } as TopLevelSpec).spec;

      const source = compiled.data.find((d: any) => d.url) as any;
      expect(source.format.parse).toMatchObject({day: 'number'});
    });

    it('re-applies stack transforms on the frame dataset', () => {
      // The filter moves below the main pipeline's stack, which therefore
      // stacks every frame's rows at once. The frame dataset restacks, so bars
      // are laid out within their own frame.
      const compiled = compile({
        data: {url: 'data/population.json'},
        params: [{name: 'frame', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'bar',
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {aggregate: 'sum', field: 'people', type: 'quantitative'},
          color: {field: 'sex', type: 'nominal'},
          time: {field: 'year', type: 'ordinal'},
        },
      } as TopLevelSpec).spec;

      const curr = compiled.data.find((d) => d.name.endsWith('_curr'));
      const types = curr.transform.map((t: any) => t.type);
      expect(types[0]).toBe('filter');
      expect(types).toContain('stack');
    });
  });

  describe('default projection', () => {
    it('projects onto the derived field when the time encoding has a timeUnit', () => {
      // the time scale's domain holds the derived field's values, and
      // anim_value inverts to them, so the raw field could never match
      const compiled = compile({
        data: {url: 'data/seattle-weather.csv'},
        params: [{name: 'frame', select: {type: 'point', on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'point',
        encoding: {
          x: {field: 'temp_max', type: 'quantitative'},
          time: {field: 'date', type: 'ordinal', timeUnit: 'month'},
        },
      } as TopLevelSpec).spec;

      expect(compiled.signals).toEqual(
        expect.arrayContaining([{name: 'frame_tuple_fields', value: [{type: 'E', field: 'month_date'}]}]),
      );
    });

    it('projects an unprojected animated selection onto the time field', () => {
      // the `_vgsid_` fallback other point selections use stores a row identity,
      // which no frame filter can match
      const compiled = compile(gapminder({on: 'timer'})).spec;

      expect(compiled.signals).toEqual(
        expect.arrayContaining([{name: 'frame_tuple_fields', value: [{type: 'E', field: 'year'}]}]),
      );
      expect(compiled.signals).toEqual(
        expect.arrayContaining([
          {
            name: 'frame_tuple',
            update: '{unit: "", fields: frame_tuple_fields, values: [anim_value ? anim_value : min_extent]}',
          },
        ]),
      );
    });
  });
  describe('rescale', () => {
    it('leaves scale domains on the full dataset by default', () => {
      const domains = scaleDomains(racingBars(false));
      expect(domains.x).not.toMatch(/_curr$/);
      expect(domains.y).not.toMatch(/_curr$/);
    });

    it('reads continuous domains from the current frame', () => {
      expect(scaleDomains(racingBars(true)).x).toMatch(/_curr$/);
    });

    it('reads a sorted band domain from the current frame', () => {
      // a band domain sorted by another field reads the raw source rather than
      // the main one; it has to follow the animation too, or the bars in a
      // racing bar chart never reorder
      expect(scaleDomains(racingBars(true)).y).toMatch(/_curr$/);
    });

    it('rewrites a sort over a pre-aggregation field onto the frame dataset', () => {
      // the sort reads the raw source, where `people` exists; the frame dataset
      // carries the aggregate's output, so the sort has to read `sum_people`
      const compiled = compile({
        data: {url: 'data/population.json'},
        params: [{name: 'frame', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'people', type: 'quantitative'},
          y: {field: 'age', type: 'ordinal', sort: {field: 'people', op: 'sum', order: 'descending'}},
          time: {field: 'year', type: 'ordinal', rescale: true},
        },
      } as TopLevelSpec).spec;

      const y = compiled.scales.find((s) => s.name === 'y').domain as any;
      expect(y.data).toMatch(/_curr$/);
      expect(y.sort).toEqual({field: 'sum_people', op: 'max', order: 'descending'});
    });

    it('leaves scales with a discrete range alone', () => {
      // interpolating between an ordinal scale's outputs is not meaningful
      expect(scaleDomains(racingBars(true)).color).not.toMatch(/_curr$/);
    });

    it('leaves the time scale alone', () => {
      // the time scale defines the extent of the animation; narrowing it to the
      // current frame would collapse the domain being played through
      expect(scaleDomains(racingBars(true)).time).not.toMatch(/_curr$/);
    });

    it('points the rescaled domains at a dataset that exists', () => {
      const compiled = compile(racingBars(true)).spec;
      const names = new Set(compiled.data.map((d) => d.name));

      for (const scale of compiled.scales) {
        const data = (scale.domain as any)?.data;
        if (data) {
          expect(names).toContain(data);
        }
      }
    });
  });
  describe('playback gate', () => {
    it('gates on an is_playing switch of its own by default', () => {
      const compiled = compile(gapminder({on: 'timer'})).spec;
      expect(clockGate(gapminder({on: 'timer'}))).toBe('is_playing');
      expect(compiled.signals).toEqual(expect.arrayContaining([{name: 'is_playing', init: 'true'}]));
    });

    it('defers to the timer event filter and emits no switch of its own', () => {
      // otherwise the internal signal collides with the very parameter the
      // filter refers to, and the spec ends up with two `is_playing` signals
      const spec = gapminder({on: {type: 'timer', filter: 'is_playing'}}, [
        {name: 'is_playing', value: true, bind: {input: 'checkbox'}},
      ]);
      const compiled = compile(spec).spec;

      expect(clockGate(spec)).toBe('is_playing');
      expect(compiled.signals.filter((s) => s.name === 'is_playing')).toEqual([
        {name: 'is_playing', value: true, bind: {input: 'checkbox'}},
      ]);
    });

    it('conjoins multiple filter expressions', () => {
      const spec = gapminder({on: {type: 'timer', filter: ['playing', 'ready']}}, [
        {name: 'playing', value: true},
        {name: 'ready', value: true},
      ]);
      expect(clockGate(spec)).toBe('playing && ready');
    });

    it('wraps an expression filter in a signal of its own', () => {
      // An expression cannot be referenced from an event stream, so the tick
      // reference could never reset on it. The signal also brackets the
      // expression, so an `||` inside it cannot regroup the gate's `&&`s.
      const spec = gapminder({on: {type: 'timer', filter: 'a || b'}, pause: [{value: 1965, duration: 2000}]}, [
        {name: 'a', value: false},
        {name: 'b', value: true},
      ]);
      const compiled = compile(spec).spec;

      expect(compiled.signals).toEqual(expect.arrayContaining([{name: 'frame_gate', update: '(a || b)'}]));
      expect(clockGate(spec)).toBe('frame_gate && frame_pause_playing');

      const lastTick = compiled.signals.find((s) => s.name === 'last_tick_at') as any;
      expect(lastTick.on[0].events).toEqual(
        expect.arrayContaining([{signal: 'frame_gate'}, {signal: 'frame_pause_playing'}]),
      );
    });

    it('resets the tick reference whenever the gate changes', () => {
      // without this a pause banks up elapsed time and the animation jumps on resume
      const compiled = compile(gapminder({on: 'timer'})).spec;
      const lastTick = compiled.signals.find((s) => s.name === 'last_tick_at') as any;
      expect(lastTick.on[0].events).toEqual([{signal: 'anim_clock'}, {signal: 'is_playing'}]);
    });
  });

  describe('data-driven pause', () => {
    const paused = gapminder({on: 'timer', pause: [{value: 1965, duration: 2000}]});

    it('holds the pause entries in a store filtered to the current frame', () => {
      const compiled = compile(paused).spec;
      expect(compiled.data).toEqual(
        expect.arrayContaining([
          {
            name: 'frame_pause_store',
            values: [{value: 1965, duration: 2000}],
            transform: [{type: 'filter', expr: 'datum.value === anim_value'}],
          },
        ]),
      );
    });

    it('gates playback on the dwell having elapsed', () => {
      expect(clockGate(paused)).toBe('is_playing && frame_pause_playing');
    });

    it('restarts the dwell timer on arriving at a new pause point', () => {
      const compiled = compile(paused).spec;
      expect(compiled.signals).toEqual(
        expect.arrayContaining([
          {
            name: 'frame_pause_duration',
            update: 'length(data("frame_pause_store")) ? data("frame_pause_store")[0].duration : null',
          },
          {
            name: 'frame_pause_since',
            init: 'now()',
            // keyed off the frame, not the duration, so consecutive pause
            // points with the same duration each get a fresh dwell
            on: [{events: [{signal: 'anim_value'}], update: 'now()'}],
          },
        ]),
      );
    });

    it('plays through frames that are not pause points', () => {
      const compiled = compile(paused).spec;
      const playing = compiled.signals.find((s) => s.name === 'frame_pause_playing') as any;
      // a null duration means "not a pause point", which must read as playing
      expect(playing.on[0].update).toBe(
        'frame_pause_duration ? (now() - frame_pause_since > frame_pause_duration) : true',
      );
    });

    it('emits no pause machinery without a pause', () => {
      const compiled = compile(gapminder({on: 'timer'})).spec;
      expect(compiled.signals.filter((s) => /pause/.test(s.name))).toHaveLength(0);
      expect(compiled.data.filter((d) => /pause/.test(d.name))).toHaveLength(0);
    });
  });
  describe('range binding', () => {
    const slider = gapminder({on: 'timer'});
    (slider as any).params[0].bind = {input: 'range', min: 1955, max: 2005, step: 5};
    const compiled = compile(slider).spec;
    const signal = (name: string) => compiled.signals.find((s) => s.name === name) as any;

    it('binds a signal reading in data units, labelled with the time field', () => {
      expect(signal('frame_time')).toEqual({
        name: 'frame_time',
        bind: {name: 'year', input: 'range', min: 1955, max: 2005, step: 5},
        // the binding is two-way: the slider follows playback on each tick
        // (listening to anim_value itself would close a dataflow cycle)
        on: [{events: {type: 'timer', throttle: 1000 / 60}, update: 'anim_value'}],
      });
    });

    it('keeps a label the binding supplies', () => {
      const labelled = gapminder({on: 'timer'});
      (labelled as any).params[0].bind = {input: 'range', min: 1955, max: 2005, step: 5, name: 'Year'};
      const sg = compile(labelled).spec.signals.find((s) => s.name === 'frame_time') as any;
      expect(sg.bind.name).toBe('Year');
    });

    it('scrubs the clock by scaling the slider value', () => {
      // guarded so the slider echoing playback does not quantize the clock,
      // and an off-domain value cannot poison the clock into NaN
      expect(signal('anim_clock').on).toContainEqual({
        events: {signal: 'frame_time'},
        update:
          "frame_time !== anim_value && isValid(scale('time', frame_time)) ? scale('time', frame_time) : anim_clock",
      });
    });

    it('stops playback on scrub and offers a labelled way to resume', () => {
      expect(signal('is_playing')).toEqual({
        name: 'is_playing',
        init: 'true',
        bind: {input: 'checkbox', name: 'Playing'},
        // ignores the slider echoing the current frame during playback
        on: [{events: {signal: 'frame_time'}, update: 'frame_time !== anim_value ? false : is_playing'}],
      });
    });

    it('does not also build the generic widget-driven tuple', () => {
      // the generic input binding rewrites the tuple to read widget values,
      // which would sever it from the clock
      expect(signal('frame_tuple').update).toContain('anim_value');
    });

    it('emits no scrub signal when the compiler owns the switch', () => {
      expect(signal(SCRUB_PLAYING)).toBeUndefined();
    });

    describe('with a specification-supplied timer filter', () => {
      const own = gapminder({on: {type: 'timer', filter: 'playing'}}, [
        {name: 'playing', value: true, bind: {input: 'checkbox'}},
      ]);
      (own as any).params[0].bind = {input: 'range', min: 1955, max: 2005, step: 5};
      const ownCompiled = compile(own).spec;
      const ownSignal = (name: string) => ownCompiled.signals.find((s) => s.name === name) as any;

      it('leaves the specification its own switch', () => {
        expect(ownSignal('is_playing')).toBeUndefined();
        expect(ownSignal('playing')).toEqual({name: 'playing', value: true, bind: {input: 'checkbox'}});
      });

      it('stops playback on scrub through a signal of its own', () => {
        expect(ownSignal(SCRUB_PLAYING)).toEqual({
          name: SCRUB_PLAYING,
          init: 'true',
          on: [
            {events: {signal: 'frame_time'}, update: `frame_time !== anim_value ? false : ${SCRUB_PLAYING}`},
            {events: [{signal: 'playing'}], update: 'true'},
          ],
        });
      });

      it('gates the clock on both switches', () => {
        expect(ownSignal('anim_clock').on[0].update).toContain(`playing && ${SCRUB_PLAYING} ?`);
      });

      it('emits no scrub signal without a slider', () => {
        const noSlider = compile(
          gapminder({on: {type: 'timer', filter: 'playing'}}, [{name: 'playing', value: true}]),
        ).spec;
        expect(noSlider.signals.find((s) => s.name === SCRUB_PLAYING)).toBeUndefined();
      });
    });
  });
});
