/* tslint:disable:quotemark */

import {assert} from 'chai';

import {stack} from '../../../src/compile/data/stack';
import {DataComponent} from '../../../src/compile/data/data';

import {mockDataComponent} from './datatestutil';
import {parseUnitModel, parseFacetModel} from '../../util';

describe('compile/data/stack', () => {
  describe('parseUnit', () => {
    it('should not produce stack component for unit without stack', () => {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {}
      });
      const stackComponent = stack.parseUnit(model);
      assert.equal(stackComponent, undefined);
    });
  });

  it('should produce correct stack component for bar with color', () => {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "y": {"field": "b", "type": "nominal"},
        "color": {"field": "c", "type": "ordinal",}
      }
    });

    const stackComponent = stack.parseUnit(model);
    assert.deepEqual(stackComponent, {
      name: 'stacked',
      source: 'summary',
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

    const stackComponent = stack.parseUnit(model);
    assert.deepEqual(stackComponent, {
      name: 'stacked',
      source: 'summary',
      groupby: ['bin_b_start', 'bin_b_end'],
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
    model.component.data = {} as DataComponent;
    model.component.data.stack = stack.parseUnit(model);

    const stackComponent = model.component.data.stack;
    assert.deepEqual(stackComponent, {
      name: 'stacked',
      source: 'summary',
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

    const stackComponent = stack.parseUnit(model);
    assert.deepEqual(stackComponent, {
      name: 'stacked',
      source: 'summary',
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
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    it('should produce correct stack component for trellis colored bar', function() {
      const model = parseFacetModel({
        facet: {
          row: {"field": "d", "type": "nominal"}
        },
        spec: {
          "mark": "bar",
          "encoding": {
            "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "nominal"},
            "color": {"field": "c", "type": "nominal"}
          }
        }
      });
      const child = model.child;
      child.component.data = mockDataComponent();
      child.component.data.stack = {
        name: 'stacked',
        source: 'summary',
        groupby: ['b'],
        field: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: true
      };

      const stackComponent = stack.parseFacet(model);
      assert.deepEqual(stackComponent, {
        name: 'stacked',
        source: 'summary',
        groupby: ['b', 'd'],
        field: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: true
      });
    });

    it('should produce correct stack component for trellis colored bar with faceted y', function() {
      const model = parseFacetModel({
        facet: {
          row: {"field": "b", "type": "nominal"}
        },
        spec: {
          "mark": "bar",
          "encoding": {
            "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "nominal"},
            "color": {"field": "c", "type": "nominal"}
          }
        }
      });
      const child = model.child;
      child.component.data = mockDataComponent();
      child.component.data.stack = {
        name: 'stacked',
        source: 'summary',
        groupby: ['b'],
        field: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: true
      };

      const stackComponent = stack.parseFacet(model);
      assert.deepEqual(stackComponent, {
        name: 'stacked',
        source: 'summary',
        groupby: ['b'], // no duplicate
        field: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['c'],
          order: ['descending']
        },
        offset: 'zero',
        impute: true
      });
    });

    it('should produce correct stack component for trellis non-stacked bar', function() {
      const model = parseFacetModel({
        facet: {
          row: {"field": "d", "type": "nominal"}
        },
        spec: {
          "mark": "bar",
          "encoding": {
            "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "nominal"}
          }
        }
      });
      const child = model.child;
      child.component.data = mockDataComponent();
      child.component.data.stack = undefined;

      const stackComponent = stack.parseFacet(model);
      assert.equal(stackComponent, undefined);
    });
  });

  describe('assemble', function() {
    it('should assemble correct imputed stack data source', () => {
      const stackData = stack.assemble({
        name: 'stacked',
        source: 'summary',
        groupby: ['bin_b_start'],
        field: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['mean_d'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: true
      });
      assert.deepEqual(stackData, {
        name: 'stacked',
        source: 'summary',
        transform: [
          {
            type: 'impute',
            field: 'sum_a',
            groupby: ['c'],
            orderby: ['bin_b_start'],
            method: "value",
            value: 0
          },
          {
            type: 'stack',
            groupby: ['bin_b_start'],
            field: 'sum_a',
            sort: {
              field: ['mean_d'],
              order: ['ascending']
            },
            as: ['sum_a_start', 'sum_a_end'],
            offset: 'zero'
          }
        ]
      });
    });

    it('should assemble correct unimputed stack data source', () => {
      const stackData = stack.assemble({
        name: 'stacked',
        source: 'summary',
        groupby: ['bin_b_start'],
        field: 'sum_a',
        stackby: ['c'],
        sort: {
          field: ['mean_d'],
          order: ['ascending']
        },
        offset: 'zero',
        impute: false
      });
      assert.deepEqual(stackData, {
        name: 'stacked',
        source: 'summary',
        transform: [
          {
            type: 'stack',
            groupby: ['bin_b_start'],
            field: 'sum_a',
            sort: {
              field: ['mean_d'],
              order: ['ascending']
            },
            as: ['sum_a_start', 'sum_a_end'],
            offset: 'zero'
          }
        ]
      });
    });
  });
});
