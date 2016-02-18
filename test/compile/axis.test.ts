/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseModel} from '../util';
import * as axis from '../../src/compile/axis';
import {X, Y, COLUMN} from '../../src/channel';

describe('Axis', function() {
  // TODO: move this to model.test.ts
  describe('= true', function() {
    it('should produce default properties for axis', function() {
      const model1 = parseModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true}
        },
        "data": {"url": "data/movies.json"}
      });

      const model2 = parseModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "data": {"url": "data/movies.json"}
      });
      assert.deepEqual(model1.axis(Y), model2.axis(Y));
    });
  });

  describe('compileAxis', function() {
    it('should produce a Vega axis object with correct type and scale', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative"}
        }
      });
      const def = axis.compileAxis(X, model);
      assert.isObject(def);
      assert.equal(def.type, 'x');
      assert.equal(def.scale, 'x');
    });
  });

  describe('grid()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis:{orient: 'bottom'}}
          }
        }), X);
      assert.deepEqual(orient, 'bottom');
    });

    it('should return undefined by default', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X);
      assert.deepEqual(orient, undefined);
    });

    it('should return top for COL', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'},
            column: {field: 'a'}
          }
        }), COLUMN);
      assert.deepEqual(orient, 'top');
    });
  });

  describe('ticks', function() {
    // FIXME: write test
  });

  describe('tickSize', function() {
    // FIXME: write test
    // - it should return explicitly specified tickSize
    // - otherwise it should return 0 for ROW and COLUMN and undefined for other channels
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis: {title: 'Custom'}}
          }
        }), X);
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", axis: {titleMaxLength: 3}}
          }
        }), X);
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 10}}
          }
        }), X);
      assert.deepEqual(title, 'SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 3}}
          }
        }), X);
      assert.deepEqual(title, 'SU…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      const title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'abcdefghijkl'}
          },
          config: {
            unit: {width: 60}
          }
        }), X);
      assert.deepEqual(title, 'abcdefghi…');
    });
  });

  describe('properties.labels()', function () {
    it('should show labels by default', function () {
      const labels = axis.properties.labels(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal"}
          }
        }), X, {}, {orient: 'top'});
      assert.deepEqual(labels.text.template, '{{ datum.data | truncate:25}}');
    });

    it('should hide labels if labels are set to false', function () {
      const labels = axis.properties.labels(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal", axis: {labels: false}}
          }
        }), X, {}, null);
      assert.deepEqual(labels.text, '');
    });

    it('should rotate labels if labelAngle is defined', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {labelAngle: -45}}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {});
      assert.equal(labels.angle.value, -45);
    });

    it('should rotate label', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {});
      assert.equal(labels.angle.value, 270);
      assert.equal(labels.baseline.value, 'middle');
    });
  });
});
