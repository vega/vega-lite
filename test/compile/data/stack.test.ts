import {StackNode} from '../../../src/compile/data/stack';
import {UnitModel} from '../../../src/compile/unit';
import {Transform} from '../../../src/transform';
import {parseUnitModelWithScale} from '../../util';
import {PlaceholderDataFlowNode} from './util';

function parse(model: UnitModel) {
  return StackNode.makeFromEncoding(null, model).stack;
}

function assemble(model: UnitModel) {
  return StackNode.makeFromEncoding(null, model).assemble();
}

describe('compile/data/stack', () => {
  describe('StackNode.makeFromEncoding', () => {
    it('should produce correct stack component for bar with color', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'ordinal'}
        }
      });

      expect(parse(model)).toEqual({
        dimensionFieldDef: {field: 'b', type: 'nominal'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: false,
        as: ['sum_a_start', 'sum_a_end']
      });
    });

    it('should remove escaping from fields for as', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a\\[foo\\]', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'ordinal'}
        }
      });

      expect(parse(model)).toEqual({
        dimensionFieldDef: {field: 'b', type: 'nominal'},
        facetby: [],
        stackField: 'sum_a\\[foo\\]',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: false,
        as: ['sum_a[foo]_start', 'sum_a[foo]_end']
      });
    });

    it('should produce correct stack component with both start and end of the binned field for bar with color and binned y', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {bin: true, field: 'b', type: 'quantitative'},
          color: {field: 'c', type: 'ordinal'}
        }
      });

      expect(parse(model)).toEqual({
        dimensionFieldDef: {bin: {maxbins: 10}, field: 'b', type: 'quantitative'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: false,
        as: ['sum_a_start', 'sum_a_end']
      });
    });

    it('should produce correct stack component for 1D bar with color', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          color: {field: 'c', type: 'ordinal'}
        }
      });

      expect(parse(model)).toEqual({
        dimensionFieldDef: undefined,
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: false,
        as: ['sum_a_start', 'sum_a_end']
      });

      expect(assemble(model)).toEqual([
        {
          type: 'stack',
          groupby: [],
          field: 'sum_a',
          sort: {
            field: ['c'],
            order: ['ascending']
          },
          as: ['sum_a_start', 'sum_a_end'],
          offset: 'zero'
        }
      ]);
    });

    it('should produce correct stack component for area with color and order', () => {
      const model = parseUnitModelWithScale({
        mark: 'area',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'nominal'},
          order: {aggregate: 'mean', field: 'd', type: 'quantitative'}
        }
      });

      expect(parse(model)).toEqual({
        dimensionFieldDef: {field: 'b', type: 'nominal'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['mean_d'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: true,
        as: ['sum_a_start', 'sum_a_end']
      });

      expect(assemble(model)).toEqual([
        {
          type: 'impute',
          field: 'sum_a',
          groupby: ['c'],
          key: 'b',
          method: 'value',
          value: 0
        },
        {
          type: 'stack',
          groupby: ['b'],
          field: 'sum_a',
          sort: {
            field: ['mean_d'],
            order: ['ascending']
          },
          as: ['sum_a_start', 'sum_a_end'],
          offset: 'zero'
        }
      ]);
    });

    it('should produce correct stack component for area with color and binned dimension', () => {
      const model = parseUnitModelWithScale({
        mark: 'area',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {bin: true, field: 'b', type: 'quantitative'},
          color: {field: 'c', type: 'nominal'}
        }
      });

      expect(parse(model)).toEqual({
        dimensionFieldDef: {bin: {maxbins: 10}, field: 'b', type: 'quantitative'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: true,
        as: ['sum_a_start', 'sum_a_end']
      });

      expect(assemble(model)).toEqual([
        {
          type: 'formula',
          expr: '0.5*datum["bin_maxbins_10_b"]+0.5*datum["bin_maxbins_10_b_end"]',
          as: 'bin_maxbins_10_b_mid'
        },
        {
          type: 'impute',
          field: 'sum_a',
          groupby: ['c'],
          key: 'bin_maxbins_10_b_mid',
          method: 'value',
          value: 0
        },
        {
          type: 'stack',
          groupby: ['bin_maxbins_10_b_mid'],
          field: 'sum_a',
          sort: {
            field: ['c'],
            order: ['ascending']
          },
          as: ['sum_a_start', 'sum_a_end'],
          offset: 'zero'
        }
      ]);
    });
  });

  describe('StackNode.makeFromTransform', () => {
    it('should fill in offset and sort properly', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age'],
        as: ['v1', 'v2']
      };
      const stack = StackNode.makeFromTransform(null, transform);
      expect(stack.assemble()).toEqual([
        {
          type: 'stack',
          groupby: ['age'],
          field: 'people',
          offset: 'zero',
          sort: {field: [], order: []},
          as: ['v1', 'v2']
        }
      ]);
    });

    it('should fill in partial "as" field properly', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age', 'gender'],
        offset: 'normalize',
        as: 'val'
      };
      const stack = StackNode.makeFromTransform(null, transform);
      expect(stack.assemble()).toEqual([
        {
          type: 'stack',
          groupby: ['age', 'gender'],
          field: 'people',
          offset: 'normalize',
          sort: {field: [], order: []},
          as: ['val', 'val_end']
        }
      ]);
    });

    it('should handle complete "sort"', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age', 'gender'],
        offset: 'normalize',
        sort: [
          {field: 'height', order: 'ascending'},
          {field: 'weight', order: 'descending'}
        ],
        as: 'val'
      };
      const stack = StackNode.makeFromTransform(null, transform);
      expect(stack.assemble()).toEqual([
        {
          type: 'stack',
          groupby: ['age', 'gender'],
          field: 'people',
          offset: 'normalize',
          sort: {field: ['height', 'weight'], order: ['ascending', 'descending']},
          as: ['val', 'val_end']
        }
      ]);
    });

    it('should handle incomplete "sort" field', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age', 'gender'],
        offset: 'normalize',
        sort: [{field: 'height'}],
        as: 'val'
      };
      const stack = StackNode.makeFromTransform(null, transform);

      expect(stack.assemble()).toEqual([
        {
          type: 'stack',
          groupby: ['age', 'gender'],
          field: 'people',
          offset: 'normalize',
          sort: {field: ['height'], order: ['ascending']},
          as: ['val', 'val_end']
        }
      ]);
    });
  });

  describe('StackNode.producedFields', () => {
    it('should give producedFields correctly', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age'],
        as: 'people'
      };
      const stack = StackNode.makeFromTransform(null, transform);
      expect(stack.producedFields()).toEqual(new Set(['people', 'people_end']));
    });

    it('should give producedFields correctly when in encoding channel', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'ordinal'}
        }
      });
      const stack = StackNode.makeFromEncoding(null, model);
      expect(stack.producedFields()).toEqual(new Set(['sum_a_start', 'sum_a_end']));
    });

    it('should generate the correct hash', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'ordinal'}
        }
      });
      const stack = StackNode.makeFromEncoding(null, model);
      expect(stack.hash()).toEqual(
        'Stack {"as":["sum_a_start","sum_a_end"],"dimensionFieldDef":{"field":"b","type":"nominal"},"facetby":[],"impute":false,"offset":"zero","sort":{"field":["c"],"order":["ascending"]},"stackField":"sum_a","stackby":["c"]}'
      );
    });

    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const stack = new StackNode(parent, null);
      expect(stack.clone().parent).toBeNull();
    });
  });

  describe('StackNode.dependentFields', () => {
    it('should give dependentFields correctly', () => {
      const transform: Transform = {
        stack: 'foo',
        groupby: ['bar', 'baz'],
        as: 'qux'
      };
      const stack = StackNode.makeFromTransform(null, transform);
      expect(stack.dependentFields()).toEqual(new Set(['foo', 'bar', 'baz']));
    });

    it('should give dependentFields correctly when derived from encoding channel', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'ordinal'}
        }
      });
      const stack = StackNode.makeFromEncoding(null, model);
      expect(stack.dependentFields()).toEqual(new Set(['sum_a', 'b', 'c']));
    });
  });
});
