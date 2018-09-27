import {DataFlowNode} from './../../../src/compile/data/dataflow';
/* tslint:disable:quotemark */

import {assert} from 'chai';

import {StackComponent, StackNode} from '../../../src/compile/data/stack';
import {UnitModel} from '../../../src/compile/unit';
import {Transform} from '../../../src/transform';
import {VgComparatorOrder, VgSort, VgTransform} from '../../../src/vega.schema';
import {parseUnitModelWithScale} from '../../util';

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

      assert.deepEqual<StackComponent>(parse(model), {
        dimensionFieldDef: {field: 'b', type: 'nominal'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: false,
        as: ['sum_a_start', 'sum_a_end']
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

      assert.deepEqual<StackComponent>(parse(model), {
        dimensionFieldDef: {bin: {maxbins: 10}, field: 'b', type: 'quantitative'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
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

      assert.deepEqual<StackComponent>(parse(model), {
        dimensionFieldDef: undefined,
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: false,
        as: ['sum_a_start', 'sum_a_end']
      });

      assert.deepEqual<VgTransform[]>(assemble(model), [
        {
          type: 'stack',
          groupby: [],
          field: 'sum_a',
          sort: {
            field: ['c'],
            order: ['descending']
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

      assert.deepEqual<StackComponent>(parse(model), {
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

      assert.deepEqual<VgTransform[]>(assemble(model), [
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

      assert.deepEqual<StackComponent>(parse(model), {
        dimensionFieldDef: {bin: {maxbins: 10}, field: 'b', type: 'quantitative'},
        facetby: [],
        stackField: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: true,
        as: ['sum_a_start', 'sum_a_end']
      });

      assert.deepEqual<VgTransform[]>(assemble(model), [
        {
          type: 'formula',
          expr: '(datum["bin_maxbins_10_b"]+datum["bin_maxbins_10_b_end"])/2',
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
            order: ['descending']
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
      assert.deepEqual<VgTransform[]>(stack.assemble(), [
        {
          type: 'stack',
          groupby: ['age'],
          field: 'people',
          offset: 'zero',
          sort: {field: [] as string[], order: [] as VgComparatorOrder[]} as VgSort,
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
      assert.deepEqual<VgTransform[]>(stack.assemble(), [
        {
          type: 'stack',
          groupby: ['age', 'gender'],
          field: 'people',
          offset: 'normalize',
          sort: {field: [] as string[], order: [] as VgComparatorOrder[]} as VgSort,
          as: ['val', 'val_end']
        }
      ]);
    });

    it('should handle complete "sort"', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age', 'gender'],
        offset: 'normalize',
        sort: [{field: 'height', order: 'ascending'}, {field: 'weight', order: 'descending'}],
        as: 'val'
      };
      const stack = StackNode.makeFromTransform(null, transform);
      assert.deepEqual<VgTransform[]>(stack.assemble(), [
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

      assert.deepEqual<VgTransform[]>(stack.assemble(), [
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
    it('should give producedfields correctly', () => {
      const transform: Transform = {
        stack: 'people',
        groupby: ['age'],
        as: 'people'
      };
      const stack = StackNode.makeFromTransform(null, transform);
      assert.deepEqual(stack.producedFields(), {
        people: true,
        people_end: true
      });
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
      assert.deepEqual(stack.producedFields(), {
        sum_a_start: true,
        sum_a_end: true
      });
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
      assert.deepEqual(
        stack.hash(),
        'Stack {"as":["sum_a_start","sum_a_end"],"dimensionFieldDef":{"field":"b","type":"nominal"},"facetby":[],"impute":false,"offset":"zero","sort":{"field":["c"],"order":["descending"]},"stackField":"sum_a","stackby":["c"]}'
      );
    });

    it('should never clone parent', () => {
      const parent = new DataFlowNode(null);
      const stack = new StackNode(parent, null);
      expect(stack.clone().parent).toBeNull();
    });
  });
});
