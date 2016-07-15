import {assert} from 'chai';

import {ScaleType} from '../src/scale';
import {TimeUnit, containsTimeUnit, defaultScaleType} from '../src/timeunit';


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

    it('should return false for quarter given year', function() {
      const fullTimeUnit = TimeUnit.YEAR;
      const timeUnit = TimeUnit.QUARTER;
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
});
