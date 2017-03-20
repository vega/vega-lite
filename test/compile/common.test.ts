/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X} from '../../src/channel';
import {defaultConfig} from '../../src/config';
import {TimeUnit} from '../../src/timeunit';
import {field, FieldDef} from '../../src/fielddef';
import {TEMPORAL, QUANTITATIVE, ORDINAL, NOMINAL} from '../../src/type';
import {numberFormat, timeFormatExpression} from '../../src/compile/common';

describe('Common', function() {
  describe('timeFormat()', function() {
    it('should get the right time expression for month with shortTimeLabels=true', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(field(fieldDef, {datum: true}), TimeUnit.MONTH, undefined, true, defaultConfig.timeFormat);
      assert.equal(expression, `timeFormat(datum["month_a"], '%b')`);
    });

    it('should get the right time expression for month with shortTimeLabels=false', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(field(fieldDef, {datum: true}), TimeUnit.MONTH, undefined, false, defaultConfig.timeFormat);
      assert.equal(expression, `timeFormat(datum["month_a"], '%B')`);
    });

    it('should get the right time expression for yearmonth with custom format', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(field(fieldDef, {datum: true}), TimeUnit.MONTH, '%Y', true, defaultConfig.timeFormat);
      assert.equal(expression, `timeFormat(datum["yearmonth_a"], '%Y')`);
    });

    it('should get the right time expression for quarter', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(field(fieldDef, {datum: true}), TimeUnit.QUARTER, undefined, true, defaultConfig.timeFormat);
      assert.equal(expression, `'Q' + quarter(datum["quarter_a"])`);
    });

    it('should get the right time expression for yearquarter', function() {
      const expression = timeFormatExpression('datum["data"]', TimeUnit.YEARQUARTER, undefined, true, defaultConfig.timeFormat);
      assert.equal(expression, `'Q' + quarter(datum["data"]) + ' ' + timeFormat(datum["data"], '%y')`);
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
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, 'a', {}, X), 'a');
    });

    it('should not use number format for binned quantitative scale', function() {
      assert.equal(numberFormat({bin: true, field: 'a', type: QUANTITATIVE}, undefined, {}, X), undefined);
    });

    it('should not use number format for non-quantitative scale', function() {
      for (let type of [TEMPORAL, NOMINAL, ORDINAL]) {
        assert.equal(numberFormat({bin: true, field: 'a', type: type}, undefined, {}, X), undefined);
      }
    });
  });
});
