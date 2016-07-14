import {assert} from 'chai';
import {isEqualFilter, isInFilter, isRangeFilter, isCompareFilter} from '../src/filter';

describe('filter', () => {
  const equalFilter = {field: 'color', equal: 'red'};
  const inFilter = {field: 'color', in: ['red', 'yellow']};
  const rangeFilter = {field: 'x', range: [0, 5]};
  const compareFilter1 = {field: 'x', gte: 0};
  const compareFilter2 = {field: 'x', gte: 0, lt: 5 };

  const exprFilter = 'datum.x===5';

  describe('isEqualFilter', () => {
    it('should return true for an equal filter', () => {
      assert.isTrue(isEqualFilter(equalFilter));
    });

    it('should return false for other filters', () => {
      [inFilter, rangeFilter, exprFilter].forEach((filter) => {
        assert.isFalse(isEqualFilter(filter));
      });
    });
  });

  describe('isInFilter', () => {
    it('should return true for an in filter', () => {
      assert.isTrue(isInFilter(inFilter));
    });

    it('should return false for other filters', () => {
      [equalFilter, rangeFilter, exprFilter].forEach((filter) => {
        assert.isFalse(isInFilter(filter));
      });
    });
  });

  describe('isRangeFilter', () => {
    it('should return true for a range filter', () => {
      assert.isTrue(isRangeFilter(rangeFilter));
    });

    it('should return false for other filters', () => {
      [inFilter, equalFilter, exprFilter, compareFilter1, compareFilter2].forEach((filter) => {
        assert.isFalse(isRangeFilter(filter));
      });
    });
  });

  describe('isCompareFilter', () => {
    it('should return true for a compare filter', () => {
      assert.isTrue(isCompareFilter(compareFilter1));
      assert.isTrue(isCompareFilter(compareFilter2));
    });

    it('should return false for other filters', () => {
      [inFilter, equalFilter, exprFilter, rangeFilter].forEach((filter) => {
        assert.isFalse(isCompareFilter(filter));
      });
    });
  });
});
