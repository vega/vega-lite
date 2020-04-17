import {containsTimeUnit, fieldExpr, formatExpression} from '../src/timeunit';

describe('timeUnit', () => {
  describe('containsTimeUnit', () => {
    it('should return true for quarter given quarter', () => {
      expect(containsTimeUnit('quarter', 'quarter')).toBe(true);
    });

    it('should return true for yearquarter given quarter', () => {
      expect(containsTimeUnit('yearquarter', 'quarter')).toBe(true);
    });

    it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', () => {
      expect(containsTimeUnit('secondsmilliseconds', 'seconds')).toBe(true);
    });

    it('should return true for MILLISECONDS given SECONDSMILLISECONDS', () => {
      expect(containsTimeUnit('secondsmilliseconds', 'milliseconds')).toBe(true);
    });

    it('should return false for quarter given year', () => {
      expect(containsTimeUnit('year', 'quarter')).toBeFalsy();
    });

    it('should return false for SECONDS given MILLISECONDS', () => {
      expect(containsTimeUnit('milliseconds', 'seconds')).toBeFalsy();
    });
  });

  describe('fieldExpr', () => {
    it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      expect(fieldExpr('yearmonthdatehoursminutesseconds', 'x')).toBe(
        'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)'
      );
    });

    it('should return correct field expression for QUARTER', () => {
      expect(fieldExpr('quarter', 'x')).toBe('datetime(2012, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for DAY', () => {
      expect(fieldExpr('day', 'x')).toBe('datetime(2012, 0, day(datum["x"])+1, 0, 0, 0, 0)');
    });

    it('should return correct field expression for MILLISECONDS', () => {
      expect(fieldExpr('milliseconds', 'x')).toBe('datetime(2012, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
    });

    it('should return correct field expression for MONTHDATE', () => {
      expect(fieldExpr('monthdate', 'x')).toBe('datetime(2012, month(datum["x"]), date(datum["x"]), 0, 0, 0, 0)');
    });

    it('should return correct field expression with utc for MILLISECONDS', () => {
      expect(fieldExpr('utcquarter', 'x')).toBe('datetime(2012, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');

      expect(fieldExpr('utcmilliseconds', 'x')).toBe('datetime(2012, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
    });
  });

  describe('template', () => {
    it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
      expect(formatExpression('yearmonthdatehoursminutesseconds', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","month","date","hours","minutes","seconds"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for YEARMONTH (No comma)', () => {
      expect(formatExpression('yearmonth', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for DAY', () => {
      expect(formatExpression('day', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["day"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for DAY (shortened)', () => {
      expect(formatExpression('day', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["day"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for QUARTER', () => {
      expect(formatExpression('quarter', 'datum.x', false)).toBe(
        'timeFormat(datum.x, timeUnitSpecifier(["quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for YEARQUARTER', () => {
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

    it('should return correct template for YEARMONTH (No comma) with utc scale', () => {
      expect(formatExpression('yearmonth', 'datum.x', true)).toBe(
        'utcFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should return correct template for UTCYEARMONTH (No comma)', () => {
      expect(formatExpression('utcyearmonth', 'datum.x', true)).toBe(
        'utcFormat(datum.x, timeUnitSpecifier(["year","month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });
  });
});
