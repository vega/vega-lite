import {assert} from 'chai';

import {TimeUnit, containsTimeUnit} from '../src/timeunit';

describe('For containsTimeUnit', function () {
  it('should return true for quarter given quarter', function() {
    const container = TimeUnit.QUARTER;
    const containee = TimeUnit.QUARTER;
    assert.equal(containsTimeUnit(container, containee), true);
  });

  it('should return true for yearquarter given quarter', function() {
    const container = TimeUnit.YEARQUARTER;
    const containee = TimeUnit.QUARTER;
    assert.equal(containsTimeUnit(container, containee), true);
  });

  it('should return false for quarter given year', function() {
    const container = TimeUnit.YEAR;
    const containee = TimeUnit.QUARTER;
    assert.equal(containsTimeUnit(container, containee), false);
  });
});
