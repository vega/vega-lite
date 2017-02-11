/* tslint:disable:quotemark */

import {assert} from 'chai';

import {pathOrder} from '../../../src/compile/data/pathorder';
import {LayerModel} from '../../../src/compile/layer';
import {parseUnitModel, parseModel, parseFacetModel} from '../../util';

describe('compile/data/pathorder', function() {
  describe('compileUnit', function() {
    it('should order by order field for line with order (connected scatterplot)', function () {
      const model = parseUnitModel({
        "data": {"url": "data/driving.json"},
        "mark": "line",
        "encoding": {
          "x": {"field": "miles","type": "quantitative", "scale": {"zero": false}},
          "y": {"field": "gas","type": "quantitative", "scale": {"zero": false}},
          "order": {"field": "year","type": "temporal"}
        }
      });
      assert.deepEqual(pathOrder.parseUnit(model), {
        field: ['year'],
        order: ['ascending']
      });
    });

    it('should order by x by default if x is the dimension', function () {
      const model = parseUnitModel({
        "data": {"url": "data/movies.json"},
        "mark": "line",
        "encoding": {
          "x": {
            "bin": {"maxbins": 10},
            "field": "IMDB_Rating",
            "type": "quantitative"
          },
          "color": {
            "field": "Source",
            "type": "nominal"
          },
          "y": {
            "aggregate": "count",
            "field": "*",
            "type": "quantitative"
          }
        }
      });
      assert.deepEqual(pathOrder.parseUnit(model), {
        field: 'bin_IMDB_Rating_start',
        order: 'descending'
      });
    });

    it('should order by x by default if y is the dimension', function () {
      const model = parseUnitModel({
        "data": {"url": "data/movies.json"},
        "mark": "line",
        "encoding": {
          "y": {
            "bin": {"maxbins": 10},
            "field": "IMDB_Rating",
            "type": "quantitative"
          },
          "color": {
            "field": "Source",
            "type": "nominal"
          },
          "x": {
            "aggregate": "count",
            "field": "*",
            "type": "quantitative"
          }
        }
      });
      assert.deepEqual(pathOrder.parseUnit(model), {
        field: 'bin_IMDB_Rating_start',
        order: 'descending'
      });
    });
  });

  describe('parseLayer', function() {
    it('should return line order for line when merging line and point', () => {
      const model = parseFacetModel({
        "data": {"url": "data/movies.json"},
        "facet": {
          "column": {
            "field": "Source",
            "type": "nominal"
          }
        },
        "spec": {
          "mark": "line",
          "encoding": {
            "y": {
              "bin": {"maxbins": 10},
              "field": "IMDB_Rating",
              "type": "quantitative"
            },
            "x": {
              "aggregate": "count",
              "field": "*",
              "type": "quantitative"
            }
          }
        }
      });
      const child = model.child;
      child.component.data = {
        pathOrder: pathOrder.parseUnit(child as any)
      } as any;

      assert.deepEqual(pathOrder.parseFacet(model), {
        field: 'bin_IMDB_Rating_start',
        order: 'descending'
      });
    });
  });

  describe('parseFacet', function() {
    it('should return line order for line for faceted line', () => {
      const model = parseModel({
        "data": {"url": "data/movies.json"},
        "mark": "line",
        "encoding": {
          "y": {
            "bin": {"maxbins": 10},
            "field": "IMDB_Rating",
            "type": "quantitative"
          },
          "color": {
            "field": "Source",
            "type": "nominal"
          },
          "x": {
            "aggregate": "count",
            "field": "*",
            "type": "quantitative"
          }
        },
        "config": {
          "overlay": {
            "line": true
          }
        }
      }) as LayerModel;
      const children = model.children;
      children[0].component.data = {
        pathOrder: pathOrder.parseUnit(children[0])
      } as any;
      children[1].component.data = {
        pathOrder: pathOrder.parseUnit(children[1])
      } as any;

      assert.deepEqual(pathOrder.parseLayer(model), {
        field: 'bin_IMDB_Rating_start',
        order: 'descending'
      });
    });
  });

  describe('assemble', function() {
    it('should correctly assemble a collect transform', () => {
      assert.deepEqual(pathOrder.assemble({
        field: 'a',
        order: 'ascending'
      }), {
        type: 'collect',
        sort: {
          field: 'a',
          order: 'ascending'
        }
      });
    });
  });
});
