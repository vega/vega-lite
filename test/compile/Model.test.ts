/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import {X} from '../../src/channel';

describe('Model', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      assert.equal(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X), '%b');

      assert.equal(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }).timeFormat(X), '%B');

      assert.equal(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X), undefined);
    });
  });

  describe('format()', function() {
    it('should use time format type for time scale', function() {
      assert.deepEqual(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }).format(X, undefined), {
        formatType: 'time',
        format: '%B'
      });
    });

    it('should use default time format if we don\'t have a good format', function() {
      assert.deepEqual(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal"}
        }
      }).format(X, undefined), {
        formatType: 'time',
        format: '%Y-%m-%d'
      });
    });

    it('should use number format for quantitative scale', function() {
      assert.deepEqual(parseModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        }
      }).format(X, undefined), {
        format: 's'
      });
    });

    it('should use format if provided', function() {
      assert.deepEqual(parseModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        }
      }).format(X, 'foo'), {
        format: 'foo'
      });
    });
  });
});
