/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {X} from '../../src/channel';
import {timeFormatTemplate, formatMixins, applyColorAndOpacity} from '../../src/compile/common';

describe('Model', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), '{{datum.data | time:\'%b\'}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X, 'datum.foo'), '{{datum.foo | time:\'%b\'}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }), X), '{{datum.data | time:\'%B\'}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'quarter', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), 'Q{{datum.data | quarter}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'yearquarter', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), '{{datum.data | time:\'%y-\'}}Q{{datum.data | quarter}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), undefined);
    });
  });

  describe('format()', function() {
    it('should use number format for quantitative scale', function() {
      assert.deepEqual(formatMixins(parseUnitModel({
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
      assert.deepEqual(formatMixins(parseUnitModel({
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
      assert.deepEqual(formatMixins(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        }
      }), X, 'foo'), {
        format: 'foo'
      });
    });
  });

  describe('applyColorAndOpacity()', function() {
    it('opacity should be mapped to a field if specified', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true},
          "opacity": {"field": "US_Gross", "type": "quantitative"}
        },
        "data": {"url": "data/movies.json"}
      });

      let p: any = {};
      applyColorAndOpacity(p, model);
      assert.deepEqual(p.opacity.field, 'US_Gross');
    });

    it('opacity should be mapped to a value if specified', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true},
          "opacity": {"value": 0.5}
        },
        "data": {"url": "data/movies.json"}
      });

      let p: any = {};
      applyColorAndOpacity(p, model);
      assert.deepEqual(p.opacity.value, 0.5);
    });
  });
});
