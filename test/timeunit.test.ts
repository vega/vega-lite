import {assert} from 'chai';

import {TimeUnit, hasTimeUnit} from '../src/timeunit';

describe('For hasTimeUnit', function () {
  it('should return true for quarter given quarter', function() {
    const keyword = 'quarter';
    const timeUnit = TimeUnit.QUARTER;
    assert.equal(hasTimeUnit(keyword, timeUnit), true);
  });

  it('should return true for yearquarter given quarter', function() {
    const keyword = 'quarter';
    const timeUnit = TimeUnit.YEARQUARTER;
    assert.equal(hasTimeUnit(keyword, timeUnit), true);
  });

  it('should return false for quarter given year', function() {
    const keyword = 'quarter';
    const timeUnit = TimeUnit.YEAR;
    assert.equal(hasTimeUnit(keyword, timeUnit), false);
  });
});
