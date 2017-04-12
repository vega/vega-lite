/* tslint:disable:quotemark */

import {assert} from 'chai';

import {StackComponent, StackNode} from '../../../src/compile/data/stack';

import {UnitModel} from '../../../src/compile/unit';
import {VgTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

function parse(model: UnitModel) {
  return new StackNode(model).stack;
}

function assemble(model: UnitModel) {
  return new StackNode(model).assemble();
}

describe('compile/data/stack', () => {
  it('should produce correct stack component for bar with color', () => {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"field": "b", "type": "nominal"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      groupby: ['b'],
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
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"bin": true, "field": "b", "type": "quantitative"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      groupby: ["bin_maxbins_10_b_start", "bin_maxbins_10_b_end"],
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
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      groupby: [],
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
    const model = parseUnitModel({
      "mark": "area",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"field": "b", "type": "nominal"},
        "color": {"field": "c", "type": "nominal"},
        "order": {"aggregate": "mean", "field": "d", "type": "quantitative"}
      }
    });

    assert.deepEqual<StackComponent>(parse(model), {
      groupby: ['b'],
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
        orderby: ['b'],
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
});
