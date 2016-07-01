/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {X} from '../../src/channel';
import {timeFormatTemplate, formatMixins, applyColorAndOpacity} from '../../src/compile/common';

describe('Common', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X, true), '{{datum.data | time:\'%b\'}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X, true, 'datum.foo'), '{{datum.foo | time:\'%b\'}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }), X, false), '{{datum.data | time:\'%B\'}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'quarter', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X, true), 'Q{{datum.data | quarter}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'yearquarter', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X, true), '{{datum.data | time:\'%y-\'}}Q{{datum.data | quarter}}');

      assert.equal(timeFormatTemplate(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X, true), undefined);
    });
  });

  describe('formatMixins()', function() {
    it('should use number format for quantitative scale', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        },
        config: {
          numberFormat: 'd'
        }
      });
      assert.deepEqual(formatMixins(model, model.fieldDef(X), undefined, model.axis(X).shortTimeLabels), {
        format: 'd'
      });
    });

    it('should support empty number format', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        },
        config: {
          numberFormat: ''
        }
      });
      assert.deepEqual(formatMixins(model, model.fieldDef(X), undefined, model.axis(X).shortTimeLabels), {
        format: ''
      });
    });

    it('should use format if provided', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        }
      });
      assert.deepEqual(formatMixins(model, model.fieldDef(X), 'foo', model.axis(X).shortTimeLabels), {
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
