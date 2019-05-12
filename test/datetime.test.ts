import {dateTimeExpr} from '../src/datetime';
import * as log from '../src/log';

describe('datetime', () => {
  describe('dateTimeExpr', () => {
    it(
      'should drop day if day is combined with year/month/date',
      log.wrap(localLogger => {
        const d = {
          year: 2007,
          day: 'monday'
        };
        const expr = dateTimeExpr(d, true);
        expect(expr).toBe('datetime(2007, 0, 1, 0, 0, 0, 0)');
        expect(localLogger.warns[0]).toEqual(log.message.droppedDay(d));
      })
    );

    it('should normalize numeric quarter correctly', () => {
      const expr = dateTimeExpr(
        {
          quarter: 2
        },
        true
      );
      expect(expr).toBe('datetime(0, 1*3, 1, 0, 0, 0, 0)');
    });

    it(
      'should log warning for quarter > 4',
      log.wrap(localLogger => {
        expect(
          dateTimeExpr(
            {
              quarter: 5
            },
            true
          )
        ).toBe('datetime(0, 4*3, 1, 0, 0, 0, 0)');
        expect(localLogger.warns[0]).toEqual(log.message.invalidTimeUnit('quarter', 5));
      })
    );

    it('should throw error for invalid quarter', () => {
      expect(() => {
        dateTimeExpr({quarter: 'Q'}, true);
      }).toThrow();
    });

    it('should normalize numeric month correctly', () => {
      const expr = dateTimeExpr(
        {
          month: 1
        },
        true
      );
      expect(expr).toBe('datetime(0, 0, 1, 0, 0, 0, 0)');
    });

    it('should normalize month name correctly', () => {
      expect(
        dateTimeExpr(
          {
            month: 'January'
          },
          true
        )
      ).toBe('datetime(0, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            month: 'january'
          },
          true
        )
      ).toBe('datetime(0, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            month: 'Jan'
          },
          true
        )
      ).toBe('datetime(0, 0, 1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            month: 'jan'
          },
          true
        )
      ).toBe('datetime(0, 0, 1, 0, 0, 0, 0)');
    });

    it('should throw error for invalid month', () => {
      expect(() => {
        dateTimeExpr({month: 'J'}, true);
      }).toThrow();
    });

    it('should normalize numeric day (of week) correctly', () => {
      expect(
        dateTimeExpr(
          {
            day: 0
          },
          true
        )
      ).toBe('datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            day: 7
          },
          true
        )
      ).toBe('datetime(2006, 0, 0+1, 0, 0, 0, 0)');
    });

    it('should normalize day name correctly and use year 2006 to ensure correct', () => {
      expect(
        dateTimeExpr(
          {
            day: 'Sunday'
          },
          true
        )
      ).toBe('datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            day: 'sunday'
          },
          true
        )
      ).toBe('datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            day: 'Sun'
          },
          true
        )
      ).toBe('datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      expect(
        dateTimeExpr(
          {
            day: 'sun'
          },
          true
        )
      ).toBe('datetime(2006, 0, 0+1, 0, 0, 0, 0)');
    });

    it('should return date in JSON if specified', () => {
      const d = {
        year: 1970,
        month: 1,
        day: '1'
      };
      const expr = dateTimeExpr(d, false, true);
      expect(expr).toBe('1970-02-02T08:00:00.000Z');
    });

    it('should throw error for invalid day', () => {
      expect(() => {
        dateTimeExpr({day: 'S'}, true);
      }).toThrow();
    });

    it('should use utc expression if utc is specified', () => {
      const d = {
        year: 2007,
        day: 'monday',
        utc: true
      };
      const expr = dateTimeExpr(d, true);
      expect(expr).toBe('utc(2007, 0, 1, 0, 0, 0, 0)');
      const exprJSON = dateTimeExpr(d, true, true);
      expect(exprJSON).toBe('2007-01-01T00:00:00.000Z');
    });

    // Note: Other part of coverage handled by timeUnit.fieldExpr's test
  });
});
