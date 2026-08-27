import {FacetNode} from '../../../src/compile/data/facet.js';
import {parseFacetModelWithScale} from '../../util.js';

describe('compile/data/facet', () => {
  describe('assemble', () => {
    it('should calculate column distinct if child has an independent discrete scale with step', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
        description: 'A trellis bar chart showing the US population distribution of age groups and gender in 2000.',
        data: {url: 'data/population.json'},
        facet: {column: {field: 'gender', type: 'nominal'}},
        spec: {
          mark: 'bar',
          encoding: {
            y: {
              aggregate: 'sum',
              field: 'people',
              type: 'quantitative',
              axis: {title: 'population'},
            },
            x: {
              field: 'age',
              type: 'ordinal',
            },
            color: {
              field: 'gender',
              type: 'nominal',
              scale: {range: ['#EA98D2', '#659CCA']},
            },
          },
        },
        resolve: {
          scale: {x: 'independent'},
        },
        config: {view: {fill: 'yellow'}},
      });

      const node = new FacetNode(null, model, 'facetName', 'dataName');
      const data = node.assemble();

      expect(data[0]).toEqual({
        name: 'column_domain',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['gender'],
            fields: ['age'],
            ops: ['distinct'],
            as: ['distinct_age'],
          },
        ],
      });
    });

    it('should calculate column and row distinct if child has an independent discrete scale with step and the facet has both row and column', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
        data: {
          values: [
            {r: 'r1', c: 'c1', a: 'a1', b: 'b1'},
            {r: 'r1', c: 'c1', a: 'a2', b: 'b2'},
            {r: 'r2', c: 'c2', a: 'a1', b: 'b1'},
            {r: 'r3', c: 'c2', a: 'a3', b: 'b2'},
          ],
        },
        facet: {
          row: {field: 'r', type: 'nominal'},
          column: {field: 'c', type: 'nominal'},
        },
        spec: {
          mark: 'rect',
          encoding: {
            y: {field: 'b', type: 'nominal'},
            x: {field: 'a', type: 'nominal'},
          },
        },
        resolve: {
          scale: {
            x: 'independent',
            y: 'independent',
          },
        },
      });

      const node = new FacetNode(null, model, 'facetName', 'dataName');
      const data = node.assemble();

      // crossed data
      expect(data[0]).toEqual({
        name: 'cross_column_domain_row_domain',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['r', 'c'],
            fields: ['a', 'b'],
            ops: ['distinct', 'distinct'],
          },
        ],
      });

      expect(data[1]).toEqual({
        name: 'column_domain',
        source: 'cross_column_domain_row_domain',
        transform: [
          {
            type: 'aggregate',
            groupby: ['c'],
            fields: ['distinct_a'],
            ops: ['max'],
            as: ['distinct_a'],
          },
        ],
      });

      expect(data[2]).toEqual({
        name: 'row_domain',
        source: 'cross_column_domain_row_domain',
        transform: [
          {
            type: 'aggregate',
            groupby: ['r'],
            fields: ['distinct_b'],
            ops: ['max'],
            as: ['distinct_b'],
          },
        ],
      });
    });

    it('should calculate column and row sort array', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
        data: {
          name: 'a',
        },
        facet: {
          row: {field: 'r', type: 'nominal', sort: ['r1', 'r2']},
          column: {field: 'c', type: 'nominal', sort: ['c1', 'c2']},
        },
        spec: {
          mark: 'rect',
          encoding: {
            y: {field: 'b', type: 'quantitative'},
            x: {field: 'a', type: 'quantitative'},
          },
        },
      });

      const node = new FacetNode(null, model, 'facetName', 'dataName');
      const data = node.assemble();

      expect(data[0]).toEqual({
        name: 'column_domain',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['c'],
            fields: ['column_c_sort_index'],
            ops: ['max'],
            as: ['column_c_sort_index'],
          },
        ],
      });

      expect(data[1]).toEqual({
        name: 'row_domain',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['r'],
            fields: ['row_r_sort_index'],
            ops: ['max'],
            as: ['row_r_sort_index'],
          },
        ],
      });
    });

    it('should calculate column and row sort field', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
        data: {
          name: 'a',
        },
        facet: {
          row: {field: 'r', type: 'nominal', sort: {op: 'median', field: 'b'}},
          column: {field: 'c', type: 'nominal', sort: {field: 'a'}},
        },
        spec: {
          mark: 'rect',
          encoding: {
            y: {field: 'b', type: 'quantitative'},
            x: {field: 'a', type: 'quantitative'},
          },
        },
      });

      const node = new FacetNode(null, model, 'facetName', 'dataName');
      const data = node.assemble();

      expect(data[0]).toEqual({
        name: 'column_domain',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['c'],
            fields: ['a'],
            ops: ['min'],
            as: ['a'],
          },
        ],
      });

      expect(data[1]).toEqual({
        name: 'row_domain',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['r'],
            fields: ['b'],
            ops: ['median'],
            as: ['median_b'],
          },
        ],
      });
    });

    it('should assemble lookup datasets for crossed custom facet sort metadata', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
        data: {
          name: 'a',
        },
        facet: {
          row: {field: 'r', type: 'nominal', sort: {op: 'median', field: 'b'}},
          column: {field: 'c', type: 'nominal', sort: ['c1', 'c2']},
        },
        spec: {
          mark: 'rect',
          encoding: {
            y: {field: 'b', type: 'quantitative'},
            x: {field: 'a', type: 'quantitative'},
          },
        },
      });

      const node = new FacetNode(null, model, 'facetName', 'dataName');
      const data = node.assemble();

      expect(data).toContainEqual({
        name: 'row_lookup_domain',
        source: 'row_domain',
        transform: [
          {
            type: 'formula',
            expr: `join([isValid(datum["r"]) ? length(toString(datum["r"])) + ':' + toString(datum["r"]) : '-1:'], '|')`,
            as: 'row_facet_key',
          },
        ],
      });

      expect(data).toContainEqual({
        name: 'column_lookup_domain',
        source: 'column_domain',
        transform: [
          {
            type: 'formula',
            expr: `join([isValid(datum["c"]) ? length(toString(datum["c"])) + ':' + toString(datum["c"]) : '-1:'], '|')`,
            as: 'column_facet_key',
          },
        ],
      });

      expect(data.find((d) => d.name === 'crossed_facet_domain')).toBeUndefined();
    });

    it('should join custom facet sort metadata from a separate aggregate when the crossed dataset supplies per-cell cardinality (independent discrete child scale with step)', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
        data: {
          name: 'a',
        },
        facet: {
          column: {field: 'c', type: 'nominal', sort: {op: 'median', field: 'v'}},
          row: {field: 'r', type: 'nominal'},
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'k', type: 'ordinal'},
            y: {field: 'v', type: 'quantitative'},
          },
        },
        resolve: {scale: {x: 'independent'}},
      });

      const node = new FacetNode(null, model, 'facetName', 'dataName');
      const data = node.assemble();

      // The crossed dataset is kept for per-cell cardinality.
      expect(data.find((d) => d.name === 'cross_column_domain_row_domain')).toBeDefined();

      // The custom sort value is computed over the original data, grouped by the sorted channel
      // only (not re-aggregated over the crossed per-cell dataset, which would be op-of-op), and
      // keyed for lookup.
      expect(data).toContainEqual({
        name: 'column_domain_sort',
        source: 'dataName',
        transform: [
          {
            type: 'aggregate',
            groupby: ['c'],
            fields: ['v'],
            ops: ['median'],
            as: ['median_v'],
          },
          {
            type: 'formula',
            expr: `join([isValid(datum["c"]) ? length(toString(datum["c"])) + ':' + toString(datum["c"]) : '-1:'], '|')`,
            as: 'column_facet_key',
          },
        ],
      });

      const columnDomain = data.find((d) => d.name === 'column_domain');

      // Cardinality still comes from the crossed dataset ...
      expect(columnDomain.source).toBe('cross_column_domain_row_domain');
      const cardinalityAggregate = columnDomain.transform.find((t) => t.type === 'aggregate') as any;
      expect(cardinalityAggregate).toEqual({
        type: 'aggregate',
        groupby: ['c'],
        fields: ['distinct_k'],
        ops: ['max'],
        as: ['distinct_k'],
      });
      // ... and the sort field is NOT re-aggregated over the crossed dataset (which lacks "v").
      expect(cardinalityAggregate.fields).not.toContain('v');

      // Instead the sort value is joined in by looking it up from the separate sort aggregate.
      const joinFormula = columnDomain.transform.find((t) => t.type === 'formula') as any;
      expect(joinFormula.as).toBe('median_v');
      expect(joinFormula.expr).toContain('indexof(pluck(data("column_domain_sort"), "column_facet_key")');
      expect(joinFormula.expr).toContain('["median_v"]');

      // The cell lookup domain derives from column_domain, so it carries the joined sort value too.
      expect(data).toContainEqual({
        name: 'column_lookup_domain',
        source: 'column_domain',
        transform: [
          {
            type: 'formula',
            expr: `join([isValid(datum["c"]) ? length(toString(datum["c"])) + ':' + toString(datum["c"]) : '-1:'], '|')`,
            as: 'column_facet_key',
          },
        ],
      });

      // The unsorted row channel needs no cardinality and no sort, so it gets no sort aggregate.
      expect(data.find((d) => d.name === 'row_domain_sort')).toBeUndefined();
    });
  });

  describe('dependentFields', () => {
    it('should return proper dependent fields', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
        data: {
          name: 'a',
        },
        facet: {
          row: {field: 'r', type: 'nominal', sort: {op: 'median', field: 'b'}},
          column: {field: 'c', type: 'nominal', sort: [1, 2, 3]},
        },
        spec: {
          mark: 'rect',
          encoding: {
            y: {field: 'b', type: 'quantitative'},
            x: {field: 'a', type: 'quantitative'},
          },
        },
      });

      const facet = new FacetNode(null, model, 'facetName', 'dataName');

      expect(facet.dependentFields()).toEqual(new Set(['r', 'c', 'b', 'column_c_sort_index']));
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const model = parseFacetModelWithScale({
        $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
        data: {
          name: 'a',
        },
        facet: {
          row: {field: 'r', type: 'nominal', sort: {op: 'median', field: 'b'}},
          column: {field: 'c', type: 'nominal', sort: {op: 'median', field: 'a'}},
        },
        spec: {
          mark: 'rect',
          encoding: {
            y: {field: 'b', type: 'quantitative'},
            x: {field: 'a', type: 'quantitative'},
          },
        },
      });

      const facetNode = new FacetNode(null, model, 'facetName', 'dataName');

      expect(facetNode.hash()).toBe(
        'Facet r:{"fields":["r"],"name":"row_domain","sortField":{"field":"b","op":"median"}} c:{"fields":["c"],"name":"column_domain","sortField":{"field":"a","op":"median"}}',
      );
    });
  });
});
