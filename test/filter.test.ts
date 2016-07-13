import {assert} from 'chai';
import {isEqualFilter, isInFilter, isRangeFilter} from '../src/filter';

describe('filter', () => {
  const equalFilter = {field: 'color', equal: 'red'};
  const inFilter = {field: 'color', in: ['red', 'yellow']};
  const rangeFilter = {field: 'x', range: [0, 5]};
  const rangeFilter2 = {field: 'x', gte: 0};
  const rangeFilter3 = {field: 'x', gte: 0, lt: 5 };
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
    it('should return true for an range filter', () => {
      assert.isTrue(isRangeFilter(rangeFilter));
      assert.isTrue(isRangeFilter(rangeFilter2));
      assert.isTrue(isRangeFilter(rangeFilter3));
    });

    it('should return false for other filters', () => {
      [inFilter, equalFilter, exprFilter].forEach((filter) => {
        assert.isFalse(isRangeFilter(filter));
      });
    });
  });
});
