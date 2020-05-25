import {containsTimeUnit, fieldExpr, formatExpression, TIMEUNIT_PARTS} from '../src/timeunit';

describe('timeUnit', () => {
  describe('containsTimeUnit', () => {
    it('should return true for time unit parts', () => {
      for (const part of TIMEUNIT_PARTS) {
        expect(containsTimeUnit(part, part)).toBe(true);
      }
    });

    it('should return true for yearquarter given quarter', () => {
      expect(containsTimeUnit('yearquarter', 'quarter')).toBe(true);
    });

    it('should return true for seconds and milliseconds given secondsmilliseconds', () => {
      expect(containsTimeUnit('secondsmilliseconds', 'seconds')).toBe(true);
    });

    it('should return true for milliseconds given secondsmilliseconds', () => {
      expect(containsTimeUnit('secondsmilliseconds', 'milliseconds')).toBe(true);
    });

    it('should return false for quarter given year', () => {
      expect(containsTimeUnit('year', 'quarter')).toBeFalsy();
    });

    it('should return false for seconds given milliseconds', () => {
      expect(containsTimeUnit('milliseconds', 'seconds')).toBeFalsy();
    });

    it('should return false for day given dayofyear', () => {
      expect(containsTimeUnit('dayofyear', 'day')).toBeFalsy();
    });

    it('should return false for year given dayofyear', () => {
      expect(containsTimeUnit('dayofyear', 'year')).toBeFalsy();
    });
  });

  describe('fieldExpr', () => {
    it('should return correct field expression for yearmonthdatehoursminutesseconds', () => {
      expect(fieldExpr('yearmonthdatehoursminutesseconds', 'x')).toBe(
        'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)'
      );
    });

    it('should return correct field expression for quarter', () => {
      expect(fieldExpr('quarter', 'x')).toBe('datetime(2012, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for day', () => {
      expect(fieldExpr('day', 'x')).toBe('datetime(2012, 0, day(datum["x"])+1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for milliseconds', () => {
      expect(fieldExpr('milliseconds', 'x')).toBe('datetime(2012, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
    });

    it('should return correct field expression for monthdate', () => {
      expect(fieldExpr('monthdate', 'x')).toBe('datetime(2012, month(datum["x"]), date(datum["x"]), 0, 0, 0, 0)');
    });

    it('should return correct field expression with utc for milliseconds', () => {
      expect(fieldExpr('utcquarter', 'x')).toBe('datetime(2012, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');

      expect(fieldExpr('utcmilliseconds', 'x')).toBe('datetime(2012, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
    });
  });

  describe('template', () => {
    it('should return correct template for yearmonthdatehoursminutesseconds', () => {
      expect(formatExpression('yearmonthdatehoursminutesseconds', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","month","date","hours","minutes","seconds"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for yearmonth (No comma)', () => {
      expect(formatExpression('yearmonth', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for day', () => {
      expect(formatExpression('day', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["day"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for day (shortened)', () => {
      expect(formatExpression('day', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["day"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for QUARTER', () => {
      expect(formatExpression('quarter', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for yearquarter', () => {
      expect(formatExpression('yearquarter', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for milliseconds', () => {
      expect(formatExpression('milliseconds', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["milliseconds"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for no timeUnit', () => {
      expect(formatExpression(undefined, 'datum.x', false)).toBeUndefined();
    });

    it('should return correct template for yearmonth (No comma) with utc scale', () => {
      expect(formatExpression('yearmonth', 'datum.x', true)).toBe(
        'utcFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for utcyearmonth (No comma)', () => {
      expect(formatExpression('utcyearmonth', 'datum.x', true)).toBe(
        'utcFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });
  });
});
