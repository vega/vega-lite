import {assert} from 'chai';

import {TimeUnit, containsTimeUnit} from '../src/timeunit';

describe('For containsTimeUnit', function () {
  it('should return true for quarter given quarter', function() {
    const fullTimeUnit = TimeUnit.QUARTER;
    const timeUnit = TimeUnit.QUARTER;
    assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
  });

  it('should return true for yearquarter given quarter', function() {
    const fullTimeUnit = TimeUnit.YEARQUARTER;
    const timeUnit = TimeUnit.QUARTER;
    assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
  });

  it('should return false for quarter given year', function() {
    const fullTimeUnit = TimeUnit.YEAR;
    const timeUnit = TimeUnit.QUARTER;
    assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
  });
});
