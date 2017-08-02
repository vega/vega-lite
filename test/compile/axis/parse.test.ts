/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X, Y} from '../../../src/channel';
import {AxisComponent} from '../../../src/compile/axis/component';
import {parseGridAxis, parseLayerAxis, parseMainAxis, parseUnitAxis} from '../../../src/compile/axis/parse';
import {gridScale} from '../../../src/compile/axis/rules';
import {parseLayerModel, parseUnitModelWithScale} from '../../util';

describe('Axis', function() {
  // TODO: move this to model.test.ts
  describe('= true', function() {
    it('should produce default properties for axis', function() {
      const model1 = parseUnitModelWithScale({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "data": {"url": "data/movies.json"}
      });

      const model2 = parseUnitModelWithScale({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "data": {"url": "data/movies.json"}
      });
      assert.deepEqual(model1.axis(Y), model2.axis(Y));
    });
  });
  describe('parseUnitAxis', function() {
    it('should produce Vega grid axis objects for both main axis and for grid axis)', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: true, gridColor: "blue", gridWidth: 20}
          }
        }
      });
      const axisComponent = parseUnitAxis(model);
      assert.equal(axisComponent['x'].length, 1);
      assert.equal(axisComponent['x'][0].main.implicit.grid, undefined);
      assert.equal(axisComponent['x'][0].grid.explicit.grid, true);
    });

    it('should produce Vega grid axis objects for only main axis if grid is disabled)', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: false, gridColor: "blue", gridWidth: 20}
          }
        }
      });
      const axisComponent = parseUnitAxis(model);
      assert.equal(axisComponent['x'].length, 1);
      assert.equal(axisComponent['x'][0].main.explicit.grid, undefined);
    });
  });

  describe('parseLayerAxis', () => {
    const globalRuleOverlay = parseLayerModel({
      "layer": [
        {
          "mark": "rule",
          "encoding": {
            "y": {
              "aggregate": "mean",
              "field": "a",
              "type": "quantitative"
            }
          }
        },
        {
          "mark": "line",
          "encoding": {
            "y": {
              "aggregate": "mean",
              "field": "a",
              "type": "quantitative"
            },
            "x": {
              "timeUnit": "month",
              "type": "temporal",
              "field": "date"
            }
          }
        }
      ]
    });
    globalRuleOverlay.parseScale();
    globalRuleOverlay.parseLayoutSize();
    parseLayerAxis(globalRuleOverlay);


    it('correctly merges gridScale if one layer does not have one of the axis', () => {
      const axisComponents = globalRuleOverlay.component.axes;
      assert.equal(axisComponents.y.length, 1);
      assert.equal(axisComponents.y[0].grid.get('gridScale'), 'x');
    });

    it('correctly merges similar title', () => {
      const axisComponents = globalRuleOverlay.component.axes;
      assert.equal(axisComponents.y[0].main.get('title'), 'MEAN(a)');
    });

    it('correctly combines different title', () => {
      const model = parseLayerModel({
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": {"url": "data/cars.json"},
        "layer": [
          {
            "mark": "line",
            "encoding": {
              "x": {"field": "Cylinders","type": "ordinal"},
              "y": {
                "aggregate": "max",
                "bin": false,
                "field": "Horsepower",
                "type": "quantitative"
              },
              "color": {"value": "darkred"}
            }
          },
          {
            "data": {"url": "data/cars.json"},
            "mark": "line",
            "encoding": {
              "x": {"field": "Cylinders","type": "ordinal"},
              "y": {
                "aggregate": "min",
                "bin": false,
                "field": "Horsepower",
                "type": "quantitative"
              }
            }
          }
        ]
      });
      model.parseScale();
      parseLayerAxis(model);
      const axisComponents = model.component.axes;

      assert.equal(axisComponents.y[0].main.get('title'), 'MAX(Horsepower), MIN(Horsepower)');
    });
  });

  describe('parseGridAxis', function() {
    it('should produce a Vega grid axis object with correct type, scale and grid properties', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: true}
          }
        }
      });
      const def = parseGridAxis(X, model);
      assert.isObject(def);
      assert.equal(def.implicit.orient, 'bottom');
      assert.equal(def.implicit.scale, 'x');
    });
  });

  describe('parseMainAxis', function() {
    it('should produce a Vega axis object with correct type and scale', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative"}
        }
      });
      const def = parseMainAxis(X, model);
      assert.isObject(def);
      assert.equal(def.implicit.orient, 'bottom');
      assert.equal(def.implicit.scale, 'x');
    });
  });

});
