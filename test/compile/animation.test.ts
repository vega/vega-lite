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
});
