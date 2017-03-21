/* tslint:disable:quotemark */

import {assert} from 'chai';

import {X, Y} from '../../../src/channel';
import * as axisParse from '../../../src/compile/axis/parse';
import {parseUnitModel} from '../../util';

describe('Axis', function() {
  // TODO: move this to model.test.ts
  describe('= true', function() {
    it('should produce default properties for axis', function() {
      const model1 = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true}
        },
        "data": {"url": "data/movies.json"}
      });

      const model2 = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "data": {"url": "data/movies.json"}
      });
      assert.deepEqual(model1.axis(Y), model2.axis(Y));
    });
  });
  describe('parseAxisComponent', function() {
    it('should produce Vega grid axis objects for both main axis and for grid axis)', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: true, gridColor: "blue", gridWidth: 20}
          }
        }
      });
      const axisComponent = axisParse.parseAxisComponent(model, ['x', 'y']);
      assert.equal(axisComponent['x'].length, 2);
      assert.equal(axisComponent['x'][0].grid, undefined);
      assert.equal(axisComponent['x'][1].grid, true);
    });

    it('should produce Vega grid axis objects for only main axis if grid is disabled)', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: false, gridColor: "blue", gridWidth: 20}
          }
        }
      });
      const axisComponent = axisParse.parseAxisComponent(model, ['x', 'y']);
      assert.equal(axisComponent['x'].length, 1);
      assert.equal(axisComponent['x'][0].grid, undefined);
    });
  });

  describe('parseGridAxis', function() {
    it('should produce a Vega grid axis object with correct type, scale and grid properties', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: true}
          }
        }
      });
      const def = axisParse.parseGridAxis(X, model);
      assert.isObject(def);
      assert.equal(def.orient, 'bottom');
      assert.equal(def.scale, 'x');
    });
  });

  describe('parseMainAxis', function() {
    it('should produce a Vega axis object with correct type and scale', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative"}
        }
      });
      const def = axisParse.parseMainAxis(X, model);
      assert.isObject(def);
      assert.equal(def.orient, 'bottom');
      assert.equal(def.scale, 'x');
    });
  });

});
