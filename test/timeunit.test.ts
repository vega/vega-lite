import {assert} from 'chai';
import {containsTimeUnit, convert, fieldExpr, formatExpression, TimeUnit} from '../src/timeunit';

describe('timeUnit', () => {
  describe('containsTimeUnit', () => {
    it('should return true for quarter given quarter', () => {
      const fullTimeUnit = TimeUnit.QUARTER;
      const timeUnit = TimeUnit.QUARTER;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return true for yearquarter given quarter', () => {
      const fullTimeUnit = TimeUnit.YEARQUARTER;
      const timeUnit = TimeUnit.QUARTER;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', () => {
      const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
      const timeUnit = TimeUnit.SECONDS;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return true for MILLISECONDS given SECONDSMILLISECONDS', () => {
      const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
      const timeUnit = TimeUnit.MILLISECONDS;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
    });

    it('should return false for quarter given year', () => {
      const fullTimeUnit = TimeUnit.YEAR;
      const timeUnit = TimeUnit.QUARTER;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
    });

    it('should return false for SECONDS given MILLISECONDS', () => {
      const fullTimeUnit = TimeUnit.MILLISECONDS;
      const timeUnit = TimeUnit.SECONDS;
      assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
    });
  });

  describe('fieldExpr', () => {
    it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      assert.equal(
        fieldExpr(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'x'),
        'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)'
      );
    });

    it('should return correct field expression for QUARTER', () => {
      assert.equal(fieldExpr(TimeUnit.QUARTER, 'x'), 'datetime(0, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for DAY', () => {
      assert.equal(fieldExpr(TimeUnit.DAY, 'x'), 'datetime(2006, 0, day(datum["x"])+1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for MILLISECONDS', () => {
      assert.equal(fieldExpr(TimeUnit.MILLISECONDS, 'x'), 'datetime(0, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
    });

    it('should return correct field expression with utc for MILLISECONDS', () => {
      assert.equal(fieldExpr(TimeUnit.UTCQUARTER, 'x'), 'datetime(0, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');

      assert.equal(fieldExpr(TimeUnit.UTCMILLISECONDS, 'x'), 'datetime(0, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
    });
  });

  describe('convert', () => {
    it('should throw an error for the DAY timeunit', () => {
      assert.throws(
        () => {
          convert(TimeUnit.DAY, new Date(2000, 11, 2, 23, 59, 59, 999));
        },
        Error,
        "Cannot convert to TimeUnits containing 'day'"
      );
    });

    it('should return expected result for YEARQUARTER', () => {
      const date: Date = convert(TimeUnit.YEARQUARTER, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 9, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for UTCYEARQUARTER', () => {
      const date: Date = convert(TimeUnit.UTCYEARQUARTER, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
      assert.equal(date.getTime(), new Date(Date.UTC(2000, 9, 1, 0, 0, 0, 0)).getTime());
    });

    it('should return expected result for YEARQUARTERMONTH', () => {
      const date: Date = convert(TimeUnit.YEARQUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTH', () => {
      const date: Date = convert(TimeUnit.YEARMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for UTCYEARMONTH', () => {
      const date: Date = convert(TimeUnit.UTCYEARMONTH, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
      assert.equal(date.getTime(), new Date(Date.UTC(2000, 11, 1, 0, 0, 0, 0)).getTime());
    });

    it('should return expected result for UTCYEARMONTH', () => {
      const date: Date = convert(TimeUnit.UTCYEAR, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
      assert.equal(date.getTime(), new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).getTime());
    });

    it('should return expected result for YEARMONTHDATE', () => {
      const date: Date = convert(TimeUnit.YEARMONTHDATE, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATEHOURS', () => {
      const date: Date = convert(TimeUnit.YEARMONTHDATEHOURS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 0, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATEHOURSMINUTES', () => {
      const date: Date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 0, 0).getTime());
    });

    it('should return expected result for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      const date: Date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 59, 0).getTime());
    });

    it('should return expected result for QUARTERMONTH', () => {
      const date: Date = convert(TimeUnit.QUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 11, 1, 0, 0, 0, 0).getTime());
    });

    it('should return expected result for HOURSMINUTES', () => {
      const date: Date = convert(TimeUnit.HOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 0, 0).getTime());
    });

    it('should return expected result for HOURSMINUTESSECONDS', () => {
      const date: Date = convert(TimeUnit.HOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 59, 0).getTime());
    });

    it('should return expected result for MINUTESSECONDS', () => {
      const date: Date = convert(TimeUnit.MINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 59, 59, 0).getTime());
    });

    it('should return expected result for SECONDSMILLISECONDS', () => {
      const date: Date = convert(TimeUnit.SECONDSMILLISECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
      assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 0, 59, 999).getTime());
    });
  });

  describe('template', () => {
    it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      assert.equal(
        formatExpression(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'datum.x', undefined, false),
        "timeFormat(datum.x, '%b %d, %Y %H:%M:%S')"
      );
    });

    it('should return correct template for YEARMONTH (No comma)', () => {
      assert.equal(formatExpression(TimeUnit.YEARMONTH, 'datum.x', undefined, false), "timeFormat(datum.x, '%b %Y')");
    });

    it('should return correct template for DAY', () => {
      assert.equal(formatExpression(TimeUnit.DAY, 'datum.x', undefined, false), "timeFormat(datum.x, '%A')");
    });

    it('should return correct template for DAY (shortened)', () => {
      assert.equal(formatExpression(TimeUnit.DAY, 'datum.x', true, false), "timeFormat(datum.x, '%a')");
    });

    it('should return correct template for QUARTER', () => {
      assert.equal(formatExpression(TimeUnit.QUARTER, 'datum.x', undefined, false), "'Q' + quarter(datum.x)");
    });

    it('should return correct template for YEARQUARTER', () => {
      assert.equal(
        formatExpression(TimeUnit.YEARQUARTER, 'datum.x', undefined, false),
        "'Q' + quarter(datum.x) + ' ' + timeFormat(datum.x, '%Y')"
      );
    });

    it('should return correct template for milliseconds', () => {
      assert.equal(formatExpression(TimeUnit.MILLISECONDS, 'datum.x', undefined, false), "timeFormat(datum.x, '%L')");
    });

    it('should return correct template for no timeUnit', () => {
      assert.equal(formatExpression(undefined, 'datum.x', undefined, false), undefined);
    });

    it('should return correct template for YEARMONTH (No comma) with utc scale', () => {
      assert.equal(formatExpression(TimeUnit.YEARMONTH, 'datum.x', undefined, true), "utcFormat(datum.x, '%b %Y')");
    });
  });
});
