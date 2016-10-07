import {assert} from 'chai';

import {ScaleType} from '../src/scale';
import {TimeUnit, containsTimeUnit, defaultScaleType, fieldExpr, convert, template} from '../src/timeunit';


describe('timeUnit', () => {
  describe('containsTimeUnit', function () {
    it('should return true for quarter given quarter', function() {
      const fullTimeUnit = TimeUnit.QUARTER;
      const timeUnit = TimeUnit.QUARTER;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return true for yearquarter given quarter', function() {
      const fullTimeUnit = TimeUnit.YEARQUARTER;
      const timeUnit = TimeUnit.QUARTER;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', function() {
      const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
      const timeUnit = TimeUnit.SECONDS;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return true for MILLISECONDS given SECONDSMILLISECONDS', function() {
      const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
      const timeUnit = TimeUnit.MILLISECONDS;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return false for quarter given year', function() {
      const fullTimeUnit = TimeUnit.YEAR;
      const timeUnit = TimeUnit.QUARTER;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
    });

    it('should return false for SECONDS given MILLISECONDS', function() {
      const fullTimeUnit = TimeUnit.MILLISECONDS;
      const timeUnit = TimeUnit.SECONDS;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
    });

  });

  describe('defaultScaleType', () => {
    it('should return ordinal for month, quarter, day , hours', () => {
      for (const timeUnit of [TimeUnit.MONTH, TimeUnit.QUARTER, TimeUnit.DAY, TimeUnit.HOURS]) {
        assert.equal(defaultScaleType(timeUnit), ScaleType.ORDINAL);
      }
    });

    it('should return time for other timeUnit', () => {
      const TIMEUNITS = [
        TimeUnit.YEAR,
        TimeUnit.DATE,
        TimeUnit.MINUTES,
        TimeUnit.SECONDS,
        TimeUnit.MILLISECONDS,
        TimeUnit.YEARMONTH,
        TimeUnit.YEARMONTHDATE,
        TimeUnit.YEARMONTHDATEHOURS,
        TimeUnit.YEARMONTHDATEHOURSMINUTES,
        TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
        TimeUnit.HOURSMINUTES,
        TimeUnit.HOURSMINUTESSECONDS,
        TimeUnit.MINUTESSECONDS,
        TimeUnit.SECONDSMILLISECONDS,
        TimeUnit.YEARQUARTER,
        TimeUnit.QUARTERMONTH,
        TimeUnit.YEARQUARTERMONTH,
      ];

      for (const timeUnit of TIMEUNITS) {
        assert.equal(defaultScaleType(timeUnit), ScaleType.TIME);
      }
    });
  });

  describe('fieldExpr', () => {
    it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      assert.equal(
        fieldExpr(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'x'),
        'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)'
      );
    });


    it('should automatically correct YEARMONTHDAY to be YEARMONTHDATE', () => {
      assert.equal(
        fieldExpr('yearmonthday' as any, 'x'),
        'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), 0, 0, 0, 0)'
      );
    });

    it('should return correct field expression for QUARTER', () => {
      assert.equal(
        fieldExpr(TimeUnit.QUARTER, 'x'),
        'datetime(0, floor(month(datum["x"])/3)*3, 1, 0, 0, 0, 0)'
      );
    });

    it('should return correct field expression for DAY', () => {
      assert.equal(
        fieldExpr(TimeUnit.DAY, 'x'),
        'datetime(2006, 0, day(datum["x"])+1, 0, 0, 0, 0)'
      );
    });

    it('should return correct field expression for MILLISECONDS', () => {
      assert.equal(
        fieldExpr(TimeUnit.MILLISECONDS, 'x'),
        'datetime(0, 0, 1, 0, 0, 0, milliseconds(datum["x"]))'
      );
    });
  });

  describe('convert', function () {
    it('should throw an error for the DAY timeunit', function() {
      assert.throws(function() {
        convert(TimeUnit.DAY, new Date(2000, 11, 2, 23, 59, 59, 999));
      }, Error, 'Cannot convert to TimeUnits containing \'day\'');
    });

    it('should return expected result for YEARQUARTER', function() {
      const date: Date = convert(TimeUnit.YEARQUARTER, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 9, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARQUARTERMONTH', function() {
      const date: Date = convert(TimeUnit.YEARQUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTH', function() {
      const date: Date = convert(TimeUnit.YEARMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATE', function() {
      const date: Date = convert(TimeUnit.YEARMONTHDATE, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATEHOURS', function() {
      const date: Date = convert(TimeUnit.YEARMONTHDATEHOURS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATEHOURSMINUTES', function() {
      const date: Date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATEHOURSMINUTESSECONDS', function() {
      const date: Date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 59, 0).getTime());
    });

    it('should return expected result for QUARTERMONTH', function() {
      const date: Date = convert(TimeUnit.QUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 11, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for HOURSMINUTES', function() {
      const date: Date = convert(TimeUnit.HOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 0, 0).getTime());
    });

    it('should return expected result for HOURSMINUTESSECONDS', function() {
      const date: Date = convert(TimeUnit.HOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 59, 0).getTime());
    });

    it('should return expected result for MINUTESSECONDS', function() {
      const date: Date = convert(TimeUnit.MINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 59, 59, 0).getTime());
    });

    it('should return expected result for SECONDSMILLISECONDS', function() {
      const date: Date = convert(TimeUnit.SECONDSMILLISECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 0, 59, 999).getTime());
    });
  });

  describe('template', () => {
    it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      assert.deepEqual(
        template(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,'datum.x', undefined),
        '{{datum.x | time:\'%b %d, %Y %H:%M:%S\'}}'
      );
    });

    it('should return correct template for YEARMONTH (No comma)', () => {
      assert.deepEqual(
        template(TimeUnit.YEARMONTH,'datum.x', undefined),
        '{{datum.x | time:\'%b %Y\'}}'
      );
    });

    it('should return correct template for DAY', () => {
      assert.deepEqual(
        template(TimeUnit.DAY,'datum.x', undefined),
        '{{datum.x | time:\'%A\'}}'
      );
    });

    it('should return correct template for DAY (shortened)', () => {
      assert.deepEqual(
        template(TimeUnit.DAY,'datum.x', true),
        '{{datum.x | time:\'%a\'}}'
      );
    });

    it('should return correct template for QUARTER', () => {
      assert.deepEqual(
        template(TimeUnit.QUARTER,'datum.x', undefined),
        'Q{{datum.x | quarter}}'
      );
    });

    it('should return correct template for YEARQUARTER', () => {
      assert.deepEqual(
        template(TimeUnit.YEARQUARTER,'datum.x', undefined),
        'Q{{datum.x | quarter}} {{datum.x | time:\'%Y\'}}'
      );
    });

    it('should return correct template for milliseconds', () => {
      assert.deepEqual(
        template(TimeUnit.MILLISECONDS,'datum.x', undefined),
        '{{datum.x | time:\'%L\'}}'
      );
    });

    it('should return correct template for no timeUnit', () => {
      assert.deepEqual(
        template(undefined,'datum.x', undefined),
        undefined
      );
    });
  });
});
