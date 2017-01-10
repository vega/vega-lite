/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import * as axisParse from '../../../src/compile/axis/parse';
import {X, Y} from '../../../src/channel';

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

  describe('parseInnerAxis', function() {
    it('should produce a Vega inner axis object with correct type, scale and grid properties', function() {
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
      const def = axisParse.parseGridAxis(X, model);
      assert.isObject(def);
      assert.equal(def.orient, 'bottom');
      assert.equal(def.scale, 'x');
      assert.deepEqual(def.encode.grid.update, {stroke: {value: "blue"}, strokeWidth: {value: 20}});
    });
  });

  describe('parseAxis', function() {
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

    it('should produce correct encode block if needed', () => {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", "axis": {"axisColor": "#0099ff"}}
        }
      });
      const def = axisParse.parseMainAxis(X, model);
      assert.equal(def.encode.domain.update.stroke.value, '#0099ff');
    });
  });

});
