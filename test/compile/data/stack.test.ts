/* tslint:disable:quotemark */

import {assert} from 'chai';

import {StackComponent, StackNode} from '../../../src/compile/data/stack';

import {UnitModel} from '../../../src/compile/unit';
import {VgTransform} from '../../../src/vega.schema';
import {parseUnitModelWithScale} from '../../util';

function parse(model: UnitModel) {
  return StackNode.make(null, model).stack;
}

function assemble(model: UnitModel) {
  return StackNode.make(null, model).assemble();
}

describe('compile/data/stack', () => {
  it('should produce correct stack component for bar with color', () => {
    const model = parseUnitModelWithScale({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"field": "b", "type": "nominal"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      dimensionFieldDef: {field: 'b', type: 'nominal'},
      facetby: [],
      field: 'sum_a',
      stackby: ['c'],
      sort: {
        field: ['c'],
        order: ['descending']
      },
      offset: 'zero',
      impute: false
    });
  });

  it('should produce correct stack component with both start and end of the binned field for bar with color and binned y', () => {
    const model = parseUnitModelWithScale({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"bin": true, "field": "b", "type": "quantitative"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      dimensionFieldDef: {"bin": {maxbins: 10}, "field": "b", "type": "quantitative"},
      facetby: [],
      field: 'sum_a',
      stackby: ['c'],
      sort: {
        field: ['c'],
        order: ['descending']
      },
      offset: 'zero',
      impute: false
    });
  });

  it('should produce correct stack component for 1D bar with color', () => {
    const model = parseUnitModelWithScale({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      dimensionFieldDef: undefined,
      facetby: [],
      field: 'sum_a',
      stackby: ['c'],
      sort: {
        field: ['c'],
        order: ['descending']
      },
      offset: 'zero',
      impute: false
    });

    assert.deepEqual<VgTransform[]>(assemble(model), [{
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

  it('should produce correct stack component for area with color and order', function() {
    const model = parseUnitModelWithScale({
      "mark": "area",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"field": "b", "type": "nominal"},
        "color": {"field": "c", "type": "nominal"},
        "order": {"aggregate": "mean", "field": "d", "type": "quantitative"}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      dimensionFieldDef: {field: 'b', type: 'nominal'},
      facetby: [],
      field: 'sum_a',
      stackby: ['c'],
      sort: {
        field: ['mean_d'],
        order: ['ascending']
      },
      offset: 'zero',
      impute: true
    });

    assert.deepEqual<VgTransform[]>(assemble(model), [
      {
        type: 'impute',
        field: 'sum_a',
        groupby: ['c'],
        key: 'b',
        method: "value",
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

  it('should produce correct stack component for area with color and binned dimension', function() {
    const model = parseUnitModelWithScale({
      "mark": "area",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"bin": true, "field": "b", "type": "quantitative"},
        "color": {"field": "c", "type": "nominal"}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      dimensionFieldDef: {"bin": {maxbins: 10}, "field": "b", "type": "quantitative"},
      facetby: [],
      field: 'sum_a',
      stackby: ['c'],
      sort: {
        field: ['c'],
        order: ['descending']
      },
      offset: 'zero',
      impute: true
    });

    assert.deepEqual<VgTransform[]>(assemble(model), [
      {
        type: 'formula',
        expr: '(datum[\"bin_maxbins_10_b\"]+datum[\"bin_maxbins_10_b_end\"])/2',
        as: 'bin_maxbins_10_b_mid'
      },
      {
        type: 'impute',
        field: 'sum_a',
        groupby: ['c'],
        key: 'bin_maxbins_10_b_mid',
        method: "value",
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
