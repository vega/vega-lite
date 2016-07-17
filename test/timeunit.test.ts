import {assert} from 'chai';

import {ScaleType} from '../src/scale';
import {TimeUnit, containsTimeUnit, defaultScaleType, fieldExpr} from '../src/timeunit';


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
        'datetime(year(datum.x), month(datum.x), date(datum.x), hours(datum.x), minutes(datum.x), seconds(datum.x), 0)'
      );
    });


    it('should automatically correct YEARMONTHDAY to be YEARMONTHDATE', () => {
      assert.equal(
        fieldExpr('yearmonthday' as any, 'x'),
        'datetime(year(datum.x), month(datum.x), date(datum.x), 0, 0, 0, 0)'
      );
    });

    it('should return correct field expression for QUARTER', () => {
      assert.equal(
        fieldExpr(TimeUnit.QUARTER, 'x'),
        'datetime(0, floor(month(datum.x)/3)*3, 1, 0, 0, 0, 0)'
      );
    });

    it('should return correct field expression for DAY', () => {
      assert.equal(
        fieldExpr(TimeUnit.DAY, 'x'),
        'datetime(2006, 0, day(datum.x)+1, 0, 0, 0, 0)'
      );
    });

    it('should return correct field expression for MILLISECONDS', () => {
      assert.equal(
        fieldExpr(TimeUnit.MILLISECONDS, 'x'),
        'datetime(0, 0, 1, 0, 0, 0, milliseconds(datum.x))'
      );
    });
  });
});
