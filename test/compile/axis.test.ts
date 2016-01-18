/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseModel} from '../util';
import * as axis from '../../src/compile/axis';
import {X, COLUMN} from '../../src/channel';

describe('Axis', function() {
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
      assert.deepEqual(model1.spec().encoding.y.axis, model2.spec().encoding.y.axis);
    });
  });

  describe('(X) for Time Data', function() {
    const encoding = parseModel({
        mark: "line",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
    const _axis = axis.compileAxis(X, encoding);

    // FIXME decouple the test here

    it('should use custom format', function() {
      assert.equal(_axis.format, '%B');
    });
    it('should rotate label', function() {
      assert.equal(_axis.properties.labels.angle.value, 270);
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

  describe('labels()', function () {
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
            cell: {width: 60}
          }
        }), X);
      assert.deepEqual(title, 'abcdefghi…');
    });
  });

  describe('titleOffset()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });
});
