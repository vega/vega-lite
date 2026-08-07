import {describe, expect, it} from 'vitest';
import {compile} from '../../src/compile/compile.js';
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
      expect(signal('scrub_playing')).toBeUndefined();
    });

    describe('with a specification-supplied timer filter', () => {
      const own = gapminder({on: {type: 'timer', filter: 'playing'}}, [
        {name: 'playing', value: true, bind: {input: 'checkbox'}},
      ]);
      (own as any).params[0].bind = {input: 'range', min: 1955, max: 2005, step: 5};
      const ownCompiled = compile(own).spec;
      const ownSignal = (name: string) => ownCompiled.signals.find((s) => s.name === name) as any;

      it('leaves the specification its own switch and pauses it on scrub', () => {
        expect(ownSignal('is_playing')).toBeUndefined();
        // Scrubbing writes to the specification's own parameter, so the
        // widget bound to it unchecks and the visible state stays consistent.
        expect(ownSignal('playing')).toEqual({
          name: 'playing',
          value: true,
          bind: {input: 'checkbox'},
          on: [{events: {signal: 'frame_time'}, update: 'frame_time !== anim_value ? false : playing'}],
        });
      });

      it('gates the clock on the specification switch alone', () => {
        expect(ownSignal('anim_clock').on[0].update).toContain('playing ?');
      });

      it('warns and drops the binding when a filter is an expression', () => {
        // an expression names no parameter the compiler could clear on scrub
        const spec = gapminder({on: {type: 'timer', filter: 'a || b'}}, [
          {name: 'a', value: true},
          {name: 'b', value: false},
        ]);
        (spec as any).params[0].bind = {input: 'range', min: 1955, max: 2005, step: 5};
        const compiled = compile(spec).spec;
        expect(compiled.signals.find((s) => s.name === 'frame_time')).toBeUndefined();
      });

      it('leaves an unbound filtered selection alone', () => {
        const noSlider = compile(
          gapminder({on: {type: 'timer', filter: 'playing'}}, [{name: 'playing', value: true}]),
        ).spec;
        const playing = noSlider.signals.find((s) => s.name === 'playing') as any;
        expect(playing.on).toBeUndefined();
      });
    });
  });
  describe('line marks', () => {
    it('reveals a line whose x is the time field behind a moving clip', () => {
      // the geometry is the static chart's own curve, so any curve
      // interpolation stays stable while the clip advances
      const compiled = compile({
        data: {url: 'data/stocks.csv'},
        params: [{name: 'frame', select: {type: 'point', fields: ['date'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: {type: 'line', interpolate: 'monotone'},
        encoding: {
          x: {field: 'date', type: 'temporal'},
          y: {field: 'price', type: 'quantitative'},
          color: {field: 'symbol', type: 'nominal'},
          time: {field: 'date', type: 'temporal', key: {field: 'symbol'}},
        },
      } as TopLevelSpec).spec;

      const pathgroup = compiled.marks.find((m: any) => m.name === 'pathgroup') as any;
      expect(pathgroup.clip.path.signal).toContain('lerp([scale("x", anim_value), scale("x", anim_value_next)]');
      // the line draws from the full data, not a frame dataset
      expect(pathgroup.from.facet.data).not.toMatch(/_curr$|_interpolate$/);
    });

    it('resamples a line whose position is not the time field', () => {
      const compiled = compile({
        data: {url: 'data/driving.json'},
        params: [{name: 'frame', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'line',
        encoding: {
          x: {field: 'miles', type: 'quantitative'},
          y: {field: 'gas', type: 'quantitative'},
          order: {field: 'year'},
          time: {field: 'year', type: 'quantitative', key: true},
        },
      } as TopLevelSpec).spec;

      const line = compiled.data.find((d: any) => d.name.endsWith('_line_interpolate')) as any;
      expect(line.transform.map((t: any) => t.type)).toEqual([
        'formula', // singleton key
        'window', // next vertex of the series
        'formula', // subsample fractions
        'flatten',
        'formula', // position on the clock's range
        'filter', // reveal up to the playhead
        'formula', // resampled x
        'formula', // resampled y
      ]);

      const mark = compiled.marks[0] as any;
      expect(mark.from.data).toBe(line.name);
      // subsamples of one segment share the time value, so the path orders by
      // each subsample's clock position
      expect(mark.sort).toEqual({field: 'datum["anim_sample_clock"]'});
    });
  });

  describe('interpolation', () => {
    const interpolated = (time: any): TopLevelSpec => ({
      data: {url: 'data/gapminder.json'},
      params: [{name: 'frame', select: {type: 'point', on: 'timer'}}],
      transform: [{filter: {param: 'frame'}}],
      mark: 'point',
      encoding: {
        x: {field: 'fertility', type: 'quantitative'},
        y: {field: 'life_expect', type: 'quantitative'},
        color: {field: 'cluster', type: 'nominal'},
        time: {field: 'year', type: 'ordinal', ...time},
      },
    });

    const keyed = compile(interpolated({key: {field: 'country'}})).spec;
    const signal = (name: string) => keyed.signals.find((s) => s.name === name) as any;
    const dataset = (name: string) => keyed.data.find((d) => d.name === name);

    it('emits no interpolation machinery without a key', () => {
      const plain = compile(interpolated({})).spec;
      expect(plain.signals.filter((s) => /anim_tween|anim_value_next|t_index/.test(s.name))).toHaveLength(0);
      expect(plain.data.filter((d) => /_eq|_next|_interpolate/.test(d.name))).toHaveLength(0);
      expect(plain.marks[0].from.data).toMatch(/_curr$/);
    });

    it('joins on a synthesized constant when the key names no field', () => {
      // A keyframe holding one mark has nothing to tell its rows apart by, so
      // `"key": true` asks for interpolation without naming a field.
      for (const key of [true, {}]) {
        const single = compile(interpolated({key})).spec;
        const eq = single.data.find((d) => d.name.endsWith('_eq')) as any;
        const eqNext = single.data.find((d) => d.name.endsWith('_eq_next')) as any;

        expect(eq.transform).toContainEqual({type: 'formula', expr: '0', as: 'animation_key'});
        expect(eqNext.transform[0]).toMatchObject({
          type: 'lookup',
          key: 'animation_key',
          fields: ['animation_key'],
        });
        // The tween machinery is emitted just as it is for a keyed animation.
        expect(single.signals.filter((s) => /anim_tween|anim_value_next/.test(s.name))).toHaveLength(2);
      }
    });

    it('does not synthesize a constant when the key names a field', () => {
      const eq = dataset('source_0_eq') as any;
      expect(eq.transform.filter((t: any) => t.type === 'formula')).toHaveLength(0);
      expect((dataset('source_0_eq_next') as any).transform[0].key).toBe('country');
    });

    it('does not interpolate over a linear time scale', () => {
      // a linear time scale is already continuous; there are no keyframes to
      // move between, because every instant is its own frame
      const linear = compile(
        interpolated({type: 'quantitative', scale: {type: 'linear'}, key: {field: 'country'}}),
      ).spec;
      expect(linear.signals.filter((s) => s.name === 'anim_tween')).toHaveLength(0);
    });

    it('tracks the frame it is heading towards', () => {
      expect(signal('t_index').update).toBe('indexof(frame_domain, anim_value)');
      // a successor equal to the current frame settles in place: it zeroes the
      // tween below
      expect(signal('anim_value_next').update).toBe(
        't_index < length(frame_domain) - 1 ? frame_domain[t_index + 1] : anim_value',
      );
    });

    it('loops back to the first frame in playback order when asked', () => {
      const looping = compile(interpolated({key: {field: 'country', loop: true}})).spec;
      const next = looping.signals.find((s) => s.name === 'anim_value_next') as any;
      expect(next.update).toContain('frame_domain[0]');
    });

    it('measures progress across the gap between frames', () => {
      // Guarded, because at the end of a non-looping animation the two frames
      // coincide and the ratio is undefined. The wrap of a looping animation
      // has its successor behind the current frame, so it runs over the
      // remainder of the clock's range rather than a negative gap.
      expect(signal('anim_tween').update).toBe(
        'anim_value_next !== anim_value ? ' +
          '(eased_anim_clock - scale("time", anim_value)) / ' +
          '(scale("time", anim_value_next) > scale("time", anim_value) ? ' +
          'scale("time", anim_value_next) - scale("time", anim_value) : ' +
          'max_range_extent - scale("time", anim_value)) : 0',
      );
    });

    it('keeps conditional encoding entries when rewriting the default', () => {
      // a production rule compiles to an array whose last entry is the
      // default; only that entry interpolates, and the tests survive
      const spec = interpolated({key: {field: 'country'}}) as any;
      spec.params.push({name: 'hover', select: {type: 'point', on: 'pointerover'}});
      spec.encoding.opacity = {condition: {param: 'hover', value: 1}, field: 'fertility', type: 'quantitative'};
      const compiled = compile(spec).spec;

      const opacity = (compiled.marks[0] as any).encode.update.opacity;
      expect(Array.isArray(opacity)).toBe(true);
      expect(opacity[0].test).toContain('hover');
      expect(opacity[opacity.length - 1].signal).toContain('lerp');
    });

    it('joins each frame to its successor by the key field', () => {
      expect(dataset('source_0_eq').transform).toContainEqual({
        type: 'filter',
        expr: 'datum["year"] === anim_value',
      });
      expect(dataset('source_0_next').transform).toContainEqual({
        type: 'filter',
        expr: 'datum["year"] === anim_value_next',
      });
      expect(dataset('source_0_eq_next').transform).toContainEqual({
        type: 'lookup',
        from: 'source_0_next',
        key: 'country',
        fields: ['country'],
        as: ['next'],
      });
    });

    it('draws from the joined dataset unioned with the frame dataset', () => {
      // the frame dataset contributes rows outside the current keyframe, which a
      // cumulative or windowed predicate admits and which are drawn where they are
      expect((dataset('source_0_interpolate') as any).source).toEqual(['source_0_curr', 'source_0_eq_next']);
      expect(keyed.marks[0].from.data).toBe('source_0_interpolate');
    });

    it('drops marks with no successor rather than freezing them', () => {
      expect(dataset('source_0_interpolate').transform).toContainEqual({
        type: 'filter',
        expr: 'datum["year"] === anim_value ? isValid(datum.next) : true',
      });
    });

    it('interpolates position after scaling', () => {
      // scaling first means a mark still moves smoothly when the scale itself is
      // not numeric -- between two band positions, say
      expect(keyed.marks[0].encode.update.x).toEqual({
        signal:
          'isValid(datum.next) ? lerp([scale("x", datum["fertility"]), scale("x", datum.next["fertility"])], anim_tween) : scale("x", datum["fertility"])',
      });
    });

    it('leaves encodings on a discrete-range scale alone', () => {
      expect(keyed.marks[0].encode.update.stroke).toEqual({scale: 'color', field: 'cluster'});
    });

    describe('with rescale', () => {
      const both = compile({
        data: {url: 'data/category-brands.csv'},
        params: [{name: 'frame', select: {type: 'point', on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'bar',
        encoding: {
          x: {field: 'value', type: 'quantitative'},
          y: {field: 'name', type: 'nominal', sort: {field: 'value', order: 'descending'}},
          time: {field: 'date', type: 'ordinal', rescale: true, key: {field: 'name'}},
        },
      } as TopLevelSpec).spec;

      it('builds a scale for the next frame', () => {
        const next = both.scales.find((s) => s.name === 'y_next') as any;
        expect(next).toBeDefined();
        expect(next.domain.data).toBe('data_0_next');
      });

      it('reads the successor position off the next frame scale', () => {
        // against the current frame's domain the mark would aim somewhere it is
        // not going, since rescaling moves the domain every frame
        expect((both.marks[0].encode.update.y as any).signal).toContain('scale("y_next", datum.next["name"])');
      });

      it('points every scale reference at a scale that exists', () => {
        const names = new Set(both.scales.map((s) => s.name));
        const encode = JSON.stringify(both.marks[0].encode);
        for (const [, name] of encode.matchAll(/scale\(\\"([^\\]+)\\"/g)) {
          expect(names).toContain(name);
        }
      });
    });
  });
  describe('multi-view', () => {
    const timeEncoding = {
      x: {field: 'fertility', type: 'quantitative'},
      y: {field: 'life_expect', type: 'quantitative'},
      time: {field: 'year', type: 'ordinal'},
    };

    it('lets several animated selections share one clock', () => {
      // Emitting the clock once is what makes a layered animation work, and the
      // same thing lets a spec hold the current frame in one selection and a
      // window around it in another -- one animation seen two ways.
      const twoSelections = compile({
        data: {url: 'data/gapminder.json'},
        params: [
          {name: 'today', select: {type: 'point', fields: ['year'], on: 'timer'}},
          {name: 'window', select: {type: 'point', fields: ['year'], on: 'timer'}},
        ],
        transform: [{filter: {param: 'today'}}],
        mark: 'point',
        encoding: {
          ...timeEncoding,
          opacity: {condition: {param: 'window', value: 1}, value: 0.2},
        },
      } as TopLevelSpec).spec;

      const names = twoSelections.signals.map((s) => s.name);
      expect(names.filter((n) => n === 'anim_clock')).toHaveLength(1);
      expect(names).toHaveLength(new Set(names).size);

      // Each selection keeps its own store, so they can hold different things.
      expect(twoSelections.data.map((d) => d.name)).toEqual(expect.arrayContaining(['today_store', 'window_store']));
    });

    it('honors clock properties whichever selection carries them', () => {
      // the clock is assembled once, so it merges every timer selection's
      // configuration rather than taking the first selection's alone
      const compiled = compile({
        data: {url: 'data/gapminder.json'},
        params: [
          {name: 'today', select: {type: 'point', fields: ['year'], on: 'timer'}},
          {
            name: 'window',
            select: {type: 'point', fields: ['year'], on: 'timer'},
            bind: {input: 'range', min: 1955, max: 2005, step: 5},
          },
        ],
        transform: [{filter: {param: 'today'}}],
        mark: 'point',
        encoding: {
          x: {field: 'fertility', type: 'quantitative'},
          time: {field: 'year', type: 'ordinal'},
        },
      } as TopLevelSpec).spec;

      // the slider owned by the second selection still scrubs the clock
      const clock = compiled.signals.find((s) => s.name === 'anim_clock') as any;
      expect(clock.on.some((o: any) => o.events?.signal === 'window_time')).toBe(true);
      // and stops playback
      const playing = compiled.signals.find((s) => s.name === 'is_playing') as any;
      expect(playing.bind).toEqual({input: 'checkbox', name: 'Playing'});
    });

    it("leaves a lookup transform's selection filter alone", () => {
      // `lookup: {from: {param}}` in a sibling layer materializes the
      // selection as a filtered secondary table. That filter tests the same
      // store as a frame filter, but it belongs to the lookup, and moving it
      // would freeze the lookup on its first frame.
      const compiled = compile({
        data: {url: 'data/stocks.csv'},
        encoding: {time: {field: 'date', type: 'temporal'}},
        layer: [
          {
            params: [{name: 'index', select: {type: 'point', on: 'timer'}}],
            mark: 'point',
            encoding: {x: {field: 'date', type: 'temporal'}, opacity: {value: 0}},
          },
          {
            transform: [
              {lookup: 'symbol', from: {param: 'index', key: 'symbol'}},
              {calculate: 'datum.index ? datum.price / datum.index.price : 0', as: 'indexed'},
            ],
            mark: 'line',
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'indexed', type: 'quantitative'},
              color: {field: 'symbol', type: 'nominal'},
            },
          },
        ],
      } as TopLevelSpec).spec;

      const lookup = compiled.data.flatMap((d) => d.transform ?? []).find((t: any) => t.type === 'lookup') as any;
      const lookupTable = compiled.data.find((d) => d.name === lookup.from);
      expect(lookupTable.transform).toEqual(
        expect.arrayContaining([
          expect.objectContaining({type: 'filter', expr: expect.stringContaining('vlSelectionTest')}),
        ]),
      );
    });

    const layered = compile({
      data: {url: 'data/gapminder.json'},
      params: [{name: 'frame', select: {type: 'point', on: 'timer'}}],
      transform: [{filter: {param: 'frame'}}],
      layer: [{mark: 'point'}, {mark: {type: 'text', dy: -10}, encoding: {text: {field: 'country'}}}],
      encoding: timeEncoding,
    } as TopLevelSpec).spec;

    const duplicates = (names: string[]) => names.filter((n, i) => names.indexOf(n) !== i);

    it('builds the clock once for a layered view', () => {
      // the selection is parsed into every child, so each asks for these; Vega
      // rejects a duplicate signal name
      expect(duplicates(layered.signals.map((s) => s.name))).toEqual([]);
    });

    it('builds the frame dataset once for a layered view', () => {
      expect(duplicates(layered.data.map((d) => d.name))).toEqual([]);
    });

    it('points every layer at the same frame dataset', () => {
      const from = layered.marks.map((m) => m.from.data);
      expect(from).toEqual(['source_0_curr', 'source_0_curr']);
    });

    it('keeps the clock resolvable from a concatenated view', () => {
      // the clock depends on the time scale's extent, so a clock scoped to one
      // concat group could not see it -- both have to be top-level
      const concatenated = compile({
        data: {url: 'data/gapminder.json'},
        vconcat: [
          {
            params: [{name: 'frame', select: {type: 'point', on: 'timer'}}],
            transform: [{filter: {param: 'frame'}}],
            mark: 'point',
            encoding: timeEncoding,
          },
          {mark: 'line', encoding: {x: {field: 'year', type: 'ordinal'}}},
        ],
      } as TopLevelSpec).spec;

      const topLevel = new Set(concatenated.signals.map((s) => s.name));
      expect(topLevel).toContain('anim_clock');
      expect(topLevel).toContain('max_range_extent');
      expect(topLevel).toContain('anim_value');
      expect(concatenated.scales.map((s) => s.name)).toContain('time');

      // the tuple stays with its unit, since it records which unit it came from
      const groupSignals = (concatenated.marks[0] as any).signals.map((s: any) => s.name);
      expect(groupSignals).toContain('frame_tuple');
    });
  });
  describe('facet', () => {
    it('re-applies stack transforms in the cell frame and interpolation datasets', () => {
      // the partition inherits rows stacked across every frame
      const compiled = compile({
        data: {url: 'data/population.json'},
        params: [{name: 'frame', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'bar',
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {aggregate: 'sum', field: 'people', type: 'quantitative'},
          color: {field: 'sex', type: 'nominal'},
          time: {field: 'year', type: 'ordinal', key: {field: 'age'}},
          facet: {field: 'sex', columns: 2},
        },
      } as TopLevelSpec).spec;

      const cell = (compiled.marks as any[]).find((m) => m.name === 'cell');
      const types = Object.fromEntries(
        (cell.data as any[]).map((d) => [d.name, d.transform.map((t: any) => t.type)]),
      );
      expect(types['facet_curr']).toEqual(['filter', 'stack']);
      expect(types['facet_eq']).toEqual(expect.arrayContaining(['filter', 'stack']));
    });

    const faceted = (time: any = {field: 'year', type: 'ordinal'}) =>
      compile({
        data: {url: 'data/gapminder.json'},
        params: [{name: 'frame', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'frame'}}],
        mark: 'point',
        encoding: {
          x: {field: 'fertility', type: 'quantitative'},
          y: {field: 'life_expect', type: 'quantitative'},
          time,
          facet: {field: 'cluster', columns: 2},
        },
      } as TopLevelSpec).spec;

    const cell = (spec: any) => spec.marks.find((m: any) => /cell/.test(m.name));

    it('builds the frame dataset inside the cell group', () => {
      // The partition is a Vega-level dataset the cell group defines, so the
      // frame dataset has to live in the same scope rather than at the top.
      const compiled = faceted();
      expect(cell(compiled).data.map((d: any) => d.name)).toContain('facet_curr');
      expect(compiled.data.map((d: any) => d.name)).not.toContain('facet_curr');
    });

    it('derives the frame dataset from the partition the cell holds', () => {
      const frame = cell(faceted()).data.find((d: any) => d.name === 'facet_curr');
      expect(frame.source).toBe('facet');
      expect(frame.transform[0].expr).toContain('vlSelectionTest');
    });

    it('leaves the frame filter off every top-level dataset', () => {
      // Left upstream, the filter narrows the source that the scales and the
      // facet partition both read: the time domain collapses to one keyframe
      // and the set of cells changes every frame.
      const compiled = faceted();
      for (const d of compiled.data) {
        for (const t of d.transform ?? []) {
          expect(JSON.stringify(t)).not.toContain('vlSelectionTest');
        }
      }
    });

    it('keeps every scale on the full data', () => {
      const compiled = faceted();
      for (const scale of compiled.scales) {
        expect((scale.domain as any).data).toBe('source_0');
      }
    });

    it('partitions the cells from the full data', () => {
      const facetDef = cell(faceted()).from.facet;
      expect(facetDef.data).toBe('source_0');
    });

    it('points the marks at the frame dataset', () => {
      expect(cell(faceted()).marks[0].from.data).toBe('facet_curr');
    });

    it('builds the interpolation datasets in the cell group too', () => {
      const compiled = faceted({field: 'year', type: 'ordinal', key: {field: 'country'}});
      const names = cell(compiled).data.map((d: any) => d.name);
      expect(names).toEqual(['facet_curr', 'facet_eq', 'facet_next', 'facet_eq_next', 'facet_interpolate']);
      expect(cell(compiled).marks[0].from.data).toBe('facet_interpolate');

      // the signals the join reads stay at the top level, where one clock lives
      const topLevel = new Set(compiled.signals.map((s: any) => s.name));
      expect(topLevel).toContain('anim_value_next');
      expect(topLevel).toContain('anim_tween');
    });
  });
});
