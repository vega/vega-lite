/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import {X} from '../../src/channel';
import {timeFormat, formatMixins} from '../../src/compile/util';

describe('Model', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      assert.equal(timeFormat(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), '%b');

      assert.equal(timeFormat(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }), X), '%B');

      assert.equal(timeFormat(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), undefined);
    });
  });

  describe('format()', function() {
    it('should use time format type for time scale', function() {
      assert.deepEqual(formatMixins(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }), X, undefined), {
        formatType: 'time',
        format: '%B'
      });
    });

    it('should use default time format if we don\'t have a good format', function() {
      assert.deepEqual(formatMixins(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal"}
        }
      }), X, undefined), {
        formatType: 'time',
        format: '%Y-%m-%d'
      });
    });

    it('should use number format for quantitative scale', function() {
      assert.deepEqual(formatMixins(parseModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        },
        config: {
          numberFormat: 'd'
        }
      }), X, undefined), {
        format: 'd'
      });
    });

    it('should support empty number format', function() {
      assert.deepEqual(formatMixins(parseModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        },
        config: {
          numberFormat: ''
        }
      }), X, undefined), {
        format: ''
      });
    });

    it('should use format if provided', function() {
      assert.deepEqual(formatMixins(parseModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        }
      }), X, 'foo'), {
        format: 'foo'
      });
    });
  });
});
