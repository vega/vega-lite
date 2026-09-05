import {Data, GroupMark} from 'vega';
import {compile} from '../../../src/compile/compile.js';

function findData(data: readonly Data[], name: string): Data {
  const d = data.find((datum) => datum.name === name);
  expect(d).toBeDefined();
  return d;
}

describe('compile/data/subtree', () => {
  describe('moveFacetDown', () => {
    it('should move the facet below an aggregate without a custom sort', () => {
      const {spec} = compile({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          row: {field: 'Origin', type: 'nominal'},
          x: {field: 'Horsepower', type: 'quantitative', aggregate: 'mean'},
        },
      });

      const source = findData(spec.data, 'source_0');
      expect(source.transform).toEqual([
        {
          type: 'aggregate',
          groupby: ['Origin'],
          ops: ['mean'],
          fields: ['Horsepower'],
          as: ['mean_Horsepower'],
        },
        expect.objectContaining({type: 'filter'}),
      ]);
    });

    it('should preserve the sort index through an aggregate below the facet', () => {
      const {spec} = compile({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          row: {field: 'Origin', type: 'nominal', sort: ['Japan', 'Europe', 'USA']},
          x: {field: 'Horsepower', type: 'quantitative', aggregate: 'mean'},
        },
      });

      const source = findData(spec.data, 'source_0');
      expect(source.transform).toEqual([
        {
          type: 'formula',
          expr: 'datum["Origin"]==="Japan" ? 0 : datum["Origin"]==="Europe" ? 1 : datum["Origin"]==="USA" ? 2 : 3',
          as: 'row_Origin_sort_index',
        },
        {
          type: 'aggregate',
          groupby: ['Origin', 'row_Origin_sort_index'],
          ops: ['mean'],
          fields: ['Horsepower'],
          as: ['mean_Horsepower'],
        },
        expect.objectContaining({type: 'filter'}),
      ]);

      expect(findData(spec.data, 'row_domain')).toEqual({
        name: 'row_domain',
        source: 'source_0',
        transform: [
          {
            type: 'aggregate',
            groupby: ['Origin'],
            fields: ['row_Origin_sort_index'],
            ops: ['max'],
            as: ['row_Origin_sort_index'],
          },
        ],
      });
    });

    it('should not move the facet below an aggregate when sorting by a sort field definition', () => {
      const {spec} = compile({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          row: {field: 'Origin', type: 'nominal', sort: {field: 'Acceleration', op: 'median'}},
          x: {field: 'Horsepower', type: 'quantitative', aggregate: 'mean'},
        },
      });

      const source = findData(spec.data, 'source_0');
      expect(source.transform).toBeUndefined();

      expect(findData(spec.data, 'row_domain')).toEqual({
        name: 'row_domain',
        source: 'source_0',
        transform: [
          {
            type: 'aggregate',
            groupby: ['Origin'],
            fields: ['Acceleration'],
            ops: ['median'],
            as: ['median_Acceleration'],
          },
        ],
      });

      const cell = spec.marks.find((mark) => mark.name === 'cell') as GroupMark;
      expect(cell.data[0]).toEqual({
        name: 'data_0',
        source: 'facet',
        transform: [
          {
            type: 'aggregate',
            groupby: [],
            ops: ['mean'],
            fields: ['Horsepower'],
            as: ['mean_Horsepower'],
          },
          expect.objectContaining({type: 'filter'}),
        ],
      });
    });

    it('should not move the facet below an aggregate when sorting a binned facet by an array', () => {
      const {spec} = compile({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          row: {bin: true, field: 'Acceleration', type: 'quantitative', sort: [12, 8]},
          x: {field: 'Horsepower', type: 'quantitative', aggregate: 'mean'},
        },
      });

      // the sort index is derived from the unbinned values, so it cannot be added to the
      // aggregate's groupby therefore, the must facet stays above the aggregate
      const source = findData(spec.data, 'source_0');
      expect(source.transform.map((t) => t.type)).toEqual(['extent', 'bin', 'formula']);

      expect(findData(spec.data, 'row_domain').transform).toEqual([
        {
          type: 'aggregate',
          groupby: ['bin_maxbins_6_Acceleration', 'bin_maxbins_6_Acceleration_end'],
          fields: ['row_bin_maxbins_6_Acceleration_sort_index'],
          ops: ['max'],
          as: ['row_bin_maxbins_6_Acceleration_sort_index'],
        },
      ]);
    });
  });
});
