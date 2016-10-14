import {assert} from 'chai';
import {dateTimeExpr, timestamp} from '../src/datetime';


describe('datetime', () => {
  describe('dateTimeExpr', () => {
    it('should drop day if day is combined with year/month/date', () => {
      const expr = dateTimeExpr({
        year: 2007,
        day: 'monday'
      }, true);
      assert.equal(expr, 'datetime(2007, 0, 1, 0, 0, 0, 0)');
    });

    it('should normalize numeric quarter correctly', () => {
      const expr = dateTimeExpr({
        quarter: 2
      }, true);
      assert.equal(expr, 'datetime(0, 1*3, 1, 0, 0, 0, 0)');
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

    // Note: Other part of coverage handled by timeUnit.fieldExpr's test
  });

  describe('timestamp', () => {
    it('should produce correct timestamp', () => {
      assert.equal(timestamp({
        year: 1234,
        month: 'June', // 5 = June
        date: 6,
        hours: 7,
        minutes: 8,
        seconds: 9,
        milliseconds: 123
      }, true), new Date(1234, 5, 6, 7, 8, 9, 123).getTime());
    });

    it('should produce correct timestamp for quarter', () => {
      assert.equal(timestamp({
        year: 1234,
        quarter: 3,
      }, true), new Date(1234, 6, 1).getTime());
    });

    it('should produce correct timestamp for day', () => {
      assert.equal(timestamp({
        day: 'monday'
      }, true), new Date(2006, 0, 2).getTime());
    });
  });
});
