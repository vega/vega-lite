import {expect} from 'chai';

import {getFullName, QUANTITATIVE} from '../src/type';


describe('vl.type.getFullName()', function () {
  it('translates short type', function() {
    expect(getFullName(<any>'Q')).to.equal(QUANTITATIVE);
  });

  it('translates long type', function() {
    expect(getFullName(<any>'quantitative')).to.equal(QUANTITATIVE);
  });

  it('translates enum', function() {
    expect(getFullName(QUANTITATIVE)).to.equal(QUANTITATIVE);
  });
});
