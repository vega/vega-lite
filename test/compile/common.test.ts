/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {X} from '../../src/channel';
import {defaultConfig} from '../../src/config';
import {TimeUnit} from '../../src/timeunit';
import {field, FieldDef} from '../../src/fielddef';
import {TEMPORAL, QUANTITATIVE, ORDINAL, NOMINAL} from '../../src/type';
import {numberFormat, timeTemplate, applyColorAndOpacity} from '../../src/compile/common';

describe('Common', function() {
  describe('timeFormat()', function() {
    it('should get the right time template for month with shortTimeLabels=true', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.MONTH, undefined, true, defaultConfig);
      assert.equal(template,'{{datum["month_a"] | time:\'%b\'}}');
    });

    it('should get the right time template for month with shortTimeLabels=false', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.MONTH, undefined, false, defaultConfig);
      assert.equal(template,'{{datum["month_a"] | time:\'%B\'}}');
    });

    it('should get the right time template for yearmonth with custom format', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.MONTH, '%Y', true, defaultConfig);
      assert.equal(template,'{{datum["yearmonth_a"] | time:\'%Y\'}}');
    });

    it('should get the right time template for quarter', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.QUARTER, undefined, true, defaultConfig);
      assert.equal(template, 'Q{{datum["quarter_a"] | quarter}}');
    });

    it('should get the right time template for yearquarter', function() {
      const template = timeTemplate('datum["data"]', TimeUnit.YEARQUARTER, undefined, true, defaultConfig);
      assert.equal(template, 'Q{{datum["data"] | quarter}} {{datum["data"] | time:\'%y\'}}');
    });
  });

  describe('numberFormat()', function() {
    it('should use number format for quantitative scale', function() {
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: 'd'}, X), 'd');
    });

    it('should support empty number format', function() {
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: ''}, X), '');
    });

    it('should use format if provided', function() {
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, 'a', 'd', X), 'a');
    });

    it('should not use number format for binned quantitative scale', function() {
      assert.equal(numberFormat({bin: true, field: 'a', type: QUANTITATIVE}, undefined, 'd', X), undefined);
    });

    it('should not use number format for non-quantitative scale', function() {
      for (let type of [TEMPORAL, NOMINAL, ORDINAL]) {
        assert.equal(numberFormat({bin: true, field: 'a', type: type}, undefined, 'd', X), undefined);
      }
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
