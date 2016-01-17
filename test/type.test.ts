import {assert} from 'chai';

import {getFullName, QUANTITATIVE} from '../src/type';

describe('vl.type.getFullName()', function () {
  it('translates short type', function() {
    assert.equal(getFullName(<any>'Q'), QUANTITATIVE);
  });

  it('translates long type', function() {
    assert.equal(getFullName(<any>'quantitative'), QUANTITATIVE);
  });

  it('translates enum', function() {
    assert.equal(getFullName(QUANTITATIVE), QUANTITATIVE);
  });
});
