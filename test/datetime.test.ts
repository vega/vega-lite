import {assert} from 'chai';
import {dateTimeExpr} from '../src/datetime';
import * as log from '../src/log';

describe('datetime', () => {
  describe('dateTimeExpr', () => {
    it('should drop day if day is combined with year/month/date', () => {
      log.runLocalLogger((localLogger) => {
        const d = {
          year: 2007,
          day: 'monday'
        };
        const expr = dateTimeExpr(d, true);
        assert.equal(expr, 'datetime(2007, 0, 1, 0, 0, 0, 0)');
        assert.equal(localLogger.warns[0], log.message.droppedDay(d));
      });
    });

    it('should normalize numeric quarter correctly', () => {
      const expr = dateTimeExpr({
        quarter: 2
      }, true);
      assert.equal(expr, 'datetime(0, 1*3, 1, 0, 0, 0, 0)');
    });

    it('should log warning for quarter > 4', () => {
      log.runLocalLogger((localLogger) => {
        assert.equal(dateTimeExpr({
          quarter: 5
        }, true), 'datetime(0, 4*3, 1, 0, 0, 0, 0)');
        assert.equal(localLogger.warns[0], log.message.invalidTimeUnit('quarter', 5));
      });
    });

    it('should throw error for invalid quarter', () => {
      assert.throws(() => {
        dateTimeExpr({quarter: 'Q'}, true);
      }, Error, log.message.invalidTimeUnit('quarter', 'Q'));
    });

    it('should normalize numeric month correctly', () => {
      const expr = dateTimeExpr({
        month: 1
      }, true);
      assert.equal(expr, 'datetime(0, 0, 1, 0, 0, 0, 0)');
    });

    it('should normalize month name correctly', () => {
      assert.equal(dateTimeExpr({
        month: 'January'
      }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        month: 'january'
      }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        month: 'Jan'
      }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        month: 'jan'
      }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
    });

    it('should throw error for invalid month', () => {
      assert.throws(() => {
        dateTimeExpr({month: 'J'}, true);
      }, Error, log.message.invalidTimeUnit('month', 'J'));
    });

    it('should normalize numeric day (of week) correctly', () => {
      assert.equal(dateTimeExpr({
        day: 0
      }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        day: 7
      }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
    });

    it('should normalize day name correctly and use year 2006 to ensure correct', () => {
      assert.equal(dateTimeExpr({
        day: 'Sunday'
      }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        day: 'sunday'
      }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        day: 'Sun'
      }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
      assert.equal(dateTimeExpr({
        day: 'sun'
      }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
    });

    it('should throw error for invalid day', () => {
      assert.throws(() => {
        dateTimeExpr({day: 'S'}, true);
      }, Error, log.message.invalidTimeUnit('day', 'S'));
    });

    it('should use utc expression if utc is specified', () => {
      log.runLocalLogger((localLogger) => {
        const d = {
          year: 2007,
          day: 'monday',
          utc: true
        };
        const expr = dateTimeExpr(d, true);
        assert.equal(expr, 'utc(2007, 0, 1, 0, 0, 0, 0)');
      });
    });

    // Note: Other part of coverage handled by timeUnit.fieldExpr's test
  });
});
