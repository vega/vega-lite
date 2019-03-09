/* tslint:disable:quotemark */

import {mergeTitle, numberOrTimeFormat, timeFormatExpression} from '../../src/compile/common';
import {defaultConfig} from '../../src/config';
import {vgField} from '../../src/fielddef';
import {TimeUnit} from '../../src/timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../../src/type';

describe('Common', () => {
  describe('timeFormat()', () => {
    it('should get the right time expression for month with shortTimeLabels=true', () => {
      const fieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        undefined,
        true,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(`timeFormat(datum["month_a"], '%b')`);
    });

    it('should get the right time expression for month with shortTimeLabels=false', () => {
      const fieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        undefined,
        false,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(`timeFormat(datum["month_a"], '%B')`);
    });

    it('should get the right time expression for yearmonth with custom format', () => {
      const fieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        '%Y',
        true,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(`timeFormat(datum["yearmonth_a"], '%Y')`);
    });

    it('should get the right time expression for quarter', () => {
      const fieldDef = {timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.QUARTER,
        undefined,
        true,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(`'Q' + quarter(datum["quarter_a"])`);
    });

    it('should get the right time expression for yearquarter', () => {
      const expression = timeFormatExpression(
        'datum["data"]',
        TimeUnit.YEARQUARTER,
        undefined,
        true,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(`'Q' + quarter(datum["data"]) + ' ' + timeFormat(datum["data"], '%y')`);
    });

    it('should get the right time expression for yearmonth with custom format and utc scale type', () => {
      const fieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        '%Y',
        true,
        defaultConfig.timeFormat,
        true
      );
      expect(expression).toBe(`utcFormat(datum["yearmonth_a"], '%Y')`);
    });
  });

  describe('numberFormat()', () => {
    it('should use number format for quantitative scale', () => {
      expect(numberOrTimeFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: 'd'})).toBe('d');
    });

    it('should use number format for ordinal and nominal data but don not use config', () => {
      for (const type of [ORDINAL, NOMINAL]) {
        expect(numberOrTimeFormat({field: 'a', type: type}, undefined, {numberFormat: 'd'})).toBeUndefined();
        expect(numberOrTimeFormat({field: 'a', type: type}, 'd', {numberFormat: 'd'})).toBe('d');
      }
    });

    it('should support empty number format', () => {
      expect(numberOrTimeFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: ''})).toBe('');
    });

    it('should use format if provided', () => {
      expect(numberOrTimeFormat({field: 'a', type: QUANTITATIVE}, 'a', {})).toBe('a');
    });

    it('should not use number format for binned quantitative scale', () => {
      expect(numberOrTimeFormat({bin: true, field: 'a', type: QUANTITATIVE}, undefined, {})).toBeUndefined();
    });
  });

  describe('mergeTitle()', () => {
    it('should drop falsy title(s) when merged', () => {
      expect(mergeTitle('title', null)).toBe('title');
      expect(mergeTitle(null, 'title')).toBe('title');
      expect(mergeTitle(null, null)).toBe(null);
    });

    it('should drop one title when both are the same', () => {
      expect(mergeTitle('title', 'title')).toBe('title');
    });

    it('should join 2 titles with comma when both titles are not falsy and difference', () => {
      expect(mergeTitle('title1', 'title2')).toBe('title1, title2');
    });
  });
});
