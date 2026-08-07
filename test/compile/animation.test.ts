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
});
