import {DateTime, dateTimeToExpr, dateTimeToTimestamp, isDateTime} from '../src/datetime';
import * as log from '../src/log';

describe('datetime', () => {
  describe('isDateTime', () => {
    it('correctly classifies unit with zero', () => {
      expect(isDateTime({hours: 0})).toEqual(true);
    });
  });

  describe('dateTimeToExpr', () => {
    it(
      'should drop day if day is combined with year/month/date',
      log.wrap(localLogger => {
        const d = {
          year: 2007,
          day: 'monday'
        };
        const expr = dateTimeToExpr(d);
        expect(expr).toBe('datetime(2007, 0, 1, 0, 0, 0, 0)');
        expect(localLogger.warns[0]).toEqual(log.message.droppedDay(d));
      })
    );

    it('should normalize numeric quarter correctly', () => {
      const expr = dateTimeToExpr({
        quarter: 2
      });
      expect(expr).toBe('datetime(2012, 3, 1, 0, 0, 0, 0)');
    });

    it(
      'should log warning for quarter > 4',
      log.wrap(localLogger => {
        expect(
          dateTimeToExpr({
            quarter: 5
          })
        ).toBe('datetime(2012, 12, 1, 0, 0, 0, 0)');
        expect(localLogger.warns[0]).toEqual(log.message.invalidTimeUnit('quarter', 5));
      })
    );

    it('should throw error for invalid quarter', () => {
      expect(() => {
        dateTimeToExpr({quarter: 'Q'} as any);
      }).toThrow();
    });

    it('should normalize numeric month correctly', () => {
      const expr = dateTimeToExpr({
        month: 1
      });
      expect(expr).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
    });

    it('should normalize month name correctly', () => {
      expect(
        dateTimeToExpr({
          month: 'January'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          month: 'january'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          month: 'Jan'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          month: 'jan'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
    });

    it('should throw error for invalid month', () => {
      expect(() => {
        dateTimeToExpr({month: 'J'});
      }).toThrow();
    });

    it('should normalize numeric day (of week) correctly', () => {
      expect(
        dateTimeToExpr({
          day: 0
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          day: 7
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
    });

    it('should normalize day name correctly and use year 2006 to ensure correct', () => {
      expect(
        dateTimeToExpr({
          day: 'Sunday'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          day: 'sunday'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          day: 'Sun'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeToExpr({
          day: 'sun'
        })
      ).toBe('datetime(2012, 0, 1, 0, 0, 0, 0)');
    });

    it('should throw error for invalid day', () => {
      expect(() => {
        dateTimeToExpr({day: 'S'});
      }).toThrow();
    });

    it('should use utc expression if utc is specified', () => {
      const d: DateTime = {
        year: 2007,
        date: 1,
        utc: true
      };
      const expr = dateTimeToExpr(d);
      expect(expr).toBe('utc(2007, 0, 1, 0, 0, 0, 0)');
    });

    // Note: Other part of coverage handled by timeUnit.fieldExpr's test
  });

  describe('dateTimeToTimestamp', () => {
    it('should return date as timestamp if specified with month number', () => {
      const d: DateTime = {
        year: 1970,
        month: 1, // January
        date: 1
      };
      const expr = dateTimeToTimestamp(d);
      expect(expr).toBe(+new Date(1970, 0, 1, 0, 0, 0, 0));
    });

    it('should return date as timestamp if specified with month name', () => {
      const d: DateTime = {
        year: 1970,
        month: 'January',
        date: 1
      };
      const expr = dateTimeToTimestamp(d);
      expect(expr).toBe(+new Date(1970, 0, 1, 0, 0, 0, 0));
    });

    it('should use UTC if specified', () => {
      const d: DateTime = {
        year: 2007,
        date: 1,
        utc: true
      };
      const exprJSON = dateTimeToTimestamp(d);
      expect(exprJSON).toBe(+new Date(Date.UTC(2007, 0, 1, 0, 0, 0, 0)));
    });

    it('should support accidental use of strings', () => {
      const d: any = {
        year: '2007',
        month: '1',
        date: '1'
      };
      const exprJSON = dateTimeToTimestamp(d);
      expect(exprJSON).toBe(+new Date(2007, 0, 1, 0, 0, 0, 0));
    });
  });
});
