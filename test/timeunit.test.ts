import {containsTimeUnit, fieldExpr, formatExpression, TimeUnit} from '../src/timeunit';

describe('timeUnit', () => {
  describe('containsTimeUnit', () => {
    it('should return true for quarter given quarter', () => {
      const fullTimeUnit = TimeUnit.QUARTER;
      const timeUnit = TimeUnit.QUARTER;
      expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
    });

    it('should return true for yearquarter given quarter', () => {
      const fullTimeUnit = TimeUnit.YEARQUARTER;
      const timeUnit = TimeUnit.QUARTER;
      expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
    });

    it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', () => {
      const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
      const timeUnit = TimeUnit.SECONDS;
      expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
    });

    it('should return true for MILLISECONDS given SECONDSMILLISECONDS', () => {
      const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
      const timeUnit = TimeUnit.MILLISECONDS;
      expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
    });

    it('should return false for quarter given year', () => {
      const fullTimeUnit = TimeUnit.YEAR;
      const timeUnit = TimeUnit.QUARTER;
      expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBeFalsy();
    });

    it('should return false for SECONDS given MILLISECONDS', () => {
      const fullTimeUnit = TimeUnit.MILLISECONDS;
      const timeUnit = TimeUnit.SECONDS;
      expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBeFalsy();
    });
  });

  describe('fieldExpr', () => {
    it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      expect(fieldExpr(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'x')).toBe(
        'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)'
      );
    });

    it('should return correct field expression for QUARTER', () => {
      expect(fieldExpr(TimeUnit.QUARTER, 'x')).toBe('datetime(0, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for DAY', () => {
      expect(fieldExpr(TimeUnit.DAY, 'x')).toBe('datetime(2006, 0, day(datum["x"])+1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for MILLISECONDS', () => {
      expect(fieldExpr(TimeUnit.MILLISECONDS, 'x')).toBe('datetime(0, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
    });

    it('should return correct field expression for MONTHDATE', () => {
      expect(fieldExpr(TimeUnit.MONTHDATE, 'x')).toBe('datetime(0, month(datum["x"]), date(datum["x"]), 0, 0, 0, 0)');
    });

    it('should return correct field expression with utc for MILLISECONDS', () => {
      expect(fieldExpr(TimeUnit.UTCQUARTER, 'x')).toBe('datetime(0, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');

      expect(fieldExpr(TimeUnit.UTCMILLISECONDS, 'x')).toBe('datetime(0, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
    });
  });

  describe('template', () => {
    it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      expect(formatExpression(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","month","date","hours","minutes","seconds"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for YEARMONTH (No comma)', () => {
      expect(formatExpression(TimeUnit.YEARMONTH, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for DAY', () => {
      expect(formatExpression(TimeUnit.DAY, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["day"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for DAY (shortened)', () => {
      expect(formatExpression(TimeUnit.DAY, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["day"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for QUARTER', () => {
      expect(formatExpression(TimeUnit.QUARTER, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for YEARQUARTER', () => {
      expect(formatExpression(TimeUnit.YEARQUARTER, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for milliseconds', () => {
      expect(formatExpression(TimeUnit.MILLISECONDS, 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["milliseconds"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for no timeUnit', () => {
      expect(formatExpression(undefined, 'datum.x', false)).toBeUndefined();
    });

    it('should return correct template for YEARMONTH (No comma) with utc scale', () => {
      expect(formatExpression(TimeUnit.YEARMONTH, 'datum.x', true)).toBe(
        'utcFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for UTCYEARMONTH (No comma)', () => {
      expect(formatExpression(TimeUnit.UTCYEARMONTH, 'datum.x', true)).toBe(
        'utcFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });
  });
});
